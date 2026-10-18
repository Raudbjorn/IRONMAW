"""The improve pipeline: explore, run specialists, review their proposals.

explorer -> widen the file set from its findings -> specialists (a11y, copy,
tokens, gaps) -> token gates recomputed locally -> reviewer critiques the lot.

Caller mistakes (unknown specialist, unsafe path, missing key, bad model) raise
before any request. Once the first stage has run, every failure, including a
configuration error such as unparseable gates, is recorded in
``ImprovementReport.failures`` and the remaining stages still run. The API key is
resolved once and reused, so a key helper runs once per pipeline, not per agent.
"""

from __future__ import annotations

import os
import re
from collections.abc import Callable, Iterable, Mapping, Sequence
from typing import TypeVar

from .context import MAX_FILES, ProposalsProvider, RepoFilesProvider
from .tools.minimax_tools import REPO_ROOT
from .gates import verify_colour_changes
from .minimax import MiniMaxConfigError, MiniMaxCredentialError
from .roster import DEFAULT_PROVIDER, build_agent, get_provider
from .schemas import ImprovementReport, StageFailure, TaskInput

SPECIALISTS: tuple[str, ...] = ("a11y-auditor", "copy-editor", "token-steward", "gap-scout")
REPORT_FIELD = {"a11y-auditor": "a11y", "copy-editor": "copy_review", "token-steward": "tokens", "gap-scout": "gaps"}
# The list that must be non-empty for a specialist's report to count. Models sometimes
# answer instantly with nothing; an empty report is flagged, never read as a clean bill.
PRIMARY_LIST = {"a11y-auditor": "issues", "copy-editor": "issues", "token-steward": "changes", "gap-scout": "proposals"}
# Files a specialist can't do its job without; they go ahead of the shared set.
ROLE_PATHS: dict[str, tuple[str, ...]] = {
    # The DTCG sources it edits, the registry, the resolved values and the gates (~22 KB).
    "token-steward": tuple(f"src/lib/tokens/{f}" for f in (
        "primitives.tokens.json", "scale.tokens.json", "oxide.tokens.json", "bone.tokens.json",
        "themes.ts", "palette.ts", "palette.test.ts")),
    "gap-scout": ("src/lib/index.ts",),
}
# Roles that judge a component with its colocated test and its stories.
WITH_COMPANIONS = frozenset({"a11y-auditor"})
COMPONENT = re.compile(r"^src/lib/components/([^/]+)/([^/]+)\.svelte$")
MAX_TASK_CHARS = 8000
MAX_ERROR_CHARS = 500

T = TypeVar("T")


def _fits(paths: Sequence[str]) -> bool:
    try:
        RepoFilesProvider(paths)
    except MiniMaxConfigError:
        return False
    return True


def _bounded(base: Sequence[str], extra: Sequence[str]) -> list[str]:
    """``base`` plus whichever ``extra`` paths are safe files and fit the file and size caps."""
    chosen = list(dict.fromkeys(base))
    for path in extra:
        if len(chosen) >= MAX_FILES:
            break
        if path not in chosen and _fits([*chosen, path]):
            chosen.append(path)
    return chosen


def _with_companions(paths: Iterable[str]) -> list[str]:
    """Each component path followed by its colocated test and its story file, when they exist."""
    out: list[str] = []
    for path in paths:
        out.append(path)
        if m := COMPONENT.match(path):
            group, name = m.groups()
            for companion in (f"src/lib/components/{group}/{name}.test.ts", f"src/stories/{group}/{name}.stories.svelte"):
                if (REPO_ROOT / companion).is_file():
                    out.append(companion)
    return list(dict.fromkeys(out))


def _describe(exc: BaseException) -> str:
    """Name the root cause; Instructor wraps provider errors in a verbose retry report."""
    attempts = getattr(exc, "failed_attempts", None) or []
    root = getattr(attempts[-1], "exception", None) if attempts else None
    root = root or exc.__cause__ or exc
    head = type(exc).__name__ if root is exc else f"{type(exc).__name__} after {len(attempts) or 1} attempt(s), last {type(root).__name__}"
    return f"{head}: {root}"[:MAX_ERROR_CHARS]


def _stage(name: str, failures: list[StageFailure], run: Callable[[], T], *, strict: bool = False) -> T | None:
    """Run one stage. ``strict`` (first stage only) lets caller errors raise before any request."""
    try:
        return run()
    except (MiniMaxConfigError, MiniMaxCredentialError) as exc:
        if strict:
            raise                                                      # nothing has run yet: a caller error
        failures.append(StageFailure(stage=name, error=_describe(exc)))
        return None
    except Exception as exc:                                           # provider, network or schema errors
        failures.append(StageFailure(stage=name, error=_describe(exc)))
        return None


def improve(
    task: str,
    *,
    paths: Sequence[str] = (),
    specialists: Sequence[str] = SPECIALISTS,
    model: str | None = None,
    env: Mapping[str, str] | None = None,
    provider: str = DEFAULT_PROVIDER,
) -> ImprovementReport:
    unknown = sorted(set(specialists) - set(SPECIALISTS))
    if unknown or not specialists:
        raise MiniMaxConfigError(f"specialists must be a non-empty subset of {list(SPECIALISTS)}; got {unknown or '[]'}")
    backend = get_provider(provider)
    request = TaskInput(task=task)
    RepoFilesProvider(paths)                                           # unsafe paths fail before any request
    key = backend.resolve_key(env)                                     # so does a missing key
    stage_env = {**(os.environ if env is None else env), backend.key_env: key}   # helper runs once, not per agent
    build = lambda role, files: build_agent(role, paths=files, model=model, env=stage_env, provider=provider)  # noqa: E731

    failures: list[StageFailure] = []
    report = ImprovementReport(task=task)

    report.exploration = _stage("explorer", failures, lambda: build("explorer", paths).run(request), strict=True)
    found = [f.path for f in report.exploration.findings] if report.exploration else []
    report.files = _bounded(paths, found)

    role_files: dict[str, list[str]] = {}
    for role in dict.fromkeys(specialists):
        shared = _with_companions(report.files) if role in WITH_COMPANIONS else report.files
        role_paths = role_files[role] = _bounded([p for p in ROLE_PATHS.get(role, ()) if _fits([p])], shared)
        out = _stage(role, failures, lambda role=role, role_paths=role_paths: build(role, role_paths).run(request))
        if out is not None and not getattr(out, PRIMARY_LIST[role]):
            failures.append(StageFailure(
                stage=role, error=f"EmptyReport: no {PRIMARY_LIST[role]} returned; not treated as a clean result"))
        setattr(report, REPORT_FIELD[role], out)

    if report.tokens and report.tokens.changes:
        gates = _stage("token-gates", failures, lambda: verify_colour_changes(report.tokens.changes))
        report.token_gates = gates or []

    proposals: dict[str, str] = {}
    if report.token_gates:                                             # first: never the block that gets cut
        proposals["token-gates (computed, authoritative)"] = "\n".join(
            g.model_dump_json() for g in report.token_gates)
    proposals |= {
        role: getattr(report, REPORT_FIELD[role]).model_dump_json(indent=1)
        for role in SPECIALISTS if getattr(report, REPORT_FIELD[role]) is not None
    }
    if proposals:
        # The reviewer sees what each specialist saw, as far as the caps allow.
        review_files = _bounded(report.files, [p for role in role_files for p in role_files[role]])

        def review():
            agent = build("reviewer", review_files)
            agent.register_context_provider("proposals", ProposalsProvider(proposals))
            ask = (f"Review these improvement proposals before anyone applies them. Original task: {task}")
            return agent.run(TaskInput(task=ask[:MAX_TASK_CHARS]))
        report.review = _stage("reviewer", failures, review)

    report.failures = failures
    return report
