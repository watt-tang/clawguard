from __future__ import annotations

import json
import re
import shlex
import uuid
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


FENCE_RE = re.compile(r"```(?P<info>[^\n]*)\n(?P<body>.*?)```", re.DOTALL)


@dataclass
class SkillAction:
    id: str
    type: str
    name: str
    description: str = ""
    config: dict[str, Any] = field(default_factory=dict)
    arguments_schema: dict[str, Any] = field(default_factory=dict)
    continue_on_error: bool = False


@dataclass
class SkillDefinition:
    skill_root: str
    skill_file: str
    name: str
    description: str
    runtime: str
    actions: list[SkillAction]
    metadata: dict[str, Any] = field(default_factory=dict)
    raw_markdown: str = ""


def resolve_skill_target(skill_path: str) -> tuple[Path, str]:
    source = Path(skill_path).expanduser().resolve()
    if not source.exists():
        raise ValueError(f"Skill path does not exist: {source}")

    if source.is_file():
        if source.name != "SKILL.md":
            raise ValueError("When skill_path is a file it must point to SKILL.md.")
        return source.parent, source.name

    direct = source / "SKILL.md"
    if direct.exists():
        return source, "SKILL.md"

    candidates = sorted(path for path in source.rglob("*") if path.is_file() and path.name == "SKILL.md")
    if not candidates:
        raise ValueError(f"No SKILL.md found under directory: {source}")
    if len(candidates) > 1:
        raise ValueError(
            "Multiple SKILL.md files found. Please pass a single SKILL.md or a directory with exactly one SKILL.md."
        )
    skill_file = candidates[0]
    return source, str(skill_file.relative_to(source))


def load_skill_definition(
    skill_root: str | Path,
    skill_file: str = "SKILL.md",
    allow_empty_actions: bool = False,
) -> SkillDefinition:
    root = Path(skill_root).resolve()
    markdown_path = (root / skill_file).resolve()
    if not markdown_path.exists():
        raise ValueError(f"SKILL.md not found: {markdown_path}")

    text = markdown_path.read_text(encoding="utf-8")
    metadata = _parse_frontmatter(text)
    name = metadata.get("name") or _extract_title(text) or markdown_path.parent.name
    description = metadata.get("description") or _extract_first_paragraph(text)
    runtime = metadata.get("runtime") or "provloom-embedded"
    actions = _parse_actions(text)
    llm_native_runtime = runtime in {"deepseek-agent", "llm-agent", "llm-native"}
    if not actions and allow_empty_actions and not llm_native_runtime:
        runtime = "llm-native"
        llm_native_runtime = True
    if not actions and not llm_native_runtime and not allow_empty_actions:
        raise ValueError(
            "SKILL.md does not define executable actions. Add a ```skill-actions``` fenced JSON array."
        )

    return SkillDefinition(
        skill_root=str(root),
        skill_file=str(Path(skill_file)),
        name=name,
        description=description,
        runtime=runtime,
        actions=actions,
        metadata=metadata,
        raw_markdown=text,
    )


def _parse_frontmatter(text: str) -> dict[str, str]:
    if not text.startswith("---\n"):
        return {}
    try:
        _, body, _ = text.split("---", 2)
    except ValueError:
        return {}
    result: dict[str, str] = {}
    for raw_line in body.splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or ":" not in line:
            continue
        key, value = line.split(":", 1)
        result[key.strip()] = value.strip().strip('"').strip("'")
    return result


def _extract_title(text: str) -> str:
    for line in text.splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return ""


def _extract_first_paragraph(text: str) -> str:
    lines = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if line.startswith("#"):
            continue
        if not line:
            if lines:
                break
            continue
        lines.append(line)
    return " ".join(lines)


def _parse_actions(text: str) -> list[SkillAction]:
    explicit_actions = _parse_explicit_actions(text)
    if explicit_actions:
        return explicit_actions
    return _parse_example_actions(text)


def _parse_explicit_actions(text: str) -> list[SkillAction]:
    for match in FENCE_RE.finditer(text):
        info = match.group("info").strip().lower()
        if info not in {"skill-actions", "json skill-actions", "skill-actions json"}:
            continue
        payload = json.loads(match.group("body"))
        actions = []
        for index, item in enumerate(payload):
            action_id = item.get("id") or f"action_{index + 1}"
            action_type = item["type"]
            action_name = item.get("name") or action_id
            config = {
                key: value
                for key, value in item.items()
                if key not in {"id", "type", "name", "description", "continue_on_error", "arguments_schema"}
            }
            actions.append(
                SkillAction(
                    id=action_id,
                    type=action_type,
                    name=action_name,
                    description=item.get("description", ""),
                    config=config,
                    arguments_schema=item.get("arguments_schema", {}),
                    continue_on_error=bool(item.get("continue_on_error", False)),
                )
            )
        return actions
    return []


def _parse_example_actions(text: str) -> list[SkillAction]:
    supported_shells = {"bash", "sh", "shell", "zsh"}
    candidates: list[tuple[int, SkillAction]] = []
    for match in FENCE_RE.finditer(text):
        info = match.group("info").strip().lower()
        if info not in supported_shells:
            continue
        for command in _extract_curl_commands(match.group("body")):
            action = _curl_command_to_action(command)
            if action is not None:
                candidates.append((_score_example_action(action), action))
    if not candidates:
        return []
    candidates.sort(key=lambda item: item[0], reverse=True)
    return [candidates[0][1]]


def _extract_curl_commands(body: str) -> list[str]:
    commands: list[str] = []
    current: list[str] = []

    for raw_line in body.splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("curl "):
            if current:
                commands.append(" ".join(current).replace("\\", "").strip())
                current = []
            current.append(line)
            if not line.endswith("\\"):
                commands.append(" ".join(current).replace("\\", "").strip())
                current = []
            continue
        if current:
            current.append(line)
            if not line.endswith("\\"):
                commands.append(" ".join(current).replace("\\", "").strip())
                current = []

    if current:
        commands.append(" ".join(current).replace("\\", "").strip())

    return [item for item in commands if item.startswith("curl ")]


def _curl_command_to_action(command: str) -> SkillAction | None:
    try:
        tokens = shlex.split(command, posix=True)
    except ValueError:
        return None
    if not tokens or tokens[0] != "curl":
        return None

    method = "GET"
    url = ""
    headers: dict[str, str] = {}
    body: str | None = None
    unsupported = False
    options_with_value = {
        "-X", "--request",
        "-H", "--header",
        "-d", "--data", "--data-raw", "--data-binary",
        "-F", "--form",
        "-A", "--user-agent",
        "-u", "--user",
    }

    index = 1
    while index < len(tokens):
        token = tokens[index]
        if token in {"-X", "--request"} and index + 1 < len(tokens):
            method = tokens[index + 1].upper()
            index += 2
            continue
        if token in {"-H", "--header"} and index + 1 < len(tokens):
            header = tokens[index + 1]
            if ":" in header:
                key, value = header.split(":", 1)
                headers[key.strip()] = value.strip()
            index += 2
            continue
        if token in {"-d", "--data", "--data-raw", "--data-binary"} and index + 1 < len(tokens):
            body = tokens[index + 1]
            if method == "GET":
                method = "POST"
            index += 2
            continue
        if token in {"-F", "--form"}:
            unsupported = True
            break
        if token in {"-s", "--silent", "-L", "--location", "--compressed"}:
            index += 1
            continue
        if token.startswith("http://") or token.startswith("https://"):
            url = token
            index += 1
            continue
        if token in options_with_value and index + 1 < len(tokens):
            index += 2
            continue
        index += 1

    if unsupported or not url:
        return None
    if _contains_unresolved_placeholder(url) or _contains_unresolved_placeholder(body or ""):
        return None
    if any(_contains_unresolved_placeholder(value) for value in headers.values()):
        return None

    normalized_body = _normalize_example_body(body, headers)
    description = f"Synthesized from documented curl example: {method} {url}"
    return SkillAction(
        id="example_http_request",
        type="http_request",
        name="Execute documented API example",
        description=description,
        config={
            "url": url,
            "method": method,
            "headers": headers,
            **({"body": normalized_body} if normalized_body is not None else {}),
            "timeout_seconds": 20,
        },
        continue_on_error=True,
    )


def _contains_unresolved_placeholder(value: str) -> bool:
    placeholders = {
        "YOUR_API_KEY",
        "POST_ID",
        "HANDLE",
        "SLUG",
        "IMAGE_URL_FROM_STEP_1",
        "AUDIO_URL_FROM_STEP_1",
        "YOUR_CLAIM_CODE",
        "/path/to/",
    }
    return any(token in value for token in placeholders)


def _normalize_example_body(body: str | None, headers: dict[str, str]) -> str | None:
    if body is None:
        return None
    content_type = headers.get("Content-Type", headers.get("content-type", "")).lower()
    if "application/json" not in content_type:
        return body
    try:
        payload = json.loads(body)
    except json.JSONDecodeError:
        return body
    if isinstance(payload, dict):
        if str(payload.get("handle", "")).strip().lower() in {"youragent", "your-agent"}:
            payload["handle"] = f"sandbox-agent-{uuid.uuid4().hex[:8]}"
        if str(payload.get("display_name", "")).strip() == "Your Agent":
            payload["display_name"] = "Sandbox Agent"
        if str(payload.get("bio", "")).strip() == "What you do":
            payload["bio"] = "ProvLoom sandbox bootstrap probe"
        return json.dumps(payload, ensure_ascii=False)
    return body


def _score_example_action(action: SkillAction) -> int:
    url = str(action.config.get("url", ""))
    method = str(action.config.get("method", "GET")).upper()
    body = action.config.get("body")
    score = 0

    if "api." in url or "/api/" in url:
        score += 40
    if method != "GET":
        score += 25
    if body:
        score += 10
    if "register" in url:
        score += 15
    if url.endswith((".md", ".json", ".yaml", ".yml")):
        score -= 40

    return score
