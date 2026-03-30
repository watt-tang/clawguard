from __future__ import annotations

import json
import os
import subprocess
import sys
import time
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any

from .models import (
    AuthState,
    NormalizedFinding,
    ScannerDescriptor,
    ScannerExecutionResult,
    ScannerRunState,
    UnifiedScanSettings,
)

REPO_ROOT = Path(__file__).resolve().parents[3]
SCANNERS_ROOT = REPO_ROOT / "scanners"


def _normalize_location(location: str | None) -> tuple[str | None, int | None]:
    if not location:
        return None, None
    if ":" not in location:
        return location, None
    left, right = location.rsplit(":", 1)
    try:
        return left, int(right)
    except ValueError:
        return location, None


def _run_process(
    command: list[str],
    *,
    cwd: Path | None = None,
    env: dict[str, str] | None = None,
    timeout_ms: int = 300_000,
) -> subprocess.CompletedProcess[str]:
    merged_env = os.environ.copy()
    merged_env.setdefault("PYTHONIOENCODING", "utf-8")
    merged_env.setdefault("PYTHONUTF8", "1")
    if env:
        merged_env.update(env)
    return subprocess.run(
        command,
        cwd=str(cwd) if cwd else None,
        env=merged_env,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=max(1, timeout_ms // 1000),
        check=False,
    )


def _normalize_litellm_model(model: str, base_url: str | None) -> str:
    normalized = (model or "").strip()
    if not normalized:
        return "openai/deepseek-chat"
    if "/" in normalized:
        return normalized
    if base_url:
        return f"openai/{normalized}"
    return normalized


class ScannerAdapter(ABC):
    descriptor: ScannerDescriptor

    def should_run(self, settings: UnifiedScanSettings) -> tuple[bool, str | None]:
        if settings.enabled_scanners and self.descriptor.scanner_id not in settings.enabled_scanners:
            return False, "not selected"
        if self.descriptor.scanner_id in settings.disabled_scanners:
            return False, "disabled by user"
        if self.descriptor.requires_authentication and settings.auth_state != AuthState.AUTHENTICATED:
            return False, "requires authenticated user state"
        return True, None

    def skip(self, reason: str) -> ScannerExecutionResult:
        return ScannerExecutionResult(
            descriptor=self.descriptor,
            state=ScannerRunState.SKIPPED,
            skipped_reason=reason,
        ).finish()

    def unavailable(self, reason: str) -> ScannerExecutionResult:
        return ScannerExecutionResult(
            descriptor=self.descriptor,
            state=ScannerRunState.UNAVAILABLE,
            skipped_reason=reason,
        ).finish()

    def failed(self, error: str, summary: dict[str, Any] | None = None) -> ScannerExecutionResult:
        return ScannerExecutionResult(
            descriptor=self.descriptor,
            state=ScannerRunState.FAILED,
            error=error,
            raw_summary=summary or {},
        ).finish()

    @abstractmethod
    def run(self, target_path: Path, settings: UnifiedScanSettings) -> ScannerExecutionResult:
        raise NotImplementedError


class Scanner1Adapter(ScannerAdapter):
    descriptor = ScannerDescriptor(
        scanner_id="scanner1",
        display_name="Scanner 1 Static Audit",
        scanner_kind="static",
        resource_tier="free",
        requires_authentication=False,
        description="Pattern-based static skill scanner with JSON output.",
    )

    def run(self, target_path: Path, settings: UnifiedScanSettings) -> ScannerExecutionResult:
        command = [
            sys.executable,
            str(SCANNERS_ROOT / "scanner1" / "scripts" / "scan_skill.py"),
            str(target_path),
        ]
        try:
            completed = _run_process(command, timeout_ms=settings.timeout_ms)
        except FileNotFoundError as exc:
            return self.unavailable(str(exc))
        except subprocess.TimeoutExpired:
            return self.failed("scanner1 timed out")

        if completed.returncode != 0:
            return self.failed(
                "scanner1 process failed",
                {
                    "returncode": completed.returncode,
                    "stdout": completed.stdout,
                    "stderr": completed.stderr,
                },
            )

        try:
            payload = json.loads(completed.stdout)
        except json.JSONDecodeError as exc:
            return self.failed(f"scanner1 returned invalid JSON: {exc}")

        findings = [
            NormalizedFinding(
                severity=item.get("severity"),
                category=item.get("category", "content"),
                title=item.get("message", "scanner1 finding"),
                description=item.get("message", "scanner1 finding"),
                file_path=item.get("file"),
                line_number=item.get("line"),
                snippet=item.get("matched_text"),
                scanners=[self.descriptor.scanner_id],
                metadata={"source": "scanner1"},
            )
            for item in payload.get("findings", [])
        ]

        return ScannerExecutionResult(
            descriptor=self.descriptor,
            state=ScannerRunState.COMPLETED,
            findings=findings,
            raw_summary=payload.get("summary", {}),
        ).finish()


class Scanner2Adapter(ScannerAdapter):
    descriptor = ScannerDescriptor(
        scanner_id="scanner2",
        display_name="Scanner 2 Unified Core",
        scanner_kind="framework",
        resource_tier="free",
        requires_authentication=False,
        description="Python framework scanner with static, behavioral, and optional LLM analyzers.",
    )

    def run(self, target_path: Path, settings: UnifiedScanSettings) -> ScannerExecutionResult:
        use_llm = settings.is_authenticated and bool(settings.deepseek_api_key)
        llm_model = _normalize_litellm_model(settings.deepseek_model, settings.deepseek_base_url)

        try:
            from ..core.analyzer_factory import build_analyzers
            from ..core.scan_policy import ScanPolicy
            from ..core.scanner import SkillScanner
        except ModuleNotFoundError as exc:
            return self.unavailable(f"scanner2 dependency missing: {exc.name}")
        try:
            policy = ScanPolicy.default()
            analyzers = build_analyzers(
                policy,
                use_behavioral=settings.is_authenticated,
                use_llm=use_llm,
                llm_model=llm_model,
                llm_api_key=settings.deepseek_api_key,
                llm_base_url=settings.deepseek_base_url,
                use_trigger=settings.is_authenticated,
            )
            scanner = SkillScanner(analyzers=analyzers, policy=policy)
            result = scanner.scan_skill(target_path)
        except Exception as exc:
            return self.failed(f"scanner2 execution failed: {exc}")

        findings = [
            NormalizedFinding(
                severity=finding.severity.value,
                category=finding.category.value,
                title=finding.title,
                description=finding.description,
                file_path=finding.file_path,
                line_number=finding.line_number,
                snippet=finding.snippet,
                scanners=[self.descriptor.scanner_id],
                rule_ids=[finding.rule_id] if finding.rule_id else [],
                metadata={
                    "analyzer": finding.analyzer,
                    "scanner2_metadata": finding.metadata,
                },
            )
            for finding in result.findings
        ]

        raw_summary = {
            "is_safe": result.is_safe,
            "max_severity": result.max_severity.value,
            "analyzers_used": result.analyzers_used,
            "analyzers_failed": result.analyzers_failed,
            "scan_metadata": result.scan_metadata or {},
        }
        return ScannerExecutionResult(
            descriptor=self.descriptor,
            state=ScannerRunState.COMPLETED,
            findings=findings,
            raw_summary=raw_summary,
        ).finish()


class SkillBackedAdapter(ScannerAdapter):
    def run(self, target_path: Path, settings: UnifiedScanSettings) -> ScannerExecutionResult:
        return self.unavailable(
            "skill-backed scanner is registered but needs an external skill runtime adapter to execute"
        )


class Scanner3Adapter(SkillBackedAdapter):
    descriptor = ScannerDescriptor(
        scanner_id="scanner3",
        display_name="Scanner 3 Yidun Skill",
        scanner_kind="skill",
        resource_tier="api",
        requires_authentication=True,
        description="Hybrid local-cloud skill scanner distributed as a skill definition.",
    )


class Scanner4Adapter(SkillBackedAdapter):
    descriptor = ScannerDescriptor(
        scanner_id="scanner4",
        display_name="Scanner 4 Skill Vetter",
        scanner_kind="skill",
        resource_tier="skill",
        requires_authentication=True,
        description="Checklist-driven security vetter distributed as a skill definition.",
    )


class Scanner5Adapter(ScannerAdapter):
    descriptor = ScannerDescriptor(
        scanner_id="scanner5",
        display_name="Scanner 5 Agentic LLM Audit",
        scanner_kind="llm",
        resource_tier="api",
        requires_authentication=True,
        description="Agent-style multi-stage code security scan powered by an LLM API.",
    )

    def run(self, target_path: Path, settings: UnifiedScanSettings) -> ScannerExecutionResult:
        if not settings.deepseek_api_key:
            return self.skip("scanner5 requires an API key in authenticated mode")

        command = [
            sys.executable,
            str(SCANNERS_ROOT / "scanner5" / "json_scan.py"),
            "--repo",
            str(target_path),
            "--api-key",
            settings.deepseek_api_key,
            "--base-url",
            settings.deepseek_base_url,
            "--model",
            settings.deepseek_model,
            "--language",
            settings.language,
            "--fast-mode",
        ]
        last_failure: dict[str, Any] | None = None
        for attempt in range(1, 3):
            try:
                completed = _run_process(command, cwd=SCANNERS_ROOT / "scanner5", timeout_ms=settings.timeout_ms)
            except FileNotFoundError as exc:
                return self.unavailable(str(exc))
            except subprocess.TimeoutExpired:
                last_failure = {"attempt": attempt, "error": "scanner5 timed out"}
                if attempt < 2:
                    time.sleep(2)
                    continue
                return self.failed("scanner5 timed out", last_failure)

            if completed.returncode == 0:
                break

            last_failure = {
                "attempt": attempt,
                "returncode": completed.returncode,
                "stdout": completed.stdout,
                "stderr": completed.stderr,
            }
            if attempt < 2:
                time.sleep(2)
                continue
            return self.failed("scanner5 process failed", last_failure)
        else:
            return self.failed("scanner5 process failed", last_failure or {})

        try:
            payload = json.loads(completed.stdout)
        except json.JSONDecodeError as exc:
            return self.failed(f"scanner5 returned invalid JSON: {exc}")

        findings = []
        for item in payload.get("results", []):
            findings.append(
                NormalizedFinding(
                    severity=item.get("level"),
                    category=item.get("risk_type", "llm_audit"),
                    title=item.get("title", "scanner5 finding"),
                    description=item.get("description", item.get("title", "scanner5 finding")),
                    scanners=[self.descriptor.scanner_id],
                    metadata={
                        "suggestion": item.get("suggestion"),
                        "source": "scanner5",
                    },
                )
            )

        raw_summary = {
            "score": payload.get("score"),
            "language": payload.get("language"),
            "llm": payload.get("llm"),
            "result_count": len(payload.get("results", [])),
        }
        return ScannerExecutionResult(
            descriptor=self.descriptor,
            state=ScannerRunState.COMPLETED,
            findings=findings,
            raw_summary=raw_summary,
        ).finish()


class Scanner6Adapter(ScannerAdapter):
    descriptor = ScannerDescriptor(
        scanner_id="scanner6",
        display_name="Scanner 6 ClawGuard Auditor",
        scanner_kind="runtime_auditor",
        resource_tier="premium",
        requires_authentication=True,
        description="Node-based security auditor with SAST, semantic, and sandbox analysis.",
    )

    def run(self, target_path: Path, settings: UnifiedScanSettings) -> ScannerExecutionResult:
        command = [
            "node",
            str(SCANNERS_ROOT / "scanner6" / "json_scan.js"),
            str(target_path),
        ]
        try:
            completed = _run_process(command, cwd=SCANNERS_ROOT / "scanner6", timeout_ms=settings.timeout_ms)
        except FileNotFoundError as exc:
            return self.unavailable(str(exc))
        except subprocess.TimeoutExpired:
            return self.failed("scanner6 timed out")

        if completed.returncode != 0:
            return self.failed(
                "scanner6 process failed",
                {
                    "returncode": completed.returncode,
                    "stdout": completed.stdout,
                    "stderr": completed.stderr,
                },
            )

        try:
            payload = json.loads(completed.stdout)
        except json.JSONDecodeError as exc:
            return self.failed(f"scanner6 returned invalid JSON: {exc}")

        findings = []
        for item in payload.get("analysis", {}).get("sast", {}).get("findings", []):
            file_path, line_number = _normalize_location(item.get("location"))
            findings.append(
                NormalizedFinding(
                    severity=item.get("severity"),
                    category=item.get("category", "sast"),
                    title=item.get("title", "scanner6 finding"),
                    description=item.get("recommendation", item.get("title", "scanner6 finding")),
                    file_path=file_path,
                    line_number=line_number,
                    snippet=item.get("evidence"),
                    scanners=[self.descriptor.scanner_id],
                    metadata={"source": "scanner6"},
                )
            )

        raw_summary = {
            "verdict": payload.get("verdict"),
            "risk_tier": payload.get("risk_tier"),
            "risk_score": payload.get("risk_score"),
            "recommendation": payload.get("recommendation"),
        }
        return ScannerExecutionResult(
            descriptor=self.descriptor,
            state=ScannerRunState.COMPLETED,
            findings=findings,
            raw_summary=raw_summary,
        ).finish()


def default_adapters() -> list[ScannerAdapter]:
    return [
        Scanner1Adapter(),
        Scanner2Adapter(),
        Scanner3Adapter(),
        Scanner4Adapter(),
        Scanner5Adapter(),
        Scanner6Adapter(),
    ]
