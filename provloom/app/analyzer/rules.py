from __future__ import annotations

import json
from pathlib import Path

from app.analyzer.attack_chain import extract_primary_attack_chain
from app.analyzer.capability_inference import infer_capability_profile
from app.analyzer.dual_axis_decision import infer_dual_axis_decision
from app.analyzer.root_cause_v2 import infer_root_cause_v2
from app.analyzer.decision_engine import evaluate_decision
from app.analyzer.endpoint_semantics import endpoint_semantics, infer_endpoint_kind
from app.backend.schemas import EvidenceEvent
from app.graph.builder import build_execution_provenance_graph
from app.graph.exporter import export_graph
from app.runtime.skill_parser import SkillDefinition, load_skill_definition
from app.runner.models import SandboxExecution
from app.telemetry.normalizer import NormalizedEvent, build_normalized_events, persist_normalized_events
from app.reporting.risk_mapper import map_risk_profile


SENSITIVE_PATH_PREFIXES = [
    "/etc/",
    "/root/",
    "/proc/",
    "/sys/",
    "/var/run/",
]
SYNTHETIC_SENSITIVE_MARKERS = [
    ".provloom/adapters/credential_state/",
    "/.provloom/adapters/credential_state/",
]

NOISY_FILE_PREFIXES = [
    "/usr/local/lib/python",
    "/usr/local/bin/../lib",
    "/usr/lib/locale",
    "/usr/share/locale",
    "/usr/lib/x86_64-linux-gnu/gconv",
    "/lib/x86_64-linux-gnu/",
    "/opt/skill_sandbox/",
    "/artifacts/",
    "/workspace/skill/",
]

NOISY_FILE_PATHS = {
    "/etc/ld.so.cache",
    "/etc/localtime",
    "/usr/lib/ssl/cert.pem",
    "/usr/lib/ssl/openssl.cnf",
    "/usr/local/bin/pyvenv.cfg",
    "/usr/local/pyvenv.cfg",
    "/usr/local/bin/pybuilddir.txt",
    "/etc/nsswitch.conf",
    "/etc/host.conf",
    "/etc/resolv.conf",
    "/etc/gai.conf",
    "/proc/self/fd",
}

NETWORK_UNKNOWN = "unknown"


def analyze_trace(execution: SandboxExecution, analysis_mode: str = "rule_plus_epg") -> dict:
    skill_definition = _load_dynamic_skill_definition(execution)
    capability_profile = infer_capability_profile(
        skill_root=execution.skill_path,
        skill_file=execution.skill_file,
        skill_definition=skill_definition,
    )
    normalized_events = build_normalized_events(execution)
    interesting_files = _interesting_file_events(execution.file_events)
    interesting_network = _interesting_network_events(execution.network_events)
    interesting_processes = _interesting_process_events(execution.process_events)

    detected: set[str] = set()

    if interesting_network:
        detected.add("network_access")

    if _has_external_http_tool_call(execution.tool_calls):
        detected.add("network_access")

    if any(event.command in {"/bin/sh", "/usr/bin/sh", "/bin/bash", "/usr/bin/bash"} for event in interesting_processes):
        detected.add("shell_execution")

    if interesting_processes:
        detected.add("process_spawn")

    write_events = [event for event in interesting_files if event.action in {"write", "create", "delete_or_rename"}]
    if write_events:
        detected.add("file_write")

    if _has_sensitive_source_evidence(execution, interesting_files, skill_definition):
        detected.add("sensitive_file_read")

    if _has_read_then_exfiltration(execution, interesting_files, interesting_network, skill_definition):
        detected.add("read_then_exfiltration")

    if execution.timed_out:
        detected.add("execution_timeout")

    result = {
        "risk_score": 0,
        "detected_behaviors": sorted(detected),
        "analysis_mode": analysis_mode,
        "trace_summary": {
            "file_event_count": len(interesting_files),
            "network_event_count": len(interesting_network),
            "process_event_count": len(interesting_processes),
            "tool_call_count": len(execution.tool_calls),
            "llm_event_count": len(execution.llm_events),
            "stdout_line_count": len([line for line in execution.stdout.splitlines() if line.strip()]),
            "stderr_line_count": len([line for line in execution.stderr.splitlines() if line.strip()]),
        },
        "evidence_timeline": [
            EvidenceEvent(**item)
            for item in _filtered_timeline(execution, interesting_files, interesting_network, interesting_processes)
        ],
        "primary_chain": [],
        "root_cause": "unknown",
        "root_cause_detail": "unknown",
        "root_cause_v2": {},
        "root_cause_evidence": {},
        "graph_summary": {},
        "final_decision": "benign",
        "triggered_factors": [],
        "suppression_factors": [],
        "decision_evidence": {},
        "source_assessment": {},
        "sink_assessment": {},
        "capability_profile": capability_profile.to_dict(),
        "capability_tags": capability_profile.capability_tags,
        "recommended_execution_profile": capability_profile.recommended_profile,
        "recommended_trigger_mode": capability_profile.recommended_trigger_mode,
        "estimated_budget_class": capability_profile.estimated_budget_class,
        "execution_feasibility": capability_profile.execution_feasibility,
        "blocking_requirements": capability_profile.blocking_requirements,
        "enabled_adapters": list(execution.enabled_adapters),
        "adapter_events_summary": dict(execution.adapter_events_summary or {}),
        "synthetic_artifact_summary": dict(execution.synthetic_artifact_summary or {}),
        "trigger_plan": dict(execution.trigger_plan or {}),
        "trigger_used": list(execution.trigger_used or []),
        "trigger_hits": list(execution.trigger_hits or []),
        "trigger_unexecuted": list(execution.trigger_unexecuted or []),
        "trigger_events_summary": dict(execution.trigger_events_summary or {}),
    }
    if analysis_mode in {"rule_plus_epg", "epg_without_filtering", "epg_with_filtering"}:
        _augment_with_epg(
            execution,
            result,
            normalized_events=normalized_events,
            filter_noise=analysis_mode == "epg_with_filtering",
        )

    decision = evaluate_decision(
        detected_behaviors=result["detected_behaviors"],
        normalized_events=[event.to_dict() for event in normalized_events],
        primary_chain=result["primary_chain"],
        graph_summary=result["graph_summary"],
        skill_definition=skill_definition,
        tool_calls=execution.tool_calls,
        file_events=interesting_files,
        network_events=interesting_network,
        llm_events=execution.llm_events,
    )
    result["risk_score"] = decision.risk_score
    result["final_decision"] = decision.final_decision.value
    result["triggered_factors"] = [factor.to_dict() for factor in decision.triggered_factors]
    result["suppression_factors"] = [factor.to_dict() for factor in decision.suppression_factors]
    result["decision_evidence"] = decision.evidence_bundle
    result["source_assessment"] = decision.evidence_bundle.get("source_assessment", {})
    result["sink_assessment"] = decision.evidence_bundle.get("sink_assessment", {})

    legacy_profile = map_risk_profile(
        risk_score=int(result["risk_score"]),
        detected_behaviors=list(result.get("detected_behaviors", [])),
    )
    dual_axis = infer_dual_axis_decision(
        risk_score=int(result["risk_score"]),
        risk_level=str(legacy_profile.get("risk_level", "unknown")),
        detected_behaviors=list(result.get("detected_behaviors", [])),
        source_assessment=result.get("source_assessment", {}),
        sink_assessment=result.get("sink_assessment", {}),
        primary_chain=result.get("primary_chain", []),
        trigger_used=list(result.get("trigger_used", [])),
        trigger_hits=list(result.get("trigger_hits", [])),
        enabled_adapters=list(result.get("enabled_adapters", [])),
        execution_outcome=str(result.get("execution_outcome", "")),
        skip_category=str(result.get("skip_category", "")),
        llm_involved=bool(execution.llm_events),
    )
    result.update(dual_axis)

    detail = _infer_root_cause_detail(
        execution,
        result["detected_behaviors"],
        primary_chain=result["primary_chain"],
        source_assessment=result["source_assessment"],
        sink_assessment=result["sink_assessment"],
        skill_definition=skill_definition,
    )
    result["root_cause_detail"] = detail
    result["root_cause"] = _to_coarse_root_cause(detail)
    result["root_cause_evidence"] = _build_root_cause_evidence(
        execution=execution,
        root_cause_detail=detail,
        primary_chain=result["primary_chain"],
        graph_nodes=[],
        graph_edges=[],
    )
    result["root_cause_v2"] = infer_root_cause_v2(
        legacy_root_cause=result["root_cause"],
        legacy_root_cause_detail=result["root_cause_detail"],
        detected_behaviors=result["detected_behaviors"],
        source_assessment=result.get("source_assessment", {}),
        sink_assessment=result.get("sink_assessment", {}),
        primary_chain=result.get("primary_chain", []),
        root_cause_evidence=result.get("root_cause_evidence", {}),
        execution_outcome=str(result.get("execution_outcome", "completed_full")),
        skip_category=result.get("skip_category"),
        trigger_used=list(result.get("trigger_used", [])),
        trigger_hits=list(result.get("trigger_hits", [])),
        enabled_adapters=list(result.get("enabled_adapters", [])),
        llm_involved=bool(execution.llm_events),
        analysis_mode=analysis_mode,
    )
    return result


def analyze_static_skill(skill_definition, analysis_mode: str = "static_only") -> dict:
    """Simplified static-only analyzer for ablation mode."""
    capability_profile = infer_capability_profile(
        skill_root=skill_definition.skill_root,
        skill_file=skill_definition.skill_file,
        skill_definition=skill_definition,
    )

    detected: set[str] = set()
    for action in skill_definition.actions:
        if action.type == "http_request":
            detected.add("network_access")
        if action.type == "run_command":
            detected.add("process_spawn")
        if action.type == "write_file":
            detected.add("file_write")
        if action.type == "read_file":
            path = str(action.config.get("path", ""))
            if _is_sensitive_path(path):
                detected.add("sensitive_file_read")
    if {"sensitive_file_read", "network_access"} <= detected:
        detected.add("read_then_exfiltration")

    score = min(100, len(detected) * 20)
    timeline = []
    for action in skill_definition.actions:
        timeline.append(
            EvidenceEvent(
                timestamp="static",
                category="static_action",
                action=action.type,
                detail=f"{action.id}: {action.type}",
                metadata={"action_id": action.id, "config": action.config},
            )
        )
    primary_chain: list[dict] = []
    if {"sensitive_file_read", "network_access"} <= detected:
        source_path = next(
            (str(action.config.get("path", "")) for action in skill_definition.actions if action.type == "read_file"),
            "unknown",
        )
        sink_url = next(
            (str(action.config.get("url", "")) for action in skill_definition.actions if action.type == "http_request"),
            "unknown",
        )
        endpoint_kind = infer_endpoint_kind(label=sink_url, host=None, source="static_http_request")
        sink_meta = endpoint_semantics(label=sink_url, host=None, endpoint_kind=endpoint_kind)
        primary_chain = [{
            "node_id": f"file:{source_path}",
            "node_type": "file",
            "label": source_path,
            "edge_type": None,
            "completeness": "partial",
            "role": "source",
        }]
        primary_chain.append(
            {
                "node_id": f"network:{sink_url}",
                "node_type": "network_endpoint",
                "label": sink_url,
                "edge_type": "flows_to",
                "completeness": "partial",
                "role": sink_meta["endpoint_role"],
                **sink_meta,
            }
        )
        if sink_meta["endpoint_role"] == "relay" and sink_meta["is_llm_provider"]:
            primary_chain.append(
                {
                    "node_id": f"network:unknown-via:network:{sink_url}",
                    "node_type": "network_endpoint",
                    "label": "unknown",
                    "edge_type": "llm_mediated",
                    "completeness": "partial",
                    "role": "sink",
                    "endpoint_role": "sink",
                    "is_llm_provider": False,
                    "llm_provider_name": "unknown",
                    "sink_resolution_status": "llm-mediated",
                    "llm_relay": False,
                    "relay_label": sink_url,
                    "relay_llm_provider_name": sink_meta["llm_provider_name"],
                    "relay_node_id": f"network:{sink_url}",
                }
            )

    graph_export = _build_static_graph(skill_definition, primary_chain)
    root_cause_detail = _infer_static_root_cause_detail(skill_definition, sorted(detected), primary_chain)
    root_cause = _to_coarse_root_cause(root_cause_detail)
    root_cause_evidence = _build_static_root_cause_evidence(skill_definition, root_cause_detail, primary_chain)
    root_cause_v2 = infer_root_cause_v2(
        legacy_root_cause=root_cause,
        legacy_root_cause_detail=root_cause_detail,
        detected_behaviors=sorted(detected),
        source_assessment={},
        sink_assessment={},
        primary_chain=primary_chain,
        root_cause_evidence=root_cause_evidence,
        execution_outcome="completed_full",
        skip_category=None,
        trigger_used=[],
        trigger_hits=[],
        enabled_adapters=[],
        llm_involved=skill_definition.runtime in {"deepseek-agent", "llm-agent", "llm-native"},
        analysis_mode=analysis_mode,
    )

    return {
        "risk_score": score,
        "detected_behaviors": sorted(detected),
        "analysis_mode": analysis_mode,
        "trace_summary": {
            "file_event_count": 0,
            "network_event_count": 0,
            "process_event_count": 0,
            "tool_call_count": len(skill_definition.actions),
            "llm_event_count": 0,
            "stdout_line_count": 0,
            "stderr_line_count": 0,
        },
        "evidence_timeline": timeline,
        "primary_chain": primary_chain,
        "root_cause": root_cause,
        "root_cause_detail": root_cause_detail,
        "root_cause_v2": root_cause_v2,
        "root_cause_evidence": root_cause_evidence,
        "graph_summary": graph_export["summary"],
        "graph_export": graph_export,
        "capability_profile": capability_profile.to_dict(),
        "capability_tags": capability_profile.capability_tags,
        "recommended_execution_profile": capability_profile.recommended_profile,
        "recommended_trigger_mode": capability_profile.recommended_trigger_mode,
        "estimated_budget_class": capability_profile.estimated_budget_class,
        "execution_feasibility": capability_profile.execution_feasibility,
        "blocking_requirements": capability_profile.blocking_requirements,
        "enabled_adapters": [],
        "adapter_events_summary": {},
        "synthetic_artifact_summary": {},
        "trigger_plan": {},
        "trigger_used": [],
        "trigger_hits": [],
        "trigger_unexecuted": [],
        "trigger_events_summary": {},
        "execution_outcome": "completed_full",
        "skip_category": None,
        "skip_explanation": None,
        "partial_evidence": None,
        "profile_promotion_recommended": None,
        "severity_label": "weakly_suspicious" if score >= 20 else "benign_like",
        "evidence_strength": "speculative",
        "decision_rationale": {
            "severity_factors": ["static_only_estimation"],
            "evidence_factors": ["static_analysis_without_runtime_trace"],
            "uncertainty_factors": ["runtime_trace_not_available"],
            "legacy_risk": {
                "risk_score": score,
                "risk_level": map_risk_profile(risk_score=score, detected_behaviors=sorted(detected)).get("risk_level", "unknown"),
            },
            "observability_context": {
                "trigger_used_count": 0,
                "trigger_hit_count": 0,
                "enabled_adapter_count": 0,
                "execution_outcome": "completed_full",
                "skip_category": None,
            },
        },
    }


def _is_sensitive_path(path: str) -> bool:
    return any(path.startswith(prefix) for prefix in SENSITIVE_PATH_PREFIXES) or any(
        marker in path for marker in SYNTHETIC_SENSITIVE_MARKERS
    )


def _load_dynamic_skill_definition(execution: SandboxExecution) -> SkillDefinition | None:
    try:
        return load_skill_definition(execution.skill_path, execution.skill_file, allow_empty_actions=True)
    except Exception:
        return None


def _has_sensitive_source_evidence(
    execution: SandboxExecution,
    files,
    skill_definition: SkillDefinition | None,
) -> bool:
    return any(_is_sensitive_file_event(event.path, execution, skill_definition) for event in files)


def _is_sensitive_file_event(
    path: str,
    execution: SandboxExecution,
    skill_definition: SkillDefinition | None,
) -> bool:
    if not _is_sensitive_path(path):
        return False
    if any(
        event.event == "start"
        and event.tool_type == "read_file"
        and str(event.metadata.get("config", {}).get("path", "")) == path
        for event in execution.tool_calls
    ):
        return True
    if skill_definition is not None:
        for action in skill_definition.actions:
            if action.type == "read_file" and str(action.config.get("path", "")) == path:
                return True
            if action.type == "run_command" and path in str(action.config.get("command", "")):
                return True
    return False


def _has_risky_command_definition(
    skill_definition: SkillDefinition | None,
    execution: SandboxExecution | None,
) -> bool:
    if skill_definition is not None:
        for action in skill_definition.actions:
            if action.type != "run_command":
                continue
            command = str(action.config.get("command", ""))
            if "{{ input_payload." in command or "{{input_payload." in command:
                return True
            if bool(action.config.get("shell")) and any(token in command for token in ["|", ";", "$(", "`", "&&"]):
                return True
            if any(path in command for path in ["/etc/passwd", "/etc/shadow", "/etc/hosts", "/root/"]):
                return True
    if execution is None:
        return False
    return any(
        event.event == "start"
        and event.tool_type == "run_command"
        and bool(event.metadata.get("config", {}).get("shell"))
        and any(
            token in str(event.metadata.get("config", {}).get("command", ""))
            for token in ["|", ";", "$(", "`", "&&"]
        )
        for event in execution.tool_calls
    )


def _interesting_file_events(events):
    filtered = []
    seen: set[tuple[str, str]] = set()
    for event in events:
        if _is_noisy_file_event(event.path):
            continue
        key = (event.action, event.path)
        if key in seen:
            continue
        seen.add(key)
        filtered.append(event)
    return filtered


def _interesting_network_events(events):
    filtered = []
    seen: set[tuple[str, str]] = set()
    for event in events:
        if _is_llm_provider_relay_event(event):
            continue
        label = _network_event_label(event)
        if label == NETWORK_UNKNOWN:
            continue
        key = (event.action, label)
        if key in seen:
            continue
        seen.add(key)
        filtered.append(event)
    return filtered


def _has_external_http_tool_call(tool_calls) -> bool:
    for event in tool_calls:
        if getattr(event, "event", "") != "start" or getattr(event, "tool_type", "") != "http_request":
            continue
        config = getattr(event, "metadata", {}).get("config", {})
        url = str(config.get("url", "")).strip().lower()
        if url.startswith(("http://", "https://")) and "localhost" not in url and "127.0.0.1" not in url:
            return True
    return False


def _is_llm_provider_relay_event(event) -> bool:
    return (
        getattr(event, "is_llm_provider", False) is True
        or getattr(event, "endpoint_role", "") == "relay"
        or getattr(event, "endpoint_kind", "") == "model_api"
        or getattr(event, "endpoint_source", "") == "llm_base_url"
    )


def _interesting_process_events(events):
    filtered = []
    seen_commands: set[str] = set()
    for event in events:
        if event.action != "execve":
            continue
        if event.command in {"/usr/local/bin/python", "python", "python3"}:
            continue
        if event.command == "unknown":
            continue
        if event.command in seen_commands:
            continue
        seen_commands.add(event.command)
        filtered.append(event)
    return filtered


def _filtered_timeline(execution: SandboxExecution, files, network, processes):
    timeline = []
    for event in files:
        timeline.append(
            {
                "timestamp": event.timestamp,
                "category": "file",
                "action": event.action,
                "detail": f"{event.action} {event.path}",
                "metadata": {"path": event.path, "pid": event.pid},
            }
        )
    for event in network:
        label = _network_event_label(event)
        timeline.append(
            {
                "timestamp": event.timestamp,
                "category": "network",
                "action": event.action,
                "detail": f"{event.action} {label}",
                "metadata": {
                    "address": event.address,
                    "display_label": getattr(event, "display_label", None),
                    "endpoint_kind": getattr(event, "endpoint_kind", None),
                    "pid": event.pid,
                },
            }
        )
    for event in processes:
        timeline.append(
            {
                "timestamp": event.timestamp,
                "category": "process",
                "action": event.action,
                "detail": f"{event.action} {event.command}",
                "metadata": {"command": event.command, "pid": event.pid},
            }
        )
    for event in execution.tool_calls:
        timeline.append(
            {
                "timestamp": event.timestamp,
                "category": "tool_call",
                "action": event.event,
                "detail": f"{event.event} {event.tool_name} ({event.tool_type})",
                "metadata": {
                    "tool_id": event.tool_id,
                    "tool_name": event.tool_name,
                    "tool_type": event.tool_type,
                    "status": event.status,
                },
            }
        )
    for event in execution.llm_events:
        timeline.append(
            {
                "timestamp": event.timestamp,
                "category": "llm",
                "action": event.event,
                "detail": f"{event.event} llm",
                "metadata": event.metadata,
            }
        )
    for event in execution.data_flows:
        timeline.append(
            {
                "timestamp": event.timestamp,
                "category": "data_flow",
                "action": "source_to_sink",
                "detail": f"{event.source_detail} -> {event.sink_detail}",
                "metadata": event.to_dict(),
            }
        )
    timeline.sort(key=lambda item: item["timestamp"])
    return timeline


def _is_noisy_file_event(path: str) -> bool:
    if not path:
        return True
    if path in NOISY_FILE_PATHS:
        return True
    if any(path.startswith(prefix) for prefix in NOISY_FILE_PREFIXES):
        return True
    return False


def _has_read_then_exfiltration(
    execution: SandboxExecution,
    files,
    network,
    skill_definition: SkillDefinition | None,
) -> bool:
    sensitive_reads = [event for event in files if _is_sensitive_file_event(event.path, execution, skill_definition)]
    if not sensitive_reads or not network:
        return False
    first_read = min(event.timestamp for event in sensitive_reads)
    first_network = min(event.timestamp for event in network)
    return first_read <= first_network


def _augment_with_epg(
    execution: SandboxExecution,
    result: dict,
    *,
    normalized_events: list[NormalizedEvent],
    filter_noise: bool,
) -> None:
    telemetry_report = {
        "file_events": [event.to_dict() for event in execution.file_events],
        "network_events": [event.to_dict() for event in execution.network_events],
        "process_events": [event.to_dict() for event in execution.process_events],
        "tool_calls": [event.to_dict() for event in execution.tool_calls],
        "llm_events": [event.to_dict() for event in execution.llm_events],
        "data_flows": [event.to_dict() for event in execution.data_flows],
    }
    normalized_path = persist_normalized_events(execution.artifacts_dir, normalized_events)
    graph = build_execution_provenance_graph(
        execution_id=execution.execution_id,
        normalized_events_path=normalized_path,
        telemetry_report=telemetry_report,
    )
    export_graph(graph, Path(execution.artifacts_dir) / "epg.json")
    primary_chain = extract_primary_attack_chain(
        graph,
        result["detected_behaviors"],
        filter_noise=filter_noise,
    )
    _write_json_artifact(Path(execution.artifacts_dir) / "attack-chain.json", primary_chain)
    result["primary_chain"] = primary_chain
    result["graph_summary"] = graph.to_dict()["summary"]


def _infer_root_cause_detail(
    execution: SandboxExecution,
    detected_behaviors: list[str],
    primary_chain: list[dict],
    source_assessment: dict | None = None,
    sink_assessment: dict | None = None,
    skill_definition: SkillDefinition | None = None,
) -> str:
    if any(_looks_like_prompt_injection(event.metadata) for event in execution.llm_events):
        return "prompt_injection_suspected"
    if execution.llm_events and (primary_chain or "network_access" in detected_behaviors):
        return "llm_decision_induced_action"
    if _has_risky_command_definition(skill_definition, execution):
        return "unsafe_command_construction"
    source_assessment = source_assessment or {}
    sink_assessment = sink_assessment or {}
    primary_source_label = str(primary_chain[0].get("label", "")) if primary_chain else str(source_assessment.get("label", ""))
    if (
        (primary_chain or source_assessment)
        and _looks_like_generated_artifact(primary_source_label)
        and any(
            event.tool_type == "http_request"
            for event in execution.tool_calls
            if event.event == "start"
        )
        and source_assessment.get("from_public_lineage") is not True
    ):
        return "overprivileged_tool_use"
    if (
        (primary_chain or "read_then_exfiltration" in detected_behaviors)
        and source_assessment.get("sensitivity") != "LOW_SENSITIVITY"
        and sink_assessment.get("semantics") != "PUBLIC_FETCH_ONLY"
    ):
        return "unsafe_dataflow_design"
    if any(
        event.tool_type == "http_request"
        for event in execution.tool_calls
        if event.event == "start"
    ) and source_assessment.get("sensitivity") in {"HIGH_SENSITIVITY", "MEDIUM_SENSITIVITY"}:
        return "overprivileged_tool_use"
    return "unknown"


def _infer_static_root_cause_detail(skill_definition, detected_behaviors: list[str], primary_chain: list[dict]) -> str:
    markdown = skill_definition.raw_markdown.lower()
    if any(token in markdown for token in ["ignore previous", "system prompt", "developer message"]):
        return "prompt_injection_suspected"
    if skill_definition.runtime in {"deepseek-agent", "llm-agent", "llm-native"} and detected_behaviors:
        return "llm_decision_induced_action"
    if _has_risky_command_definition(skill_definition, execution=None):
        return "unsafe_command_construction"
    primary_source_label = str(primary_chain[0].get("label", "")) if primary_chain else ""
    if primary_chain and _looks_like_generated_artifact(primary_source_label):
        return "overprivileged_tool_use"
    if primary_chain or "read_then_exfiltration" in detected_behaviors:
        return "unsafe_dataflow_design"
    if any(action.type == "http_request" for action in skill_definition.actions):
        return "overprivileged_tool_use"
    return "unknown"


def _build_root_cause_evidence(
    execution: SandboxExecution,
    root_cause_detail: str,
    primary_chain: list[dict],
    graph_nodes: list[dict],
    graph_edges: list[dict],
) -> dict:
    tool_refs = [
        {
            "tool_id": event.tool_id,
            "tool_name": event.tool_name,
            "tool_type": event.tool_type,
            "timestamp": event.timestamp,
        }
        for event in execution.tool_calls
        if event.event == "start"
    ]
    llm_refs = [
        {
            "event": event.event,
            "step_id": event.step_id,
            "timestamp": event.timestamp,
            "metadata": event.metadata,
        }
        for event in execution.llm_events
    ]
    telemetry_refs = {
        "file_events": [
            {"path": event.path, "action": event.action, "timestamp": event.timestamp}
            for event in execution.file_events
            if not _is_noisy_file_event(event.path)
        ],
        "network_events": [
            {
                "address": event.address,
                "display_label": getattr(event, "display_label", None),
                "action": event.action,
                "timestamp": event.timestamp,
            }
            for event in execution.network_events
            if _network_event_label(event) != NETWORK_UNKNOWN
        ],
        "process_events": [
            {"command": event.command, "action": event.action, "timestamp": event.timestamp}
            for event in execution.process_events
            if event.action == "execve" and event.command != "unknown"
        ],
    }
    chain_node_ids = [node["node_id"] for node in primary_chain]
    chain_edges = _chain_edges_from_primary_chain(primary_chain)

    evidence = {
        "summary": "",
        "tool_refs": tool_refs,
        "llm_refs": llm_refs,
        "telemetry_refs": telemetry_refs,
        "graph_node_ids": chain_node_ids,
        "graph_edge_refs": chain_edges,
    }

    if root_cause_detail == "unsafe_command_construction":
        suspicious_tools = [
            tool
            for tool in tool_refs
            if tool["tool_type"] == "run_command"
        ]
        evidence["summary"] = "Shell-backed command construction is supported by run_command tool steps and matching execve telemetry."
        evidence["tool_refs"] = suspicious_tools
        evidence["graph_node_ids"] = [node["node_id"] for node in graph_nodes if node["node_id"].startswith("tool:")]
    elif root_cause_detail == "unsafe_dataflow_design":
        evidence["summary"] = "The primary chain, file/network telemetry, and connected graph nodes support a source-to-sink dataflow design risk."
    elif root_cause_detail == "overprivileged_tool_use":
        http_tools = [tool for tool in tool_refs if tool["tool_type"] == "http_request"]
        evidence["summary"] = "An outward-facing http_request tool is backed by local artifact handling and network telemetry."
        evidence["tool_refs"] = http_tools
    elif root_cause_detail == "llm_decision_induced_action":
        evidence["summary"] = "LLM steps and the downstream tool invocation jointly support an LLM-induced unsafe action."
        evidence["tool_refs"] = [tool for tool in tool_refs if tool["tool_type"] in {"http_request", "read_file", "run_command"}]
    elif root_cause_detail == "prompt_injection_suspected":
        evidence["summary"] = "Prompt-like instruction markers in LLM events are paired with downstream risky tool choices."
    else:
        evidence["summary"] = "No strong supporting evidence bundle was isolated for this label."

    if not evidence["graph_edge_refs"] and len(chain_node_ids) >= 2:
        evidence["graph_edge_refs"] = [
            {"source_node_id": chain_node_ids[index], "target_node_id": chain_node_ids[index + 1]}
            for index in range(len(chain_node_ids) - 1)
        ]
    return evidence


def _build_static_root_cause_evidence(skill_definition, root_cause_detail: str, primary_chain: list[dict]) -> dict:
    tool_refs = [
        {
            "tool_id": action.id,
            "tool_name": action.name,
            "tool_type": action.type,
        }
        for action in skill_definition.actions
    ]
    llm_refs = [{"runtime": skill_definition.runtime}] if skill_definition.runtime in {"deepseek-agent", "llm-agent", "llm-native"} else []
    evidence = {
        "summary": "Static attribution is backed by declared actions and the abstract chain projection.",
        "tool_refs": tool_refs,
        "llm_refs": llm_refs,
        "telemetry_refs": {},
        "graph_node_ids": [node["node_id"] for node in primary_chain],
        "graph_edge_refs": _chain_edges_from_primary_chain(primary_chain),
    }
    if root_cause_detail == "prompt_injection_suspected":
        evidence["summary"] = "Static attribution is backed by prompt-injection markers in the skill markdown plus the declared action graph."
    elif root_cause_detail == "llm_decision_induced_action":
        evidence["summary"] = "Static attribution is backed by an LLM-native runtime declaration plus the downstream tool graph."
    elif root_cause_detail == "unsafe_command_construction":
        evidence["summary"] = "Static attribution is backed by shell-enabled run_command declarations."
    elif root_cause_detail == "overprivileged_tool_use":
        evidence["summary"] = "Static attribution is backed by outward http_request declarations over locally produced artifacts."
    return evidence


def _chain_edges_from_primary_chain(primary_chain: list[dict]) -> list[dict]:
    return [
        {
            "source_node_id": primary_chain[index]["node_id"],
            "target_node_id": primary_chain[index + 1]["node_id"],
        }
        for index in range(len(primary_chain) - 1)
    ]


def _looks_like_generated_artifact(path: str) -> bool:
    if not path:
        return False
    return path.startswith("runtime_output/") or (not path.startswith("/") and not path.startswith("public/"))


def _network_event_label(event) -> str:
    return str(
        getattr(event, "sink_display_label", None)
        or getattr(event, "display_label", None)
        or getattr(event, "address", NETWORK_UNKNOWN)
        or NETWORK_UNKNOWN
    )


def _to_coarse_root_cause(root_cause_detail: str) -> str:
    mapping = {
        "unsafe_dataflow_design": "skill_design",
        "unsafe_command_construction": "skill_design",
        "overprivileged_tool_use": "skill_design",
        "llm_decision_induced_action": "llm_decision",
        "prompt_injection_suspected": "prompt_injection_suspected",
        "unknown": "unknown",
    }
    return mapping.get(root_cause_detail, "unknown")


def _build_static_graph(skill_definition, primary_chain: list[dict]) -> dict:
    """Build a minimal abstract graph so static outputs share stable graph semantics."""

    node_types: dict[str, int] = {"tool_call": len(skill_definition.actions)}
    edge_types: dict[str, int] = {}
    nodes: list[dict] = []
    edges: list[dict] = []

    for action in skill_definition.actions:
        nodes.append({
            "node_id": f"tool:{action.id}",
            "node_type": "tool_call",
            "label": action.name,
            "metadata": {"tool_id": action.id, "tool_type": action.type},
        })
        if action.type in {"read_file", "write_file"} and action.config.get("path"):
            path = str(action.config["path"])
            nodes.append({
                "node_id": f"file:{path}",
                "node_type": "file",
                "label": path,
                "metadata": {"path": path},
            })
            node_types["file"] = node_types.get("file", 0) + 1
            edge_label = "reads" if action.type == "read_file" else "writes"
            edge_types[edge_label] = edge_types.get(edge_label, 0) + 1
            edges.append({
                "edge_id": f"edge-tool-{action.id}-{path}",
                "edge_type": edge_label,
                "source_node_id": f"tool:{action.id}",
                "target_node_id": f"file:{path}",
                "metadata": {"via": "static_action"},
            })
        if action.type == "http_request" and action.config.get("url"):
            url = str(action.config["url"])
            endpoint_kind = infer_endpoint_kind(label=url, host=None, source="static_http_request")
            nodes.append({
                "node_id": f"network:{url}",
                "node_type": "network_endpoint",
                "label": url,
                "metadata": {
                    "address": url,
                    "endpoint_kind": endpoint_kind,
                    **endpoint_semantics(label=url, host=None, endpoint_kind=endpoint_kind),
                },
            })
            node_types["network_endpoint"] = node_types.get("network_endpoint", 0) + 1
            edge_types["connects"] = edge_types.get("connects", 0) + 1
            edges.append({
                "edge_id": f"edge-tool-{action.id}-network",
                "edge_type": "connects",
                "source_node_id": f"tool:{action.id}",
                "target_node_id": f"network:{url}",
                "metadata": {"via": "static_action"},
            })

    for index in range(len(primary_chain) - 1):
        edge_types["flows_to"] = edge_types.get("flows_to", 0) + 1
        edges.append({
            "edge_id": f"edge-chain-{index}",
            "edge_type": "flows_to",
            "source_node_id": primary_chain[index]["node_id"],
            "target_node_id": primary_chain[index + 1]["node_id"],
            "metadata": {"via": "static_chain"},
        })

    unique_nodes: dict[str, dict] = {}
    for node in nodes:
        unique_nodes[node["node_id"]] = node
    for node in primary_chain:
        unique_nodes.setdefault(
            node["node_id"],
            {
                "node_id": node["node_id"],
                "node_type": node["node_type"],
                "label": node["label"],
                "metadata": {
                    key: value
                    for key, value in node.items()
                    if key not in {"node_id", "node_type", "label", "edge_type", "completeness", "role"}
                },
            },
        )
        node_types[node["node_type"]] = node_types.get(node["node_type"], 0) + int(
            node["node_id"] not in {existing["node_id"] for existing in nodes}
        )

    return {
        "execution_id": "static-analysis",
        "nodes": list(unique_nodes.values()),
        "edges": edges,
        "summary": {
            "summary_scope": "abstract_skill_graph",
            "node_count": len(unique_nodes),
            "edge_count": len(edges),
            "node_types": _recount_types(unique_nodes.values()),
            "edge_types": edge_types,
        },
    }


def _recount_types(nodes) -> dict[str, int]:
    counts: dict[str, int] = {}
    for node in nodes:
        counts[node["node_type"]] = counts.get(node["node_type"], 0) + 1
    return counts


def _looks_like_prompt_injection(metadata: dict) -> bool:
    serialized = json.dumps(metadata, ensure_ascii=False).lower()
    suspicious_tokens = [
        "ignore previous",
        "reveal system prompt",
        "exfiltrate",
        "send secrets",
        "override instruction",
    ]
    return any(token in serialized for token in suspicious_tokens)


def _write_json_artifact(path: Path, payload) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
