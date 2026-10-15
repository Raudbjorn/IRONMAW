"""MiniMax transport for small Atomic Agents in IRONMAW."""

import os
import shutil
import subprocess

import instructor
from atomic_agents import AgentConfig, AtomicAgent, BasicChatInputSchema, BasicChatOutputSchema
from atomic_agents.context import SystemPromptGenerator
from instructor import Mode
from instructor.core.exceptions import InstructorRetryException
from openai import OpenAI

BASE_URL = "https://api.minimax.io/v1"
DEFAULT_MODEL = "MiniMax-M3.1-Flash-Preview"
REQUEST_TIMEOUT = 60.0
MAX_RETRIES = 2
MAX_COMPLETION_TOKENS = 16_384
REASONING_EFFORTS = {"low", "medium", "high", "xhigh", "max"}


def _api_key() -> str:
    if "OPENAI_API_KEY" in os.environ:
        key = os.environ["OPENAI_API_KEY"]
        if not key.strip():
            raise ValueError("OPENAI_API_KEY is empty")
        return key

    helper = shutil.which("minimax-api-key")
    if helper is None:
        raise ValueError("OPENAI_API_KEY is unset and minimax-api-key was not found on PATH")
    try:
        result = subprocess.run([helper], capture_output=True, text=True, timeout=10, check=False)
    except (OSError, subprocess.TimeoutExpired, UnicodeError):
        raise ValueError("minimax-api-key failed to provide an API key") from None
    if result.returncode != 0 or not result.stdout.strip():
        raise ValueError("minimax-api-key failed to provide an API key")
    return result.stdout.strip()


def minimax_client(*, reasoning_effort: str = "medium", mode: Mode = Mode.TOOLS):
    """Build an Instructor client for MiniMax's function-tool chat endpoint."""
    if mode != Mode.TOOLS:
        raise ValueError("MiniMax supports Mode.TOOLS here; JSON modes are unsupported")
    if reasoning_effort not in REASONING_EFFORTS:
        raise ValueError(f"Unsupported reasoning_effort: {reasoning_effort}")

    key = _api_key()
    raw_client = OpenAI(
        api_key=key,
        base_url=BASE_URL,
        timeout=REQUEST_TIMEOUT,
        max_retries=MAX_RETRIES,
    )
    client = instructor.from_openai(
        raw_client,
        mode=Mode.TOOLS,
        reasoning_effort=reasoning_effort,
        max_completion_tokens=MAX_COMPLETION_TOKENS,
    )
    create = client.create_fn

    def create_with_text_fallback(*args, **kwargs):
        try:
            return create(*args, **kwargs)
        except InstructorRetryException as error:
            # MiniMax may answer plain text even when a function is offered.
            if kwargs.get("response_model") is BasicChatOutputSchema:
                completion = error.last_completion
                if completion and completion.choices:
                    choice = completion.choices[0]
                    message = choice.message
                    if choice.finish_reason == "stop" and message.content and not message.tool_calls:
                        return BasicChatOutputSchema(chat_message=message.content)
            raise

    client.create_fn = create_with_text_fallback
    return client


def create_minimax_agent(
    *, model: str = DEFAULT_MODEL, reasoning_effort: str = "medium", mode: Mode = Mode.TOOLS
) -> AtomicAgent[BasicChatInputSchema, BasicChatOutputSchema]:
    """Create a basic chat agent; callers may choose another MiniMax model."""
    return AtomicAgent[BasicChatInputSchema, BasicChatOutputSchema](
        config=AgentConfig(
            client=minimax_client(reasoning_effort=reasoning_effort, mode=mode),
            model=model,
            mode=Mode.TOOLS,
            model_api_parameters={"max_retries": MAX_RETRIES},
            system_prompt_generator=SystemPromptGenerator(
                output_instructions=[
                    "Always call the BasicChatOutputSchema function with your final answer. "
                    "Do not return a plain text answer."
                ]
            ),
        )
    )
