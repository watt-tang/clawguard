from __future__ import annotations

import base64
import json
import os
import shutil
import sys
import tempfile
import traceback
import urllib.request
import uuid
import zipfile
from dataclasses import asdict, is_dataclass
from pathlib import Path
from typing import Any


def main() -> int:
    try:
        request_path = Path(sys.argv[1]).resolve()
        request = json.loads(request_path.read_text(encoding="utf-8"))
        provloom_root = Path(request["provloomRoot"]).resolve()
        work_root = Path(request["workRoot"]).resolve()
        tmp_root = work_root / "tmp"
        tmp_root.mkdir(parents=True, exist_ok=True)
        os.environ["TMPDIR"] = str(tmp_root)
        tempfile.tempdir = str(tmp_root)
        sys.path.insert(0, str(provloom_root))
        os.chdir(provloom_root)

        from app.analyzer.rules import analyze_trace
        from app.backend.schemas import LLMConfig
        from app.reporting.risk_mapper import map_risk_profile
        from app.runner.docker_runner import DockerRunner
        from app.telemetry.collector import build_execution_report

        execution_id = uuid.uuid4().hex
        source_dir = work_root / "uploads" / execution_id
        source_dir.mkdir(parents=True, exist_ok=True)
        skill_path = prepare_skill_source(request, source_dir)

        llm_config = LLMConfig.from_dict(request.get("llmConfig") or {})
        runner = DockerRunner(
            dockerfile_dir="docker/sandbox",
            artifacts_root=str(work_root / "runs"),
        )
        execution = runner.run(
            execution_id=execution_id,
            skill_path=str(skill_path),
            input_payload=request.get("inputPayload") or {},
            timeout_seconds=int(request.get("timeoutSeconds") or 45),
            network_policy=request.get("networkPolicy") or "default",
            llm_config=llm_config,
        )
        report = analyze_trace(execution, analysis_mode=request.get("analysisMode") or "rule_plus_epg")
        telemetry_report = build_execution_report(execution)
        risk_profile = map_risk_profile(
            risk_score=report["risk_score"],
            detected_behaviors=report["detected_behaviors"],
        )

        result = {
            "executionId": execution_id,
            "status": "completed",
            "skillPath": execution.skill_path,
            "skillFile": execution.skill_file,
            "sandboxImage": execution.sandbox_image,
            "runtimeName": execution.runtime_name,
            "networkPolicy": request.get("networkPolicy") or "default",
            "analysisMode": request.get("analysisMode") or "rule_plus_epg",
            "exitCode": execution.exit_code,
            "timedOut": execution.timed_out,
            "stdout": execution.stdout,
            "stderr": execution.stderr,
            "traceSummary": report.get("trace_summary", {}),
            "riskScore": report.get("risk_score", 0),
            "riskLevel": risk_profile.get("risk_level", "unknown"),
            "riskLevelName": risk_profile.get("risk_level_name", "未知"),
            "primaryRisk": risk_profile.get("primary_risk", {}),
            "riskLabels": risk_profile.get("risk_labels", []),
            "riskSummary": risk_profile.get("risk_summary", ""),
            "detectedBehaviors": report.get("detected_behaviors", []),
            "evidenceTimeline": report.get("evidence_timeline", []),
            "fileEvents": telemetry_report.get("file_events", []),
            "networkEvents": telemetry_report.get("network_events", []),
            "processEvents": telemetry_report.get("process_events", []),
            "toolCalls": telemetry_report.get("tool_calls", []),
            "llmEvents": telemetry_report.get("llm_events", []),
            "dataFlows": telemetry_report.get("data_flows", []),
            "resourceUsage": execution.resource_usage.to_dict(),
            "primaryChain": report.get("primary_chain", []),
            "rootCause": report.get("root_cause", "unknown"),
            "rootCauseDetail": report.get("root_cause_detail", "unknown"),
            "graphSummary": report.get("graph_summary", {}),
            "finalDecision": report.get("final_decision", "unknown"),
            "triggeredFactors": report.get("triggered_factors", []),
            "suppressionFactors": report.get("suppression_factors", []),
            "decisionEvidence": report.get("decision_evidence", {}),
            "capabilityProfile": report.get("capability_profile", {}),
            "capabilityTags": report.get("capability_tags", []),
            "triggerPlan": report.get("trigger_plan", {}),
            "triggerUsed": report.get("trigger_used", []),
            "triggerHits": report.get("trigger_hits", []),
            "triggerUnexecuted": report.get("trigger_unexecuted", []),
            "severityLabel": report.get("severity_label", ""),
            "evidenceStrength": report.get("evidence_strength", ""),
            "decisionRationale": report.get("decision_rationale", {}),
        }
        print(json.dumps({"ok": True, "result": json_ready(result)}, ensure_ascii=False))
        return 0
    except Exception as exc:
        print(json.dumps({
            "ok": False,
            "message": str(exc),
            "traceback": traceback.format_exc(limit=12),
        }, ensure_ascii=False))
        return 1


def prepare_skill_source(request: dict[str, Any], source_dir: Path) -> Path:
    files = request.get("files") or []
    for item in files:
        name = str(item.get("name") or "upload.bin")
        raw = base64.b64decode(str(item.get("contentBase64") or ""))
        if name.lower().endswith(".zip"):
            zip_path = source_dir / safe_name(name)
            zip_path.write_bytes(raw)
            extract_zip(zip_path, source_dir)
            zip_path.unlink(missing_ok=True)
        else:
            relative = safe_relative_path(str(item.get("relativePath") or name))
            target = source_dir / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(raw)

    source_url = str(request.get("sourceUrl") or "").strip()
    if source_url:
        downloaded = download_source(source_url, source_dir)
        if downloaded.suffix.lower() == ".zip":
            extract_zip(downloaded, source_dir)
            downloaded.unlink(missing_ok=True)
        elif downloaded.suffix.lower() == ".md" and downloaded.name != "SKILL.md":
            target = source_dir / "SKILL.md"
            if not target.exists():
                downloaded.rename(target)

    skill_files = sorted(source_dir.rglob("SKILL.md"))
    if not skill_files:
        markdown_files = sorted(source_dir.rglob("*.md"))
        if len(markdown_files) == 1:
            markdown_files[0].rename(markdown_files[0].parent / "SKILL.md")
            skill_files = [markdown_files[0].parent / "SKILL.md"]

    if len(skill_files) == 1:
        return skill_files[0].parent
    if not skill_files:
        raise ValueError("上传内容中没有找到 SKILL.md，无法进行 ProvLoom 动态沙箱分析。")
    raise ValueError("上传内容包含多个 SKILL.md，请拆分为单个 Skill 后重试。")


def download_source(url: str, source_dir: Path) -> Path:
    if not url.startswith(("http://", "https://")):
        raise ValueError("URL 输入口仅支持 http:// 或 https:// 地址。")
    filename = safe_name(url.rstrip("/").rsplit("/", 1)[-1] or "remote-skill")
    if "." not in filename:
        filename = f"{filename}.md"
    target = source_dir / filename
    request = urllib.request.Request(url, headers={"User-Agent": "ClawGuard-ProvLoom/1.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        with target.open("wb") as output:
            shutil.copyfileobj(response, output, length=1024 * 1024)
    return target


def extract_zip(zip_path: Path, target_dir: Path) -> None:
    with zipfile.ZipFile(zip_path) as archive:
        for member in archive.infolist():
            if member.is_dir():
                continue
            relative = safe_relative_path(member.filename)
            target = target_dir / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            with archive.open(member) as src, target.open("wb") as dst:
                shutil.copyfileobj(src, dst, length=1024 * 1024)


def safe_relative_path(value: str) -> Path:
    clean_parts = []
    for part in Path(value.replace("\\", "/")).parts:
        if part in {"", ".", ".."}:
            continue
        clean_parts.append(safe_name(part))
    if not clean_parts:
        return Path("upload.bin")
    return Path(*clean_parts)


def safe_name(value: str) -> str:
    return "".join(ch if ch.isalnum() or ch in "._- " else "_" for ch in value).strip() or "upload"


def json_ready(value: Any) -> Any:
    if is_dataclass(value):
        return json_ready(asdict(value))
    if isinstance(value, dict):
        return {str(key): json_ready(item) for key, item in value.items()}
    if isinstance(value, (list, tuple, set)):
        return [json_ready(item) for item in value]
    if isinstance(value, Path):
        return str(value)
    return value


if __name__ == "__main__":
    raise SystemExit(main())
