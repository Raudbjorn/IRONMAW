"""Read-only repo context for the agents (they have no file tools)."""

from __future__ import annotations

from collections.abc import Sequence
from pathlib import Path

from atomic_agents.context import BaseDynamicContextProvider

from .minimax import MiniMaxConfigError
from .tools.minimax_tools import REPO_ROOT, _resolve_inside

MAX_FILES = 8
MAX_FILE_CHARS = 40_000
MAX_TOTAL_CHARS = 160_000


class RulesProvider(BaseDynamicContextProvider):
    """The project's CLAUDE.md, so every agent works from the same rules."""

    def __init__(self, root: Path = REPO_ROOT) -> None:
        super().__init__(title="IRONMAW project rules (CLAUDE.md)")
        self._path = root / "CLAUDE.md"

    def get_info(self) -> str:
        return self._path.read_text(encoding="utf-8") if self._path.is_file() else "CLAUDE.md not found."


class RepoFilesProvider(BaseDynamicContextProvider):
    """Bounded, read-only file contents chosen by the caller.

    Paths must be inside the repo and outside protected folders; the whole set is
    validated at construction, before anything is sent anywhere.
    """

    def __init__(self, paths: Sequence[str], root: Path = REPO_ROOT) -> None:
        super().__init__(title="Repository files (read-only)")
        if len(paths) > MAX_FILES:
            raise MiniMaxConfigError(f"at most {MAX_FILES} files per task")
        self._blocks: list[str] = []
        total = 0
        for p in paths:
            target = _resolve_inside(p, (root,))
            if not target.is_file():
                raise MiniMaxConfigError(f"not a file: {p}")
            text = target.read_text(encoding="utf-8", errors="replace")
            clipped = text[:MAX_FILE_CHARS]
            total += len(clipped)
            if total > MAX_TOTAL_CHARS:
                raise MiniMaxConfigError("selected files exceed the total context budget")
            note = "" if len(text) == len(clipped) else f"\n[truncated at {MAX_FILE_CHARS} chars]"
            self._blocks.append(f"=== {target.relative_to(root)} ===\n{clipped}{note}")

    def get_info(self) -> str:
        return "\n\n".join(self._blocks) or "No files were provided."
