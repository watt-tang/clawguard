from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

from app.reporting.risk_mapper import enrich_log_payload


class ExecutionLogWriter:
    def __init__(self, log_dir: str = "Log") -> None:
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(parents=True, exist_ok=True)

    def get_log_path(self, execution_id: str, request: dict[str, Any]) -> Path:
        return self.log_dir / self._build_filename(execution_id, request)

    def write(
        self,
        execution_id: str,
        status: str,
        request: dict[str, Any],
        result: dict[str, Any] | None = None,
        error: str | None = None,
    ) -> Path:
        payload = {
            "execution_id": execution_id,
            "status": status,
            "request": request,
            "result": result,
            "error": error,
        }
        payload = enrich_log_payload(payload)
        target = self.get_log_path(execution_id, request)
        legacy_target = self.log_dir / f"{execution_id}.json"
        if legacy_target.exists() and legacy_target != target and not target.exists():
            legacy_target.rename(target)
        target.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        return target

    def _build_filename(self, execution_id: str, request: dict[str, Any]) -> str:
        skill_hint = request.get("suite_case") or request.get("skill_path") or "skill"
        slug = self._slugify(skill_hint)
        return f"{slug}__{execution_id[:12]}.json"

    @staticmethod
    def _slugify(value: str) -> str:
        raw = Path(str(value)).stem or Path(str(value)).name or "skill"
        normalized = re.sub(r"[^a-zA-Z0-9._-]+", "_", raw).strip("._-").lower()
        return normalized or "skill"
