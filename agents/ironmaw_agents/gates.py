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


def _is_colour(change: TokenChange, palettes: Mapping[str, Mapping[str, str]]) -> bool:
    return any(change.token in p for p in palettes.values()) or bool(HEX.match(change.proposed))


def verify_colour_changes(
    changes: Iterable[TokenChange],
    *,
    palettes: Mapping[str, Mapping[str, str]] | None = None,
    gates: Sequence[Gate] | None = None,
) -> list[GateResult]:
    """Apply proposed colours per edition and rerun every gate that touches a changed token."""
    palettes = palettes if palettes is not None else load_palettes()
    gates = gates if gates is not None else load_gates()
    results: list[GateResult] = []
    per_edition: dict[str, dict[str, str]] = {}

    for change in changes:
        if not _is_colour(change, palettes):
            continue                                                   # scale/primitive tokens have no gate
        targets = list(palettes) if change.edition == "all" else [change.edition]
        for edition in targets:
            if edition not in palettes:
                results.append(GateResult(
                    edition=edition, rule=f"{change.token}: edition not built yet; add it, then run pnpm test",
                    passes=None))
                continue
            if not HEX.match(change.proposed):
                results.append(GateResult(
                    edition=edition, rule=f"{change.token}: proposed value {change.proposed!r} is not 6-digit hex",
                    passes=False))
                continue
            per_edition.setdefault(edition, {})[change.token] = change.proposed

    for edition, edits in per_edition.items():
        before, after = palettes[edition], {**palettes[edition], **edits}
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
