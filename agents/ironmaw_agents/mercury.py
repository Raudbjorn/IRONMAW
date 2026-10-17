"""Inception Labs Mercury client and agent factory for Atomic Agents.

Mercury speaks the OpenAI Chat Completions format at a fixed endpoint. Same
contract as ``minimax.py`` (and its error types), with Mercury's own limits:

* credentials: an explicit ``INCEPTION_LABS_API_KEY`` wins; otherwise the
  ``inceptionlabs-api-key`` helper is found on ``PATH`` and run (output never
  exposed).
* ``temperature`` must be in [0.5, 1]. The API silently resets anything else
  and only adds a warning, so out-of-range values are rejected here instead.
* ``reasoning_effort`` is ``instant|low|medium|high``. At ``high``, mercury-2
  sometimes spends the whole token budget reasoning and returns no tool call
  (``finish_reason: length``); ``safe_effort`` caps role defaults at medium.
* Instructor makes at most two attempts (one retry) instead of three: a
  truncated answer costs 15-30 s per attempt and rarely recovers on a retry.
* structured outputs use function tools only (``Mode.TOOLS``).
"""

from __future__ import annotations

import math
from collections.abc import Mapping
from typing import Any, Callable

import instructor
from atomic_agents import AgentConfig, AtomicAgent
from atomic_agents.context import ChatHistory, SystemPromptGenerator
from instructor import Mode
from openai import OpenAI

from .minimax import MiniMaxConfigError, resolve_api_key, validate_mode

MERCURY_BASE_URL = "https://api.inceptionlabs.ai/v1"
API_KEY_ENV = "INCEPTION_LABS_API_KEY"
HELPER_NAME = "inceptionlabs-api-key"

DEFAULT_MODEL = "mercury-2"
# Max output tokens per model (models page / chat completions reference).
MODELS: dict[str, int] = {"mercury-2": 50_000, "mercury-2.5": 65_536}
REASONING_EFFORTS = ("instant", "low", "medium", "high")
EFFORT_CAP = "medium"

REQUEST_TIMEOUT_S = 120.0
MAX_RETRIES = 2                       # HTTP-level, inside the OpenAI client
INSTRUCTOR_ATTEMPTS = 2               # validation-level; Instructor's max_retries counts attempts
DEFAULT_MAX_COMPLETION_TOKENS = 8192
DEFAULT_TEMPERATURE = 0.5
TEMPERATURE_RANGE = (0.5, 1.0)

SUPPORTED_MODE = Mode.TOOLS


def resolve_mercury_key(env: Mapping[str, str] | None = None, **kwargs: Any) -> str:
    return resolve_api_key(env, env_name=API_KEY_ENV, helper_name=HELPER_NAME, **kwargs)


def validate_model(model: str) -> str:
    if model not in MODELS:
        raise MiniMaxConfigError(f"unknown Mercury model {model!r}; expected one of {sorted(MODELS)}")
    return model


def validate_reasoning_effort(effort: str | None) -> str | None:
    if effort is not None and effort not in REASONING_EFFORTS:
        raise MiniMaxConfigError(f"Mercury reasoning_effort must be one of {list(REASONING_EFFORTS)} (got {effort!r})")
    return effort


def safe_effort(effort: str | None) -> str | None:
    """Cap an effort at ``EFFORT_CAP``; ``high`` runs away often enough to be opt-in only."""
    if effort is None:
        return None
    validate_reasoning_effort(effort)
    order = REASONING_EFFORTS.index
    return effort if order(effort) <= order(EFFORT_CAP) else EFFORT_CAP


def _number_in(name: str, value: Any, bounds: tuple[float, float]) -> None:
    ok = (isinstance(value, (int, float)) and not isinstance(value, bool)
          and math.isfinite(value) and bounds[0] <= value <= bounds[1])
    if not ok:
        raise MiniMaxConfigError(f"Mercury {name} must be a number in [{bounds[0]:g}, {bounds[1]:g}]")


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
        limit = MODELS[model]
        value = out["max_completion_tokens"]
        if not isinstance(value, int) or isinstance(value, bool) or not 1 <= value <= limit:
            raise MiniMaxConfigError(f"max_completion_tokens must be an int in [1, {limit}] for {model}")
    if "temperature" in out:
        _number_in("temperature", out["temperature"], TEMPERATURE_RANGE)
    if "reasoning_effort" in out:
        validate_reasoning_effort(out["reasoning_effort"])
    return out


def mercury_client(
    *,
    reasoning_effort: str | None = None,
    mode: Mode = SUPPORTED_MODE,
    env: Mapping[str, str] | None = None,
) -> instructor.Instructor:
    """Instructor-wrapped client for the fixed Mercury endpoint; validates before any client exists."""
    validate_mode(mode)
    validate_reasoning_effort(reasoning_effort)
    api_key = resolve_mercury_key(env)

    raw = OpenAI(api_key=api_key, base_url=MERCURY_BASE_URL, timeout=REQUEST_TIMEOUT_S, max_retries=MAX_RETRIES)
    client = instructor.from_openai(raw, mode=mode)

    def guard(send: Callable[..., Any]) -> Callable[..., Any]:
        def guarded(*args: Any, **kwargs: Any) -> Any:
            model = kwargs.get("model") or DEFAULT_MODEL
            validate_model(model)
            attempts = kwargs.pop("max_retries", INSTRUCTOR_ATTEMPTS)  # Instructor's, never sent upstream
            kwargs = validate_request_params(model, kwargs)
            if reasoning_effort is not None:
                kwargs.setdefault("reasoning_effort", reasoning_effort)
            return send(*args, max_retries=attempts, **kwargs)

        return guarded

    for name in ("create", "create_partial", "create_iterable", "create_with_completion"):
        setattr(client, name, guard(getattr(client, name)))
    return client


def mercury_agent(
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
    """Factory for an ``AtomicAgent[input_schema, output_schema]`` on Mercury."""
    validate_model(model)
    params = {"max_completion_tokens": DEFAULT_MAX_COMPLETION_TOKENS, "temperature": DEFAULT_TEMPERATURE}
    params.update(model_api_parameters)
    params = validate_request_params(model, params)
    client = mercury_client(reasoning_effort=reasoning_effort, env=env)
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
