import json

import httpx
import pytest

import ironmaw_agents.minimax as mm

SECRET = "sk-test-secret-value"


class Recorder:
    """Records every HTTP request instead of touching the network."""

    def __init__(self, arguments: dict | None = None):
        self.requests: list[httpx.Request] = []
        self.arguments = arguments or {"reply": "pong"}

    def __call__(self, request: httpx.Request) -> httpx.Response:
        self.requests.append(request)
        sent = json.loads(request.content)
        tool = (sent.get("tools") or [{"function": {"name": "Reply"}}])[0]["function"]["name"]
        body = {
            "id": "x", "object": "chat.completion", "created": 1, "model": "MiniMax-M3",
            "choices": [{"index": 0, "finish_reason": "tool_calls", "message": {
                "role": "assistant", "content": "",
                "tool_calls": [{"id": "call_1", "type": "function", "function": {
                    "name": tool, "arguments": json.dumps(self.arguments)}}]}}],
            "usage": {"prompt_tokens": 1, "completion_tokens": 1, "total_tokens": 2},
        }
        return httpx.Response(200, json=body)


@pytest.fixture
def http(monkeypatch):
    """Route the real openai.OpenAI through a recording mock transport."""
    rec = Recorder()
    real = mm.OpenAI
    constructed: list[dict] = []

    def factory(**kwargs):
        constructed.append(kwargs)
        return real(http_client=httpx.Client(transport=httpx.MockTransport(rec)), **kwargs)

    monkeypatch.setattr(mm, "OpenAI", factory)
    rec.constructed = constructed
    return rec


@pytest.fixture(autouse=True)
def clean_env(monkeypatch):
    for name in ("OPENAI_API_KEY", "OPENAI_BASE_URL"):
        monkeypatch.delenv(name, raising=False)
