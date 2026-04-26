from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from app.runtime.skill_parser import SkillDefinition, load_skill_definition


CAPABILITY_REQUIRES_BROWSER = "requires_browser"
CAPABILITY_REQUIRES_WEB_PLATFORM = "requires_web_platform"
CAPABILITY_REQUIRES_OAUTH_OR_LOGIN = "requires_oauth_or_login"
CAPABILITY_REQUIRES_EXTERNAL_API_KEY = "requires_external_api_key"
CAPABILITY_REQUIRES_CALLBACK_OR_WEBHOOK = "requires_callback_or_webhook"
CAPABILITY_REQUIRES_LONG_HORIZON_TASK = "requires_long_horizon_task"
CAPABILITY_REQUIRES_HEAVY_RUNTIME = "requires_heavy_runtime"
CAPABILITY_REQUIRES_USER_SUPPLIED_ARTIFACT = "requires_user_supplied_artifact"
CAPABILITY_REQUIRES_INTERACTIVE_PROMPTING = "requires_interactive_prompting"
CAPABILITY_REQUIRES_LOCAL_HELPER_TOOLING = "requires_local_helper_tooling"
CAPABILITY_REQUIRES_DOCUMENT_OR_OFFICE_STACK = "requires_document_or_office_stack"
CAPABILITY_REQUIRES_MESSAGING_STACK = "requires_messaging_stack"

PROFILE_BASE_LIGHTWEIGHT = "base_lightweight"
PROFILE_BROWSER_LIGHTWEIGHT = "browser_lightweight"
PROFILE_ADAPTER_BACKED = "adapter_backed"
PROFILE_DEEP_EXECUTION = "deep_execution"

FEASIBILITY_READY = "ready"
FEASIBILITY_CONDITIONAL = "conditional"
FEASIBILITY_BLOCKED = "blocked"

TRIGGER_MODE_BASE = "budgeted_minimal"
TRIGGER_MODE_BROWSER = "budgeted_browser"
TRIGGER_MODE_ADAPTER = "adapter_gated"
TRIGGER_MODE_DEEP = "budgeted_deep"

BUDGET_LOW = "low"
BUDGET_MEDIUM = "medium"
BUDGET_HIGH = "high"


@dataclass
class CapabilityProfile:
    capability_tags: list[str] = field(default_factory=list)
    recommended_profile: str = PROFILE_BASE_LIGHTWEIGHT
    recommended_trigger_mode: str = TRIGGER_MODE_BASE
    estimated_budget_class: str = BUDGET_LOW
    execution_feasibility: str = FEASIBILITY_READY
    blocking_requirements: list[str] = field(default_factory=list)
    inferred_from: list[str] = field(default_factory=list)
    tag_reasons: dict[str, list[str]] = field(default_factory=dict)
    complexity_score: int = 0

    def to_dict(self) -> dict[str, Any]:
        return {
            "capability_tags": self.capability_tags,
            "recommended_profile": self.recommended_profile,
            "recommended_trigger_mode": self.recommended_trigger_mode,
            "estimated_budget_class": self.estimated_budget_class,
            "execution_feasibility": self.execution_feasibility,
            "blocking_requirements": self.blocking_requirements,
            "inferred_from": self.inferred_from,
            "tag_reasons": self.tag_reasons,
            "complexity_score": self.complexity_score,
        }


@dataclass
class _InferenceState:
    tags: list[str] = field(default_factory=list)
    inferred_from: list[str] = field(default_factory=list)
    tag_reasons: dict[str, list[str]] = field(default_factory=dict)

    def add(self, tag: str, reason: str, source: str) -> None:
        if tag not in self.tags:
            self.tags.append(tag)
        self.tag_reasons.setdefault(tag, [])
        if reason not in self.tag_reasons[tag]:
            self.tag_reasons[tag].append(reason)
        if source and source not in self.inferred_from:
            self.inferred_from.append(source)


def infer_capability_profile(
    skill_root: str | Path,
    skill_file: str = "SKILL.md",
    skill_definition: SkillDefinition | None = None,
) -> CapabilityProfile:
    root = Path(skill_root).resolve()
    definition = skill_definition
    if definition is None:
        try:
            definition = load_skill_definition(root, skill_file, allow_empty_actions=True)
        except Exception:
            definition = None

    markdown_path = (root / skill_file).resolve()
    markdown = _read_text(markdown_path)
    markdown_lower = markdown.lower()

    actions = definition.actions if definition is not None else []
    metadata = definition.metadata if definition is not None else {}
    name = (definition.name if definition is not None else "") or ""
    description = (definition.description if definition is not None else "") or ""
    runtime = (definition.runtime if definition is not None else "") or ""
    action_payload = " ".join(_action_text(action) for action in actions).lower()

    state = _InferenceState()

    dep_signals = _collect_dependency_signals(root)
    file_signals = _collect_file_signals(root)
    text_blob = "\n".join([markdown_lower, action_payload, name.lower(), description.lower(), json.dumps(metadata, ensure_ascii=False).lower()])

    _infer_browser_related(state, text_blob=text_blob, dep_signals=dep_signals, file_signals=file_signals)
    _infer_auth_related(state, text_blob=text_blob, dep_signals=dep_signals)
    _infer_callback_related(state, text_blob=text_blob, action_payload=action_payload)
    _infer_long_horizon(state, text_blob=text_blob, action_count=len(actions))
    _infer_heavy_runtime(state, text_blob=text_blob, dep_signals=dep_signals, action_payload=action_payload)
    _infer_user_artifact(state, text_blob=text_blob, action_payload=action_payload)
    _infer_interactive_prompting(state, text_blob=text_blob, action_payload=action_payload)
    _infer_local_helper_tooling(state, root=root, action_payload=action_payload, file_signals=file_signals)
    _infer_document_stack(state, text_blob=text_blob, dep_signals=dep_signals, file_signals=file_signals)
    _infer_messaging_stack(state, text_blob=text_blob, dep_signals=dep_signals)

    if runtime in {"deepseek-agent", "llm-agent", "llm-native"}:
        state.add(
            CAPABILITY_REQUIRES_EXTERNAL_API_KEY,
            "Skill runtime declares LLM-native execution, which usually requires external API credentials.",
            f"runtime:{runtime}",
        )

    if not state.inferred_from:
        state.inferred_from.append("default:no_strong_capability_signal")

    complexity = _estimate_complexity(state.tags, len(actions), dep_signals)
    profile = _recommend_profile(state.tags, complexity)
    trigger_mode = _recommend_trigger_mode(profile)
    budget = _recommend_budget(profile, state.tags)
    feasibility, blocking = _infer_feasibility(state.tags)

    return CapabilityProfile(
        capability_tags=state.tags,
        recommended_profile=profile,
        recommended_trigger_mode=trigger_mode,
        estimated_budget_class=budget,
        execution_feasibility=feasibility,
        blocking_requirements=blocking,
        inferred_from=state.inferred_from,
        tag_reasons=state.tag_reasons,
        complexity_score=complexity,
    )


def _read_text(path: Path, max_bytes: int = 256_000) -> str:
    try:
        data = path.read_bytes()
    except Exception:
        return ""
    if len(data) > max_bytes:
        data = data[:max_bytes]
    try:
        return data.decode("utf-8", errors="replace")
    except Exception:
        return ""


def _collect_dependency_signals(root: Path) -> set[str]:
    signals: set[str] = set()

    package_json = root / "package.json"
    if package_json.exists():
        text = _read_text(package_json)
        try:
            payload = json.loads(text)
            for section in ("dependencies", "devDependencies", "peerDependencies"):
                deps = payload.get(section, {})
                if isinstance(deps, dict):
                    signals.update(str(key).lower() for key in deps.keys())
        except Exception:
            pass

    requirements = root / "requirements.txt"
    if requirements.exists():
        for line in _read_text(requirements).splitlines():
            cleaned = line.strip()
            if not cleaned or cleaned.startswith("#"):
                continue
            cleaned = re.split(r"[<>=!~\[]", cleaned, maxsplit=1)[0].strip().lower()
            if cleaned:
                signals.add(cleaned)

    pyproject = root / "pyproject.toml"
    if pyproject.exists():
        text = _read_text(pyproject).lower()
        for match in re.findall(r'"([a-z0-9_.-]+)"', text):
            if match and any(token.isalpha() for token in match):
                signals.add(match)

    return signals


def _collect_file_signals(root: Path) -> set[str]:
    signals: set[str] = set()
    candidates = [
        "playwright.config.ts",
        "playwright.config.js",
        "playwright.config.mjs",
        "docker-compose.yml",
        "docker-compose.yaml",
        "tools",
        "scripts",
        "docs",
    ]
    for item in candidates:
        path = root / item
        if path.exists():
            signals.add(item.lower())
    for suffix in ("*.docx", "*.pptx", "*.xlsx", "*.pdf"):
        for match in root.glob(suffix):
            signals.add(match.suffix.lower().lstrip("."))
    return signals


def _action_text(action: Any) -> str:
    payload = {
        "id": getattr(action, "id", ""),
        "type": getattr(action, "type", ""),
        "name": getattr(action, "name", ""),
        "description": getattr(action, "description", ""),
        "config": getattr(action, "config", {}),
        "arguments_schema": getattr(action, "arguments_schema", {}),
    }
    return json.dumps(payload, ensure_ascii=False)


def _infer_browser_related(state: _InferenceState, text_blob: str, dep_signals: set[str], file_signals: set[str]) -> None:
    browser_keywords = ("playwright", "puppeteer", "selenium", "webdriver", "browser", "page.goto", "chromium", "firefox")
    if any(token in text_blob for token in browser_keywords) or any(token in dep_signals for token in {"playwright", "puppeteer", "selenium", "cypress"}):
        state.add(
            CAPABILITY_REQUIRES_BROWSER,
            "Found browser automation keywords or dependencies.",
            "signal:browser_automation",
        )
    if any(token in text_blob for token in ("web app", "website", "navigate", "dom", "url")):
        state.add(
            CAPABILITY_REQUIRES_WEB_PLATFORM,
            "Skill text indicates interaction with a live web platform.",
            "signal:web_platform_text",
        )
    if any(token.startswith("playwright.config") for token in file_signals):
        state.add(
            CAPABILITY_REQUIRES_BROWSER,
            "Playwright config file exists in skill workspace.",
            "file:playwright.config.*",
        )


def _infer_auth_related(state: _InferenceState, text_blob: str, dep_signals: set[str]) -> None:
    if any(token in text_blob for token in ("oauth", "sign in", "signin", "login", "2fa", "auth flow", "session cookie")):
        state.add(
            CAPABILITY_REQUIRES_OAUTH_OR_LOGIN,
            "Detected login/OAuth style phrases in skill content.",
            "signal:auth_keywords",
        )
    api_key_patterns = ("api key", "_api_key", "bearer", "authorization", "token", "openai_api_key", "anthropic_api_key")
    if any(token in text_blob for token in api_key_patterns):
        state.add(
            CAPABILITY_REQUIRES_EXTERNAL_API_KEY,
            "Detected explicit API key/token requirements in skill content.",
            "signal:api_key_keywords",
        )
    if any(token in dep_signals for token in {"openai", "anthropic", "cohere", "groq", "replicate", "langchain-openai"}):
        state.add(
            CAPABILITY_REQUIRES_EXTERNAL_API_KEY,
            "Dependencies indicate external hosted API usage.",
            "dependency:hosted_api_sdk",
        )


def _infer_callback_related(state: _InferenceState, text_blob: str, action_payload: str) -> None:
    if any(token in text_blob for token in ("webhook", "callback", "hook url", "ngrok")) or any(
        token in action_payload for token in ("webhook", "callback", "hook")
    ):
        state.add(
            CAPABILITY_REQUIRES_CALLBACK_OR_WEBHOOK,
            "Detected webhook/callback oriented integration markers.",
            "signal:webhook_callback",
        )


def _infer_long_horizon(state: _InferenceState, text_blob: str, action_count: int) -> None:
    markers = ("long-running", "long horizon", "continuously", "monitor", "watch", "periodically", "retry until", "crawl all")
    if any(token in text_blob for token in markers) or action_count >= 10:
        state.add(
            CAPABILITY_REQUIRES_LONG_HORIZON_TASK,
            "Detected long-horizon language or high action count suggesting extended execution.",
            "signal:long_horizon",
        )


def _infer_heavy_runtime(state: _InferenceState, text_blob: str, dep_signals: set[str], action_payload: str) -> None:
    heavy_deps = {
        "torch",
        "tensorflow",
        "jax",
        "opencv-python",
        "opencv",
        "spacy",
        "pandas",
        "numpy",
        "playwright",
        "selenium",
    }
    heavy_commands = ("npm install", "pnpm install", "yarn install", "docker build", "apt-get", "pip install", "poetry install")
    if any(dep in dep_signals for dep in heavy_deps) or any(cmd in action_payload for cmd in heavy_commands) or "gpu" in text_blob:
        state.add(
            CAPABILITY_REQUIRES_HEAVY_RUNTIME,
            "Detected heavy dependencies or install/build commands.",
            "signal:heavy_runtime",
        )


def _infer_user_artifact(state: _InferenceState, text_blob: str, action_payload: str) -> None:
    markers = ("upload", "user file", "attachment", "provide a file", "input document", "dataset path")
    if any(token in text_blob for token in markers) or "{{ input_payload." in action_payload:
        state.add(
            CAPABILITY_REQUIRES_USER_SUPPLIED_ARTIFACT,
            "Detected user-provided artifact requirements in text or command templates.",
            "signal:user_artifact",
        )


def _infer_interactive_prompting(state: _InferenceState, text_blob: str, action_payload: str) -> None:
    markers = ("ask the user", "confirm with user", "interactive", "prompt user", "input(", "readline")
    if any(token in text_blob for token in markers) or any(token in action_payload for token in ("input(", "read -p", "prompt")):
        state.add(
            CAPABILITY_REQUIRES_INTERACTIVE_PROMPTING,
            "Detected interactive prompting or explicit user confirmation requirements.",
            "signal:interactive_prompting",
        )


def _infer_local_helper_tooling(state: _InferenceState, root: Path, action_payload: str, file_signals: set[str]) -> None:
    if "tools" in file_signals or "scripts" in file_signals:
        state.add(
            CAPABILITY_REQUIRES_LOCAL_HELPER_TOOLING,
            "Skill directory contains local helper folders (tools/scripts).",
            "file:tools_or_scripts",
        )
    if any(token in action_payload for token in ("tools/", "scripts/", "helper.py")):
        state.add(
            CAPABILITY_REQUIRES_LOCAL_HELPER_TOOLING,
            "Action commands reference local helper scripts.",
            "signal:helper_command_path",
        )
    if (root / "tools").exists() and any((root / "tools").glob("**/*.py")):
        state.add(
            CAPABILITY_REQUIRES_LOCAL_HELPER_TOOLING,
            "Python helper scripts detected under tools/.",
            "file:tools_python_helpers",
        )


def _infer_document_stack(state: _InferenceState, text_blob: str, dep_signals: set[str], file_signals: set[str]) -> None:
    office_keywords = ("docx", "pptx", "xlsx", "spreadsheet", "powerpoint", "google docs", "office", "slides", "word document", "pdf")
    office_deps = {"python-docx", "openpyxl", "pypdf", "pdfplumber", "python-pptx", "xlsxwriter", "unstructured"}
    if any(token in text_blob for token in office_keywords) or any(dep in dep_signals for dep in office_deps) or any(
        token in file_signals for token in {"docx", "pptx", "xlsx", "pdf"}
    ):
        state.add(
            CAPABILITY_REQUIRES_DOCUMENT_OR_OFFICE_STACK,
            "Detected document/office processing signals.",
            "signal:office_stack",
        )


def _infer_messaging_stack(state: _InferenceState, text_blob: str, dep_signals: set[str]) -> None:
    messaging_keywords = ("slack", "discord", "telegram", "twilio", "smtp", "email", "teams", "lark", "feishu", "notifier")
    messaging_deps = {"slack-sdk", "python-telegram-bot", "discord.py", "twilio"}
    if any(token in text_blob for token in messaging_keywords) or any(dep in dep_signals for dep in messaging_deps):
        state.add(
            CAPABILITY_REQUIRES_MESSAGING_STACK,
            "Detected messaging platform integration markers.",
            "signal:messaging_stack",
        )


def _estimate_complexity(tags: list[str], action_count: int, dep_signals: set[str]) -> int:
    score = len(tags)
    if action_count >= 10:
        score += 3
    elif action_count >= 6:
        score += 2
    elif action_count >= 3:
        score += 1
    if CAPABILITY_REQUIRES_HEAVY_RUNTIME in tags:
        score += 1
    if len(dep_signals) >= 20:
        score += 1
    return score


def _recommend_profile(tags: list[str], complexity_score: int) -> str:
    if any(tag in tags for tag in [CAPABILITY_REQUIRES_CALLBACK_OR_WEBHOOK, CAPABILITY_REQUIRES_DOCUMENT_OR_OFFICE_STACK, CAPABILITY_REQUIRES_MESSAGING_STACK]):
        return PROFILE_ADAPTER_BACKED
    if CAPABILITY_REQUIRES_LONG_HORIZON_TASK in tags and complexity_score >= 6:
        return PROFILE_DEEP_EXECUTION
    if CAPABILITY_REQUIRES_BROWSER in tags:
        return PROFILE_BROWSER_LIGHTWEIGHT
    return PROFILE_BASE_LIGHTWEIGHT


def _recommend_trigger_mode(profile: str) -> str:
    if profile == PROFILE_BROWSER_LIGHTWEIGHT:
        return TRIGGER_MODE_BROWSER
    if profile == PROFILE_ADAPTER_BACKED:
        return TRIGGER_MODE_ADAPTER
    if profile == PROFILE_DEEP_EXECUTION:
        return TRIGGER_MODE_DEEP
    return TRIGGER_MODE_BASE


def _recommend_budget(profile: str, tags: list[str]) -> str:
    if profile == PROFILE_DEEP_EXECUTION:
        return BUDGET_HIGH
    if profile in {PROFILE_BROWSER_LIGHTWEIGHT, PROFILE_ADAPTER_BACKED}:
        return BUDGET_MEDIUM
    if CAPABILITY_REQUIRES_HEAVY_RUNTIME in tags:
        return BUDGET_MEDIUM
    return BUDGET_LOW


def _infer_feasibility(tags: list[str]) -> tuple[str, list[str]]:
    blocking_map = {
        CAPABILITY_REQUIRES_OAUTH_OR_LOGIN: "Requires interactive OAuth/login session bootstrapping that is not available in base sandbox.",
        CAPABILITY_REQUIRES_CALLBACK_OR_WEBHOOK: "Requires inbound callback/webhook endpoint or adapter-backed routing.",
        CAPABILITY_REQUIRES_DOCUMENT_OR_OFFICE_STACK: "Requires document/office adapter-backed execution stack.",
        CAPABILITY_REQUIRES_MESSAGING_STACK: "Requires messaging adapter-backed execution stack.",
    }
    conditional_map = {
        CAPABILITY_REQUIRES_EXTERNAL_API_KEY: "Requires external API credentials provided at run time.",
        CAPABILITY_REQUIRES_USER_SUPPLIED_ARTIFACT: "Requires user-supplied artifact/input before execution can be complete.",
    }

    blocking: list[str] = [message for tag, message in blocking_map.items() if tag in tags]
    conditional: list[str] = [message for tag, message in conditional_map.items() if tag in tags]

    if blocking:
        return FEASIBILITY_BLOCKED, blocking + conditional
    if conditional:
        return FEASIBILITY_CONDITIONAL, conditional
    return FEASIBILITY_READY, []

