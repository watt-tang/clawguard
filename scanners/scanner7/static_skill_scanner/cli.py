from __future__ import annotations

import argparse
import json
from dataclasses import asdict

from .aggregator import aggregate, render_markdown
from .analyzer_factory import build_default_analyzers
from .normalizer import build_skill_model
from .parser import cleanup_workspace, parse_input


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Minimal static skill scanner")
    parser.add_argument("source", help="Path to a skill directory or zip archive")
    parser.add_argument("--format", choices=["json", "md"], default="json", help="Output format")
    return parser


def main() -> int:
    args = build_parser().parse_args()
    parsed = parse_input(args.source)
    try:
        skill = build_skill_model(parsed)
        analyzer_results = [analyzer.run(skill) for analyzer in build_default_analyzers()]
        scan_result = aggregate(skill, analyzer_results)
        if args.format == "md":
            print(render_markdown(scan_result), end="")
        else:
            print(json.dumps(asdict(scan_result), indent=2, ensure_ascii=False))
        return 0
    finally:
        cleanup_workspace(parsed)


if __name__ == "__main__":
    raise SystemExit(main())
