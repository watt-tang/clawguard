from __future__ import annotations

import re

from ..models import AnalyzerResult, Finding, SkillModel
from .base import Analyzer


RULES = [
    {
        "id": "PATTERN_CURL_PIPE_SHELL",
        "title": "Curl piped into shell",
        "severity": "HIGH",
        "category": "pipeline",
        "pattern": re.compile(r"(curl|wget).{0,80}\|\s*(bash|sh|zsh)", re.IGNORECASE),
        "message": "Detected network download piped directly into a shell.",
    },
    {
        "id": "PATTERN_EVAL",
        "title": "Dynamic eval execution",
        "severity": "HIGH",
        "category": "code-execution",
        "pattern": re.compile(r"\beval\s*\(", re.IGNORECASE),
        "message": "Detected eval-style dynamic code execution.",
    },
    {
        "id": "PATTERN_SUBPROCESS_SHELL",
        "title": "Subprocess shell usage",
        "severity": "MEDIUM",
        "category": "code-execution",
        "pattern": re.compile(r"subprocess\.(run|Popen)\([^)]*shell\s*=\s*True", re.IGNORECASE),
        "message": "Detected subprocess execution with shell=True.",
    },
]


class PatternAnalyzer(Analyzer):
    name = "pattern"

    def run(self, skill: SkillModel) -> AnalyzerResult:
        result = AnalyzerResult(analyzer=self.name)
        for file_record in skill.text_files:
            if not file_record.content:
                continue
            lines = file_record.content.splitlines()
            for line_number, line in enumerate(lines, start=1):
                for rule in RULES:
                    match = rule["pattern"].search(line)
                    if not match:
                        continue
                    result.findings.append(
                        Finding(
                            rule_id=rule["id"],
                            title=rule["title"],
                            severity=rule["severity"],
                            category=rule["category"],
                            file_path=file_record.path,
                            line_number=line_number,
                            message=rule["message"],
                            evidence=match.group(0),
                            analyzer=self.name,
                        )
                    )
        result.metrics["scanned_text_files"] = len(skill.text_files)
        return result
