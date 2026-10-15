"""MiniMax endpoints that help build the IRONMAW theme, wrapped as Atomic Agents tools.

Selected from the MiniMax API overview for this project:

* Chat Completions with ``image_url``      -> ScreenshotReviewTool (brand-rule review of renders)
* Text to Image (``/v1/image_generation``) -> ImageGenerationTool  (terrain, contour, empty-state imagery)
* Estimate Input Tokens (Responses API)    -> TokenEstimateTool    (context budgeting for the agents)
* List Models (``/v1/models``)             -> ModelListTool        (which models the key can use)

Deliberately not wrapped: image-to-image (subject references support portraits
only; the owner's bear mark is never regenerated), speech, music, video and
voice endpoints (no use in a UI token and component system).

Every tool returns a typed result with ``status``; API and guard failures come
back as ``status="error"`` with a safe message instead of raising.
"""

from __future__ import annotations

import base64
import binascii
import hashlib
from pathlib import Path
from typing import Literal

from atomic_agents import BaseIOSchema, BaseTool, BaseToolConfig
from pydantic import Field

from ..http import MiniMaxAPIError, MiniMaxHTTP
from ..minimax import (
    DEFAULT_MODEL,
    MODELS,
    MiniMaxConfigError,
    MiniMaxCredentialError,
    validate_model,
    validate_reasoning_effort,
)

REPO_ROOT = Path(__file__).resolve().parents[3]
DENIED_PARTS = frozenset({".do-no-commit", ".do-not-commit", ".git", "node_modules", ".venv", ".env"})
IMAGE_TYPES = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
               ".webp": "image/webp", ".gif": "image/gif"}
MAX_UPLOAD_BYTES = 10 * 1024 * 1024          # MiniMax limit per image
MAX_GENERATED_BYTES = 20 * 1024 * 1024
MAX_PROMPT_CHARS = 1500                      # MiniMax limit for image prompts
ASPECT_RATIOS = ("1:1", "16:9", "4:3", "3:2", "2:3", "3:4", "9:16", "21:9")
# The owner's mark is never generated; keep prompts about environment, not identity.
FORBIDDEN_IMAGE_TERMS = ("logo", "wordmark", "emblem", "bear", "sveinbjorn", "sveinbjörn", "ironmaw")

BRAND_STYLE_SUFFIX = (
    " Dark Nordic palette: charcoal #0F1416 ground, teal #3CA0A0 and slate #5F7E8F accents with a"
    " rare rust #D0602B highlight. Flat, quiet, low contrast. No text, no lettering, no logos,"
    " no people, no animals."
)
REVIEW_RUBRIC = (
    "You review UI renders of the IRONMAW (Wormian Bones) design system. Rules: teal = interactive"
    " emphasis (focus, selection, links); rust = the one main action and the active indicator;"
    " warnings are amber, never rust; display lettering (condensed uppercase) only on short labels,"
    " never document titles, excerpts or Icelandic prose; review labels use three tones"
    " (filled/rust outline/slate outline), never green or 'Verified'; one chamfer size; the thin"
    " suture seam is the only ornament; body text must stay readable and free of terrain or"
    " pattern. Report concrete visible defects with where they are. Say what you cannot judge."
)


def _safe_error(exc: Exception) -> str:
    if isinstance(exc, (MiniMaxAPIError, MiniMaxCredentialError, MiniMaxConfigError)):
        return str(exc)
    return f"unexpected {type(exc).__name__}"


def _resolve_inside(path: str, roots: tuple[Path, ...]) -> Path:
    """Resolve ``path`` and require it to sit in an allowed root and avoid denied folders."""
    target = Path(path).expanduser()
    target = (roots[0] / target if not target.is_absolute() else target).resolve()
    if not any(target == r or r in target.parents for r in roots):
        raise MiniMaxConfigError("path is outside the allowed directories")
    if DENIED_PARTS.intersection(target.parts):
        raise MiniMaxConfigError("path is in a protected directory (private references, VCS or secrets)")
    return target


class ToolConfig(BaseToolConfig):
    """Shared tool configuration (the HTTP helper is injectable for tests)."""

    model_config = {"arbitrary_types_allowed": True}
    http: MiniMaxHTTP | None = None
    allowed_roots: tuple[Path, ...] = (REPO_ROOT,)
    out_dir: Path = REPO_ROOT / "agents" / ".out" / "minimax-images"


# --- screenshot review (vision) ---------------------------------------------------


class ScreenshotReviewInput(BaseIOSchema):
    """Review a UI screenshot against the IRONMAW brand and accessibility rules."""

    image_path: str = Field(..., description="Repo-relative path to a PNG, JPEG, WEBP or GIF render (max 10 MB).")
    question: str = Field(
        "Review this render against the rules. List visible defects, most severe first.",
        max_length=4000,
        description="What to look at.",
    )
    detail: Literal["low", "default", "high"] = Field("high", description="Image resolution tier.")
    reasoning_effort: Literal["low", "medium", "high", "xhigh", "max"] | None = Field(
        None, description="Thinking depth (MiniMax-M3.1-Flash-Preview only)."
    )


class ScreenshotReviewOutput(BaseIOSchema):
    """The model's review, or a typed failure."""

    status: Literal["ok", "error"] = Field(..., description="Whether the review completed.")
    review: str | None = Field(None, description="The review text.")
    error: str | None = Field(None, description="Why it failed (safe to display).")


class ScreenshotReviewTool(BaseTool[ScreenshotReviewInput, ScreenshotReviewOutput]):
    def __init__(self, config: ToolConfig | None = None) -> None:
        self.cfg = config or ToolConfig()
        self.http = self.cfg.http or MiniMaxHTTP()
        super().__init__(self.cfg)

    def run(self, params: ScreenshotReviewInput) -> ScreenshotReviewOutput:
        try:
            path = _resolve_inside(params.image_path, self.cfg.allowed_roots)
            media = IMAGE_TYPES.get(path.suffix.lower())
            if media is None:
                raise MiniMaxConfigError(f"unsupported image type {path.suffix!r}")
            if not path.is_file():
                raise MiniMaxConfigError("image file not found")
            if path.stat().st_size > MAX_UPLOAD_BYTES:
                raise MiniMaxConfigError("image exceeds the 10 MB upload limit")
            validate_reasoning_effort(params.reasoning_effort)
            data_url = f"data:{media};base64,{base64.b64encode(path.read_bytes()).decode()}"
            body = {
                "model": DEFAULT_MODEL,
                "messages": [
                    {"role": "system", "content": REVIEW_RUBRIC},
                    {"role": "user", "content": [
                        {"type": "text", "text": params.question},
                        {"type": "image_url", "image_url": {"url": data_url, "detail": params.detail}},
                    ]},
                ],
                "max_completion_tokens": 4096,
            }
            if params.reasoning_effort:
                body["reasoning_effort"] = params.reasoning_effort
            reply = self.http.request("POST", "/chat/completions", json=body)
            text = (reply.get("choices") or [{}])[0].get("message", {}).get("content")
            if not text:
                raise MiniMaxAPIError("the model returned no review text")
            return ScreenshotReviewOutput(status="ok", review=text)
        except Exception as exc:  # typed failure, never a raw traceback
            return ScreenshotReviewOutput(status="error", error=_safe_error(exc))


# --- text to image ------------------------------------------------------------------


class ImageGenerationInput(BaseIOSchema):
    """Generate brand-consistent environmental imagery (terrain, contour, empty states)."""

    prompt: str = Field(..., min_length=3, max_length=1200, description="Scene description, no text or logos.")
    aspect_ratio: Literal["1:1", "16:9", "4:3", "3:2", "2:3", "3:4", "9:16", "21:9"] = Field(
        "16:9", description="Output aspect ratio."
    )
    n: int = Field(1, ge=1, le=9, description="Number of images.")
    seed: int | None = Field(None, ge=0, description="Seed for reproducible output.")


class ImageGenerationOutput(BaseIOSchema):
    """Paths of the generated files, or a typed failure."""

    status: Literal["ok", "error"] = Field(..., description="Whether images were produced.")
    files: list[str] = Field(default_factory=list, description="Saved image paths, outside tracked assets.")
    blocked: int = Field(0, description="Images blocked by MiniMax content safety.")
    error: str | None = Field(None, description="Why it failed (safe to display).")


class ImageGenerationTool(BaseTool[ImageGenerationInput, ImageGenerationOutput]):
    def __init__(self, config: ToolConfig | None = None) -> None:
        self.cfg = config or ToolConfig()
        self.http = self.cfg.http or MiniMaxHTTP()
        super().__init__(self.cfg)

    def run(self, params: ImageGenerationInput) -> ImageGenerationOutput:
        try:
            lowered = params.prompt.lower()
            hit = next((t for t in FORBIDDEN_IMAGE_TERMS if t in lowered), None)
            if hit:
                raise MiniMaxConfigError(
                    f"prompt mentions {hit!r}; the owner's mark and name are never generated, describe scenery only"
                )
            prompt = (params.prompt.rstrip() + BRAND_STYLE_SUFFIX)[:MAX_PROMPT_CHARS]
            body = {"model": "image-01", "prompt": prompt, "aspect_ratio": params.aspect_ratio,
                    "n": params.n, "response_format": "base64", "prompt_optimizer": False}
            if params.seed is not None:
                body["seed"] = params.seed
            reply = self.http.request("POST", "/image_generation", json=body)
            images = (reply.get("data") or {}).get("image_base64") or []
            blocked = int((reply.get("metadata") or {}).get("failed_count") or 0)
            if not images:
                raise MiniMaxAPIError("no images were returned" + (" (blocked by content safety)" if blocked else ""))
            files = [self._save(b64) for b64 in images]
            return ImageGenerationOutput(status="ok", files=files, blocked=blocked)
        except Exception as exc:
            return ImageGenerationOutput(status="error", error=_safe_error(exc))

    def _save(self, b64: str) -> str:
        try:
            raw = base64.b64decode(b64, validate=True)
        except (binascii.Error, ValueError):
            raise MiniMaxAPIError("an image was not valid base64") from None
        if len(raw) > MAX_GENERATED_BYTES:
            raise MiniMaxAPIError("a generated image exceeded the size cap")
        ext = _sniff_ext(raw)
        if ext is None:
            raise MiniMaxAPIError("a generated file was not a PNG, JPEG or WEBP image")
        self.cfg.out_dir.mkdir(parents=True, exist_ok=True)
        target = self.cfg.out_dir / f"{hashlib.sha256(raw).hexdigest()[:16]}{ext}"
        target.write_bytes(raw)
        return str(target)


def _sniff_ext(raw: bytes) -> str | None:
    if raw.startswith(b"\x89PNG\r\n\x1a\n"):
        return ".png"
    if raw.startswith(b"\xff\xd8\xff"):
        return ".jpg"
    if raw[:4] == b"RIFF" and raw[8:12] == b"WEBP":
        return ".webp"
    return None


# --- token estimate -----------------------------------------------------------------


class TokenEstimateInput(BaseIOSchema):
    """Estimate input tokens for a prompt without invoking the model."""

    text: str = Field(..., min_length=1, description="The user input to measure.")
    instructions: str | None = Field(None, description="System instructions to include.")
    model: str = Field(DEFAULT_MODEL, description="MiniMax model id.")


class TokenEstimateOutput(BaseIOSchema):
    """Estimated token count, or a typed failure."""

    status: Literal["ok", "error"] = Field(..., description="Whether an estimate was produced.")
    input_tokens: int | None = Field(None, description="Estimated input tokens.")
    error: str | None = Field(None, description="Why it failed (safe to display).")


class TokenEstimateTool(BaseTool[TokenEstimateInput, TokenEstimateOutput]):
    def __init__(self, config: ToolConfig | None = None) -> None:
        self.cfg = config or ToolConfig()
        self.http = self.cfg.http or MiniMaxHTTP()
        super().__init__(self.cfg)

    def run(self, params: TokenEstimateInput) -> TokenEstimateOutput:
        try:
            validate_model(params.model)
            body = {"model": params.model, "input": params.text}
            if params.instructions:
                body["instructions"] = params.instructions
            reply = self.http.request("POST", "/responses/input_tokens", json=body)
            count = reply.get("input_tokens")
            if not isinstance(count, int):
                raise MiniMaxAPIError("the response had no token count")
            return TokenEstimateOutput(status="ok", input_tokens=count)
        except Exception as exc:
            return TokenEstimateOutput(status="error", error=_safe_error(exc))


# --- model list ---------------------------------------------------------------------


class ModelListInput(BaseIOSchema):
    """List the models this API key can use."""

    contains: str | None = Field(None, description="Only ids containing this text (case-insensitive).")


class ModelListOutput(BaseIOSchema):
    """Model ids, flagged when this project's validators do not know them yet."""

    status: Literal["ok", "error"] = Field(..., description="Whether the list was fetched.")
    models: list[str] = Field(default_factory=list, description="Model ids.")
    unknown_to_project: list[str] = Field(
        default_factory=list, description="Ids the API returned that ironmaw_agents.minimax.MODELS lacks."
    )
    error: str | None = Field(None, description="Why it failed (safe to display).")


class ModelListTool(BaseTool[ModelListInput, ModelListOutput]):
    def __init__(self, config: ToolConfig | None = None) -> None:
        self.cfg = config or ToolConfig()
        self.http = self.cfg.http or MiniMaxHTTP()
        super().__init__(self.cfg)

    def run(self, params: ModelListInput) -> ModelListOutput:
        try:
            reply = self.http.request("GET", "/models")
            ids = sorted(m["id"] for m in reply.get("data", []) if isinstance(m, dict) and isinstance(m.get("id"), str))
            if params.contains:
                ids = [i for i in ids if params.contains.lower() in i.lower()]
            return ModelListOutput(status="ok", models=ids, unknown_to_project=[i for i in ids if i.startswith("MiniMax-") and i not in MODELS])
        except Exception as exc:
            return ModelListOutput(status="error", error=_safe_error(exc))
