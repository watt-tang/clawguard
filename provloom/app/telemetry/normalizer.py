from __future__ import annotations

import json
import uuid
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any

from app.analyzer.network_sink_resolution import (
    candidate_from_domain,
    candidate_from_network_event,
    candidate_from_url,
    event_metadata_from_resolution,
    extract_network_candidates_from_text,
    resolve_best_network_sink,
)
from app.runner.models import DataFlowEvent, FileEvent, LLMEvent, NetworkEvent, ProcessEvent, SandboxExecution, ToolCallEvent


@dataclass
class NormalizedEvent:
    """Canonical telemetry event used across runtime, graphing, and benchmarking."""

    event_id: str
    timestamp: str
    execution_id: str
    step_id: str | None
    event_type: str
    source: str
    parent_event_id: str | None
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def build_normalized_events(execution: SandboxExecution) -> list[NormalizedEvent]:
    """Normalize heterogeneous telemetry into a stable event stream."""

    _enrich_network_events(execution)
    events: list[NormalizedEvent] = []
    llm_events = _normalize_llm_events(execution)
    tool_events = _normalize_tool_events(execution, llm_events)
    process_events = _normalize_process_events(execution, tool_events, llm_events)
    file_events = _normalize_file_events(execution, tool_events, llm_events)
    network_events = _normalize_network_events(execution, tool_events, llm_events)
    data_flow_events = _normalize_data_flow_events(execution, file_events, network_events)

    for group in (llm_events, tool_events, process_events, file_events, network_events, data_flow_events):
        events.extend(group)

    events.sort(key=lambda item: (item.timestamp, item.event_id))
    return events


def persist_normalized_events(artifacts_dir: str | Path, events: list[NormalizedEvent]) -> Path:
    target = Path(artifacts_dir) / "normalized-events.jsonl"
    with target.open("w", encoding="utf-8") as handle:
        for event in events:
            handle.write(json.dumps(event.to_dict(), ensure_ascii=False) + "\n")
    return target


def load_normalized_events(path: str | Path) -> list[NormalizedEvent]:
    target = Path(path)
    if not target.exists():
        return []
    events: list[NormalizedEvent] = []
    for raw_line in target.read_text(encoding="utf-8", errors="replace").splitlines():
        if not raw_line.strip():
            continue
        events.append(NormalizedEvent(**json.loads(raw_line)))
    return events


def _normalize_llm_events(execution: SandboxExecution) -> list[NormalizedEvent]:
    normalized: list[NormalizedEvent] = []
    previous_event_id: str | None = None
    last_request_event_id_by_step: dict[str, str] = {}
    for event in execution.llm_events:
        step_id = event.step_id or _derive_step_id(event.metadata.get("step"))
        event_id = event.event_id or _event_id("llm")
        parent_event_id = event.parent_event_id
        if parent_event_id is None and event.event == "response" and step_id:
            parent_event_id = last_request_event_id_by_step.get(step_id)
        elif parent_event_id is None:
            parent_event_id = previous_event_id

        normalized_event = NormalizedEvent(
            event_id=event_id,
            timestamp=event.timestamp,
            execution_id=execution.execution_id,
            step_id=step_id,
            event_type="llm_step",
            source=event.source,
            parent_event_id=parent_event_id,
            metadata={
                "event": event.event,
                **event.metadata,
            },
        )
        event.event_id = event_id
        event.parent_event_id = parent_event_id
        event.step_id = step_id
        normalized.append(normalized_event)
        previous_event_id = event_id
        if event.event == "request" and step_id:
            last_request_event_id_by_step[step_id] = event_id
    return normalized


def _normalize_tool_events(
    execution: SandboxExecution,
    llm_events: list[NormalizedEvent],
) -> list[NormalizedEvent]:
    normalized: list[NormalizedEvent] = []
    llm_request_by_step = {
        event.step_id: event.event_id
        for event in llm_events
        if event.metadata.get("event") == "request" and event.step_id
    }
    last_start_by_tool: dict[tuple[str, str | None], str] = {}
    for event in execution.tool_calls:
        step_id = event.step_id or _derive_step_id(event.metadata.get("step"))
        event_id = event.event_id or _event_id("tool")
        parent_event_id = event.parent_event_id
        tool_key = (event.tool_id, step_id)
        if parent_event_id is None and event.event == "finish":
            parent_event_id = last_start_by_tool.get(tool_key)
        if parent_event_id is None and step_id:
            parent_event_id = llm_request_by_step.get(step_id)

        normalized_event = NormalizedEvent(
            event_id=event_id,
            timestamp=event.timestamp,
            execution_id=execution.execution_id,
            step_id=step_id,
            event_type="tool_call",
            source=event.source,
            parent_event_id=parent_event_id,
            metadata={
                "event": event.event,
                "tool_id": event.tool_id,
                "tool_name": event.tool_name,
                "tool_type": event.tool_type,
                "status": event.status,
                **event.metadata,
            },
        )
        event.event_id = event_id
        event.parent_event_id = parent_event_id
        event.step_id = step_id
        normalized.append(normalized_event)
        if event.event == "start":
            last_start_by_tool[tool_key] = event_id
    return normalized


def _normalize_process_events(
    execution: SandboxExecution,
    tool_events: list[NormalizedEvent],
    llm_events: list[NormalizedEvent],
) -> list[NormalizedEvent]:
    return _normalize_trace_events(
        execution=execution,
        raw_events=execution.process_events,
        event_type="process",
        build_metadata=lambda event: {
            "action": event.action,
            "command": event.command,
            "pid": event.pid,
            "raw": event.raw,
        },
        tool_events=tool_events,
        llm_events=llm_events,
    )


def _normalize_file_events(
    execution: SandboxExecution,
    tool_events: list[NormalizedEvent],
    llm_events: list[NormalizedEvent],
) -> list[NormalizedEvent]:
    return _normalize_trace_events(
        execution=execution,
        raw_events=execution.file_events,
        event_type="file",
        build_metadata=lambda event: {
            "action": event.action,
            "path": event.path,
            "pid": event.pid,
            "raw": event.raw,
        },
        tool_events=tool_events,
        llm_events=llm_events,
    )


def _normalize_network_events(
    execution: SandboxExecution,
    tool_events: list[NormalizedEvent],
    llm_events: list[NormalizedEvent],
) -> list[NormalizedEvent]:
    return _normalize_trace_events(
        execution=execution,
        raw_events=execution.network_events,
        event_type="network",
        build_metadata=lambda event: {
            "action": event.action,
            "address": event.address,
            "display_label": event.display_label or event.address,
            "host": event.host,
            "port": event.port,
            "endpoint_kind": event.endpoint_kind,
            "endpoint_source": event.endpoint_source,
            "endpoint_role": event.endpoint_role,
            "is_llm_provider": event.is_llm_provider,
            "llm_provider_name": event.llm_provider_name,
            "sink_resolution_status": event.sink_resolution_status,
            "raw_address": event.raw_address,
            "raw_host": event.raw_host,
            "raw_port": event.raw_port,
            "original_domain": event.original_domain,
            "original_url": event.original_url,
            "resolved_ip": event.resolved_ip,
            "sink_display_label": event.sink_display_label,
            "sink_raw_ip": event.sink_raw_ip,
            "sink_domain": event.sink_domain,
            "sink_url": event.sink_url,
            "sink_port": event.sink_port,
            "sink_type": event.sink_type,
            "is_controlled_sink": event.is_controlled_sink,
            "network_evidence_sources": list(event.network_evidence_sources),
            "original_target_candidates": list(event.original_target_candidates),
            "selected_sink_reason": event.selected_sink_reason,
            "pid": event.pid,
            "raw": event.raw,
        },
        tool_events=tool_events,
        llm_events=llm_events,
    )


def _normalize_data_flow_events(
    execution: SandboxExecution,
    file_events: list[NormalizedEvent],
    network_events: list[NormalizedEvent],
) -> list[NormalizedEvent]:
    file_read_ids = {event.metadata.get("path"): event.event_id for event in file_events}
    network_ids = {event.metadata.get("address"): event.event_id for event in network_events}
    normalized: list[NormalizedEvent] = []
    for event in execution.data_flows:
        event_id = event.event_id or _event_id("flow")
        parent_event_id = event.parent_event_id
        if parent_event_id is None:
            parent_event_id = (
                file_read_ids.get(event.source_detail)
                or network_ids.get(event.sink_detail)
            )
        normalized_event = NormalizedEvent(
            event_id=event_id,
            timestamp=event.timestamp,
            execution_id=execution.execution_id,
            step_id=event.step_id,
            event_type="data_flow",
            source="analyzer",
            parent_event_id=parent_event_id,
            metadata={
                "source": event.source,
                "source_detail": event.source_detail,
                "sink": event.sink,
                "sink_detail": event.sink_detail,
                "note": event.note,
            },
        )
        event.event_id = event_id
        event.parent_event_id = parent_event_id
        normalized.append(normalized_event)
    return normalized


def _normalize_trace_events(
    execution: SandboxExecution,
    raw_events: list[FileEvent] | list[NetworkEvent] | list[ProcessEvent],
    event_type: str,
    build_metadata,
    tool_events: list[NormalizedEvent],
    llm_events: list[NormalizedEvent],
) -> list[NormalizedEvent]:
    normalized: list[NormalizedEvent] = []
    parent_tool = _last_tool_event(tool_events)
    parent_llm = _last_llm_event(llm_events)
    default_parent_id = parent_tool.event_id if parent_tool is not None else (parent_llm.event_id if parent_llm else None)
    default_step_id = parent_tool.step_id if parent_tool is not None else (parent_llm.step_id if parent_llm else None)

    for event in raw_events:
        event_id = event.event_id or _event_id(event_type)
        parent_event_id = event.parent_event_id or default_parent_id
        step_id = event.step_id or default_step_id
        normalized_event = NormalizedEvent(
            event_id=event_id,
            timestamp=event.timestamp,
            execution_id=execution.execution_id,
            step_id=step_id,
            event_type=event_type,
            source=event.source,
            parent_event_id=parent_event_id,
            metadata=build_metadata(event),
        )
        event.event_id = event_id
        event.parent_event_id = parent_event_id
        event.step_id = step_id
        normalized.append(normalized_event)
    return normalized


def _enrich_network_events(execution: SandboxExecution) -> None:
    command_endpoints_by_pid: dict[str, list[dict[str, Any]]] = {}
    for event in execution.process_events:
        if not event.pid:
            continue
        endpoints = extract_network_candidates_from_text(event.command, source="command")
        if endpoints:
            command_endpoints_by_pid[event.pid] = endpoints

    tool_endpoints: list[dict[str, Any]] = []
    for event in execution.tool_calls:
        if event.event != "start":
            continue
        config = event.metadata.get("config", {})
        endpoints = _endpoints_from_tool_call(event.tool_type, config)
        for endpoint in endpoints:
            endpoint["step_id"] = event.step_id
            tool_endpoints.append(endpoint)

    llm_endpoints: list[dict[str, Any]] = []
    for event in execution.llm_events:
        if event.event != "request":
            continue
        base_url = str(event.metadata.get("base_url", "")).strip()
        if not base_url:
            continue
        endpoint = candidate_from_url(base_url, source="llm_base_url")
        endpoint["step_id"] = event.step_id
        llm_endpoints.append(endpoint)

    for event in execution.network_events:
        raw_address = event.raw_address or event.address
        raw_host = event.raw_host or event.host
        raw_port = event.raw_port if event.raw_port is not None else event.port
        candidates = _best_candidates_for_network_event(
            event=event,
            command_endpoints_by_pid=command_endpoints_by_pid,
            tool_endpoints=tool_endpoints,
            llm_endpoints=llm_endpoints,
        )
        resolved = resolve_best_network_sink(
            raw_address=raw_address,
            raw_host=raw_host,
            raw_port=raw_port,
            candidates=candidates,
        )
        _apply_endpoint_metadata(event, resolved)


def _best_candidates_for_network_event(
    *,
    event: NetworkEvent,
    command_endpoints_by_pid: dict[str, list[dict[str, Any]]],
    tool_endpoints: list[dict[str, Any]],
    llm_endpoints: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    candidates: list[dict[str, Any]] = []
    current = candidate_from_network_event(event)
    if current is not None:
        candidates.append(current)
    if event.original_url:
        candidates.append(candidate_from_url(event.original_url, source="trace"))
    if event.original_domain:
        candidates.append(candidate_from_domain(event.original_domain, source="dns"))
    if event.pid and event.pid in command_endpoints_by_pid:
        candidates.extend(command_endpoints_by_pid[event.pid])
    if tool_endpoints:
        candidates.extend(tool_endpoints)
    if llm_endpoints:
        candidates.extend(llm_endpoints)
    return candidates


def _endpoints_from_tool_call(tool_type: str, config: dict[str, Any]) -> list[dict[str, Any]]:
    if tool_type == "http_request":
        url = str(config.get("url", "")).strip()
        if not url:
            return []
        return [candidate_from_url(url, source="tool")]

    if tool_type == "run_command":
        command = config.get("command", "")
        return extract_network_candidates_from_text(command, source="command")

    return []


def _apply_endpoint_metadata(event: NetworkEvent, endpoint: dict[str, Any]) -> None:
    metadata = event_metadata_from_resolution(endpoint)
    address = str(metadata.get("address", "") or "").strip()
    display_label = str(metadata.get("display_label", "") or "").strip()
    if address:
        event.address = address
    if display_label:
        event.display_label = display_label
    if metadata.get("host"):
        event.host = str(metadata["host"])
    if metadata.get("port") is not None:
        event.port = int(metadata["port"])
    if metadata.get("endpoint_kind"):
        event.endpoint_kind = str(metadata["endpoint_kind"])
    if metadata.get("endpoint_source"):
        event.endpoint_source = str(metadata["endpoint_source"])
    if metadata.get("endpoint_role"):
        event.endpoint_role = str(metadata["endpoint_role"])
    if metadata.get("is_llm_provider") is not None:
        event.is_llm_provider = bool(metadata["is_llm_provider"])
    if metadata.get("llm_provider_name"):
        event.llm_provider_name = str(metadata["llm_provider_name"])
    if metadata.get("sink_resolution_status"):
        event.sink_resolution_status = str(metadata["sink_resolution_status"])
    event.raw_address = str(metadata.get("raw_address", event.raw_address or "")) or event.raw_address
    event.raw_host = str(metadata.get("raw_host", event.raw_host or "")) or event.raw_host
    if metadata.get("raw_port") is not None:
        event.raw_port = int(metadata["raw_port"])
    if metadata.get("original_domain"):
        event.original_domain = str(metadata["original_domain"])
    if metadata.get("original_url"):
        event.original_url = str(metadata["original_url"])
    if metadata.get("resolved_ip"):
        event.resolved_ip = str(metadata["resolved_ip"])
    if metadata.get("sink_display_label"):
        event.sink_display_label = str(metadata["sink_display_label"])
    if metadata.get("sink_raw_ip"):
        event.sink_raw_ip = str(metadata["sink_raw_ip"])
    if metadata.get("sink_domain"):
        event.sink_domain = str(metadata["sink_domain"])
    if metadata.get("sink_url"):
        event.sink_url = str(metadata["sink_url"])
    if metadata.get("sink_port") is not None:
        event.sink_port = int(metadata["sink_port"])
    if metadata.get("sink_type"):
        event.sink_type = str(metadata["sink_type"])
    if metadata.get("is_controlled_sink") is not None:
        event.is_controlled_sink = bool(metadata["is_controlled_sink"])
    event.network_evidence_sources = list(metadata.get("network_evidence_sources", event.network_evidence_sources))
    event.original_target_candidates = list(metadata.get("original_target_candidates", event.original_target_candidates))
    if metadata.get("selected_sink_reason"):
        event.selected_sink_reason = str(metadata["selected_sink_reason"])


def _last_tool_event(events: list[NormalizedEvent]) -> NormalizedEvent | None:
    starts = [event for event in events if event.metadata.get("event") == "start"]
    return starts[-1] if starts else (events[-1] if events else None)


def _last_llm_event(events: list[NormalizedEvent]) -> NormalizedEvent | None:
    requests = [event for event in events if event.metadata.get("event") == "request"]
    return requests[-1] if requests else (events[-1] if events else None)


def _derive_step_id(step: Any) -> str | None:
    if step in (None, ""):
        return None
    return f"step-{step}"


def _event_id(prefix: str) -> str:
    return f"{prefix}-{uuid.uuid4().hex}"
