"""``python -m ironmaw_agents <role> "<task>" [--path FILE ...]``"""

from __future__ import annotations

import argparse
import sys

from .minimax import MiniMaxConfigError, MiniMaxCredentialError
from .roster import ROLES, run_role


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="ironmaw_agents", description="Run an IRONMAW agent on MiniMax.")
    parser.add_argument("role", choices=sorted(ROLES))
    parser.add_argument("task")
    parser.add_argument("--path", action="append", default=[], help="repo-relative file to include (max 8)")
    args = parser.parse_args(argv)
    try:
        result = run_role(args.role, args.task, paths=args.path)
    except (MiniMaxConfigError, MiniMaxCredentialError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    print(result.model_dump_json(indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
