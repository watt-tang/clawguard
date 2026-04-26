from __future__ import annotations

import uuid
from pathlib import Path
from typing import Any

from app.analyzer.network_sink_resolution import candidate_from_url, event_metadata_from_resolution, resolve_best_network_sink
from app.graph.models import ExecutionProvenanceGraph, GraphEdge, GraphNode
from app.telemetry.normalizer import NormalizedEvent, load_normalized_events


class GraphBuilder:
    """Builds a minimal execution provenance graph from normalized telemetry."""

    def __init__(self, execution_id: str) -> None:
        self.execution_id = execution_id
        self.nodes: dict[str, GraphNode] = {}
        self.edges: list[GraphEdge] = []
        self._event_node_ids: dict[str, str] = {}

    def build(
        self,
        normalized_events: list[NormalizedEvent],
        telemetry_report: dict[str, Any],
    ) -> ExecutionProvenanceGraph:
        for event in normalized_events:
            self._ingest_event(event)

        self._link_parent_causes(normalized_events)
        self._link_data_flows(telemetry_report)
        return ExecutionProvenanceGraph(
            execution_id=self.execution_id,
            nodes=list(self.nodes.values()),
            edges=self.edges,
        )

    def _ingest_event(self, event: NormalizedEvent) -> None:
        if event.event_type == "llm_step":
            node_id = self._upsert_node(
                node_id=f"llm:{event.step_id or event.event_id}",
                node_type="llm_step",
                label=event.step_id or event.metadata.get("event", "llm_step"),
                metadata={
                    "step_id": event.step_id,
                    "event_id": event.event_id,
                    "event": event.metadata.get("event"),
                },
            )
        elif event.event_type == "tool_call":
            tool_name = event.metadata.get("tool_name") or event.metadata.get("tool_id") or "tool_call"
            node_id = self._upsert_node(
                node_id=f"tool:{event.metadata.get('tool_id') or event.event_id}",
                node_type="tool_call",
                label=tool_name,
                metadata={
                    "event_id": event.event_id,
                    "tool_id": event.metadata.get("tool_id"),
                    "tool_type": event.metadata.get("tool_type"),
                    "event": event.metadata.get("event"),
                    "step_id": event.step_id,
                },
            )
            self._ingest_tool_effect(event, node_id)
        elif event.event_type == "process":
            node_id = self._upsert_node(
                node_id=f"process:{event.metadata.get('pid') or event.event_id}",
                node_type="process",
                label=event.metadata.get("command", "process"),
                metadata={
                    "event_id": event.event_id,
                    "pid": event.metadata.get("pid"),
                    "action": event.metadata.get("action"),
                    "command": event.metadata.get("command"),
                },
            )
        elif event.event_type == "file":
            node_id = self._upsert_node(
                node_id=f"file:{event.metadata.get('path')}",
                node_type="file",
                label=event.metadata.get("path", "file"),
                metadata={
                    "path": event.metadata.get("path"),
                    "last_event_id": event.event_id,
                },
            )
        elif event.event_type == "network":
            label = (
                event.metadata.get("sink_display_label")
                or event.metadata.get("display_label")
                or event.metadata.get("address", "network")
            )
            address = event.metadata.get("address") or label
            node_id = self._upsert_node(
                node_id=f"network:{address}",
                node_type="network_endpoint",
                label=label,
                metadata={
                    "address": address,
                    "display_label": event.metadata.get("display_label") or label,
                    "host": event.metadata.get("host"),
                    "port": event.metadata.get("port"),
                    "endpoint_kind": event.metadata.get("endpoint_kind"),
                    "endpoint_source": event.metadata.get("endpoint_source"),
                    "endpoint_role": event.metadata.get("endpoint_role"),
                    "is_llm_provider": event.metadata.get("is_llm_provider"),
                    "llm_provider_name": event.metadata.get("llm_provider_name"),
                    "sink_resolution_status": event.metadata.get("sink_resolution_status"),
                    "raw_address": event.metadata.get("raw_address"),
                    "raw_host": event.metadata.get("raw_host"),
                    "raw_port": event.metadata.get("raw_port"),
                    "original_domain": event.metadata.get("original_domain"),
                    "original_url": event.metadata.get("original_url"),
                    "resolved_ip": event.metadata.get("resolved_ip"),
                    "sink_display_label": event.metadata.get("sink_display_label") or label,
                    "sink_raw_ip": event.metadata.get("sink_raw_ip"),
                    "sink_domain": event.metadata.get("sink_domain"),
                    "sink_url": event.metadata.get("sink_url"),
                    "sink_port": event.metadata.get("sink_port"),
                    "sink_type": event.metadata.get("sink_type"),
                    "is_controlled_sink": event.metadata.get("is_controlled_sink"),
                    "network_evidence_sources": list(event.metadata.get("network_evidence_sources", [])),
                    "original_target_candidates": list(event.metadata.get("original_target_candidates", [])),
                    "selected_sink_reason": event.metadata.get("selected_sink_reason"),
                    "last_event_id": event.event_id,
                },
            )
        elif event.event_type == "data_flow":
            node_id = self._upsert_node(
                node_id=f"data:{event.event_id}",
                node_type="data",
                label=f"{event.metadata.get('source_detail', 'source')} -> {event.metadata.get('sink_detail', 'sink')}",
                metadata={
                    "event_id": event.event_id,
                    **event.metadata,
                },
            )
        else:
            node_id = self._upsert_node(
                node_id=f"event:{event.event_id}",
                node_type=event.event_type,
                label=event.event_type,
                metadata={"event_id": event.event_id},
            )

        self._event_node_ids[event.event_id] = node_id

    def _ingest_tool_effect(self, event: NormalizedEvent, tool_node_id: str) -> None:
        tool_type = event.metadata.get("tool_type")
        config = event.metadata.get("config", {})
        if tool_type == "read_file" and "path" in config:
            file_node_id = self._upsert_node(
                node_id=f"file:{config['path']}",
                node_type="file",
                label=config["path"],
                metadata={"path": config["path"]},
            )
            self._add_edge(tool_node_id, file_node_id, "reads", {"via": "tool_config"})
        elif tool_type == "write_file" and "path" in config:
            file_node_id = self._upsert_node(
                node_id=f"file:{config['path']}",
                node_type="file",
                label=config["path"],
                metadata={"path": config["path"]},
            )
            self._add_edge(tool_node_id, file_node_id, "writes", {"via": "tool_config"})
        elif tool_type == "http_request" and "url" in config:
            address = config["url"]
            resolved = resolve_best_network_sink(
                raw_address=None,
                raw_host=None,
                raw_port=None,
                candidates=[candidate_from_url(address, source="tool")],
            )
            metadata = event_metadata_from_resolution(resolved)
            network_node_id = self._upsert_node(
                node_id=f"network:{metadata.get('address') or address}",
                node_type="network_endpoint",
                label=str(metadata.get("sink_display_label") or address),
                metadata={
                    **metadata,
                },
            )
            self._add_edge(tool_node_id, network_node_id, "connects", {"via": "tool_config"})

    def _link_parent_causes(self, normalized_events: list[NormalizedEvent]) -> None:
        for event in normalized_events:
            child_node_id = self._event_node_ids.get(event.event_id)
            parent_node_id = self._event_node_ids.get(event.parent_event_id or "")
            if child_node_id and parent_node_id and child_node_id != parent_node_id:
                self._add_edge(parent_node_id, child_node_id, "causes", {"event_id": event.event_id})

    def _link_data_flows(self, telemetry_report: dict[str, Any]) -> None:
        for event in telemetry_report.get("file_events", []):
            path = event.get("path")
            if not path:
                continue
            file_node_id = self.nodes.get(f"file:{path}")
            if file_node_id is None:
                continue
            for process in telemetry_report.get("process_events", []):
                if process.get("pid") == event.get("pid"):
                    process_node_id = self.nodes.get(f"process:{process.get('pid') or process.get('command')}")
                    if process_node_id is not None:
                        edge_type = "writes" if event.get("action") in {"write", "create", "delete_or_rename"} else "reads"
                        self._add_edge(process_node_id.node_id, file_node_id.node_id, edge_type, {"pid": event.get("pid")})

        for event in telemetry_report.get("network_events", []):
            address = event.get("address")
            if not address:
                continue
            network_node = self.nodes.get(f"network:{address}")
            if network_node is None:
                continue
            for process in telemetry_report.get("process_events", []):
                if process.get("pid") == event.get("pid"):
                    process_node = self.nodes.get(f"process:{process.get('pid') or process.get('command')}")
                    if process_node is not None:
                        self._add_edge(process_node.node_id, network_node.node_id, "connects", {"pid": event.get("pid")})

        for flow in telemetry_report.get("data_flows", []):
            data_node_id = self._upsert_node(
                node_id=f"data:{flow.get('event_id') or uuid.uuid4().hex}",
                node_type="data",
                label=f"{flow.get('source_detail', 'source')} -> {flow.get('sink_detail', 'sink')}",
                metadata=flow,
            )
            source_path = flow.get("source_detail")
            sink_address = flow.get("sink_detail")
            if source_path and f"file:{source_path}" in self.nodes:
                self._add_edge(f"file:{source_path}", data_node_id, "flows_to", {"kind": "source"})
            if sink_address and f"network:{sink_address}" in self.nodes:
                self._add_edge(data_node_id, f"network:{sink_address}", "flows_to", {"kind": "sink"})

    def _upsert_node(
        self,
        node_id: str,
        node_type: str,
        label: str,
        metadata: dict[str, Any],
    ) -> str:
        existing = self.nodes.get(node_id)
        if existing is None:
            self.nodes[node_id] = GraphNode(
                node_id=node_id,
                node_type=node_type,
                label=label,
                metadata=dict(metadata),
            )
        else:
            if existing.node_type == "network_endpoint":
                preferred_label = metadata.get("display_label") or metadata.get("address")
                if preferred_label and existing.label in {"network", "unknown"}:
                    existing.label = preferred_label
            existing.metadata.update({key: value for key, value in metadata.items() if value not in (None, "")})
        return node_id

    def _add_edge(
        self,
        source_node_id: str,
        target_node_id: str,
        edge_type: str,
        metadata: dict[str, Any],
    ) -> None:
        if source_node_id == target_node_id:
            return
        for edge in self.edges:
            if (
                edge.source_node_id == source_node_id
                and edge.target_node_id == target_node_id
                and edge.edge_type == edge_type
            ):
                edge.metadata.update(metadata)
                return
        self.edges.append(
            GraphEdge(
                edge_id=f"edge-{uuid.uuid4().hex}",
                edge_type=edge_type,
                source_node_id=source_node_id,
                target_node_id=target_node_id,
                metadata=dict(metadata),
            )
        )


def build_execution_provenance_graph(
    execution_id: str,
    normalized_events_path: str | Path,
    telemetry_report: dict[str, Any],
) -> ExecutionProvenanceGraph:
    normalized_events = load_normalized_events(normalized_events_path)
    builder = GraphBuilder(execution_id=execution_id)
    return builder.build(normalized_events=normalized_events, telemetry_report=telemetry_report)
