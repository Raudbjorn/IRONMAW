"""Input/output schemas for the IRONMAW agent roster."""

from __future__ import annotations

from typing import Literal

from atomic_agents import BaseIOSchema
from pydantic import Field


class TaskInput(BaseIOSchema):
    """A task for an IRONMAW agent. Repo context arrives separately as read-only context blocks."""

    task: str = Field(..., min_length=3, max_length=8000, description="What to do, in plain language.")


class Finding(BaseIOSchema):
    """One located fact about the codebase."""

    path: str = Field(..., description="Repo-relative file path.")
    line: int | None = Field(None, ge=1, description="1-based line when known.")
    note: str = Field(..., description="What is there and why it matters.")


class ExplorationReport(BaseIOSchema):
    """An interpretation of part of the codebase."""

    summary: str = Field(..., description="The answer in a few sentences.")
    findings: list[Finding] = Field(default_factory=list, description="Located evidence.")
    unverified: list[str] = Field(default_factory=list, description="Things not visible in the provided context.")


class FileChange(BaseIOSchema):
    """A proposed change to one file. The agent cannot write files; a human or another tool applies it."""

    path: str = Field(..., description="Repo-relative path.")
    change: str = Field(..., description="What to change and why.")
    diff: str | None = Field(None, description="Unified diff when the change is small and certain.")


class ImplementationPlan(BaseIOSchema):
    """A plan for implementing a change in IRONMAW, including every cross-surface mirror."""

    summary: str = Field(..., description="What will change.")
    changes: list[FileChange] = Field(default_factory=list, description="Per-file proposals.")
    cross_surface_updates: list[str] = Field(
        default_factory=list, description="Barrel, story, test, adapter index.js/index.d.ts, preview, NOTES."
    )
    commands: list[str] = Field(default_factory=list, description="Commands to verify (check, test, build).")
    risks: list[str] = Field(default_factory=list, description="What could go wrong.")


class TestCase(BaseIOSchema):
    """One test to write."""

    path: str = Field(..., description="Test file path.")
    name: str = Field(..., description="Test title.")
    asserts: str = Field(..., description="Observable behaviour asserted, derived independently of the code under test.")


class TestPlan(BaseIOSchema):
    """A verification plan."""

    cases: list[TestCase] = Field(default_factory=list, description="Tests to add.")
    commands: list[str] = Field(default_factory=list, description="Commands to run, smallest first.")
    gates: list[str] = Field(default_factory=list, description="Contrast/a11y/build gates that must stay green.")
    unverifiable: list[str] = Field(default_factory=list, description="What needs a real browser or the live service.")


class ReviewFinding(BaseIOSchema):
    """One review finding."""

    path: str = Field(..., description="Repo-relative file path.")
    line: int | None = Field(None, ge=1, description="1-based line when known.")
    severity: Literal["blocker", "major", "minor"] = Field(..., description="Impact.")
    problem: str = Field(..., description="What is wrong.")
    fix: str = Field(..., description="The smallest fix.")


class ReviewReport(BaseIOSchema):
    """A review of a change."""

    findings: list[ReviewFinding] = Field(default_factory=list, description="Confident findings only.")
    verdict: Literal["ship", "fix-first", "discuss"] = Field(..., description="Overall call.")
    not_checked: list[str] = Field(default_factory=list, description="What the context did not allow checking.")


class SyncDrift(BaseIOSchema):
    """One drift between the library and the design-sync bridge."""

    surface: str = Field(..., description="e.g. adapter index.js, index.d.ts, preview, conventions.md, NOTES.md.")
    item: str = Field(..., description="The component, prop or token that drifted.")
    action: str = Field(..., description="What to change.")


class SyncReport(BaseIOSchema):
    """State of the .design-sync bridge."""

    drift: list[SyncDrift] = Field(default_factory=list, description="Everything stale.")
    next_command: str = Field("/design-sync", description="What the user runs next; the agent never runs it.")
    unverified: list[str] = Field(default_factory=list, description="What was not visible.")


class DesignIssue(BaseIOSchema):
    """One design critique item."""

    where: str = Field(..., description="Where in the design.")
    problem: str = Field(..., description="The defect against a rule.")
    fix: str = Field(..., description="The smallest fix.")
    severity: Literal["blocker", "major", "minor"] = Field(..., description="Impact.")


class DesignCritique(BaseIOSchema):
    """A design critique."""

    issues: list[DesignIssue] = Field(default_factory=list, description="Ranked, most severe first.")
    could_not_judge: list[str] = Field(default_factory=list, description="What the material did not show.")


class A11yIssue(BaseIOSchema):
    """One accessibility defect."""

    path: str = Field(..., description="Repo-relative file path.")
    line: int | None = Field(None, ge=1, description="1-based line when known.")
    wcag: str = Field(..., description="WCAG 2.2 success criterion, e.g. '2.4.7'.")
    severity: Literal["blocker", "major", "minor"] = Field(..., description="Impact.")
    problem: str = Field(..., description="What fails and for whom.")
    fix: str = Field(..., description="The smallest fix.")


class A11yAudit(BaseIOSchema):
    """An accessibility audit of IRONMAW components."""

    issues: list[A11yIssue] = Field(default_factory=list, description="Ranked, most severe first.")
    needs_browser: list[str] = Field(
        default_factory=list, description="What needs a real browser or assistive technology to confirm."
    )


class CopyIssue(BaseIOSchema):
    """One string that breaks the voice rules."""

    path: str = Field(..., description="Repo-relative file path.")
    line: int | None = Field(None, ge=1, description="1-based line when known.")
    rule: str = Field(..., description="The voice rule it breaks.")
    current: str = Field(..., description="The string as it is.")
    proposed: str = Field(..., description="The exact replacement.")


class CopyReview(BaseIOSchema):
    """A copy edit of IRONMAW interface text."""

    issues: list[CopyIssue] = Field(default_factory=list, description="Every string to change.")
    could_not_judge: list[str] = Field(default_factory=list, description="Strings whose meaning needs the running product.")


class TokenChange(BaseIOSchema):
    """One proposed change to a DTCG token source."""

    edition: str = Field(..., description="'oxide', 'bone', a new edition name, or 'all' for scale/primitive tokens.")
    token: str = Field(..., description="Token name without the --wm- prefix, e.g. 'text-faint'.")
    current: str | None = Field(None, description="Current value; null for a new token.")
    proposed: str = Field(..., description="Proposed value; colours as 6-digit hex.")
    file: str = Field(..., description="The DTCG source file to edit, never a generated output.")
    reason: str = Field(..., description="Why, in one sentence.")


class TokenProposal(BaseIOSchema):
    """Proposed token changes. Contrast is recomputed by the pipeline, not by the agent."""

    changes: list[TokenChange] = Field(default_factory=list, description="Each change to a token source.")
    visual_checks: list[str] = Field(default_factory=list, description="What needs eyes in both editions.")


class GapProposal(BaseIOSchema):
    """One missing piece of the library."""

    name: str = Field(..., description="Component, prop or variant name, e.g. 'Toast' or 'Button.loading'.")
    kind: Literal["component", "prop", "variant", "snippet", "token"] = Field(..., description="What sort of addition.")
    value: Literal["high", "medium", "low"] = Field(..., description="How much it unblocks.")
    evidence: str = Field(..., description="What in the provided material shows the need.")
    api_sketch: str = Field(..., description="Props/snippets in the house style.")
    cross_surface: list[str] = Field(default_factory=list, description="Barrel, stories, test, adapter, preview work.")


class GapReport(BaseIOSchema):
    """What IRONMAW is missing for a screen or workflow."""

    proposals: list[GapProposal] = Field(default_factory=list, description="Ranked by value.")
    unconfirmed: list[str] = Field(default_factory=list, description="Suspected needs the material did not confirm.")


class GateResult(BaseIOSchema):
    """One palette gate, recomputed after applying proposed colour changes."""

    edition: str = Field(..., description="Edition the gate ran against.")
    rule: str = Field(..., description="The gate, e.g. 'text-faint on surface-1 >= 4.5'.")
    before: float | None = Field(None, description="Contrast ratio today, when the pair exists.")
    after: float | None = Field(None, description="Contrast ratio with the proposal applied.")
    passes: bool | None = Field(..., description="Null when the gate could not be computed.")


class StageFailure(BaseIOSchema):
    """A pipeline stage that did not produce a result."""

    stage: str = Field(..., description="Role key of the stage.")
    error: str = Field(..., description="Error type and message.")


class ImprovementReport(BaseIOSchema):
    """Result of the improve pipeline: exploration, specialist proposals and a review of them."""

    task: str = Field(..., description="The improvement task as given.")
    files: list[str] = Field(default_factory=list, description="Files the specialists were shown.")
    exploration: ExplorationReport | None = None
    a11y: A11yAudit | None = None
    copy_review: CopyReview | None = None
    tokens: TokenProposal | None = None
    token_gates: list[GateResult] = Field(default_factory=list, description="Gates touched by colour changes.")
    gaps: GapReport | None = None
    review: ReviewReport | None = None
    failures: list[StageFailure] = Field(default_factory=list, description="Stages that failed; the rest still ran.")
