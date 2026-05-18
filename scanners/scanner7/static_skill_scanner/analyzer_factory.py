from __future__ import annotations

from .analyzers import ManifestAnalyzer, PatternAnalyzer, ResourceAnalyzer
from .analyzers.base import Analyzer


def build_default_analyzers() -> list[Analyzer]:
    return [
        ManifestAnalyzer(),
        PatternAnalyzer(),
        ResourceAnalyzer(),
    ]
