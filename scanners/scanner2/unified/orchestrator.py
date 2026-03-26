from __future__ import annotations

from pathlib import Path

from .adapters import ScannerAdapter, default_adapters
from .models import (
    NormalizedFinding,
    UnifiedScanReport,
    UnifiedScanSettings,
    build_settings_dict,
    ensure_target_path,
    utc_now,
)

_SORT_RANK = {
    "CRITICAL": 4,
    "HIGH": 3,
    "MEDIUM": 2,
    "LOW": 1,
    "INFO": 0,
    "SAFE": -1,
    "UNKNOWN": -2,
}


class UnifiedSkillScanner:
    """Unified orchestration layer over the existing six scanners."""

    def __init__(self, adapters: list[ScannerAdapter] | None = None):
        self.adapters = adapters or default_adapters()

    def scan(self, target_path: str | Path, settings: UnifiedScanSettings | None = None) -> UnifiedScanReport:
        settings = settings or UnifiedScanSettings()
        resolved_target = ensure_target_path(target_path)
        started_at = utc_now()
        runs = []

        for adapter in self.adapters:
            should_run, reason = adapter.should_run(settings)
            if not should_run:
                runs.append(adapter.skip(reason or "not selected"))
                continue
            runs.append(adapter.run(resolved_target, settings))

        findings = self._deduplicate_findings(runs)
        return UnifiedScanReport(
            target_path=str(resolved_target),
            auth_state=settings.auth_state,
            settings=build_settings_dict(settings),
            scanner_runs=runs,
            findings=findings,
            started_at=started_at,
        )

    @staticmethod
    def _deduplicate_findings(runs) -> list[NormalizedFinding]:
        merged: dict[str, NormalizedFinding] = {}
        for run in runs:
            for finding in run.findings:
                current = merged.get(finding.fingerprint)
                if current is None:
                    merged[finding.fingerprint] = finding
                    continue
                current.merge(finding)
        return sorted(
            merged.values(),
            key=lambda item: (
                -1 * _SORT_RANK.get(item.severity, -2),
                item.file_path or "",
                item.line_number or 0,
                item.title,
            ),
        )
