from __future__ import annotations

import json
import re
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

    candidates = sorted(source.rglob("SKILL.md"))
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
