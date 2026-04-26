from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from app.analyzer.risk_model import SensitivityTier, SourceAssessment
from app.runtime.skill_parser import SkillAction, SkillDefinition

ACTION_REF_RE = re.compile(r"actions\.([A-Za-z0-9_]+)\.stdout")
PATH_RE = re.compile(r"(/etc/[^\s\"']+|/root/[^\s\"']+|/proc/[^\s\"']+|/sys/[^\s\"']+|runtime_output/[^\s\"']+|public/[^\s\"']+)")
SENSITIVE_PREFIXES = ("/etc/", "/root/", "/proc/", "/sys/", "/var/run/")
SYNTHETIC_SENSITIVE_MARKERS = (
    ".provloom/adapters/credential_state/",
    "/.provloom/adapters/credential_state/",
)
NOISY_SENSITIVE_PATHS = {
    "/etc/ld.so.cache",
    "/etc/localtime",
    "/etc/nsswitch.conf",
    "/etc/host.conf",
    "/etc/resolv.conf",
    "/etc/gai.conf",
}


@dataclass
class ActionLineage:
    """Recursive lineage summary for a single action output."""

    sensitivity: SensitivityTier
    reasons: list[str]
    evidence_paths: list[str]
    inferred_from: list[str]
    from_public_lineage: bool
    is_generated_artifact: bool
    is_sensitive_path: bool
    is_public_input: bool


def classify_source(
    *,
    primary_chain: list[dict[str, Any]],
    skill_definition: SkillDefinition | None,
    tool_calls: list[Any],
    file_events: list[Any],
) -> SourceAssessment:
    """Classify the best available source candidate for outbound-risk decisions."""

    chain_source = next((node for node in primary_chain if node.get("node_type") in {"file", "data"}), None)
    if chain_source is not None:
        label = str(chain_source.get("label", ""))
        lineage = _classify_path_with_lineage(label, skill_definition)
        return _assessment_from_lineage(label=label, node_type=str(chain_source.get("node_type", "unknown")), lineage=lineage)

    tool_http_posts = [
        event for event in tool_calls
        if getattr(event, "event", "") == "start"
        and getattr(event, "tool_type", "") == "http_request"
        and str(getattr(event, "metadata", {}).get("config", {}).get("method", "GET")).upper() != "GET"
    ]
    if tool_http_posts and skill_definition is not None:
        action_by_id = {action.id: action for action in skill_definition.actions}
        for tool_event in tool_http_posts:
            action = action_by_id.get(getattr(tool_event, "tool_id", ""))
            if action is None:
                continue
            lineage = _classify_action_output(action.id, action_by_id, {}, set())
            if lineage is None:
                continue
            label = lineage.evidence_paths[0] if lineage.evidence_paths else action.id
            return _assessment_from_lineage(label=label, node_type="file", lineage=lineage)

    sensitive_tool_paths = _tool_sensitive_paths(skill_definition)
    if sensitive_tool_paths:
        label = sensitive_tool_paths[0]
        lineage = _classify_path_with_lineage(label, skill_definition)
        return _assessment_from_lineage(label=label, node_type="file", lineage=lineage)

    generated_paths = sorted({
        getattr(event, "path", "")
        for event in file_events
        if str(getattr(event, "path", "")).startswith("runtime_output/")
    })
    if generated_paths:
        label = generated_paths[0]
        lineage = _classify_path_with_lineage(label, skill_definition)
        return _assessment_from_lineage(label=label, node_type="file", lineage=lineage)

    return SourceAssessment(
        sensitivity=SensitivityTier.UNKNOWN,
        reasons=["No source candidate could be established from chain, tool config, or file telemetry."],
    )


def _assessment_from_lineage(label: str, node_type: str, lineage: ActionLineage) -> SourceAssessment:
    return SourceAssessment(
        label=label,
        node_type=node_type,
        sensitivity=lineage.sensitivity,
        evidence_paths=lineage.evidence_paths,
        inferred_from=lineage.inferred_from,
        reasons=lineage.reasons,
        from_public_lineage=lineage.from_public_lineage,
        is_generated_artifact=lineage.is_generated_artifact,
        is_sensitive_path=lineage.is_sensitive_path,
        is_public_input=lineage.is_public_input,
        unknown=lineage.sensitivity == SensitivityTier.UNKNOWN,
    )


def _tool_sensitive_paths(skill_definition: SkillDefinition | None) -> list[str]:
    if skill_definition is None:
        return []
    sensitive_paths: list[str] = []
    for action in skill_definition.actions:
        if action.type == "read_file":
            path = str(action.config.get("path", ""))
            if _is_sensitive_path(path):
                sensitive_paths.append(path)
        if action.type == "run_command":
            sensitive_paths.extend(path for path in _paths_in_text(str(action.config.get("command", ""))) if _is_sensitive_path(path))
    return sensitive_paths


def _classify_path_with_lineage(path: str, skill_definition: SkillDefinition | None) -> ActionLineage:
    if path.startswith("public/"):
        return ActionLineage(
            sensitivity=SensitivityTier.LOW,
            reasons=["Source path is under public/ and is treated as public content."],
            evidence_paths=[path],
            inferred_from=["path:public"],
            from_public_lineage=True,
            is_generated_artifact=False,
            is_sensitive_path=False,
            is_public_input=True,
        )
    if _is_sensitive_path(path):
        return ActionLineage(
            sensitivity=SensitivityTier.HIGH,
            reasons=["Source path matches a sensitive local-file prefix."],
            evidence_paths=[path],
            inferred_from=["path:sensitive"],
            from_public_lineage=False,
            is_generated_artifact=False,
            is_sensitive_path=True,
            is_public_input=False,
        )
    if skill_definition is not None:
        action = _find_action_for_path(skill_definition.actions, path)
        if action is not None:
            lineage = _classify_action_output(action.id, {item.id: item for item in skill_definition.actions}, {}, set())
            if lineage is not None:
                return lineage
    if path.startswith("runtime_output/") or _looks_like_local_artifact(path):
        return ActionLineage(
            sensitivity=SensitivityTier.MEDIUM,
            reasons=["Source is a locally generated artifact with no public-only lineage evidence."],
            evidence_paths=[path],
            inferred_from=["path:generated"],
            from_public_lineage=False,
            is_generated_artifact=True,
            is_sensitive_path=False,
            is_public_input=False,
        )
    return ActionLineage(
        sensitivity=SensitivityTier.UNKNOWN,
        reasons=["Source path could not be mapped to a sensitivity tier."],
        evidence_paths=[path] if path else [],
        inferred_from=["path:unknown"],
        from_public_lineage=False,
        is_generated_artifact=False,
        is_sensitive_path=False,
        is_public_input=False,
    )


def _classify_action_output(
    action_id: str,
    action_by_id: dict[str, SkillAction],
    memo: dict[str, ActionLineage],
    stack: set[str],
) -> ActionLineage | None:
    if action_id in memo:
        return memo[action_id]
    if action_id in stack:
        return None
    action = action_by_id.get(action_id)
    if action is None:
        return None

    stack.add(action_id)
    if action.type == "read_file":
        lineage = _classify_path_with_lineage(str(action.config.get("path", "")), None)
        memo[action_id] = lineage
        stack.remove(action_id)
        return lineage
    if action.type == "http_request":
        method = str(action.config.get("method", "GET")).upper()
        if method == "GET":
            url = str(action.config.get("url", ""))
            lineage = ActionLineage(
                sensitivity=SensitivityTier.LOW,
                reasons=["HTTP GET result is treated as public fetched content for source-lineage purposes."],
                evidence_paths=[url] if url else [],
                inferred_from=[f"http_get:{url}"] if url else ["http_get"],
                from_public_lineage=True,
                is_generated_artifact=False,
                is_sensitive_path=False,
                is_public_input=True,
            )
            memo[action_id] = lineage
            stack.remove(action_id)
            return lineage
        body_refs = _classify_dependencies(action, action_by_id, memo, stack)
        memo[action_id] = body_refs
        stack.remove(action_id)
        return body_refs
    if action.type == "write_file":
        deps = _classify_dependencies(action, action_by_id, memo, stack)
        path = str(action.config.get("path", ""))
        lineage = _merge_lineages(
            [deps] if deps is not None else [],
            fallback_path=path,
            generated_default=True,
        )
        memo[action_id] = lineage
        stack.remove(action_id)
        return lineage
    if action.type == "run_command":
        command = str(action.config.get("command", ""))
        referenced_paths = _paths_in_text(command)
        direct_lineages = []
        for path in referenced_paths:
            writer_action = _find_writer_for_path(action_by_id.values(), path)
            if writer_action is not None and writer_action.id != action.id:
                lineage = _classify_action_output(writer_action.id, action_by_id, memo, stack)
                if lineage is not None:
                    direct_lineages.append(lineage)
                    continue
            direct_lineages.append(_classify_path_with_lineage(path, None))
        deps = _classify_dependencies(action, action_by_id, memo, stack)
        items = direct_lineages + ([deps] if deps is not None else [])
        lineage = _merge_lineages(items, fallback_path=referenced_paths[0] if referenced_paths else "", generated_default=False)
        memo[action_id] = lineage
        stack.remove(action_id)
        return lineage

    stack.remove(action_id)
    return None


def _classify_dependencies(
    action: SkillAction,
    action_by_id: dict[str, SkillAction],
    memo: dict[str, ActionLineage],
    stack: set[str],
) -> ActionLineage | None:
    refs = _action_references(action)
    lineages = [item for ref in refs if (item := _classify_action_output(ref, action_by_id, memo, stack)) is not None]
    if not lineages:
        return None
    return _merge_lineages(lineages, fallback_path="", generated_default=False)


def _merge_lineages(
    lineages: list[ActionLineage],
    *,
    fallback_path: str,
    generated_default: bool,
) -> ActionLineage:
    if any(item.sensitivity == SensitivityTier.HIGH for item in lineages):
        sensitivity = SensitivityTier.HIGH
    elif any(item.sensitivity == SensitivityTier.MEDIUM for item in lineages):
        sensitivity = SensitivityTier.MEDIUM
    elif any(item.sensitivity == SensitivityTier.LOW for item in lineages):
        sensitivity = SensitivityTier.LOW
    elif generated_default and fallback_path:
        sensitivity = SensitivityTier.MEDIUM
    else:
        sensitivity = SensitivityTier.UNKNOWN

    reasons: list[str] = []
    evidence_paths: list[str] = []
    inferred_from: list[str] = []
    for item in lineages:
        reasons.extend(item.reasons)
        evidence_paths.extend(item.evidence_paths)
        inferred_from.extend(item.inferred_from)

    if generated_default and not lineages and fallback_path:
        reasons.append("Generated artifact has no upstream public lineage, so it remains medium sensitivity.")
        evidence_paths.append(fallback_path)
        inferred_from.append("write_file:generated_default")

    return ActionLineage(
        sensitivity=sensitivity,
        reasons=_dedupe(reasons) or ["No lineage detail was available for this action output."],
        evidence_paths=_dedupe(evidence_paths),
        inferred_from=_dedupe(inferred_from),
        from_public_lineage=any(item.from_public_lineage for item in lineages),
        is_generated_artifact=generated_default or any(item.is_generated_artifact for item in lineages),
        is_sensitive_path=any(item.is_sensitive_path for item in lineages),
        is_public_input=all(item.is_public_input for item in lineages) if lineages else False,
    )


def _find_action_for_path(actions: list[SkillAction], path: str) -> SkillAction | None:
    for action in actions:
        if str(action.config.get("path", "")) == path:
            return action
        if action.type == "run_command" and path and path in str(action.config.get("command", "")):
            return action
    return None


def _find_writer_for_path(actions, path: str) -> SkillAction | None:
    for action in actions:
        if action.type == "write_file" and str(action.config.get("path", "")) == path:
            return action
    return None


def _action_references(action: SkillAction) -> list[str]:
    references: list[str] = []
    for value in action.config.values():
        references.extend(ACTION_REF_RE.findall(_stringify(value)))
    return _dedupe(references)


def _paths_in_text(text: str) -> list[str]:
    return _dedupe(PATH_RE.findall(text))


def _is_sensitive_path(path: str) -> bool:
    if not path or path in NOISY_SENSITIVE_PATHS:
        return False
    if any(marker in path for marker in SYNTHETIC_SENSITIVE_MARKERS):
        return True
    return path.startswith(SENSITIVE_PREFIXES)


def _looks_like_local_artifact(path: str) -> bool:
    return bool(path) and not path.startswith("/") and not path.startswith("public/")


def _stringify(value: Any) -> str:
    if isinstance(value, str):
        return value
    if isinstance(value, dict):
        return " ".join(_stringify(item) for item in value.values())
    if isinstance(value, list):
        return " ".join(_stringify(item) for item in value)
    return str(value)


def _dedupe(items: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for item in items:
        if not item or item in seen:
            continue
        seen.add(item)
        result.append(item)
    return result
