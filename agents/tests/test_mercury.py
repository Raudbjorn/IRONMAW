import json

import pytest

import ironmaw_agents.minimax as mm
import ironmaw_agents.roster as roster
from ironmaw_agents.__main__ import main
from ironmaw_agents.mercury import (
    API_KEY_ENV, API_KEY_ENVS, HELPER_NAME, MERCURY_BASE_URL, mercury_agent, resolve_mercury_key, safe_effort,
)
from ironmaw_agents.minimax import MiniMaxConfigError, MiniMaxCredentialError
from ironmaw_agents.pipeline import improve
from ironmaw_agents.schemas import TaskInput
from conftest import SECRET

ENV = {API_KEY_ENV: SECRET}


def bodies(http):
    return [json.loads(r.read()) for r in http.requests]


def test_mercury_key_uses_its_own_variable_and_helper():
    assert resolve_mercury_key(ENV, which=lambda n: pytest.fail("helper must not run")) == SECRET
    seen = []
    with pytest.raises(MiniMaxCredentialError, match=f"{' / '.join(API_KEY_ENVS)} is not set and `{HELPER_NAME}`"):
        resolve_mercury_key({"OPENAI_API_KEY": SECRET}, which=lambda n: seen.append(n))   # MiniMax key ignored
    assert seen == [HELPER_NAME]


@pytest.mark.parametrize("env,expected", [
    ({"INCEPTION_API_KEY": "sk-official"}, "sk-official"),                 # Inception's documented variable
    ({"INCEPTION_LABS_API_KEY": "sk-alias"}, "sk-alias"),
    ({"INCEPTION_API_KEY": "sk-official", "INCEPTION_LABS_API_KEY": "sk-alias"}, "sk-official"),
    ({"INCEPTION_API_KEY": "  ", "INCEPTION_LABS_API_KEY": "sk-alias"}, "sk-alias"),   # blank falls through
])
def test_both_inception_variables_are_accepted(env, expected):
    assert resolve_mercury_key(env, which=lambda n: pytest.fail("helper must not run")) == expected


@pytest.mark.parametrize("kwargs", [
    {"model": "mercury-coder"},
    {"temperature": 0.2},                       # API would silently reset it; we refuse instead
    {"temperature": 1.1},
    {"reasoning_effort": "xhigh"},
    {"max_completion_tokens": 50_001},          # mercury-2 cap
    {"response_format": {"type": "json_object"}},
])
def test_unsupported_settings_fail_before_any_client_exists(http, kwargs):
    with pytest.raises(MiniMaxConfigError):
        mercury_agent(TaskInput, TaskInput, env=ENV, **kwargs)
    assert http.constructed == []


def test_mercury_25_has_the_larger_output_cap(http):
    agent = mercury_agent(TaskInput, TaskInput, model="mercury-2.5", env=ENV, max_completion_tokens=65_536)
    assert agent.model == "mercury-2.5"


@pytest.mark.parametrize("given,capped", [("instant", "instant"), ("low", "low"), ("medium", "medium"),
                                          ("high", "medium"), (None, None)])
def test_safe_effort_caps_high(given, capped):
    assert safe_effort(given) == capped


def test_roles_adapt_to_mercury_limits(http):
    http.arguments = {"findings": [], "verdict": "ship"}
    out = roster.run_role("reviewer", "review it", env=ENV, provider="mercury")
    assert out.verdict == "ship"
    body = bodies(http)[0]
    assert body["model"] == "mercury-2"
    assert body["reasoning_effort"] == "medium"              # role asks for high; capped
    assert body["temperature"] == 0.5                        # role asks for 0.2; floored to Mercury's minimum
    assert "max_retries" not in body and "response_format" not in body and body["tools"]
    assert {c["base_url"] for c in http.constructed} == {MERCURY_BASE_URL}


def test_instructor_makes_at_most_two_attempts(http):
    http.arguments = {"verdict": "maybe"}                    # never validates against ReviewReport
    with pytest.raises(Exception):
        roster.run_role("reviewer", "review it", env=ENV, provider="mercury")
    assert len(http.requests) == 2


def test_unknown_provider_is_rejected_before_any_client(http):
    with pytest.raises(MiniMaxConfigError, match="unknown provider"):
        roster.build_agent("explorer", env=ENV, provider="ollama")
    assert http.constructed == []


def test_pipeline_runs_on_mercury_and_flags_empty_reports(http):
    http.by_tool = {
        "ExplorationReport": {"summary": "s"},
        "CopyReview": {"issues": []},                         # the instant-empty answer seen live
        "ReviewReport": {"verdict": "discuss"},
    }
    report = improve("Check copy", specialists=["copy-editor"], env=ENV, provider="mercury")
    assert report.copy_review is not None and report.review.verdict == "discuss"
    assert [f.stage for f in report.failures] == ["copy-editor"]
    assert report.failures[0].error.startswith("EmptyReport")
    assert {b["model"] for b in bodies(http)} == {"mercury-2"}


def test_pipeline_key_preflight_is_per_provider(http, monkeypatch):
    monkeypatch.setattr(mm.shutil, "which", lambda name: None)
    with pytest.raises(MiniMaxCredentialError, match=API_KEY_ENV):
        improve("Check copy", env={"OPENAI_API_KEY": SECRET}, provider="mercury")
    assert http.constructed == []


def test_cli_provider_and_model(http, monkeypatch, capsys):
    monkeypatch.setenv(API_KEY_ENV, SECRET)
    http.arguments = {"summary": "Tokens live in src/lib/tokens."}
    assert main(["explorer", "where are the tokens?", "--provider", "mercury", "--model", "mercury-2.5"]) == 0
    assert json.loads(capsys.readouterr().out)["summary"].startswith("Tokens")
    assert bodies(http)[0]["model"] == "mercury-2.5"
