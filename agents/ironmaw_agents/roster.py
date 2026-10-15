"""The IRONMAW agent roster on MiniMax.

Prompts come from ``.claude/agents/ironmaw-*.md`` so the Claude Code subagents,
the Codex agents and these Atomic Agents share one source of role definitions.
These agents cannot read or run anything: they reason over the context blocks
they are given and return typed plans and reports.
"""

from __future__ import annotations

import re
from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from pathlib import Path

from atomic_agents import AtomicAgent
from atomic_agents.context import SystemPromptGenerator

from .context import RepoFilesProvider, RulesProvider
from .minimax import DEFAULT_MODEL, MiniMaxConfigError, minimax_agent
from .schemas import (
    DesignCritique, ExplorationReport, ImplementationPlan, ReviewReport,
    SyncReport, TaskInput, TestPlan,
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


ROLES: dict[str, Role] = {
    "explorer": Role("ironmaw-explorer", ExplorationReport, "low"),
    "implementer": Role("ironmaw-implementer", ImplementationPlan, "medium"),
    "tester": Role("ironmaw-tester", TestPlan, "medium"),
    "reviewer": Role("ironmaw-reviewer", ReviewReport, "high"),
    "sync-keeper": Role("ironmaw-sync-keeper", SyncReport, "low"),
    "design-critic": Role("ironmaw-design-critic", DesignCritique, "high"),
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
    model: str = DEFAULT_MODEL,
    env: Mapping[str, str] | None = None,
    agent_dir: Path = AGENT_DIR,
) -> AtomicAgent:
    if role_key not in ROLES:
        raise MiniMaxConfigError(f"unknown role {role_key!r}; expected one of {sorted(ROLES)}")
    role = ROLES[role_key]
    description, body = load_role_prompt(role, agent_dir)
    files = RepoFilesProvider(paths) if paths else None   # validated before any client exists
    agent = minimax_agent(
        TaskInput,
        role.output,
        system_prompt_generator=SystemPromptGenerator(
            background=[description, *body],
            steps=[
                NO_TOOLS_NOTE,
                "Read the task and the provided context blocks.",
                "Answer in the required schema; leave a list empty rather than inventing entries.",
            ],
            output_instructions=["Be terse and concrete. Cite repo-relative paths and lines when the context shows them."],
        ),
        model=model,
        reasoning_effort=role.effort,
        temperature=role.temperature,
        env=env,
    )
    agent.register_context_provider("rules", RulesProvider())
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
