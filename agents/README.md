# ironmaw-agents

Atomic Agents for the IRONMAW repo, running on MiniMax's OpenAI-compatible API.

```bash
uv sync
uv run pytest                      # 87 tests, no network
export OPENAI_API_KEY="$(minimax-api-key)"   # optional: unset falls back to the helper on PATH
uv run python -m ironmaw_agents explorer "where are the tokens?" --path src/lib/review-status.ts
```

Roles (`explorer`, `implementer`, `tester`, `reviewer`, `sync-keeper`, `design-critic`) take their
prompts from `../.claude/agents/ironmaw-*.md`, so the Claude Code, Codex and MiniMax agents share
one definition. These agents cannot read or run anything: they reason over `--path` files (max 8,
repo-relative, never `.do-no-commit`, `.git` or secrets) plus `CLAUDE.md`, and return typed reports.

`minimax_client()` / `minimax_agent()` (`ironmaw_agents/minimax.py`): fixed endpoint, key from
`OPENAI_API_KEY` or the `minimax-api-key` helper (output never exposed), shared request limits,
function-tool structured output only (JSON modes rejected before any request).

Tools (`ironmaw_agents/tools`), each returning a typed `status`/`error` result:

| Tool | Endpoint | Use |
|---|---|---|
| `ScreenshotReviewTool` | Chat Completions + `image_url` | review a render against the brand rules |
| `ImageGenerationTool` | `/v1/image_generation` (`image-01`) | terrain/contour/empty-state imagery into `agents/.out/` (gitignored); refuses prompts about the owner's mark |
| `TokenEstimateTool` | `/v1/responses/input_tokens` | context budgeting |
| `ModelListTool` | `/v1/models` | which models the key can use; flags ids the project doesn't know |

Not wrapped on purpose: image-to-image (portrait subjects only), speech, music, video, voice.
