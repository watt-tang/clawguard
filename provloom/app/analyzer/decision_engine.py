from __future__ import annotations

from typing import Any

from app.analyzer.benign_patterns import detect_benign_patterns
from app.analyzer.risk_model import (
    DecisionInputs,
    DecisionResult,
    FinalDecision,
    SensitivityTier,
    SinkSemantics,
)
from app.analyzer.risk_scoring import score_risk_factors
from app.analyzer.sink_classifier import classify_sink
from app.analyzer.source_classifier import classify_source
from app.runtime.skill_parser import SkillDefinition


def evaluate_decision(
    *,
    detected_behaviors: list[str],
    normalized_events: list[dict[str, Any]],
    primary_chain: list[dict[str, Any]],
    graph_summary: dict[str, Any],
    skill_definition: SkillDefinition | None,
    tool_calls: list[Any],
    file_events: list[Any],
    network_events: list[Any],
    llm_events: list[Any],
) -> DecisionResult:
    """Run Stage B risk scoring over structured evidence from Stage A."""

    source = classify_source(
        primary_chain=primary_chain,
        skill_definition=skill_definition,
        tool_calls=tool_calls,
        file_events=file_events,
    )
    sink = classify_sink(primary_chain=primary_chain, tool_calls=tool_calls, network_events=network_events)
    risky_command, risky_command_reasons, command_evidence = classify_command_risk(skill_definition, tool_calls)
    outward_network = bool(network_events) or sink.is_external
    overprivileged_outward_action = (
        source.sensitivity == SensitivityTier.MEDIUM
        and source.is_generated_artifact
        and not source.from_public_lineage
        and sink.is_external
        and sink.tool_linked_http_action
        and sink.semantics in {
            SinkSemantics.PUBLIC_UPLOAD_OR_POST,
            SinkSemantics.CALLBACK_OR_WEBHOOK,
            SinkSemantics.LLM_MEDIATED_UNKNOWN_SINK,
            SinkSemantics.UNKNOWN_NETWORK_SINK,
        }
    )
    inputs = DecisionInputs(
        detected_behaviors=detected_behaviors,
        normalized_events=normalized_events,
        primary_chain=primary_chain,
        graph_summary=graph_summary,
        source=source,
        sink=sink,
        risky_command=risky_command,
        risky_command_reasons=risky_command_reasons,
        overprivileged_outward_action=overprivileged_outward_action,
        llm_involved=bool(llm_events),
        outward_network=outward_network,
        tool_evidence=[_tool_evidence(event) for event in tool_calls if getattr(event, "event", "") == "start"],
        command_evidence=command_evidence,
        llm_evidence=[_llm_evidence(event) for event in llm_events],
    )
    raw_score, triggered_factors, decision = score_risk_factors(inputs)
    suppression_factors = detect_benign_patterns(inputs)
    final_score = max(0, min(100, raw_score + sum(item.score_delta for item in suppression_factors)))
    if final_score >= 60:
        final_decision = FinalDecision.MALICIOUS
    elif final_score >= 30:
        final_decision = FinalDecision.NEEDS_REVIEW
    else:
        final_decision = FinalDecision.BENIGN
    return DecisionResult(
        risk_score=final_score,
        final_decision=final_decision,
        triggered_factors=triggered_factors,
        suppression_factors=suppression_factors,
        evidence_bundle={
            "source_assessment": source.to_dict(),
            "sink_assessment": sink.to_dict(),
            "risky_command_reasons": risky_command_reasons,
            "raw_score_before_suppression": raw_score,
            "normalized_event_count": len(normalized_events),
            "graph_summary": graph_summary,
        },
    )


def classify_command_risk(
    skill_definition: SkillDefinition | None,
    tool_calls: list[Any],
) -> tuple[bool, list[str], list[dict[str, Any]]]:
    """Classify shell-command evidence without conflating all helper commands with malicious use."""

    reasons: list[str] = []
    evidence: list[dict[str, Any]] = []
    if skill_definition is not None:
        for action in skill_definition.actions:
            if action.type != "run_command":
                continue
            command = str(action.config.get("command", ""))
            shell = bool(action.config.get("shell"))
            evidence.append({"action_id": action.id, "command": command, "shell": shell})
            if "{{ input_payload." in command or "{{input_payload." in command:
                reasons.append("Command template directly interpolates input_payload.")
            if shell and any(token in command for token in ["|", ";", "$(", "`", "&&"]):
                reasons.append("Shell command contains composition operators associated with command misuse.")
            if any(path in command for path in ["/etc/passwd", "/etc/shadow", "/etc/hosts", "/root/"]):
                reasons.append("Command references a sensitive local file path.")
    if not evidence:
        for event in tool_calls:
            if getattr(event, "event", "") != "start" or getattr(event, "tool_type", "") != "run_command":
                continue
            config = getattr(event, "metadata", {}).get("config", {})
            evidence.append({
                "action_id": getattr(event, "tool_id", ""),
                "command": str(config.get("command", "")),
                "shell": bool(config.get("shell")),
            })
    return bool(reasons), reasons, evidence


def _tool_evidence(event: Any) -> dict[str, Any]:
    return {
        "tool_id": getattr(event, "tool_id", ""),
        "tool_name": getattr(event, "tool_name", ""),
        "tool_type": getattr(event, "tool_type", ""),
        "config": getattr(event, "metadata", {}).get("config", {}),
    }


def _llm_evidence(event: Any) -> dict[str, Any]:
    return {
        "event": getattr(event, "event", ""),
        "step_id": getattr(event, "step_id", None),
        "metadata": getattr(event, "metadata", {}),
    }
