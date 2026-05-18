from __future__ import annotations

import shutil
import tempfile
import zipfile
from pathlib import Path

from .models import ParsedWorkspace


def parse_input(source: str) -> ParsedWorkspace:
    input_path = Path(source).expanduser().resolve()
    if not input_path.exists():
        raise FileNotFoundError(f"Input path not found: {input_path}")

    logs: list[str] = []
    temp_dir: Path | None = None

    if input_path.is_file() and input_path.suffix.lower() == ".zip":
        temp_dir = Path(tempfile.mkdtemp(prefix="skill-scan-"))
        with zipfile.ZipFile(input_path, "r") as archive:
            _safe_extract_zip(archive, temp_dir)
        workspace_path = temp_dir
        logs.append(f"Extracted zip archive to {workspace_path}")
    elif input_path.is_dir():
        workspace_path = input_path
        logs.append(f"Using directory input {workspace_path}")
    else:
        raise ValueError("Only directories and .zip archives are supported in this minimal version.")

    skill_root = _find_skill_root(workspace_path)
    logs.append(f"Resolved skill root to {skill_root}")
    return ParsedWorkspace(source=source, workspace_path=workspace_path, skill_root=skill_root, temp_dir=temp_dir, parse_logs=logs)


def cleanup_workspace(parsed: ParsedWorkspace) -> None:
    if parsed.temp_dir and parsed.temp_dir.exists():
        shutil.rmtree(parsed.temp_dir, ignore_errors=True)


def _find_skill_root(workspace_path: Path) -> Path:
    matches = sorted(path.parent for path in workspace_path.rglob("SKILL.md"))
    if len(matches) == 1:
        return matches[0]
    if len(matches) > 1:
        return matches[0]

    entries = list(workspace_path.iterdir())
    dirs = [item for item in entries if item.is_dir()]
    files = [item for item in entries if item.is_file()]
    if len(dirs) == 1 and not files:
        return dirs[0]
    return workspace_path


def _safe_extract_zip(archive: zipfile.ZipFile, target_dir: Path) -> None:
    target_root = target_dir.resolve()
    for member in archive.infolist():
        destination = (target_dir / member.filename).resolve()
        if destination != target_root and not str(destination).startswith(str(target_root) + str(Path("/"))):
            raise RuntimeError(f"Zip Slip detected: {member.filename}")
    archive.extractall(target_dir)
