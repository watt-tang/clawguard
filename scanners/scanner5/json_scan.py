from __future__ import annotations

import argparse
import asyncio
import json
import sys
from pathlib import Path

SCANNER_ROOT = Path(__file__).resolve().parent
if str(SCANNER_ROOT) not in sys.path:
    sys.path.insert(0, str(SCANNER_ROOT))


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Machine-readable wrapper around scanner5")
    parser.add_argument("--repo", required=True, help="Target repository or skill directory")
    parser.add_argument("--api-key", required=True, help="LLM API key")
    parser.add_argument("--base-url", required=True, help="OpenAI-compatible base URL")
    parser.add_argument("--model", default="deepseek-chat", help="Model name")
    parser.add_argument("--prompt", default="", help="Optional extra prompt")
    parser.add_argument("--language", default="zh", choices=["zh", "en"], help="Output language")
    parser.add_argument(
        "--fast-mode",
        action="store_true",
        help="Enable optimized fast workflow to reduce LLM round trips",
    )
    return parser


async def run_scan(args: argparse.Namespace) -> dict:
    import tools as _  # noqa: F401
    from agent.agent import Agent
    from utils.llm import LLM
    from utils.llm_manager import LLMManager

    llm = LLM(model=args.model, api_key=args.api_key, base_url=args.base_url)
    llm_manager = LLMManager(api_key=args.api_key, base_url=args.base_url)
    for purpose in ("thinking", "coding", "fast"):
        llm_manager.configure(
            purpose,
            model=args.model,
            base_url=args.base_url,
            api_key=args.api_key,
        )
    specialized_llms = llm_manager.get_specialized_llms(["thinking", "coding"])
    agent = Agent(
        llm=llm,
        specialized_llms=specialized_llms,
        debug=False,
        server_url=None,
        language=args.language,
        fast_mode=args.fast_mode,
    )
    try:
        return await agent.scan(args.repo, args.prompt)
    finally:
        if hasattr(agent, "dispatcher"):
            await agent.dispatcher.close()


def main() -> int:
    args = build_parser().parse_args()
    result = asyncio.run(run_scan(args))
    json.dump(result, sys.stdout, ensure_ascii=False)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
