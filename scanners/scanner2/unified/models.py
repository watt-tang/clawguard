from __future__ import annotations

import hashlib
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from pathlib import Path
from typing import Any


SEVERITY_ORDER = {
    "CRITICAL": 4,
    "HIGH": 3,
    "MEDIUM": 2,
    "LOW": 1,
    "INFO": 0,
    "SAFE": -1,
    "UNKNOWN": -2,
}


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def normalize_severity(value: str | None) -> str:
    if not value:
        return "UNKNOWN"
    upper = value.strip().upper()
    aliases = {
        "SEVERE": "HIGH",
        "WARN": "MEDIUM",
        "WARNING": "MEDIUM",
        "PASS": "SAFE",
        "CLEAR": "SAFE",
    }
    return aliases.get(upper, upper if upper in SEVERITY_ORDER else "UNKNOWN")


def severity_rank(value: str | None) -> int:
    return SEVERITY_ORDER.get(normalize_severity(value), -2)


class AuthState(str, Enum):
    GUEST = "guest"
    AUTHENTICATED = "authenticated"


class ScannerRunState(str, Enum):
    COMPLETED = "completed"
    SKIPPED = "skipped"
    FAILED = "failed"
    UNAVAILABLE = "unavailable"


@dataclass(frozen=True)
class ScannerDescriptor:
    scanner_id: str
    display_name: str
    scanner_kind: str
    resource_tier: str
    requires_authentication: bool
    description: str
    supports_extension: bool = True


@dataclass
class UnifiedScanSettings:
    auth_state: AuthState = AuthState.GUEST
    deepseek_api_key: str | None = None
    deepseek_model: str = "deepseek-chat"
    deepseek_base_url: str = "https://api.deepseek.com/v1"
    language: str = "zh"
    timeout_ms: int = 300_000
    enabled_scanners: set[str] = field(default_factory=set)
    disabled_scanners: set[str] = field(default_factory=set)
    extra_env: dict[str, str] = field(default_factory=dict)

    @property
    def is_authenticated(self) -> bool:
        return self.auth_state == AuthState.AUTHENTICATED


@dataclass
class NormalizedFinding:
    severity: str
    category: str
    title: str
    description: str
    file_path: str | None = None
    line_number: int | None = None
    snippet: str | None = None
    scanners: list[str] = field(default_factory=list)
    rule_ids: list[str] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)
    fingerprint: str = ""

    def __post_init__(self) -> None:
        self.severity = normalize_severity(self.severity)
        if not self.fingerprint:
            self.fingerprint = self.build_fingerprint(
                category=self.category,
                title=self.title,
                file_path=self.file_path,
                line_number=self.line_number,
                snippet=self.snippet,
            )

    @staticmethod
    def build_fingerprint(
        *,
        category: str,
        title: str,
        file_path: str | None,
        line_number: int | None,
        snippet: str | None,
    ) -> str:
        normalized = "|".join(
            [
                (category or "unknown").strip().lower(),
                (title or "").strip().lower(),
                (file_path or "").strip().lower(),
                str(line_number or 0),
                " ".join((snippet or "").strip().lower().split())[:240],
            ]
        )
        return hashlib.sha256(normalized.encode("utf-8")).hexdigest()

    def merge(self, other: "NormalizedFinding") -> None:
        if severity_rank(other.severity) > severity_rank(self.severity):
            self.severity = other.severity
        if other.description and len(other.description) > len(self.description):
            self.description = other.description
        if not self.file_path and other.file_path:
            self.file_path = other.file_path
        if not self.line_number and other.line_number:
            self.line_number = other.line_number
        if not self.snippet and other.snippet:
            self.snippet = other.snippet
        self.scanners = sorted(set(self.scanners + other.scanners))
        self.rule_ids = sorted(set(self.rule_ids + other.rule_ids))
        self.metadata.update({k: v for k, v in other.metadata.items() if k not in self.metadata})

    def to_dict(self) -> dict[str, Any]:
        return {
            "fingerprint": self.fingerprint,
            "severity": self.severity,
            "category": self.category,
            "title": self.title,
            "description": self.description,
            "file_path": self.file_path,
            "line_number": self.line_number,
            "snippet": self.snippet,
            "scanners": self.scanners,
            "rule_ids": self.rule_ids,
            "metadata": self.metadata,
        }


@dataclass
class ScannerExecutionResult:
    descriptor: ScannerDescriptor
    state: ScannerRunState
    started_at: datetime = field(default_factory=utc_now)
    completed_at: datetime | None = None
    findings: list[NormalizedFinding] = field(default_factory=list)
    raw_summary: dict[str, Any] = field(default_factory=dict)
    error: str | None = None
    skipped_reason: str | None = None

    @property
    def duration_ms(self) -> int | None:
        if not self.completed_at:
            return None
        delta = self.completed_at - self.started_at
        return int(delta.total_seconds() * 1000)

    @property
    def finding_count(self) -> int:
        return len(self.findings)

    @property
    def max_severity(self) -> str:
        if not self.findings:
            return "SAFE"
        return max((f.severity for f in self.findings), key=severity_rank)

    def finish(self) -> "ScannerExecutionResult":
        self.completed_at = utc_now()
        return self

    def to_dict(self) -> dict[str, Any]:
        return {
            "scanner": {
                "id": self.descriptor.scanner_id,
                "name": self.descriptor.display_name,
                "kind": self.descriptor.scanner_kind,
                "resource_tier": self.descriptor.resource_tier,
            },
            "state": self.state.value,
            "started_at": self.started_at.isoformat(),
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "duration_ms": self.duration_ms,
            "finding_count": self.finding_count,
            "max_severity": self.max_severity,
            "error": self.error,
            "skipped_reason": self.skipped_reason,
            "raw_summary": self.raw_summary,
            "findings": [finding.to_dict() for finding in self.findings],
        }


@dataclass
class UnifiedScanReport:
    target_path: str
    auth_state: AuthState
    settings: dict[str, Any]
    scanner_runs: list[ScannerExecutionResult]
    findings: list[NormalizedFinding]
    started_at: datetime
    completed_at: datetime = field(default_factory=utc_now)

    @property
    def duration_ms(self) -> int:
        return int((self.completed_at - self.started_at).total_seconds() * 1000)

    @property
    def max_severity(self) -> str:
        if not self.findings:
            return "SAFE"
        return max((finding.severity for finding in self.findings), key=severity_rank)

    def _severity_counts(self) -> dict[str, int]:
        counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0, "INFO": 0, "SAFE": 0, "UNKNOWN": 0}
        for finding in self.findings:
            counts[normalize_severity(finding.severity)] += 1
        return counts

    def _run_counts(self) -> dict[str, int]:
        counts = {state.value: 0 for state in ScannerRunState}
        for run in self.scanner_runs:
            counts[run.state.value] += 1
        return counts

    def overall_conclusion(self) -> str:
        level = self.max_severity
        if level == "CRITICAL":
            return "block"
        if level == "HIGH":
            return "manual_review_required"
        if level == "MEDIUM":
            return "review_recommended"
        if level in {"LOW", "INFO"}:
            return "allow_with_caution"
        if any(run.state == ScannerRunState.FAILED for run in self.scanner_runs):
            return "partial_result"
        return "clear"

    def to_dict(self) -> dict[str, Any]:
        settings = dict(self.settings)
        if settings.get("deepseek_api_key"):
            settings["deepseek_api_key"] = "***redacted***"
        return {
            "target_path": self.target_path,
            "auth_state": self.auth_state.value,
            "started_at": self.started_at.isoformat(),
            "completed_at": self.completed_at.isoformat(),
            "duration_ms": self.duration_ms,
            "settings": settings,
            "summary": {
                "scanner_runs": self._run_counts(),
                "raw_finding_count": sum(run.finding_count for run in self.scanner_runs),
                "deduplicated_finding_count": len(self.findings),
                "findings_by_severity": self._severity_counts(),
                "max_severity": self.max_severity,
                "overall_conclusion": self.overall_conclusion(),
            },
            "scanner_runs": [run.to_dict() for run in self.scanner_runs],
            "findings": [finding.to_dict() for finding in self.findings],
        }


def build_settings_dict(settings: UnifiedScanSettings) -> dict[str, Any]:
    return {
        "auth_state": settings.auth_state.value,
        "deepseek_api_key": settings.deepseek_api_key,
        "deepseek_model": settings.deepseek_model,
        "deepseek_base_url": settings.deepseek_base_url,
        "language": settings.language,
        "timeout_ms": settings.timeout_ms,
        "enabled_scanners": sorted(settings.enabled_scanners),
        "disabled_scanners": sorted(settings.disabled_scanners),
    }


def ensure_target_path(target_path: str | Path) -> Path:
    resolved = Path(target_path).resolve()
    if not resolved.exists():
        raise FileNotFoundError(f"Target path does not exist: {resolved}")
    if not resolved.is_dir():
        raise NotADirectoryError(f"Target path is not a directory: {resolved}")
    return resolved
