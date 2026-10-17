import pytest

from ironmaw_agents.gates import contrast_ratio, load_gates, load_palettes, verify_colour_changes
from ironmaw_agents.schemas import TokenChange


def change(token, proposed, edition="oxide", file="src/lib/tokens/oxide.tokens.json"):
    return TokenChange(edition=edition, token=token, current=None, proposed=proposed, file=file, reason="r")


def test_contrast_matches_the_wcag_formula():
    assert contrast_ratio("#000000", "#FFFFFF") == pytest.approx(21.0)
    assert contrast_ratio("#3CA0A0", "#3CA0A0") == pytest.approx(1.0)
    assert contrast_ratio("#FFFFFF", "#000000") == contrast_ratio("#000000", "#FFFFFF")


def test_gates_come_from_the_repo_test_file_and_pass_today():
    gates = load_gates()
    assert ("text", "bg", 7.0) in gates and ("text-faint", "surface-1", 4.5) in gates
    assert ("border-strong", "bg", 3.0) in gates
    palettes = load_palettes()
    assert {"oxide", "bone"} <= palettes.keys()
    for pal in palettes.values():
        assert all(contrast_ratio(pal[fg], pal[bg]) >= m for fg, bg, m in gates)


def test_only_gates_touching_the_change_are_reported_with_before_and_after():
    results = verify_colour_changes([change("text-faint", "#3A4A50")])
    assert results and all("text-faint" in r.rule for r in results)
    faint = next(r for r in results if r.rule == "text-faint on surface-1 >= 4.5")
    assert faint.edition == "oxide" and faint.passes is False
    assert faint.before is not None and faint.before > faint.after


def test_a_passing_change_passes():
    results = verify_colour_changes([change("text-faint", "#A0B2B8")])
    assert results and all(r.passes for r in results)


def test_warning_may_never_equal_rust():
    palettes = load_palettes()
    results = verify_colour_changes([change("warning", palettes["oxide"]["action"].lower())])
    rule = next(r for r in results if r.rule.startswith("warning is not rust"))
    assert rule.passes is False


def test_all_applies_to_every_edition_and_scale_tokens_are_skipped():
    results = verify_colour_changes([
        change("text-faint", "#3A4A50", edition="all"),
        change("space-4", "18px", edition="all", file="src/lib/tokens/scale.tokens.json"),
    ])
    assert {r.edition for r in results} == {"oxide", "bone"}
    assert not any("space-4" in r.rule for r in results)


def test_unknown_edition_and_bad_hex_are_reported_not_guessed():
    out = verify_colour_changes([change("text", "#FFFFFF", edition="slate"), change("text", "teal-ish")])
    assert out[0].edition == "slate" and out[0].passes is None
    assert out[1].passes is False and "6-digit hex" in out[1].rule


def test_pass_fail_uses_the_unrounded_ratio():
    grey = [f"#{v:02X}{v:02X}{v:02X}" for v in range(256)]
    fg, bg = next((f, b) for b in grey[:64] for f in grey if 4.495 <= contrast_ratio(f, b) < 4.5)
    out = verify_colour_changes([change("fg", fg)], palettes={"oxide": {"fg": "#FFFFFF", "bg": bg}},
                                gates=[("fg", "bg", 4.5)])
    assert out[0].after == 4.5 and out[0].passes is False
