from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))


def build_parser() -> argparse.ArgumentParser:
    from scanners.scanner2.unified.models import AuthState

    parser = argparse.ArgumentParser(description="Unified scanner runner across scanner1-6")
    parser.add_argument("target_path", help="Skill directory to scan")
    parser.add_argument(
        "--auth-state",
        choices=[state.value for state in AuthState],
        default=AuthState.GUEST.value,
        help="guest runs only free/static scanners; authenticated unlocks all registered scanners",
    )
    parser.add_argument("--deepseek-api-key", default=None, help="Runtime-only DeepSeek API key")
    parser.add_argument("--deepseek-model", default="deepseek-chat", help="DeepSeek model name")
    parser.add_argument(
        "--deepseek-base-url",
        default="https://api.deepseek.com/v1",
        help="DeepSeek-compatible OpenAI base URL",
    )
    parser.add_argument("--language", default="zh", choices=["zh", "en"], help="Preferred language for LLM-backed scanners")
    parser.add_argument("--timeout-ms", type=int, default=300000, help="Per-scanner timeout in milliseconds")
    parser.add_argument(
        "--enable-scanner",
        action="append",
        default=[],
        help="Restrict execution to the given scanner id; repeat to allow multiple",
    )
    parser.add_argument(
        "--disable-scanner",
        action="append",
        default=[],
        help="Disable a scanner id; repeat to disable multiple",
    )
    return parser


def main() -> int:
    from scanners.scanner2.unified.models import AuthState, UnifiedScanSettings
    from scanners.scanner2.unified.orchestrator import UnifiedSkillScanner

    args = build_parser().parse_args()
    scanner = UnifiedSkillScanner()
    settings = UnifiedScanSettings(
        auth_state=AuthState(args.auth_state),
        deepseek_api_key=args.deepseek_api_key,
        deepseek_model=args.deepseek_model,
        deepseek_base_url=args.deepseek_base_url,
        language=args.language,
        timeout_ms=args.timeout_ms,
        enabled_scanners=set(args.enable_scanner),
        disabled_scanners=set(args.disable_scanner),
    )
    report = scanner.scan(args.target_path, settings=settings)
    json.dump(report.to_dict(), sys.stdout, indent=2, ensure_ascii=False)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
