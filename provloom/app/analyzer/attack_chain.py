from __future__ import annotations

from collections import deque
from typing import Any

from app.analyzer.endpoint_semantics import endpoint_semantics
from app.graph.models import ExecutionProvenanceGraph, GraphNode

NOISY_FILE_PREFIXES = (
    "/usr/local/lib/python",
    "/usr/local/bin/../lib",
    "/usr/lib/locale",
    "/usr/share/locale",
    "/usr/lib/x86_64-linux-gnu/gconv",
    "/lib/x86_64-linux-gnu/",
    "/opt/skill_sandbox/",
    "/artifacts/",
    "/workspace/skill/",
)

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


def extract_primary_attack_chain(
    graph: ExecutionProvenanceGraph,
    detected_behaviors: list[str],
    *,
    filter_noise: bool = False,
) -> list[dict[str, Any]]:
    """Recover a best-effort source-to-sink chain from the EPG."""

    behaviors = set(detected_behaviors)
    if not (
        {"sensitive_file_read", "network_access"} <= behaviors
        or "read_then_exfiltration" in behaviors
        or {"file_write", "network_access"} <= behaviors
    ):
        return []

    node_lookup = {node.node_id: node for node in graph.nodes}
    adjacency = _build_adjacency(graph)
    file_nodes = _candidate_source_nodes(graph, adjacency, filter_noise=filter_noise)
    terminal_groups = _candidate_terminal_groups(graph, adjacency)
    if not file_nodes or not any(terminal_groups):
        return []

    best_path: list[tuple[str, str | None]] | None = None
    best_rank: tuple[int, int, int, int, str, str] | None = None
    for terminal_nodes in terminal_groups:
        if not terminal_nodes:
            continue
        for source in file_nodes:
            for terminal in terminal_nodes:
                path = _bfs_path(source.node_id, {terminal.node_id}, adjacency)
                if path is None:
                    continue
                rank = _rank_path(path, node_lookup, adjacency, filter_noise=filter_noise)
                if best_rank is None or rank < best_rank:
                    best_path = path
                    best_rank = rank
        if best_path is not None:
            break

    if best_path is None:
        source = file_nodes[0]
        return [
            {
                "node_id": source.node_id,
                "node_type": source.node_type,
                "label": source.label,
                "edge_type": None,
                "completeness": "partial",
                "role": "source",
            }
        ]

    if filter_noise:
        best_path = _compress_path(best_path, node_lookup)

    chain: list[dict[str, Any]] = []
    for node_id, edge_type in best_path:
        node = node_lookup[node_id]
        item = {
            "node_id": node.node_id,
            "node_type": node.node_type,
            "label": node.label,
            "edge_type": edge_type,
            "completeness": "complete",
            "role": _node_role(node_id, best_path, node),
        }
        if node.node_type == "network_endpoint":
            item.update(_network_node_export_fields(node))
        chain.append(item)

    chain = _append_unresolved_sink_if_needed(chain)

    if not _is_resolved_chain(chain):
        for item in chain:
            item["completeness"] = "partial"
    return chain


def _build_adjacency(graph: ExecutionProvenanceGraph) -> dict[str, list[tuple[str, str]]]:
    adjacency: dict[str, list[tuple[str, str]]] = {}
    for edge in graph.edges:
        adjacency.setdefault(edge.source_node_id, []).append((edge.target_node_id, edge.edge_type))
        if edge.edge_type in {"causes", "flows_to"}:
            adjacency.setdefault(edge.target_node_id, []).append((edge.source_node_id, edge.edge_type))
    return adjacency


def _bfs_path(
    start_node_id: str,
    goal_node_ids: set[str],
    adjacency: dict[str, list[tuple[str, str]]],
) -> list[tuple[str, str | None]] | None:
    queue = deque([(start_node_id, [(start_node_id, None)])])
    visited = {start_node_id}
    while queue:
        node_id, path = queue.popleft()
        if node_id in goal_node_ids:
            return path
        for next_node_id, edge_type in adjacency.get(node_id, []):
            if next_node_id in visited:
                continue
            visited.add(next_node_id)
            queue.append((next_node_id, path + [(next_node_id, edge_type)]))
    return None


def _candidate_source_nodes(
    graph: ExecutionProvenanceGraph,
    adjacency: dict[str, list[tuple[str, str]]],
    *,
    filter_noise: bool,
) -> list[GraphNode]:
    ranked = sorted(
        (node for node in graph.nodes if node.node_type == "file"),
        key=lambda node: (
            _source_priority(node, adjacency),
            1 if filter_noise and _is_noisy_file(node.metadata.get("path", "")) else 0,
            node.label,
        ),
    )
    if filter_noise:
        non_noisy = [node for node in ranked if not _is_noisy_file(node.metadata.get("path", ""))]
        if non_noisy:
            ranked = non_noisy
    return ranked


def _candidate_terminal_groups(
    graph: ExecutionProvenanceGraph,
    adjacency: dict[str, list[tuple[str, str]]],
) -> list[list[GraphNode]]:
    resolved_sinks: list[GraphNode] = []
    unresolved_sinks: list[GraphNode] = []
    relay_endpoints: list[GraphNode] = []

    for node in graph.nodes:
        if node.node_type != "network_endpoint":
            continue
        semantics = _network_node_semantics(node)
        if semantics["endpoint_role"] == "relay":
            relay_endpoints.append(node)
        elif semantics["sink_resolution_status"] == "resolved":
            resolved_sinks.append(node)
        else:
            unresolved_sinks.append(node)

    def _sort(nodes: list[GraphNode]) -> list[GraphNode]:
        return sorted(
            nodes,
            key=lambda node: (
                _sink_priority(node),
                0 if _has_tool_predecessor(node.node_id, adjacency) else 1,
                node.label,
            ),
        )

    return [_sort(resolved_sinks), _sort(unresolved_sinks), _sort(relay_endpoints)]


def _source_priority(node: GraphNode, adjacency: dict[str, list[tuple[str, str]]]) -> int:
    path = node.metadata.get("path", "")
    tool_linked = _has_tool_neighbor(node.node_id, adjacency)
    sensitive = _is_sensitive_file(path)
    generated_local = _is_generated_local_file(path)
    public_local = str(path).startswith("public/")

    if tool_linked and sensitive:
        return 0
    if tool_linked and generated_local:
        return 1
    if tool_linked and public_local:
        return 2
    if sensitive:
        return 3
    if generated_local:
        return 4
    if public_local:
        return 5
    return 6


def _rank_path(
    path: list[tuple[str, str | None]],
    node_lookup: dict[str, GraphNode],
    adjacency: dict[str, list[tuple[str, str]]],
    *,
    filter_noise: bool,
) -> tuple[int, int, int, int, str, str]:
    nodes = [node_lookup[node_id] for node_id, _ in path]
    noisy_count = sum(
        1
        for node in nodes
        if node.node_type == "file" and _is_noisy_file(node.metadata.get("path", ""))
    )
    relay_count = sum(1 for node in nodes[1:-1] if node.node_type in {"file", "data", "process", "tool_call"})
    source = nodes[0]
    sink = nodes[-1]
    return (
        len(path),
        noisy_count if filter_noise else 0,
        _source_priority(source, adjacency),
        _sink_priority(sink),
        source.label,
        sink.label,
    )


def _sink_priority(node: GraphNode) -> int:
    semantics = _network_node_semantics(node)
    if semantics["endpoint_role"] == "relay":
        return 50
    if semantics["sink_resolution_status"] == "controlled":
        return 40
    if semantics["sink_resolution_status"] != "resolved":
        return 45
    sink_type = str(semantics.get("sink_type", "") or "")
    if sink_type == "url":
        return 0
    if sink_type in {"domain", "dns_only"}:
        return 1
    if sink_type == "ip":
        return 2
    if str(node.label or "").strip() and str(node.label) != "unknown":
        return 3
    return 4


def _compress_path(
    path: list[tuple[str, str | None]],
    node_lookup: dict[str, GraphNode],
) -> list[tuple[str, str | None]]:
    compressed: list[tuple[str, str | None]] = []
    for index, (node_id, edge_type) in enumerate(path):
        node = node_lookup[node_id]
        is_endpoint = index in {0, len(path) - 1}
        if (
            not is_endpoint
            and node.node_type in {"file", "data"}
            and _is_noisy_file(node.metadata.get("path", node.label))
        ):
            continue
        if compressed and compressed[-1][0] == node_id:
            continue
        compressed.append((node_id, edge_type))
    return compressed or path


def _node_role(
    node_id: str,
    path: list[tuple[str, str | None]],
    node: GraphNode,
) -> str:
    if node_id == path[0][0]:
        return "source"
    if node_id == path[-1][0]:
        if node.node_type == "network_endpoint":
            return _network_node_semantics(node)["endpoint_role"]
        return "sink"
    if node.node_type == "network_endpoint":
        return _network_node_semantics(node)["endpoint_role"]
    if node.node_type in {"file", "data", "process", "tool_call"}:
        return "relay"
    return "context"


def _has_tool_neighbor(node_id: str, adjacency: dict[str, list[tuple[str, str]]]) -> bool:
    for source_id, neighbors in adjacency.items():
        if source_id.startswith("tool:"):
            for target_id, edge_type in neighbors:
                if target_id == node_id and edge_type in {"reads", "writes"}:
                    return True
    return False


def _has_tool_predecessor(node_id: str, adjacency: dict[str, list[tuple[str, str]]]) -> bool:
    for source_id, neighbors in adjacency.items():
        if not source_id.startswith("tool:"):
            continue
        for target_id, edge_type in neighbors:
            if target_id == node_id and edge_type == "connects":
                return True
    return False


def _is_sensitive_file(path: str) -> bool:
    return path.startswith(("/etc/", "/root/", "/proc/", "/sys/", "/var/run/"))


def _is_generated_local_file(path: str) -> bool:
    if not path:
        return False
    return path.startswith("runtime_output/") or (not path.startswith("/") and not path.startswith("public/"))


def _is_noisy_file(path: str) -> bool:
    if not path:
        return False
    if path in NOISY_FILE_PATHS:
        return True
    return any(path.startswith(prefix) for prefix in NOISY_FILE_PREFIXES)


def _looks_like_ip_port(label: str) -> bool:
    host, sep, port = label.rpartition(":")
    if not sep or not port.isdigit():
        return False
    parts = host.split(".")
    return len(parts) == 4 and all(part.isdigit() for part in parts)


def _network_node_export_fields(node: GraphNode) -> dict[str, Any]:
    semantics = _network_node_semantics(node)
    return {
        **semantics,
        "label": semantics.get("sink_display_label", node.label),
    }


def _network_node_semantics(node: GraphNode) -> dict[str, Any]:
    semantics = endpoint_semantics(
        label=str(node.label or ""),
        host=node.metadata.get("host"),
        endpoint_kind=node.metadata.get("endpoint_kind"),
    )
    semantics.update(
        {
            "sink_display_label": node.metadata.get("sink_display_label", node.label),
            "raw_address": node.metadata.get("raw_address"),
            "raw_host": node.metadata.get("raw_host"),
            "raw_port": node.metadata.get("raw_port"),
            "original_domain": node.metadata.get("original_domain"),
            "original_url": node.metadata.get("original_url"),
            "resolved_ip": node.metadata.get("resolved_ip"),
            "sink_raw_ip": node.metadata.get("sink_raw_ip"),
            "sink_domain": node.metadata.get("sink_domain"),
            "sink_url": node.metadata.get("sink_url"),
            "sink_port": node.metadata.get("sink_port"),
            "sink_type": node.metadata.get("sink_type", "unknown"),
            "is_controlled_sink": node.metadata.get("is_controlled_sink", False),
            "network_evidence_sources": list(node.metadata.get("network_evidence_sources", [])),
            "original_target_candidates": list(node.metadata.get("original_target_candidates", [])),
            "selected_sink_reason": node.metadata.get("selected_sink_reason", ""),
        }
    )
    for key in ("endpoint_role", "is_llm_provider", "llm_provider_name", "sink_resolution_status", "llm_relay"):
        if node.metadata.get(key) is not None:
            semantics[key] = node.metadata.get(key)
    return semantics


def _append_unresolved_sink_if_needed(chain: list[dict[str, Any]]) -> list[dict[str, Any]]:
    if not chain:
        return chain
    terminal = chain[-1]
    if terminal.get("node_type") != "network_endpoint":
        return chain
    if terminal.get("endpoint_role") != "relay" or not terminal.get("is_llm_provider"):
        return chain

    terminal["role"] = "relay"
    chain.append(
        {
            "node_id": f"network:unknown-via:{terminal['node_id']}",
            "node_type": "network_endpoint",
            "label": "unknown",
            "edge_type": "llm_mediated",
            "completeness": "partial",
            "role": "sink",
            "endpoint_role": "sink",
            "is_llm_provider": False,
            "llm_provider_name": "unknown",
            "sink_resolution_status": "llm-mediated",
            "sink_display_label": "unknown",
            "sink_type": "unknown",
            "is_controlled_sink": False,
            "network_evidence_sources": [],
            "original_target_candidates": [],
            "selected_sink_reason": "Observed an LLM relay, but the downstream sink could not be resolved.",
            "llm_relay": False,
            "relay_label": terminal.get("label", ""),
            "relay_llm_provider_name": terminal.get("llm_provider_name", "unknown"),
            "relay_node_id": terminal.get("node_id"),
        }
    )
    return chain


def _is_resolved_chain(chain: list[dict[str, Any]]) -> bool:
    if not chain:
        return False
    terminal = chain[-1]
    return (
        terminal.get("node_type") == "network_endpoint"
        and terminal.get("endpoint_role") == "sink"
        and terminal.get("sink_resolution_status") == "resolved"
    )
