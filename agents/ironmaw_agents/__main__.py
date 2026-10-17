"""``python -m ironmaw_agents <role|improve> "<task>" [--path FILE ...] [--with ROLE,...] [--provider P] [--model M]``"""

from __future__ import annotations

import argparse
import sys

from .minimax import MiniMaxConfigError, MiniMaxCredentialError
from .pipeline import SPECIALISTS, improve
from .roster import DEFAULT_PROVIDER, PROVIDERS, ROLES, run_role


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="ironmaw_agents", description="Run an IRONMAW agent on MiniMax or Mercury.")
    parser.add_argument("role", choices=[*sorted(ROLES), "improve"],
                        help="one role, or 'improve' for explorer -> specialists -> reviewer")
    parser.add_argument("task")
    parser.add_argument("--path", action="append", default=[], help="repo-relative file to include (max 8)")
    parser.add_argument("--with", dest="specialists", default=",".join(SPECIALISTS),
                        help=f"improve only: comma-separated subset of {','.join(SPECIALISTS)}")
    parser.add_argument("--provider", choices=sorted(PROVIDERS), default=DEFAULT_PROVIDER)
    parser.add_argument("--model", default=None, help="model id; defaults to the provider's default")
    args = parser.parse_args(argv)
    try:
        if args.role == "improve":
            chosen = [s.strip() for s in args.specialists.split(",") if s.strip()]
            result = improve(args.task, paths=args.path, specialists=chosen, provider=args.provider, model=args.model)
        else:
            result = run_role(args.role, args.task, paths=args.path, provider=args.provider, model=args.model)
    except (MiniMaxConfigError, MiniMaxCredentialError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    print(result.model_dump_json(indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
