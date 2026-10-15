#!/usr/bin/env bash
set -euo pipefail

if [[ ! -v OPENAI_API_KEY ]]; then
  if ! command -v minimax-api-key >/dev/null 2>&1; then
    echo 'OPENAI_API_KEY is unset and minimax-api-key was not found on PATH' >&2
    exit 1
  fi
  if ! OPENAI_API_KEY="$(minimax-api-key 2>/dev/null)"; then
    echo 'minimax-api-key failed to provide an API key' >&2
    exit 1
  fi
  if [[ -z "$OPENAI_API_KEY" ]]; then
    echo 'minimax-api-key returned an empty key' >&2
    exit 1
  fi
elif [[ -z "$OPENAI_API_KEY" ]]; then
  echo 'OPENAI_API_KEY is empty' >&2
  exit 1
fi
export OPENAI_API_KEY

repo_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_dir"

exec codex \
  -c 'model_provider="minimax"' \
  -c 'model_providers.minimax.name="MiniMax"' \
  -c 'model_providers.minimax.base_url="https://api.minimax.io/v1"' \
  -c 'model_providers.minimax.env_key="OPENAI_API_KEY"' \
  -c 'model_providers.minimax.wire_api="responses"' \
  -c "model_catalog_json=\"$repo_dir/.codex/minimax-model-catalog.json\"" \
  -c 'model_reasoning_effort="high"' \
  -m MiniMax-M3.1-Flash-Preview \
  "$@"
