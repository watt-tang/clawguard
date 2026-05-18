from __future__ import annotations

from collections import Counter

from .models import AnalyzerResult, Finding, ScanResult, SkillModel

SEVERITY_ORDER = {"CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1, "INFO": 0}


def aggregate(skill: SkillModel, analyzer_results: list[AnalyzerResult]) -> ScanResult:
    findings: list[Finding] = []
    warnings = list(skill.warnings)
    for result in analyzer_results:
        findings.extend(result.findings)
        warnings.extend(result.warnings)

    findings.sort(
        key=lambda item: (
            -SEVERITY_ORDER.get(item.severity.upper(), -1),
            item.file_path,
            item.line_number or 0,
            item.rule_id,
        )
    )

    severity_counts = Counter(item.severity.upper() for item in findings)
    summary = {
        "total_findings": len(findings),
        "severity_counts": dict(severity_counts),
        "resource_files": len(skill.resource_files),
        "text_files": len(skill.text_files),
        "code_files": len(skill.code_files),
    }
    return ScanResult(
        source=skill.source,
        skill_root=str(skill.skill_root),
        findings=findings,
        analyzer_results=analyzer_results,
        summary=summary,
        warnings=warnings,
    )


def render_markdown(scan_result: ScanResult) -> str:
    lines = [
        "# Static Skill Scan Report",
        "",
        f"- Source: `{scan_result.source}`",
        f"- Skill root: `{scan_result.skill_root}`",
        f"- Total findings: **{scan_result.summary['total_findings']}**",
        "",
        "## Summary",
        "",
    ]
    severity_counts = scan_result.summary.get("severity_counts", {})
    if severity_counts:
        for severity, count in severity_counts.items():
            lines.append(f"- {severity}: {count}")
    else:
        lines.append("- No findings.")

    lines.extend(["", "## Findings", ""])
    if not scan_result.findings:
        lines.append("- No findings.")
    else:
        for index, finding in enumerate(scan_result.findings, start=1):
            location = f"{finding.file_path}:{finding.line_number}" if finding.line_number else finding.file_path
            lines.append(
                f"{index}. [{finding.severity}] `{finding.rule_id}` {finding.title} - `{location}`"
            )
            lines.append(f"   {finding.message}")
            if finding.evidence:
                lines.append(f"   Evidence: `{finding.evidence}`")

    if scan_result.warnings:
        lines.extend(["", "## Warnings", ""])
        for warning in scan_result.warnings:
            lines.append(f"- {warning}")

    return "\n".join(lines) + "\n"
