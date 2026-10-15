import base64
import json
from pathlib import Path

import httpx
import pytest

from ironmaw_agents.http import MiniMaxHTTP
from ironmaw_agents.tools import (
    ImageGenerationTool, ModelListTool, ScreenshotReviewTool, TokenEstimateTool,
)
from ironmaw_agents.tools.minimax_tools import (
    ImageGenerationInput, ModelListInput, ScreenshotReviewInput, TokenEstimateInput, ToolConfig,
)
from conftest import SECRET

PNG = b"\x89PNG\r\n\x1a\n" + b"\x00" * 32


class Api:
    """Canned MiniMax responses; records requests."""

    def __init__(self, routes: dict[str, tuple[int, dict]]):
        self.routes, self.requests = routes, []

    def __call__(self, request: httpx.Request) -> httpx.Response:
        self.requests.append(request)
        status, body = self.routes[request.url.path]
        return httpx.Response(status, json=body)

    def http(self) -> MiniMaxHTTP:
        return MiniMaxHTTP(env={"OPENAI_API_KEY": SECRET}, transport=httpx.MockTransport(self))


def cfg(tmp_path, api):
    return ToolConfig(http=api.http(), allowed_roots=(tmp_path,), out_dir=tmp_path / "out")


@pytest.fixture
def shot(tmp_path):
    p = tmp_path / "render.png"
    p.write_bytes(PNG)
    return p


# -- screenshot review ----------------------------------------------------------

def test_review_sends_a_vision_request_to_chat_completions(tmp_path, shot):
    api = Api({"/v1/chat/completions": (200, {"choices": [{"message": {"content": "Rust used for a warning."}}]})})
    out = ScreenshotReviewTool(cfg(tmp_path, api)).run(ScreenshotReviewInput(image_path="render.png", detail="low"))
    assert (out.status, out.review) == ("ok", "Rust used for a warning.")
    req = api.requests[0]
    body = json.loads(req.content)
    assert str(req.url) == "https://api.minimax.io/v1/chat/completions"
    assert req.headers["authorization"] == f"Bearer {SECRET}"
    parts = body["messages"][1]["content"]
    assert parts[1]["type"] == "image_url" and parts[1]["image_url"]["detail"] == "low"
    assert parts[1]["image_url"]["url"] == "data:image/png;base64," + base64.b64encode(PNG).decode()
    assert "amber, never rust" in body["messages"][0]["content"]
    assert "reasoning_effort" not in body


@pytest.mark.parametrize("path", ["../escape.png", "/etc/hostname", ".do-no-commit/x.png",
                                  "sub/.git/x.png", "notes.txt", "missing.png"])
def test_review_refuses_unsafe_or_unsupported_paths_before_network(tmp_path, shot, path):
    (tmp_path / ".do-no-commit").mkdir()
    (tmp_path / ".do-no-commit" / "x.png").write_bytes(PNG)
    (tmp_path / "notes.txt").write_text("x")
    api = Api({})
    out = ScreenshotReviewTool(cfg(tmp_path, api)).run(ScreenshotReviewInput(image_path=path))
    assert out.status == "error" and api.requests == []


def test_review_rejects_oversize_images_before_network(tmp_path):
    big = tmp_path / "big.png"
    big.write_bytes(b"\x00" * (10 * 1024 * 1024 + 1))
    api = Api({})
    assert ScreenshotReviewTool(cfg(tmp_path, api)).run(ScreenshotReviewInput(image_path="big.png")).status == "error"
    assert api.requests == []


def test_review_symlink_to_a_protected_target_is_refused(tmp_path):
    (tmp_path / ".do-no-commit").mkdir()
    (tmp_path / ".do-no-commit" / "secret.png").write_bytes(PNG)
    (tmp_path / "link.png").symlink_to(tmp_path / ".do-no-commit" / "secret.png")
    api = Api({})
    assert ScreenshotReviewTool(cfg(tmp_path, api)).run(ScreenshotReviewInput(image_path="link.png")).status == "error"
    assert api.requests == []


def test_missing_credentials_become_a_typed_error_without_network(tmp_path, shot, monkeypatch):
    monkeypatch.setattr("ironmaw_agents.minimax.shutil.which", lambda n: None)
    hits = []
    http = MiniMaxHTTP(env={}, transport=httpx.MockTransport(lambda r: hits.append(r) or httpx.Response(200, json={})))
    out = ScreenshotReviewTool(ToolConfig(http=http, allowed_roots=(tmp_path,))).run(ScreenshotReviewInput(image_path="render.png"))
    assert out.status == "error" and "OPENAI_API_KEY" in out.error and hits == []


def test_api_errors_are_typed_and_leak_nothing(tmp_path, shot):
    api = Api({"/v1/chat/completions": (401, {"base_resp": {"status_code": 1004, "status_msg": "login fail"}})})
    out = ScreenshotReviewTool(cfg(tmp_path, api)).run(ScreenshotReviewInput(image_path="render.png"))
    assert out.status == "error" and "HTTP 401" in out.error
    assert SECRET not in out.error and "base64" not in out.error


def test_base_resp_failure_on_http_200_is_an_error(tmp_path, shot):
    api = Api({"/v1/chat/completions": (200, {"base_resp": {"status_code": 1008, "status_msg": "x"}})})
    out = ScreenshotReviewTool(cfg(tmp_path, api)).run(ScreenshotReviewInput(image_path="render.png"))
    assert out.status == "error" and "insufficient account balance" in out.error


def test_review_forwards_reasoning_effort_and_validates_it(tmp_path, shot):
    api = Api({"/v1/chat/completions": (200, {"choices": [{"message": {"content": "ok"}}]})})
    ScreenshotReviewTool(cfg(tmp_path, api)).run(ScreenshotReviewInput(image_path="render.png", reasoning_effort="low"))
    assert json.loads(api.requests[0].content)["reasoning_effort"] == "low"
    with pytest.raises(Exception):
        ScreenshotReviewInput(image_path="render.png", reasoning_effort="none")


# -- image generation -----------------------------------------------------------

def image_reply(*images, failed=0):
    return {"data": {"image_base64": [base64.b64encode(i).decode() for i in images]},
            "metadata": {"success_count": len(images), "failed_count": failed},
            "base_resp": {"status_code": 0, "status_msg": "success"}}


def test_image_tool_requests_base64_with_brand_style_and_saves_outside_assets(tmp_path):
    api = Api({"/v1/image_generation": (200, image_reply(PNG, PNG + b"1"))})
    out = ImageGenerationTool(cfg(tmp_path, api)).run(
        ImageGenerationInput(prompt="Misty fjord contour lines at dusk", aspect_ratio="21:9", n=2, seed=7))
    body = json.loads(api.requests[0].content)
    assert (body["model"], body["response_format"], body["n"], body["seed"], body["aspect_ratio"]) == ("image-01", "base64", 2, 7, "21:9")
    assert "#0F1416" in body["prompt"] and "No text" in body["prompt"] and len(body["prompt"]) <= 1500
    assert out.status == "ok" and len(out.files) == 2
    assert all(Path(f).parent == tmp_path / "out" and Path(f).read_bytes().startswith(b"\x89PNG") for f in out.files)


@pytest.mark.parametrize("prompt", ["The IRONMAW logo in neon", "a bear on a ridge", "Wordmark over mountains", "SVEINBJÖRN banner"])
def test_image_tool_never_generates_the_owners_mark(tmp_path, prompt):
    api = Api({})
    out = ImageGenerationTool(cfg(tmp_path, api)).run(ImageGenerationInput(prompt=prompt))
    assert out.status == "error" and "never generated" in out.error and api.requests == []


def test_image_tool_rejects_non_image_and_bad_base64(tmp_path):
    for payload in (image_reply(b"<html>not an image</html>"), {"data": {"image_base64": ["%%%not-b64"]}}):
        api = Api({"/v1/image_generation": (200, payload)})
        out = ImageGenerationTool(cfg(tmp_path, api)).run(ImageGenerationInput(prompt="Quiet ridge line"))
        assert out.status == "error" and not (tmp_path / "out").exists()


def test_image_tool_reports_content_safety_blocks(tmp_path):
    api = Api({"/v1/image_generation": (200, {"data": {"image_base64": []}, "metadata": {"failed_count": "2"}})})
    out = ImageGenerationTool(cfg(tmp_path, api)).run(ImageGenerationInput(prompt="Quiet ridge line"))
    assert out.status == "error" and "content safety" in out.error


def test_image_schema_bounds():
    for bad in ({"prompt": "x" * 1201}, {"prompt": "ok ok", "n": 10}, {"prompt": "ok ok", "n": 0}, {"prompt": "ok ok", "aspect_ratio": "5:4"}):
        with pytest.raises(Exception):
            ImageGenerationInput(**bad)


# -- token estimate and models ----------------------------------------------------

def test_token_estimate_uses_the_responses_endpoint(tmp_path):
    api = Api({"/v1/responses/input_tokens": (200, {"object": "response.input_tokens", "input_tokens": 588})})
    out = TokenEstimateTool(cfg(tmp_path, api)).run(TokenEstimateInput(text="hello", instructions="be brief"))
    assert (out.status, out.input_tokens) == ("ok", 588)
    assert json.loads(api.requests[0].content) == {"model": "MiniMax-M3.1-Flash-Preview", "input": "hello", "instructions": "be brief"}


def test_token_estimate_rejects_unknown_models_before_network(tmp_path):
    api = Api({})
    out = TokenEstimateTool(cfg(tmp_path, api)).run(TokenEstimateInput(text="x", model="gpt-5"))
    assert out.status == "error" and api.requests == []


def test_model_list_filters_and_flags_models_the_project_does_not_know(tmp_path):
    api = Api({"/v1/models": (200, {"object": "list", "data": [
        {"id": "MiniMax-M3"}, {"id": "MiniMax-M4-Preview"}, {"id": "abab-legacy"}]})})
    out = ModelListTool(cfg(tmp_path, api)).run(ModelListInput())
    assert out.models == ["MiniMax-M3", "MiniMax-M4-Preview", "abab-legacy"]
    assert out.unknown_to_project == ["MiniMax-M4-Preview"]
    assert ModelListTool(cfg(tmp_path, api)).run(ModelListInput(contains="m3")).models == ["MiniMax-M3"]
