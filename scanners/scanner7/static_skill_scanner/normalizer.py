from __future__ import annotations

import hashlib
from pathlib import Path

from .models import FileRecord, ParsedWorkspace, SkillModel

TEXT_EXTENSIONS = {
    ".md",
    ".txt",
    ".py",
    ".sh",
    ".bash",
    ".json",
    ".yaml",
    ".yml",
    ".toml",
    ".ini",
    ".cfg",
    ".js",
    ".ts",
    ".svg",
}

CODE_EXTENSIONS = {".py", ".sh", ".bash", ".js", ".ts"}
RESOURCE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".pdf"}


def build_skill_model(parsed: ParsedWorkspace) -> SkillModel:
    files: list[FileRecord] = []
    for path in sorted(p for p in parsed.skill_root.rglob("*") if p.is_file()):
        relative_path = path.relative_to(parsed.skill_root).as_posix()
        suffix = path.suffix.lower()
        raw_bytes = path.read_bytes()
        is_text = suffix in TEXT_EXTENSIONS
        content = None
        if is_text:
            try:
                content = raw_bytes.decode("utf-8")
            except UnicodeDecodeError:
                is_text = False

        kind = _classify_file(path, is_text)
        metadata = {}
        if kind == "resource":
            metadata["extension"] = suffix

        files.append(
            FileRecord(
                path=relative_path,
                absolute_path=path,
                kind=kind,
                size=len(raw_bytes),
                sha256=hashlib.sha256(raw_bytes).hexdigest(),
                is_text=is_text,
                content=content,
                metadata=metadata,
            )
        )

    manifest = next((item for item in files if item.path == "SKILL.md"), None)
    manifest_text = manifest.content if manifest else None
    manifest_meta = _parse_frontmatter(manifest_text) if manifest_text else {}

    return SkillModel(
        source=parsed.source,
        skill_root=parsed.skill_root,
        manifest_path=manifest.path if manifest else None,
        manifest_text=manifest_text,
        manifest_meta=manifest_meta,
        files=files,
        text_files=[item for item in files if item.is_text],
        resource_files=[item for item in files if item.kind == "resource"],
        code_files=[item for item in files if item.kind == "code"],
        binary_files=[item for item in files if item.kind == "binary"],
        warnings=list(parsed.parse_logs),
    )


def _classify_file(path: Path, is_text: bool) -> str:
    suffix = path.suffix.lower()
    if suffix in RESOURCE_EXTENSIONS:
        return "resource"
    if suffix in CODE_EXTENSIONS:
        return "code"
    if is_text:
        return "text"
    return "binary"


def _parse_frontmatter(content: str) -> dict[str, str]:
    lines = content.splitlines()
    if len(lines) < 3 or lines[0].strip() != "---":
        return {}

    data: dict[str, str] = {}
    for line in lines[1:]:
        if line.strip() == "---":
            break
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        data[key.strip()] = value.strip().strip("\"'")
    return data
