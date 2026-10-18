"""Recompute the palette contrast gates for proposed colour changes.

The agent never does contrast arithmetic. Gate pairs are parsed from
``src/lib/tokens/palette.test.ts`` and palettes from the generated
``resolved/*.tokens.json``, so this check can't drift from the repo's own gates.
"""

from __future__ import annotations

import json
import re
from collections.abc import Iterable, Mapping, Sequence
from pathlib import Path

from .minimax import MiniMaxConfigError
from .schemas import GateResult, TokenChange
from .tools.minimax_tools import REPO_ROOT

TOKENS_DIR = REPO_ROOT / "src" / "lib" / "tokens"
GATE_FILE = TOKENS_DIR / "palette.test.ts"
RESOLVED_DIR = TOKENS_DIR / "resolved"

HEX = re.compile(r"^#[0-9A-Fa-f]{6}$")
GATE_PAIR = re.compile(r"\['([a-z0-9-]+)',\s*'([a-z0-9-]+)',\s*([A-Z]+|\d+(?:\.\d+)?)\]")
GATE_CONST = re.compile(r"^const ([A-Z]+) = (\d+(?:\.\d+)?);", re.M)
RATIO_DECIMALS = 2

Gate = tuple[str, str, float]


def contrast_ratio(a: str, b: str) -> float:
    """WCAG 2.x contrast for 6-digit hex, same formula as src/lib/internal/contrast.ts."""

    def channel(c: int) -> float:
        s = c / 255
        return s / 12.92 if s <= 0.03928 else ((s + 0.055) / 1.055) ** 2.4

    def luminance(hex_: str) -> float:
        n = hex_.lstrip("#")
        r, g, b_ = (int(n[i:i + 2], 16) for i in (0, 2, 4))
        return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b_)

    hi, lo = sorted((luminance(a), luminance(b)), reverse=True)
    return (hi + 0.05) / (lo + 0.05)


def load_gates(path: Path = GATE_FILE) -> list[Gate]:
    text = path.read_text(encoding="utf-8")
    consts = {name: float(value) for name, value in GATE_CONST.findall(text)}
    gates: list[Gate] = []
    for fg, bg, minimum in GATE_PAIR.findall(text):
        if minimum in consts:
            gates.append((fg, bg, consts[minimum]))
        elif not minimum.isalpha():
            gates.append((fg, bg, float(minimum)))
    if not gates:
        raise MiniMaxConfigError(f"no contrast gates found in {path.name}")
    return gates


def load_palettes(resolved: Path = RESOLVED_DIR) -> dict[str, dict[str, str]]:
    palettes: dict[str, dict[str, str]] = {}
    for file in sorted(resolved.glob("*.tokens.json")):
        data = json.loads(file.read_text(encoding="utf-8"))
        palettes[data["$edition"]] = dict(data["color"])
    if not palettes:
        raise MiniMaxConfigError(f"no resolved palettes in {resolved}")
    return palettes


PRIMITIVES_FILE = TOKENS_DIR / "primitives.tokens.json"
ALIAS = re.compile(r"^\{primitive\.color\.([a-z0-9-]+)\}$")


def load_primitives(path: Path = PRIMITIVES_FILE) -> dict[str, str]:
    """Raw primitive colours: name -> hex."""
    colours = json.loads(path.read_text(encoding="utf-8"))["primitive"]["color"]
    return {k: v["$value"] for k, v in colours.items() if not k.startswith("$")}


def load_aliases(editions: Iterable[str], tokens_dir: Path = TOKENS_DIR) -> dict[str, dict[str, str]]:
    """Per edition, semantic token -> the primitive it aliases (from the DTCG edition source)."""
    aliases: dict[str, dict[str, str]] = {}
    for edition in editions:
        source = tokens_dir / f"{edition}.tokens.json"
        colours = json.loads(source.read_text(encoding="utf-8")).get("color", {}) if source.is_file() else {}
        aliases[edition] = {
            token: m.group(1) for token, spec in colours.items()
            if isinstance(spec, dict) and (m := ALIAS.match(str(spec.get("$value", ""))))
        }
    return aliases


def _primitive_name(change: TokenChange) -> str | None:
    if Path(change.file).name == PRIMITIVES_FILE.name or change.token.startswith("primitive.color."):
        return change.token.rsplit(".", 1)[-1]
    return None


SHARED_SOURCES = frozenset({PRIMITIVES_FILE.name, "scale.tokens.json"})
BRAND_ASSERT = re.compile(r"expect\(brand\)\.toEqual\(\{([^}]*)\}\)")
BRAND_ENTRY = re.compile(r"(\w+):\s*'(#[0-9A-Fa-f]{6})'")


def load_brand(path: Path = GATE_FILE) -> dict[str, str]:
    """The immutable brand anchors asserted verbatim in palette.test.ts."""
    match = BRAND_ASSERT.search(path.read_text(encoding="utf-8"))
    if not match:
        raise MiniMaxConfigError(f"no brand anchor assertion found in {path.name}")
    return dict(BRAND_ENTRY.findall(match.group(1)))


def _brand_name(change: TokenChange) -> str | None:
    for prefix in ("brand-", "brand."):
        if change.token.startswith(prefix):
            return change.token[len(prefix):]
    return None


def _source_edition(change: TokenChange) -> str | None:
    """The edition a source file belongs to: ``bone.tokens.json`` -> ``bone``; shared sources -> None."""
    name = Path(change.file).name
    if name.endswith(".tokens.json") and name not in SHARED_SOURCES:
        return name.removesuffix(".tokens.json")
    return None


def _is_colour(change: TokenChange, palettes: Mapping[str, Mapping[str, str]]) -> bool:
    # Edition sources and the primitive pool hold colours only, so the file decides even
    # when the value is malformed; the value check then reports it.
    return (_source_edition(change) is not None
            or _primitive_name(change) is not None
            or any(change.token in p for p in palettes.values())
            or bool(HEX.match(change.proposed) or ALIAS.match(change.proposed)))


def verify_colour_changes(
    changes: Iterable[TokenChange],
    *,
    palettes: Mapping[str, Mapping[str, str]] | None = None,
    gates: Sequence[Gate] | None = None,
    primitives: Mapping[str, str] | None = None,
    aliases: Mapping[str, Mapping[str, str]] | None = None,
    brand: Mapping[str, str] | None = None,
) -> list[GateResult]:
    """Apply proposed colours per edition and rerun every gate that touches a changed token.

    Primitive edits are resolved into every semantic token that aliases them, and
    alias values (``{primitive.color.x}``) are resolved to hex, so the gates see
    what ``pnpm run tokens`` would generate. Primitives are shared, so their edits
    are gated in every edition. An edition source file decides which edition an
    edit lands in. Brand anchors must stay verbatim. An edit no gate covers is
    reported as unchecked (``passes=None``), never left out.
    """
    palettes = palettes if palettes is not None else load_palettes()
    gates = gates if gates is not None else load_gates()
    primitives = dict(primitives if primitives is not None else load_primitives())
    aliases = aliases if aliases is not None else load_aliases(palettes)
    brand = brand if brand is not None else load_brand()
    results: list[GateResult] = []
    per_edition: dict[str, dict[str, str]] = {}
    changes = list(changes)

    for change in changes:
        if (name := _brand_name(change)) is None:
            continue
        anchor = brand.get(name)
        rule = (f"brand-{name} stays {anchor} (identity board, verbatim)" if anchor else
                f"brand-{name}: the brand anchors are exactly {sorted(brand)}; none may be added")
        results.append(GateResult(
            edition="all", rule=rule, passes=bool(anchor) and change.proposed.upper() == anchor.upper()))
    changes = [c for c in changes if _brand_name(c) is None]

    # Primitives first, so alias values in the same proposal resolve to the new hex.
    for change in changes:
        if (name := _primitive_name(change)) is None:
            continue
        if not HEX.match(change.proposed):
            results.append(GateResult(
                edition="all", rule=f"primitive {name}: proposed value {change.proposed!r} is not 6-digit hex",
                passes=False))
            continue
        primitives[name] = change.proposed
        for edition in palettes:                                       # the pool is shared by every edition
            users = sorted(t for t, p in aliases.get(edition, {}).items() if p == name)
            if not users:
                results.append(GateResult(
                    edition=edition, rule=f"primitive {name}: no semantic colour aliases it; no gate applies",
                    passes=None))
            for token in users:
                per_edition.setdefault(edition, {})[token] = change.proposed

    for change in changes:
        if _primitive_name(change) is not None or not _is_colour(change, palettes):
            continue                                                   # scale tokens have no gate
        alias = ALIAS.match(change.proposed)
        value = primitives.get(alias.group(1)) if alias else change.proposed
        if (source := _source_edition(change)) is not None:
            targets = [source]                                         # the file decides, not the label
            if change.edition != source:
                results.append(GateResult(
                    edition=source, passes=False,
                    rule=f"{change.token}: labelled edition {change.edition!r} but edits {Path(change.file).name}; "
                         f"gated as {source}"))
        else:
            targets = list(palettes) if change.edition == "all" else [change.edition]
        for edition in targets:
            if edition not in palettes:
                results.append(GateResult(
                    edition=edition, rule=f"{change.token}: edition not built yet; add it, then run pnpm test",
                    passes=None))
                continue
            if alias and value is None:
                results.append(GateResult(
                    edition=edition, rule=f"{change.token}: {change.proposed} names no existing primitive",
                    passes=False))
                continue
            if not HEX.match(value or ""):
                results.append(GateResult(
                    edition=edition, rule=f"{change.token}: proposed value {change.proposed!r} is not 6-digit hex",
                    passes=False))
                continue
            per_edition.setdefault(edition, {})[change.token] = value

    gated = {t for fg, bg, _ in gates for t in (fg, bg)} | {"warning", "action"}
    for edition, edits in per_edition.items():
        before, after = palettes[edition], {**palettes[edition], **edits}
        for token in sorted(edits.keys() - gated):
            results.append(GateResult(
                edition=edition, rule=f"{token}: no palette gate covers this token; check it in both editions",
                passes=None))
        for fg, bg, minimum in gates:
            if fg not in edits and bg not in edits:
                continue
            rule = f"{fg} on {bg} >= {minimum:g}"
            if fg not in after or bg not in after:
                results.append(GateResult(edition=edition, rule=f"{rule}: token missing", passes=None))
                continue
            old = round(contrast_ratio(before[fg], before[bg]), RATIO_DECIMALS) if fg in before and bg in before else None
            new = contrast_ratio(after[fg], after[bg])                 # judge unrounded: 4.496 must fail 4.5
            results.append(GateResult(
                edition=edition, rule=rule, before=old, after=round(new, RATIO_DECIMALS), passes=new >= minimum))
        if {"warning", "action"} & edits.keys() and "warning" in after and "action" in after:
            results.append(GateResult(
                edition=edition, rule="warning is not rust (warning != action)",
                passes=after["warning"].upper() != after["action"].upper()))
    return results
