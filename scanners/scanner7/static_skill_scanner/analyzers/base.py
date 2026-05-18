from __future__ import annotations

from abc import ABC, abstractmethod

from ..models import AnalyzerResult, SkillModel


class Analyzer(ABC):
    name: str

    @abstractmethod
    def run(self, skill: SkillModel) -> AnalyzerResult:
        raise NotImplementedError
