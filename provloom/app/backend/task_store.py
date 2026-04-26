from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from threading import Lock
from typing import Any


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass
class TaskRecord:
    execution_id: str
    status: str
    created_at: str
    updated_at: str
    request: dict[str, Any]
    result: dict[str, Any] | None = None
    error: str | None = None


class TaskStore:
    def __init__(self) -> None:
        self._lock = Lock()
        self._tasks: dict[str, TaskRecord] = {}

    def create(self, execution_id: str, request: dict[str, Any]) -> TaskRecord:
        now = utc_now()
        task = TaskRecord(
            execution_id=execution_id,
            status="running",
            created_at=now,
            updated_at=now,
            request=request,
        )
        with self._lock:
            self._tasks[execution_id] = task
        return task

    def complete(self, execution_id: str, result: dict[str, Any]) -> TaskRecord:
        with self._lock:
            task = self._tasks[execution_id]
            task.status = "completed"
            task.updated_at = utc_now()
            task.result = result
            return task

    def fail(self, execution_id: str, error: str) -> TaskRecord:
        with self._lock:
            task = self._tasks[execution_id]
            task.status = "failed"
            task.updated_at = utc_now()
            task.error = error
            return task

    def get(self, execution_id: str) -> TaskRecord | None:
        with self._lock:
            return self._tasks.get(execution_id)

    def count(self) -> int:
        with self._lock:
            return len(self._tasks)
