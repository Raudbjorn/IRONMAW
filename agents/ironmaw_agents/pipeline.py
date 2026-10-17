"""The improve pipeline: explore, run specialists, review their proposals.

explorer -> widen the file set from its findings -> specialists (a11y, copy,
tokens, gaps) -> token gates recomputed locally -> reviewer critiques the lot.

Caller mistakes (unknown specialist, unsafe path, missing key) raise before any
request. Once requests start, a failing stage is recorded in
``ImprovementReport.failures`` and the remaining stages still run.
"""

from __future__ import annotations

from collections.abc import Callable, Mapping, Sequence
from typing import TypeVar

from .context import MAX_FILES, ProposalsProvider, RepoFilesProvider
from .gates import verify_colour_changes
from .minimax import DEFAULT_MODEL, MiniMaxConfigError, MiniMaxCredentialError, resolve_api_key
from .roster import build_agent
from .schemas import ImprovementReport, StageFailure, TaskInput

SPECIALISTS: tuple[str, ...] = ("a11y-auditor", "copy-editor", "token-steward", "gap-scout")
REPORT_FIELD = {"a11y-auditor": "a11y", "copy-editor": "copy_review", "token-steward": "tokens", "gap-scout": "gaps"}
# Files a specialist can't do its job without; they go ahead of the shared set.
ROLE_PATHS: dict[str, tuple[str, ...]] = {
    "token-steward": ("src/lib/tokens/palette.ts", "src/lib/tokens/palette.test.ts"),
    "gap-scout": ("src/lib/index.ts",),
}
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


def _describe(exc: BaseException) -> str:
    """Name the root cause; Instructor wraps provider errors in a verbose retry report."""
    attempts = getattr(exc, "failed_attempts", None) or []
    root = getattr(attempts[-1], "exception", None) if attempts else None
    root = root or exc.__cause__ or exc
    head = type(exc).__name__ if root is exc else f"{type(exc).__name__} after {len(attempts) or 1} attempt(s), last {type(root).__name__}"
    return f"{head}: {root}"[:MAX_ERROR_CHARS]


def _stage(name: str, failures: list[StageFailure], run: Callable[[], T]) -> T | None:
    try:
        return run()
    except (MiniMaxConfigError, MiniMaxCredentialError):
        raise                                                          # caller errors, not stage failures
    except Exception as exc:                                           # provider, network or schema errors
        failures.append(StageFailure(stage=name, error=_describe(exc)))
        return None


def improve(
    task: str,
    *,
    paths: Sequence[str] = (),
    specialists: Sequence[str] = SPECIALISTS,
    model: str = DEFAULT_MODEL,
    env: Mapping[str, str] | None = None,
) -> ImprovementReport:
    unknown = sorted(set(specialists) - set(SPECIALISTS))
    if unknown or not specialists:
        raise MiniMaxConfigError(f"specialists must be a non-empty subset of {list(SPECIALISTS)}; got {unknown or '[]'}")
    request = TaskInput(task=task)
    RepoFilesProvider(paths)                                           # unsafe paths fail before any request
    resolve_api_key(env)                                               # so does a missing key

    failures: list[StageFailure] = []
    report = ImprovementReport(task=task)

    report.exploration = _stage("explorer", failures, lambda: build_agent(
        "explorer", paths=paths, model=model, env=env).run(request))
    found = [f.path for f in report.exploration.findings] if report.exploration else []
    report.files = _bounded(paths, found)

    for role in dict.fromkeys(specialists):
        role_paths = _bounded([p for p in ROLE_PATHS.get(role, ()) if _fits([p])], report.files)
        out = _stage(role, failures, lambda role=role, role_paths=role_paths: build_agent(
            role, paths=role_paths, model=model, env=env).run(request))
        setattr(report, REPORT_FIELD[role], out)

    if report.tokens and report.tokens.changes:
        gates = _stage("token-gates", failures, lambda: verify_colour_changes(report.tokens.changes))
        report.token_gates = gates or []

    proposals = {
        role: getattr(report, REPORT_FIELD[role]).model_dump_json(indent=1)
        for role in SPECIALISTS if getattr(report, REPORT_FIELD[role]) is not None
    }
    if report.token_gates:
        proposals["token-gates (computed, authoritative)"] = "\n".join(
            g.model_dump_json() for g in report.token_gates)
    if proposals:
        def review():
            agent = build_agent("reviewer", paths=report.files, model=model, env=env)
            agent.register_context_provider("proposals", ProposalsProvider(proposals))
            ask = (f"Review these improvement proposals before anyone applies them. Original task: {task}")
            return agent.run(TaskInput(task=ask[:MAX_TASK_CHARS]))
        report.review = _stage("reviewer", failures, review)

    report.failures = failures
    return report
