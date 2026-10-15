import json
import os

import httpx
import pytest
from atomic_agents import BasicChatInputSchema
from instructor import Mode
from instructor.core.exceptions import InstructorRetryException

from ironmaw_agents import create_minimax_agent, minimax_client
from ironmaw_agents.minimax import (
    BASE_URL,
    MAX_COMPLETION_TOKENS,
    MAX_RETRIES,
    REQUEST_TIMEOUT,
)


def test_explicit_key_wins_over_helper(monkeypatch, tmp_path):
    helper = tmp_path / "minimax-api-key"
    helper.write_text("#!/bin/sh\nexit 37\n")
    helper.chmod(0o755)
    monkeypatch.setenv("PATH", f"{tmp_path}:{os.environ['PATH']}")
    monkeypatch.setenv("OPENAI_API_KEY", "explicit-key")

    client = minimax_client()

    assert client.client.api_key == "explicit-key"


def test_helper_populates_missing_key(monkeypatch, tmp_path):
    helper = tmp_path / "minimax-api-key"
    helper.write_text("#!/bin/sh\nprintf 'helper-key\\n'\n")
    helper.chmod(0o755)
    monkeypatch.setenv("PATH", f"{tmp_path}:{os.environ['PATH']}")
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    assert minimax_client().client.api_key == "helper-key"


@pytest.mark.parametrize("helper_body", ["exit 7", "printf 'secret-output\\n' >&2; exit 7", "exit 0"])
def test_bad_helper_fails_without_leaking_output(monkeypatch, tmp_path, helper_body):
    helper = tmp_path / "minimax-api-key"
    helper.write_text(f"#!/bin/sh\n{helper_body}\n")
    helper.chmod(0o755)
    monkeypatch.setenv("PATH", f"{tmp_path}:{os.environ['PATH']}")
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    with pytest.raises(ValueError, match="minimax-api-key") as exc:
        minimax_client()
    assert "secret-output" not in str(exc.value)


def test_missing_credentials_fail_before_client_construction(monkeypatch, tmp_path):
    monkeypatch.setenv("PATH", str(tmp_path))
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    import ironmaw_agents.minimax as module

    def forbidden(*args, **kwargs):
        raise AssertionError("OpenAI constructed")

    monkeypatch.setattr(module, "OpenAI", forbidden)
    with pytest.raises(ValueError, match="minimax-api-key"):
        minimax_client()


@pytest.mark.parametrize("key", ["", "  "])
def test_empty_explicit_key_does_not_fall_back(monkeypatch, tmp_path, key):
    helper = tmp_path / "minimax-api-key"
    helper.write_text("#!/bin/sh\nprintf 'helper-key'\n")
    helper.chmod(0o755)
    monkeypatch.setenv("PATH", f"{tmp_path}:{os.environ['PATH']}")
    monkeypatch.setenv("OPENAI_API_KEY", key)
    with pytest.raises(ValueError, match="OPENAI_API_KEY"):
        minimax_client()


@pytest.mark.parametrize("mode", [Mode.JSON, Mode.JSON_SCHEMA, Mode.MD_JSON])
def test_unsupported_json_modes_rejected_before_network_or_client(monkeypatch, mode):
    import ironmaw_agents.minimax as module

    def forbidden(*args, **kwargs):
        raise AssertionError("OpenAI constructed")

    monkeypatch.setattr(module, "OpenAI", forbidden)
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    with pytest.raises(ValueError, match="Mode.TOOLS"):
        minimax_client(mode=mode)


def test_factory_model_override_and_request_limits(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    agent = create_minimax_agent(model="MiniMax-M3", reasoning_effort="high")
    raw = agent.client.client
    assert agent.model == "MiniMax-M3"
    assert agent.mode == Mode.TOOLS
    assert str(raw.base_url) == BASE_URL + "/"
    assert raw.timeout == REQUEST_TIMEOUT
    assert raw.max_retries == MAX_RETRIES
    assert agent.client.kwargs["reasoning_effort"] == "high"
    assert agent.client.kwargs["max_completion_tokens"] == MAX_COMPLETION_TOKENS
    assert agent.model_api_parameters["max_retries"] == MAX_RETRIES


def test_function_tool_output_and_outgoing_request(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    requests = []

    def respond(request):
        requests.append((request.url, json.loads(request.content)))
        return httpx.Response(200, json={
            "id": "chatcmpl-test",
            "object": "chat.completion",
            "created": 1,
            "model": "MiniMax-M3.1-Flash-Preview",
            "choices": [{
                "index": 0,
                "finish_reason": "tool_calls",
                "message": {
                    "role": "assistant",
                    "content": "",
                    "tool_calls": [{
                        "id": "call_1",
                        "type": "function",
                        "function": {
                            "name": "BasicChatOutputSchema",
                            "arguments": json.dumps({"chat_message": "Reviewed the code."}),
                        },
                    }],
                },
            }],
        })

    import ironmaw_agents.minimax as module
    original_openai = module.OpenAI
    monkeypatch.setattr(module, "OpenAI", lambda **kwargs: original_openai(
        **kwargs, http_client=httpx.Client(transport=httpx.MockTransport(respond))
    ))
    agent = create_minimax_agent(reasoning_effort="low")
    output = agent.run(BasicChatInputSchema(chat_message="Review this."))

    assert output.chat_message == "Reviewed the code."
    assert len(requests) == 1
    url, body = requests[0]
    assert str(url) == BASE_URL + "/chat/completions"
    assert body["reasoning_effort"] == "low"
    assert body["max_completion_tokens"] == MAX_COMPLETION_TOKENS
    assert body["tools"][0]["type"] == "function"
    assert "Always call the BasicChatOutputSchema function" in body["messages"][0]["content"]
    assert "response_format" not in body


@pytest.mark.parametrize("finish_reason", ["stop", "length"])
def test_plain_text_response_is_usable_for_basic_chat(monkeypatch, finish_reason):
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    import ironmaw_agents.minimax as module

    original_openai = module.OpenAI
    monkeypatch.setattr(module, "OpenAI", lambda **kwargs: original_openai(
        **kwargs, http_client=httpx.Client(transport=httpx.MockTransport(lambda _: httpx.Response(
            200,
            json={
                "id": "chatcmpl-text",
                "object": "chat.completion",
                "created": 1,
                "model": "MiniMax-M3.1-Flash-Preview",
                "choices": [{
                    "index": 0,
                    "finish_reason": finish_reason,
                    "message": {"role": "assistant", "content": "IRONMAW ready"},
                }],
            },
        )))
    ))

    agent = create_minimax_agent()
    message = BasicChatInputSchema(chat_message="Ready?")
    if finish_reason == "stop":
        assert agent.run(message).chat_message == "IRONMAW ready"
    else:
        with pytest.raises(InstructorRetryException):
            agent.run(message)
