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
