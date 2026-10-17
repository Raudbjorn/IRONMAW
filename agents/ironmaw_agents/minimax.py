"""MiniMax client and agent factory for Atomic Agents.

MiniMax speaks the OpenAI Chat Completions format at a fixed endpoint. This
module owns everything that is specific to it:

* credentials: an explicit ``OPENAI_API_KEY`` wins; otherwise the
  ``minimax-api-key`` helper is found on ``PATH`` and run. Failures raise a
  fixed message and never carry the helper's stdout or stderr.
* the endpoint is a constant, not a parameter, and ignores ``OPENAI_BASE_URL``.
* request limits (tokens, temperature, top_p, timeout) are shared by the
  client and the agent factory.
* structured outputs use function tools only (``Mode.TOOLS``). JSON modes are
  rejected before any network I/O.
"""

from __future__ import annotations

import math
import os
import shutil
import subprocess
from collections.abc import Mapping
from typing import Any, Callable

import instructor
from openai import OpenAI
from atomic_agents import AgentConfig, AtomicAgent
from atomic_agents.context import ChatHistory, SystemPromptGenerator
from instructor import Mode

MINIMAX_BASE_URL = "https://api.minimax.io/v1"
API_KEY_ENV = "OPENAI_API_KEY"
HELPER_NAME = "minimax-api-key"
HELPER_TIMEOUT_S = 10.0

DEFAULT_MODEL = "MiniMax-M3.1-Flash-Preview"
MODELS = frozenset(
    {
        "MiniMax-M3.1-Flash-Preview",
        "MiniMax-M3",
        "MiniMax-M2.7",
        "MiniMax-M2.7-highspeed",
        "MiniMax-M2.5",
        "MiniMax-M2.5-highspeed",
        "MiniMax-M2.1",
        "MiniMax-M2.1-highspeed",
        "MiniMax-M2",
    }
)
# `none` is deliberately absent: M3.1-Flash-Preview always thinks and answers 400.
REASONING_EFFORTS = ("low", "medium", "high", "xhigh", "max")

# Shared request limits (see the Chat Completions reference).
REQUEST_TIMEOUT_S = 120.0
MAX_RETRIES = 2
DEFAULT_MAX_COMPLETION_TOKENS = 8192
LONG_CONTEXT_MODELS = frozenset({"MiniMax-M3.1-Flash-Preview", "MiniMax-M3"})
MAX_COMPLETION_TOKENS_LONG = 524_288
MAX_COMPLETION_TOKENS_DEFAULT = 204_800
TEMPERATURE_RANGE = (0.0, 2.0)
TOP_P_RANGE = (0.0, 1.0)

SUPPORTED_MODE = Mode.TOOLS


class MiniMaxConfigError(ValueError):
    """A request or configuration value MiniMax does not support."""


class MiniMaxCredentialError(RuntimeError):
    """No usable API key. The message never contains helper output."""


def resolve_api_key(
    env: Mapping[str, str] | None = None,
    *,
    which: Callable[[str], str | None] | None = None,
    run: Callable[..., Any] | None = None,
    env_name: str = API_KEY_ENV,
    helper_name: str = HELPER_NAME,
) -> str:
    """Return the API key, preferring an explicit ``env_name`` over the ``helper_name`` helper.

    Defaults are MiniMax's; other providers pass their own variable and helper.
    """
    environ = os.environ if env is None else env
    which = which or shutil.which  # resolved per call so tests and callers can substitute
    run = run or subprocess.run
    explicit = (environ.get(env_name) or "").strip()
    if explicit:
        return _checked_key(explicit)

    helper = which(helper_name)
    if not helper:
        raise MiniMaxCredentialError(
            f"{env_name} is not set and `{helper_name}` was not found on PATH"
        )
    try:
        result = run(
            [helper],
            capture_output=True,
            text=True,
            timeout=HELPER_TIMEOUT_S,
            check=False,
            stdin=subprocess.DEVNULL,
        )
    except subprocess.TimeoutExpired:
        raise MiniMaxCredentialError(
            f"`{helper_name}` timed out after {HELPER_TIMEOUT_S:g}s (output withheld)"
        ) from None
    except OSError as exc:
        raise MiniMaxCredentialError(
            f"`{helper_name}` could not be run ({type(exc).__name__})"
        ) from None
    if result.returncode != 0:
        raise MiniMaxCredentialError(
            f"`{helper_name}` exited with status {result.returncode} (output withheld)"
        )
    key = (result.stdout or "").strip()
    if not key:
        raise MiniMaxCredentialError(f"`{helper_name}` returned an empty key")
    return _checked_key(key)


def _checked_key(key: str) -> str:
    if any(ch.isspace() for ch in key):
        raise MiniMaxCredentialError("API key contains whitespace; refusing to use it")
    return key


def _number_in(name: str, value: Any, bounds: tuple[float, float]) -> None:
    ok = (
        isinstance(value, (int, float))
        and not isinstance(value, bool)
        and math.isfinite(value)
        and bounds[0] <= value <= bounds[1]
    )
    if not ok:
        raise MiniMaxConfigError(f"{name} must be a number in [{bounds[0]:g}, {bounds[1]:g}]")


def max_completion_tokens_for(model: str) -> int:
    return MAX_COMPLETION_TOKENS_LONG if model in LONG_CONTEXT_MODELS else MAX_COMPLETION_TOKENS_DEFAULT


def validate_mode(mode: Mode) -> Mode:
    if mode != SUPPORTED_MODE:
        raise MiniMaxConfigError(
            f"unsupported mode {mode!s}: MiniMax structured output uses function tools "
            f"({SUPPORTED_MODE!s}); JSON modes are rejected"
        )
    return mode


def validate_model(model: str) -> str:
    if model not in MODELS:
        raise MiniMaxConfigError(f"unknown model {model!r}; expected one of {sorted(MODELS)}")
    return model


def validate_reasoning_effort(effort: str | None) -> str | None:
    if effort is not None and effort not in REASONING_EFFORTS:
        raise MiniMaxConfigError(
            f"reasoning_effort must be one of {list(REASONING_EFFORTS)} (got {effort!r}); "
            "'none' is not accepted"
        )
    return effort


def validate_request_params(model: str, params: Mapping[str, Any]) -> dict[str, Any]:
    """Validate and normalise per-request parameters. Raises before any I/O."""
    out = dict(params)
    if "response_format" in out:
        raise MiniMaxConfigError("response_format (JSON mode) is not supported; use function tools")
    if "max_tokens" in out:  # deprecated upstream; translate, never send both
        if "max_completion_tokens" in out:
            raise MiniMaxConfigError("pass max_completion_tokens, not both it and max_tokens")
        out["max_completion_tokens"] = out.pop("max_tokens")
    if "max_completion_tokens" in out:
        limit = max_completion_tokens_for(model)
        value = out["max_completion_tokens"]
        if not isinstance(value, int) or isinstance(value, bool) or not 1 <= value <= limit:
            raise MiniMaxConfigError(f"max_completion_tokens must be an int in [1, {limit}] for {model}")
    if "temperature" in out:
        _number_in("temperature", out["temperature"], TEMPERATURE_RANGE)
    if "top_p" in out:
        _number_in("top_p", out["top_p"], TOP_P_RANGE)
    if "reasoning_effort" in out:
        validate_reasoning_effort(out["reasoning_effort"])
    return out


def minimax_client(
    *,
    reasoning_effort: str | None = None,
    mode: Mode = SUPPORTED_MODE,
    env: Mapping[str, str] | None = None,
) -> instructor.Instructor:
    """Build an Instructor-wrapped client for the fixed MiniMax endpoint.

    Validation and credential resolution happen first, so a bad option or a
    missing key fails before any client object exists.
    """
    validate_mode(mode)
    validate_reasoning_effort(reasoning_effort)
    api_key = resolve_api_key(env)

    raw = OpenAI(
        api_key=api_key,
        base_url=MINIMAX_BASE_URL,
        timeout=REQUEST_TIMEOUT_S,
        max_retries=MAX_RETRIES,
    )
    client = instructor.from_openai(raw, mode=mode)

    def guard(send: Callable[..., Any]) -> Callable[..., Any]:
        def guarded(*args: Any, **kwargs: Any) -> Any:
            model = kwargs.get("model")
            if model is not None:
                validate_model(model)
            kwargs = validate_request_params(model or DEFAULT_MODEL, kwargs)
            if reasoning_effort is not None:
                kwargs.setdefault("reasoning_effort", reasoning_effort)
            return send(*args, **kwargs)

        return guarded

    # chat.completions *is* this object, so guarding here covers every call path
    # AtomicAgent uses, and raises before Instructor's retry machinery or any I/O.
    for name in ("create", "create_partial", "create_iterable", "create_with_completion"):
        setattr(client, name, guard(getattr(client, name)))
    return client


def minimax_agent(
    input_schema: type,
    output_schema: type,
    *,
    system_prompt_generator: SystemPromptGenerator | None = None,
    model: str = DEFAULT_MODEL,
    reasoning_effort: str | None = None,
    history: ChatHistory | None = None,
    env: Mapping[str, str] | None = None,
    **model_api_parameters: Any,
) -> AtomicAgent:
    """Factory for an ``AtomicAgent[input_schema, output_schema]`` on MiniMax."""
    validate_model(model)
    params = {"max_completion_tokens": DEFAULT_MAX_COMPLETION_TOKENS, "temperature": 0.2}
    params.update(model_api_parameters)
    params = validate_request_params(model, params)
    client = minimax_client(reasoning_effort=reasoning_effort, env=env)
    return AtomicAgent[input_schema, output_schema](
        config=AgentConfig(
            client=client,
            model=model,
            history=history,
            system_prompt_generator=system_prompt_generator,
            mode=SUPPORTED_MODE,
            model_api_parameters=params,
        )
    )
