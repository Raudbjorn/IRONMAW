"""The IRONMAW agent roster on MiniMax.

Prompts come from ``.claude/agents/ironmaw-*.md`` so the Claude Code subagents,
the Codex agents and these Atomic Agents share one source of role definitions.
These agents cannot read or run anything: they reason over the context blocks
they are given and return typed plans and reports.
"""

from __future__ import annotations

import re
from collections.abc import Callable, Mapping, Sequence
from dataclasses import dataclass
from pathlib import Path

from atomic_agents import AtomicAgent
from atomic_agents.context import SystemPromptGenerator

from . import mercury
from .context import RepoFilesProvider, RepoIndexProvider, RulesProvider
from .minimax import DEFAULT_MODEL, MiniMaxConfigError, minimax_agent, resolve_api_key
from .schemas import (
    A11yAudit, CopyReview, DesignCritique, ExplorationReport, GapReport, ImplementationPlan,
    ReviewReport, SyncReport, TaskInput, TestPlan, TokenProposal,
)
from .tools.minimax_tools import REPO_ROOT

AGENT_DIR = REPO_ROOT / ".claude" / "agents"
NO_TOOLS_NOTE = (
    "You cannot read files, run commands or edit anything. Work only from the context blocks"
    " provided; name what you could not verify instead of guessing."
)


@dataclass(frozen=True)
class Role:
    name: str
    output: type
    effort: str
    temperature: float = 0.2


@dataclass(frozen=True)
class Provider:
    """How one backend builds an agent and adapts the role defaults to its limits."""

    factory: Callable[..., AtomicAgent]
    default_model: str
    resolve_key: Callable[..., str]
    effort: Callable[[str], str | None] = lambda effort: effort
    temperature: Callable[[float], float] = lambda temperature: temperature


PROVIDERS: dict[str, Provider] = {
    "minimax": Provider(minimax_agent, DEFAULT_MODEL, resolve_api_key),
    "mercury": Provider(
        mercury.mercury_agent, mercury.DEFAULT_MODEL, mercury.resolve_mercury_key,
        effort=mercury.safe_effort,
        temperature=lambda t: min(max(t, mercury.TEMPERATURE_RANGE[0]), mercury.TEMPERATURE_RANGE[1]),
    ),
}
DEFAULT_PROVIDER = "minimax"


def get_provider(name: str) -> Provider:
    if name not in PROVIDERS:
        raise MiniMaxConfigError(f"unknown provider {name!r}; expected one of {sorted(PROVIDERS)}")
    return PROVIDERS[name]


ROLES: dict[str, Role] = {
    "explorer": Role("ironmaw-explorer", ExplorationReport, "low"),
    "implementer": Role("ironmaw-implementer", ImplementationPlan, "medium"),
    "tester": Role("ironmaw-tester", TestPlan, "medium"),
    "reviewer": Role("ironmaw-reviewer", ReviewReport, "high"),
    "sync-keeper": Role("ironmaw-sync-keeper", SyncReport, "low"),
    "design-critic": Role("ironmaw-design-critic", DesignCritique, "high"),
    "a11y-auditor": Role("ironmaw-a11y-auditor", A11yAudit, "high"),
    "copy-editor": Role("ironmaw-copy-editor", CopyReview, "low"),
    "token-steward": Role("ironmaw-token-steward", TokenProposal, "high"),
    "gap-scout": Role("ironmaw-gap-scout", GapReport, "medium"),
}


def load_role_prompt(role: Role, agent_dir: Path = AGENT_DIR) -> tuple[str, list[str]]:
    """Return (description, body lines) from the role's markdown definition."""
    path = agent_dir / f"{role.name}.md"
    text = path.read_text(encoding="utf-8")
    match = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if not match:
        raise MiniMaxConfigError(f"{path.name} has no frontmatter")
    front = dict(line.split(": ", 1) for line in match.group(1).splitlines() if ": " in line)
    body = [ln.strip() for ln in match.group(2).strip().splitlines() if ln.strip()]
    return front.get("description", role.name), body


def build_agent(
    role_key: str,
    *,
    paths: Sequence[str] = (),
    model: str | None = None,
    env: Mapping[str, str] | None = None,
    agent_dir: Path = AGENT_DIR,
    provider: str = DEFAULT_PROVIDER,
) -> AtomicAgent:
    if role_key not in ROLES:
        raise MiniMaxConfigError(f"unknown role {role_key!r}; expected one of {sorted(ROLES)}")
    backend = get_provider(provider)
    role = ROLES[role_key]
    description, body = load_role_prompt(role, agent_dir)
    files = RepoFilesProvider(paths) if paths else None   # validated before any client exists
    agent = backend.factory(
        TaskInput,
        role.output,
        system_prompt_generator=SystemPromptGenerator(
            background=[description, *body],
            steps=[
                NO_TOOLS_NOTE,
                "Read the task and the provided context blocks.",
                "A file you were not shown may still exist: check the repository index before calling anything"
                " missing, and list unseen contents as unverified instead of guessing.",
                "Answer in the required schema; leave a list empty rather than inventing entries.",
            ],
            output_instructions=["Be terse and concrete. Cite repo-relative paths and lines when the context shows them."],
        ),
        model=model or backend.default_model,
        reasoning_effort=backend.effort(role.effort),
        temperature=backend.temperature(role.temperature),
        env=env,
    )
    agent.register_context_provider("rules", RulesProvider())
    agent.register_context_provider("index", RepoIndexProvider())
    if files:
        agent.register_context_provider("files", files)
    return agent


def run_role(
    role_key: str,
    task: str,
    *,
    paths: Sequence[str] = (),
    env: Mapping[str, str] | None = None,
    **kwargs,
):
    return build_agent(role_key, paths=paths, env=env, **kwargs).run(TaskInput(task=task))
