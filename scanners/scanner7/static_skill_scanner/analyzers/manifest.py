from __future__ import annotations

from ..models import AnalyzerResult, Finding, SkillModel
from .base import Analyzer


class ManifestAnalyzer(Analyzer):
    name = "manifest"

    def run(self, skill: SkillModel) -> AnalyzerResult:
        result = AnalyzerResult(analyzer=self.name)
        if not skill.manifest_path:
            result.findings.append(
                Finding(
                    rule_id="MANIFEST_MISSING",
                    title="SKILL.md missing",
                    severity="HIGH",
                    category="manifest",
                    file_path=".",
                    message="Skill root does not contain a SKILL.md manifest.",
                    analyzer=self.name,
                )
            )
            return result

        if "name" not in skill.manifest_meta:
            result.findings.append(
                Finding(
                    rule_id="MANIFEST_NAME_MISSING",
                    title="Manifest name missing",
                    severity="MEDIUM",
                    category="manifest",
                    file_path=skill.manifest_path,
                    message="SKILL.md frontmatter is missing a name field.",
                    analyzer=self.name,
                )
            )

        if "description" not in skill.manifest_meta:
            result.findings.append(
                Finding(
                    rule_id="MANIFEST_DESCRIPTION_MISSING",
                    title="Manifest description missing",
                    severity="LOW",
                    category="manifest",
                    file_path=skill.manifest_path,
                    message="SKILL.md frontmatter is missing a description field.",
                    analyzer=self.name,
                )
            )
        return result
