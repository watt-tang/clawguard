from __future__ import annotations

from ..models import AnalyzerResult, Finding, SkillModel
from .base import Analyzer


class ResourceAnalyzer(Analyzer):
    name = "resource"

    def run(self, skill: SkillModel) -> AnalyzerResult:
        result = AnalyzerResult(analyzer=self.name)
        for file_record in skill.resource_files:
            extension = file_record.metadata.get("extension", "")
            if extension == ".svg" and file_record.content and "<script" in file_record.content.lower():
                result.findings.append(
                    Finding(
                        rule_id="RESOURCE_SVG_SCRIPT",
                        title="SVG embedded script",
                        severity="MEDIUM",
                        category="resource",
                        file_path=file_record.path,
                        message="SVG resource contains embedded script content.",
                        evidence="<script",
                        analyzer=self.name,
                    )
                )
            if extension in {".png", ".jpg", ".jpeg", ".gif", ".webp"} and file_record.size > 5 * 1024 * 1024:
                result.findings.append(
                    Finding(
                        rule_id="RESOURCE_LARGE_IMAGE",
                        title="Large image asset",
                        severity="LOW",
                        category="resource",
                        file_path=file_record.path,
                        message="Image asset is unusually large and may deserve manual review.",
                        evidence=f"{file_record.size} bytes",
                        analyzer=self.name,
                    )
                )
        result.metrics["resource_files"] = len(skill.resource_files)
        return result
