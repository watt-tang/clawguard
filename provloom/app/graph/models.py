from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any


@dataclass
class GraphNode:
    """Typed node in the execution provenance graph."""

    node_id: str
    node_type: str
    label: str
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class GraphEdge:
    """Directed relationship between two provenance nodes."""

    edge_id: str
    edge_type: str
    source_node_id: str
    target_node_id: str
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class ExecutionProvenanceGraph:
    """Self-contained provenance graph exported for later evaluation."""

    execution_id: str
    nodes: list[GraphNode] = field(default_factory=list)
    edges: list[GraphEdge] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        node_types: dict[str, int] = {}
        edge_types: dict[str, int] = {}
        for node in self.nodes:
            node_types[node.node_type] = node_types.get(node.node_type, 0) + 1
        for edge in self.edges:
            edge_types[edge.edge_type] = edge_types.get(edge.edge_type, 0) + 1
        return {
            "execution_id": self.execution_id,
            "nodes": [node.to_dict() for node in self.nodes],
            "edges": [edge.to_dict() for edge in self.edges],
            "summary": {
                "summary_scope": "execution_provenance_graph",
                "node_count": len(self.nodes),
                "edge_count": len(self.edges),
                "node_types": node_types,
                "edge_types": edge_types,
            },
        }
