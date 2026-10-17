import json

import pytest

import ironmaw_agents.minimax as mm
from ironmaw_agents.__main__ import main
from ironmaw_agents.minimax import MiniMaxConfigError, MiniMaxCredentialError
from ironmaw_agents.pipeline import improve
from conftest import SECRET

ENV = {"OPENAI_API_KEY": SECRET}
BUTTON = "src/lib/components/atoms/Button.svelte"
STATUS = "src/lib/review-status.ts"

REPLIES = {
    "ExplorationReport": {"summary": "Button lives in atoms.", "findings": [
        {"path": BUTTON, "note": "the component"},
        {"path": ".do-no-commit/DESIGNER-HANDOFF.md", "note": "private"},
        {"path": "src/lib/missing.ts", "note": "hallucinated"}]},
    "A11yAudit": {"issues": [{"path": BUTTON, "wcag": "2.4.7", "severity": "major",
                              "problem": "focus clipped by chamfer", "fix": "outline-offset"}]},
    "CopyReview": {"issues": [{"path": BUTTON, "rule": "sentence case", "current": "Save Draft",
                               "proposed": "Save draft"}]},
    "TokenProposal": {"changes": [{"edition": "oxide", "token": "text-faint", "current": "#86999F",
                                   "proposed": "#3A4A50", "file": "src/lib/tokens/oxide.tokens.json",
                                   "reason": "quieter"}]},
    "GapReport": {"proposals": [{"name": "Button.loading", "kind": "prop", "value": "high",
                                 "evidence": "spinners hand-rolled", "api_sketch": "loading?: boolean"}]},
    "ReviewReport": {"findings": [], "verdict": "fix-first"},
}


def sent(http):
    return [json.loads(r.read()) for r in http.requests]


def tool_of(body):
    return body["tools"][0]["function"]["name"]


def system_prompt(body):
    return body["messages"][0]["content"]


@pytest.fixture
def replies(http):
    http.by_tool = dict(REPLIES)
    return http


def test_full_pipeline_runs_in_order_and_returns_every_section(replies):
    report = improve("Improve the Button", paths=[STATUS], env=ENV)
    assert [tool_of(b) for b in sent(replies)] == [
        "ExplorationReport", "A11yAudit", "CopyReview", "TokenProposal", "GapReport", "ReviewReport"]
    assert report.files == [STATUS, BUTTON]                            # unsafe and missing findings dropped
    assert report.a11y.issues[0].wcag == "2.4.7"
    assert report.copy_review.issues[0].proposed == "Save draft"
    assert report.gaps.proposals[0].name == "Button.loading"
    assert report.review.verdict == "fix-first" and report.failures == []


def test_token_gates_are_recomputed_and_shown_to_the_reviewer(replies):
    report = improve("Tune text-faint", env=ENV)
    faint = next(g for g in report.token_gates if g.rule == "text-faint on surface-1 >= 4.5")
    assert faint.passes is False and faint.after < 4.5
    review = system_prompt(sent(replies)[-1])
    assert "Proposals under review" in review and "token-gates (computed, authoritative)" in review
    assert "focus clipped by chamfer" in review and '"passes":false' in review.replace(" ", "")


def test_specialists_get_their_required_files_first(replies):
    improve("Find gaps", paths=[STATUS], specialists=["gap-scout", "token-steward"], env=ENV)
    bodies = {tool_of(b): system_prompt(b) for b in sent(replies)}
    assert "=== src/lib/index.ts ===" in bodies["GapReport"]
    assert "=== src/lib/tokens/palette.test.ts ===" in bodies["TokenProposal"]
    assert "=== src/lib/index.ts ===" not in bodies["TokenProposal"]


def test_a_failing_stage_is_recorded_and_the_rest_still_run(replies):
    replies.fail_tools = {"CopyReview", "ExplorationReport"}
    report = improve("Improve the Button", paths=[BUTTON], env=ENV)
    assert [f.stage for f in report.failures] == ["explorer", "copy-editor"]
    assert "BadRequestError" in report.failures[1].error
    assert report.copy_review is None and report.exploration is None
    assert report.files == [BUTTON] and report.a11y and report.review


def test_no_proposals_means_no_review_request(replies):
    replies.fail_tools = {"A11yAudit"}
    report = improve("Audit", specialists=["a11y-auditor"], env=ENV)
    assert report.review is None and tool_of(sent(replies)[-1]) == "A11yAudit"


@pytest.mark.parametrize("kwargs,error", [
    ({"specialists": ["poet"]}, MiniMaxConfigError),
    ({"specialists": []}, MiniMaxConfigError),
    ({"paths": [".do-no-commit/DESIGNER-HANDOFF.md"]}, MiniMaxConfigError),
    ({"paths": ["../outside.txt"]}, MiniMaxConfigError),
])
def test_caller_errors_fail_before_any_client_exists(http, kwargs, error):
    with pytest.raises(error):
        improve("Improve the Button", env=ENV, **kwargs)
    assert http.constructed == []


def test_missing_key_fails_before_any_client_exists(http, monkeypatch):
    monkeypatch.setattr(mm.shutil, "which", lambda name: None)
    with pytest.raises(MiniMaxCredentialError):
        improve("Improve the Button", env={})
    assert http.constructed == []


def test_cli_improve_with_a_subset(replies, monkeypatch, capsys):
    monkeypatch.setenv("OPENAI_API_KEY", SECRET)
    assert main(["improve", "Fix copy", "--path", BUTTON, "--with", "copy-editor"]) == 0
    out = json.loads(capsys.readouterr().out)
    assert out["copy_review"]["issues"][0]["proposed"] == "Save draft" and out["a11y"] is None
    assert [tool_of(b) for b in sent(replies)] == ["ExplorationReport", "CopyReview", "ReviewReport"]


def test_cli_rejects_an_unknown_specialist(http, monkeypatch, capsys):
    monkeypatch.setenv("OPENAI_API_KEY", SECRET)
    assert main(["improve", "Fix copy", "--with", "copy-editor,poet"]) == 2
    assert "poet" in capsys.readouterr().err and http.constructed == []
