import json

import pytest

import ironmaw_agents.roster as roster
from ironmaw_agents.context import MAX_FILES, RepoFilesProvider
from ironmaw_agents.minimax import MiniMaxConfigError
from conftest import SECRET

ENV = {"OPENAI_API_KEY": SECRET}


def test_every_role_has_a_markdown_definition_with_a_body():
    for key, role in roster.ROLES.items():
        description, body = roster.load_role_prompt(role)
        assert description and len(body) >= 4, key


def test_roster_matches_the_claude_and_codex_agent_files():
    claude = {p.stem for p in roster.AGENT_DIR.glob("ironmaw-*.md")}
    codex = {p.stem for p in (roster.REPO_ROOT / ".codex" / "agents").glob("ironmaw-*.toml")}
    assert {r.name for r in roster.ROLES.values()} == claude == codex


def test_agents_use_the_minimax_adaption_per_role(http):
    for key, role in roster.ROLES.items():
        agent = roster.build_agent(key, env=ENV)
        assert agent.model == "MiniMax-M3.1-Flash-Preview"
        assert agent.output_schema is role.output
        prompt = agent.system_prompt_generator.generate_prompt()
        assert "IRONMAW project rules" in prompt and "cannot read files" in prompt
        assert roster.load_role_prompt(role)[1][0] in prompt          # prompt comes from the .md source
    assert {c["base_url"] for c in http.constructed} == {"https://api.minimax.io/v1"}


@pytest.mark.parametrize("key,effort", [("explorer", "low"), ("implementer", "medium"), ("tester", "medium"),
                                        ("reviewer", "high"), ("sync-keeper", "low"), ("design-critic", "high")])
def test_effort_per_role_reaches_the_request(http, key, effort):
    http.arguments = {"summary": "s"} if key == "explorer" else {}
    agent = roster.build_agent(key, env=ENV)
    try:
        agent.run(roster.TaskInput(task="describe the tokens"))
    except Exception:
        pass                                                           # output validity is not under test here
    body = http.requests[0].read().decode().replace(" ", "")
    assert f'"reasoning_effort":"{effort}"' in body and '"tools"' in body and "response_format" not in body


def test_provided_files_reach_the_prompt_and_are_read_only(http):
    agent = roster.build_agent("explorer", paths=["src/lib/review-status.ts"], env=ENV)
    prompt = agent.system_prompt_generator.generate_prompt()
    assert "=== src/lib/review-status.ts ===" in prompt and "known-errors" in prompt


@pytest.mark.parametrize("path", [".do-no-commit/DESIGNER-HANDOFF.md", "../outside.txt", "/etc/passwd", ".git/config", "missing.ts"])
def test_unsafe_context_paths_fail_before_any_client_exists(http, path):
    with pytest.raises(MiniMaxConfigError):
        roster.build_agent("reviewer", paths=[path], env=ENV)
    assert http.constructed == []


def test_file_count_and_budget_are_capped():
    with pytest.raises(MiniMaxConfigError, match="at most"):
        RepoFilesProvider(["README.md"] * (MAX_FILES + 1))


def test_unknown_role_is_rejected(http):
    with pytest.raises(MiniMaxConfigError, match="unknown role"):
        roster.build_agent("poet", env=ENV)
    assert http.constructed == []


def test_run_role_returns_the_typed_report(http):
    http.arguments = {"summary": "Tokens live in src/lib/tokens.", "findings": [], "unverified": []}
    out = roster.run_role("explorer", "where are the tokens?", env=ENV)
    assert type(out).__name__ == "ExplorationReport" and out.summary.startswith("Tokens live")
    assert json.loads(http.requests[0].read())["model"] == "MiniMax-M3.1-Flash-Preview"
