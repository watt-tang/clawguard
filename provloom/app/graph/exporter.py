from __future__ import annotations

import json
from pathlib import Path

from app.graph.models import ExecutionProvenanceGraph


def export_graph(graph: ExecutionProvenanceGraph, output_path: str | Path) -> Path:
    """Persist a stable JSON artifact for downstream evaluation."""

    target = Path(output_path)
    target.write_text(json.dumps(graph.to_dict(), ensure_ascii=False, indent=2), encoding="utf-8")
    return target
