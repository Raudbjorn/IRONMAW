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
        change("text-faint", "#3A4A50", edition="oxide"),
        change("text-faint", "#3A4A50", edition="bone", file="src/lib/tokens/bone.tokens.json"),
        change("space-4", "18px", edition="all", file="src/lib/tokens/scale.tokens.json"),
    ])
    assert {r.edition for r in results} == {"oxide", "bone"}
    assert not any("space-4" in r.rule for r in results)


def test_unknown_edition_and_bad_hex_are_reported_not_guessed():
    out = verify_colour_changes([change("text", "#FFFFFF", edition="slate", file="src/lib/tokens/slate.tokens.json"),
                                 change("text", "teal-ish")])
    assert out[0].edition == "slate" and out[0].passes is None
    assert out[1].passes is False and "6-digit hex" in out[1].rule


def test_pass_fail_uses_the_unrounded_ratio():
    grey = [f"#{v:02X}{v:02X}{v:02X}" for v in range(256)]
    fg, bg = next((f, b) for b in grey[:64] for f in grey if 4.495 <= contrast_ratio(f, b) < 4.5)
    out = verify_colour_changes([change("fg", fg)], palettes={"oxide": {"fg": "#FFFFFF", "bg": bg}},
                                gates=[("fg", "bg", 4.5)])
    assert out[0].after == 4.5 and out[0].passes is False


def palette_fixture():
    palettes = {"oxide": {"fg": "#FFFFFF", "bg": "#000000", "spare": "#123456"}}
    aliases = {"oxide": {"fg": "white", "bg": "black", "spare": "teal"}}
    primitives = {"white": "#FFFFFF", "black": "#000000", "teal": "#123456", "grey": "#777777"}
    return dict(palettes=palettes, aliases=aliases, primitives=primitives, gates=[("fg", "bg", 4.5)])


def test_primitive_edits_reach_every_semantic_token_that_aliases_them():
    out = verify_colour_changes(
        [change("white", "#111111", edition="all", file="src/lib/tokens/primitives.tokens.json")], **palette_fixture())
    rule = next(r for r in out if r.rule == "fg on bg >= 4.5")
    assert rule.passes is False and rule.before == 21.0


def test_the_real_primitive_behind_text_faint_is_gated():
    from ironmaw_agents.gates import load_aliases
    name = load_aliases(load_palettes())["oxide"]["text-faint"]
    out = verify_colour_changes([change(name, "#2A3940", edition="oxide", file="src/lib/tokens/primitives.tokens.json")])
    assert any(r.rule == "text-faint on surface-1 >= 4.5" and r.passes is False for r in out)


def test_an_unreferenced_primitive_is_reported_unchecked():
    out = verify_colour_changes(
        [change("grey", "#888888", edition="all", file="src/lib/tokens/primitives.tokens.json")], **palette_fixture())
    assert len(out) == 1 and out[0].passes is None and "no semantic colour aliases it" in out[0].rule


def test_alias_values_resolve_to_hex_and_unknown_aliases_fail():
    out = verify_colour_changes([change("fg", "{primitive.color.grey}")], **palette_fixture())
    assert next(r for r in out if r.rule == "fg on bg >= 4.5").after == round(contrast_ratio("#777777", "#000000"), 2)
    bad = verify_colour_changes([change("fg", "{primitive.color.nope}")], **palette_fixture())
    assert bad[0].passes is False and "no existing primitive" in bad[0].rule


def test_a_malformed_new_token_in_an_edition_file_is_caught():
    out = verify_colour_changes([change("fresh-token", "tealish")], **palette_fixture())
    assert out[0].passes is False and "6-digit hex" in out[0].rule


def test_an_edit_no_gate_covers_is_reported_unchecked_not_dropped():
    out = verify_colour_changes([change("spare", "#654321")], **palette_fixture())
    assert len(out) == 1 and out[0].passes is None and "no palette gate covers" in out[0].rule


PRIMS = "src/lib/tokens/primitives.tokens.json"


def test_a_malformed_primitive_value_is_reported_not_skipped():
    out = verify_colour_changes([change("white", "tealish", edition="all", file=PRIMS)], **palette_fixture())
    assert len(out) == 1 and out[0].passes is False and "6-digit hex" in out[0].rule


def test_a_primitive_edit_is_gated_in_every_edition_whatever_its_label():
    fixture = palette_fixture()
    fixture["palettes"]["bone"] = {"fg": "#FFFFFF", "bg": "#000000", "spare": "#123456"}
    fixture["aliases"]["bone"] = {"fg": "white", "bg": "black"}
    out = verify_colour_changes([change("white", "#111111", edition="oxide", file=PRIMS)], **fixture)
    failing = {r.edition for r in out if r.rule == "fg on bg >= 4.5" and r.passes is False}
    assert failing == {"oxide", "bone"}


def test_the_source_file_decides_the_edition_and_a_mismatch_is_flagged():
    fixture = palette_fixture()
    fixture["palettes"]["bone"] = {"fg": "#FFFFFF", "bg": "#000000"}
    out = verify_colour_changes([change("fg", "#111111", edition="oxide", file="src/lib/tokens/bone.tokens.json")],
                                **fixture)
    assert {r.edition for r in out} == {"bone"}
    assert any("labelled edition 'oxide' but edits bone.tokens.json" in r.rule and r.passes is False for r in out)


@pytest.mark.parametrize("token,value,passes", [
    ("brand-teal", "#3ca0a0", True),                    # unchanged (case-insensitive)
    ("brand-teal", "#3CA0A1", False),                   # any drift fails, like palette.test.ts
    ("brand.rust", "#D0602C", False),
    ("brand-violet", "#7F00FF", False),                 # the anchor set is exact; nothing may be added
])
def test_brand_anchors_stay_verbatim(token, value, passes):
    out = verify_colour_changes([change(token, value, edition="all", file="src/lib/tokens/scale.tokens.json")])
    assert len(out) == 1 and out[0].passes is passes


def test_brand_anchors_come_from_the_repo_assertion():
    from ironmaw_agents.gates import load_brand
    assert load_brand() == {"teal": "#3CA0A0", "slate": "#5F7E8F", "rust": "#D0602B", "charcoal": "#0F1416"}
