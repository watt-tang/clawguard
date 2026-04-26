from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any


@dataclass
class ResourceUsage:
    memory_limit_bytes: int | None = None
    memory_peak_bytes: int | None = None
    memory_peak_human: str | None = None
    writable_layer_bytes: int | None = None
    writable_layer_human: str | None = None
    rootfs_bytes: int | None = None
    rootfs_human: str | None = None
    skill_bundle_bytes: int | None = None
    skill_bundle_human: str | None = None
    artifacts_bytes: int | None = None
    artifacts_human: str | None = None
    estimated_total_disk_bytes: int | None = None
    estimated_total_disk_human: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class FileEvent:
    timestamp: str
    path: str
    action: str
    raw: str
    pid: str | None = None
    event_id: str | None = None
    parent_event_id: str | None = None
    step_id: str | None = None
    source: str = "strace"

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class NetworkEvent:
    timestamp: str
    address: str
    action: str
    raw: str
    host: str | None = None
    port: int | None = None
    display_label: str | None = None
    endpoint_kind: str | None = None
    endpoint_source: str | None = None
    endpoint_role: str | None = None
    is_llm_provider: bool | None = None
    llm_provider_name: str | None = None
    sink_resolution_status: str | None = None
    raw_address: str | None = None
    raw_host: str | None = None
    raw_port: int | None = None
    original_domain: str | None = None
    original_url: str | None = None
    resolved_ip: str | None = None
    sink_display_label: str | None = None
    sink_raw_ip: str | None = None
    sink_domain: str | None = None
    sink_url: str | None = None
    sink_port: int | None = None
    sink_type: str | None = None
    is_controlled_sink: bool | None = None
    network_evidence_sources: list[str] = field(default_factory=list)
    original_target_candidates: list[str] = field(default_factory=list)
    selected_sink_reason: str | None = None
    pid: str | None = None
    event_id: str | None = None
    parent_event_id: str | None = None
    step_id: str | None = None
    source: str = "strace"

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class ProcessEvent:
    timestamp: str
    action: str
    command: str
    raw: str
    pid: str | None = None
    event_id: str | None = None
    parent_event_id: str | None = None
    step_id: str | None = None
    source: str = "strace"

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class ToolCallEvent:
    timestamp: str
    tool_id: str
    tool_name: str
    tool_type: str
    event: str
    status: str | None = None
    metadata: dict[str, Any] = field(default_factory=dict)
    event_id: str | None = None
    parent_event_id: str | None = None
    step_id: str | None = None
    source: str = "runtime"

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class LLMEvent:
    timestamp: str
    event: str
    metadata: dict[str, Any] = field(default_factory=dict)
    event_id: str | None = None
    parent_event_id: str | None = None
    step_id: str | None = None
    source: str = "runtime"

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class DataFlowEvent:
    timestamp: str
    source: str
    source_detail: str
    sink: str
    sink_detail: str
    note: str
    event_id: str | None = None
    parent_event_id: str | None = None
    step_id: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class TraceArtifacts:
    files: list[FileEvent] = field(default_factory=list)
    network: list[NetworkEvent] = field(default_factory=list)
    processes: list[ProcessEvent] = field(default_factory=list)
    timeline: list[dict[str, Any]] = field(default_factory=list)


@dataclass
class SandboxExecution:
    execution_id: str
    skill_path: str
    skill_file: str
    sandbox_image: str
    runtime_name: str
    command: list[str]
    exit_code: int | None
    timed_out: bool
    stdout: str
    stderr: str
    trace_artifacts: TraceArtifacts
    file_events: list[FileEvent]
    network_events: list[NetworkEvent]
    process_events: list[ProcessEvent]
    tool_calls: list[ToolCallEvent]
    llm_events: list[LLMEvent]
    data_flows: list[DataFlowEvent]
    resource_usage: ResourceUsage
    artifacts_dir: str
    enabled_adapters: list[str] = field(default_factory=list)
    adapter_events_summary: dict[str, Any] = field(default_factory=dict)
    synthetic_artifact_summary: dict[str, Any] = field(default_factory=dict)
    trigger_plan: dict[str, Any] = field(default_factory=dict)
    trigger_used: list[str] = field(default_factory=list)
    trigger_hits: list[str] = field(default_factory=list)
    trigger_unexecuted: list[str] = field(default_factory=list)
    trigger_events_summary: dict[str, Any] = field(default_factory=dict)
