import subprocess

import pytest
from atomic_agents import BaseIOSchema
from instructor import Mode
from pydantic import Field

import ironmaw_agents.minimax as mm
from ironmaw_agents import (
    MINIMAX_BASE_URL, MiniMaxConfigError, MiniMaxCredentialError,
    minimax_agent, minimax_client, resolve_api_key,
)
from conftest import SECRET


class Ask(BaseIOSchema):
    """A question for the agent."""
    question: str = Field(..., description="The question.")


class Reply(BaseIOSchema):
    """The agent's reply."""
    reply: str = Field(..., description="The reply.")


def fake_run(stdout="", stderr="", code=0, calls=None):
    def run(cmd, **kwargs):
        if calls is not None:
            calls.append((cmd, kwargs))
        return subprocess.CompletedProcess(cmd, code, stdout, stderr)
    return run


# -- credentials ---------------------------------------------------------------

def test_explicit_key_wins_and_helper_is_never_run():
    calls = []
    key = resolve_api_key({"OPENAI_API_KEY": f"  {SECRET}\n"}, which=lambda n: "/bin/helper",
                          run=fake_run("other-key", calls=calls))
    assert key == SECRET and calls == []


def test_blank_explicit_key_counts_as_unset():
    key = resolve_api_key({"OPENAI_API_KEY": "   "}, which=lambda n: "/usr/bin/h", run=fake_run(SECRET + "\n"))
    assert key == SECRET


def test_helper_is_looked_up_on_path_and_run_without_shell_or_stdin():
    calls, seen = [], []
    def which(name):
        seen.append(name)
        return "/found/minimax-api-key"
    key = resolve_api_key({}, which=which, run=fake_run(SECRET + "\n", calls=calls))
    cmd, kwargs = calls[0]
    assert key == SECRET and seen == ["minimax-api-key"]
    assert cmd == ["/found/minimax-api-key"]                      # list form: no shell
    assert kwargs["stdin"] is subprocess.DEVNULL and kwargs["timeout"] > 0 and kwargs["capture_output"]


def test_helper_missing_from_path_is_a_clear_error():
    with pytest.raises(MiniMaxCredentialError, match="not found on PATH"):
        resolve_api_key({}, which=lambda n: None, run=fake_run())


@pytest.mark.parametrize("stdout,stderr,code", [
    (SECRET, f"leaked {SECRET}", 3),       # non-zero exit with output on both streams
    ("", f"boom {SECRET}", 1),
])
def test_helper_failure_never_exposes_its_output(stdout, stderr, code):
    with pytest.raises(MiniMaxCredentialError) as err:
        resolve_api_key({}, which=lambda n: "/h", run=fake_run(stdout, stderr, code))
    assert SECRET not in str(err.value) and SECRET not in repr(err.value)
    assert f"status {code}" in str(err.value)
    assert err.value.__cause__ is None


def test_helper_timeout_and_oserror_are_withheld():
    def timeout(cmd, **kw):
        raise subprocess.TimeoutExpired(cmd, 10, output=SECRET.encode(), stderr=SECRET.encode())
    def oserr(cmd, **kw):
        raise PermissionError(f"denied {SECRET}")
    with pytest.raises(MiniMaxCredentialError, match="timed out") as t:
        resolve_api_key({}, which=lambda n: "/h", run=timeout)
    with pytest.raises(MiniMaxCredentialError, match="PermissionError") as o:
        resolve_api_key({}, which=lambda n: "/h", run=oserr)
    assert SECRET not in str(t.value) and SECRET not in str(o.value)


@pytest.mark.parametrize("stdout", ["", "\n  \n"])
def test_empty_helper_output_is_rejected(stdout):
    with pytest.raises(MiniMaxCredentialError, match="empty key"):
        resolve_api_key({}, which=lambda n: "/h", run=fake_run(stdout))


def test_key_with_embedded_whitespace_is_refused_without_echoing_it():
    with pytest.raises(MiniMaxCredentialError, match="whitespace") as err:
        resolve_api_key({"OPENAI_API_KEY": "sk bad key"})
    assert "bad" not in str(err.value)


def test_missing_credentials_fail_before_client_construction(monkeypatch):
    monkeypatch.setattr(mm.shutil, "which", lambda n: None)
    def boom(**kw):
        raise AssertionError("OpenAI client must not be constructed without credentials")
    monkeypatch.setattr(mm, "OpenAI", boom)
    with pytest.raises(MiniMaxCredentialError):
        minimax_client(env={})
    with pytest.raises(MiniMaxCredentialError):
        minimax_agent(Ask, Reply, env={})


# -- fixed endpoint and shared limits --------------------------------------------

def test_endpoint_is_fixed_and_ignores_openai_base_url(http, monkeypatch):
    monkeypatch.setenv("OPENAI_BASE_URL", "https://evil.example/v1")
    minimax_client(env={"OPENAI_API_KEY": SECRET})
    kwargs = http.constructed[0]
    assert kwargs["base_url"] == MINIMAX_BASE_URL == "https://api.minimax.io/v1"
    assert kwargs["api_key"] == SECRET and kwargs["timeout"] == mm.REQUEST_TIMEOUT_S
    assert kwargs["max_retries"] == mm.MAX_RETRIES


def test_client_exposes_no_endpoint_override():
    with pytest.raises(TypeError):
        minimax_client(base_url="https://elsewhere/v1", env={"OPENAI_API_KEY": SECRET})


def test_requests_go_to_the_minimax_chat_completions_url(http):
    agent = minimax_agent(Ask, Reply, env={"OPENAI_API_KEY": SECRET})
    assert agent.run(Ask(question="ping")).reply == "pong"
    req = http.requests[0]
    assert str(req.url) == "https://api.minimax.io/v1/chat/completions"
    assert req.headers["authorization"] == f"Bearer {SECRET}"


@pytest.mark.parametrize("params", [
    {"max_completion_tokens": 0}, {"max_completion_tokens": 10**7}, {"max_completion_tokens": True},
    {"max_completion_tokens": 8.5}, {"temperature": -0.1}, {"temperature": 2.1},
    {"temperature": float("nan")}, {"top_p": 1.5}, {"top_p": "0.9"},
])
def test_shared_limits_reject_bad_values_before_network(http, params):
    with pytest.raises(MiniMaxConfigError):
        minimax_agent(Ask, Reply, env={"OPENAI_API_KEY": SECRET}, **params)
    assert http.requests == [] and http.constructed == []


def test_token_ceiling_depends_on_model(http):
    over_default = mm.MAX_COMPLETION_TOKENS_DEFAULT + 1
    minimax_agent(Ask, Reply, model="MiniMax-M3", max_completion_tokens=over_default, env={"OPENAI_API_KEY": SECRET})
    with pytest.raises(MiniMaxConfigError):
        minimax_agent(Ask, Reply, model="MiniMax-M2.7", max_completion_tokens=over_default, env={"OPENAI_API_KEY": SECRET})


def test_deprecated_max_tokens_is_sent_as_max_completion_tokens(http):
    agent = minimax_agent(Ask, Reply, env={"OPENAI_API_KEY": SECRET})
    raw = minimax_client(env={"OPENAI_API_KEY": SECRET})
    raw.chat.completions.create(model="MiniMax-M3", response_model=Reply, max_tokens=64,
                                messages=[{"role": "user", "content": "x"}])
    body = http.requests[-1].read().decode()
    assert '"max_completion_tokens":64' in body.replace(" ", "") and '"max_tokens"' not in body


# -- model override and reasoning_effort -------------------------------------------

def test_agent_factory_model_override_reaches_the_request(http):
    agent = minimax_agent(Ask, Reply, model="MiniMax-M3", env={"OPENAI_API_KEY": SECRET})
    agent.run(Ask(question="x"))
    assert http.requests[0].read().decode().count('"model":"MiniMax-M3"') == 1


def test_default_model_and_unknown_model(http):
    assert minimax_agent(Ask, Reply, env={"OPENAI_API_KEY": SECRET}).model == "MiniMax-M3.1-Flash-Preview"
    with pytest.raises(MiniMaxConfigError, match="unknown model"):
        minimax_agent(Ask, Reply, model="gpt-5", env={"OPENAI_API_KEY": SECRET})
    assert http.requests == []


def test_reasoning_effort_lives_on_the_client_and_is_sent(http):
    agent = minimax_agent(Ask, Reply, reasoning_effort="low", env={"OPENAI_API_KEY": SECRET})
    agent.run(Ask(question="x"))
    assert '"reasoning_effort":"low"' in http.requests[0].read().decode().replace(" ", "")


def test_reasoning_effort_omitted_is_not_sent(http):
    minimax_agent(Ask, Reply, env={"OPENAI_API_KEY": SECRET}).run(Ask(question="x"))
    assert "reasoning_effort" not in http.requests[0].read().decode()


@pytest.mark.parametrize("effort", ["none", "minimal", "MAX", "", 3])
def test_invalid_reasoning_effort_rejected_before_credentials_or_network(http, effort):
    with pytest.raises(MiniMaxConfigError):
        minimax_client(reasoning_effort=effort, env={})       # env is empty: config error comes first
    assert http.constructed == []


@pytest.mark.parametrize("effort", ["low", "medium", "high", "xhigh", "max"])
def test_every_documented_effort_is_accepted(http, effort):
    minimax_client(reasoning_effort=effort, env={"OPENAI_API_KEY": SECRET})


# -- function tools only ------------------------------------------------------------

def test_agent_uses_function_tools_and_output_comes_from_tool_arguments(http):
    http.arguments = {"reply": "from-tool-call"}
    agent = minimax_agent(Ask, Reply, env={"OPENAI_API_KEY": SECRET})
    assert agent.run(Ask(question="x")).reply == "from-tool-call"
    body = http.requests[0].read().decode()
    assert '"tools"' in body and '"tool_choice"' in body and "response_format" not in body


@pytest.mark.parametrize("mode", [Mode.JSON, Mode.JSON_SCHEMA, Mode.MD_JSON, Mode.TOOLS_STRICT])
def test_json_modes_rejected_before_any_io(http, mode):
    with pytest.raises(MiniMaxConfigError, match="unsupported mode"):
        minimax_client(mode=mode, env={"OPENAI_API_KEY": SECRET})
    assert http.constructed == [] and http.requests == []


def test_response_format_per_request_rejected_before_network(http):
    client = minimax_client(env={"OPENAI_API_KEY": SECRET})
    with pytest.raises(MiniMaxConfigError, match="response_format"):
        client.chat.completions.create(model="MiniMax-M3", response_model=Reply,
                                       response_format={"type": "json_object"},
                                       messages=[{"role": "user", "content": "x"}])
    assert http.requests == []
