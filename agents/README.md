# ironmaw-agents

Atomic Agents for the IRONMAW repo, running on MiniMax's OpenAI-compatible API.

```bash
uv sync
uv run pytest                      # 111 tests, no network
export OPENAI_API_KEY="$(minimax-api-key)"   # optional: unset falls back to the helper on PATH
uv run python -m ironmaw_agents explorer "where are the tokens?" --path src/lib/review-status.ts
```

Roles (`explorer`, `implementer`, `tester`, `reviewer`, `sync-keeper`, `design-critic`, and the
improvement specialists `a11y-auditor`, `copy-editor`, `token-steward`, `gap-scout`) take their
prompts from `../.claude/agents/ironmaw-*.md`, so the Claude Code, Codex and MiniMax agents share
one definition. These agents cannot read or run anything: they reason over `--path` files (max 8,
repo-relative, never `.do-no-commit`, `.git` or secrets) plus `CLAUDE.md`, and return typed reports.

## Improve pipeline

```bash
uv run python -m ironmaw_agents improve "Make the Button ready for release" \
  --path src/lib/components/atoms/Button.svelte --with a11y-auditor,copy-editor
```

`improve()` (`ironmaw_agents/pipeline.py`) runs explorer → specialists (all four by default) →
reviewer and returns one `ImprovementReport`. The explorer's findings widen the file set (same
safety checks, max 8); `token-steward` always sees `palette.ts` + `palette.test.ts`, `gap-scout`
always sees `src/lib/index.ts`. Proposed colours are applied to `resolved/*.tokens.json` and every
gate parsed from `palette.test.ts` is recomputed locally (`gates.py`) — the agent's own arithmetic is
never trusted. The reviewer critiques all proposals plus the computed gates. Bad input (unknown
specialist, unsafe path, missing key) raises before any request; a stage that fails mid-run lands in
`failures` and the rest still run. Nothing is applied: proposals are for a human or the
`ironmaw-implementer` to act on.

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
