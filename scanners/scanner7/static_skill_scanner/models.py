from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


@dataclass(slots=True)
class ParsedWorkspace:
    source: str
    workspace_path: Path
    skill_root: Path
    temp_dir: Path | None = None
    parse_logs: list[str] = field(default_factory=list)


@dataclass(slots=True)
class FileRecord:
    path: str
    absolute_path: Path
    kind: str
    size: int
    sha256: str
    is_text: bool
    content: str | None = None
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class SkillModel:
    source: str
    skill_root: Path
    manifest_path: str | None
    manifest_text: str | None
    manifest_meta: dict[str, Any]
    files: list[FileRecord]
    text_files: list[FileRecord]
    resource_files: list[FileRecord]
    code_files: list[FileRecord]
    binary_files: list[FileRecord]
    warnings: list[str] = field(default_factory=list)


@dataclass(slots=True)
class Finding:
    rule_id: str
    title: str
    severity: str
    category: str
    file_path: str
    message: str
    evidence: str = ""
    line_number: int | None = None
    analyzer: str = ""


@dataclass(slots=True)
class AnalyzerResult:
    analyzer: str
    findings: list[Finding] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    metrics: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class ScanResult:
    source: str
    skill_root: str
    findings: list[Finding]
    analyzer_results: list[AnalyzerResult]
    summary: dict[str, Any]
    warnings: list[str]
