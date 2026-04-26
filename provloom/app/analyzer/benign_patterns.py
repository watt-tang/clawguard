from __future__ import annotations

from typing import Any

from app.analyzer.risk_model import DecisionInputs, SensitivityTier, SinkSemantics, SuppressionFactor


def detect_benign_patterns(inputs: DecisionInputs) -> list[SuppressionFactor]:
    """Return auditable suppression factors for structured benign-flow patterns."""

    suppressions: list[SuppressionFactor] = []
    if _public_fetch_to_public_upload(inputs):
        suppressions.append(
            SuppressionFactor(
                code="public_fetch_to_public_upload",
                score_delta=-45,
                rationale="Observed transfer follows a public fetch to public upload pattern with no sensitive source or risky command.",
                evidence={
                    "source": inputs.source.to_dict(),
                    "sink": inputs.sink.to_dict(),
                },
            )
        )
    if _public_fetch_to_transform_or_note(inputs):
        suppressions.append(
            SuppressionFactor(
                code="public_fetch_to_transform_or_note",
                score_delta=-30,
                rationale="Observed activity mirrors public fetch or public content transformation into a local note/export without sensitive lineage.",
                evidence={
                    "source": inputs.source.to_dict(),
                    "detected_behaviors": inputs.detected_behaviors,
                },
            )
        )
    if _mirror_style_public_relay(inputs):
        suppressions.append(
            SuppressionFactor(
                code="mirror_style_public_relay",
                score_delta=-40,
                rationale="Relay chain is backed only by low-sensitivity public lineage and a benign outward post target.",
                evidence={
                    "primary_chain": inputs.primary_chain,
                },
            )
        )
    if _legal_helper_command(inputs):
        suppressions.append(
            SuppressionFactor(
                code="legal_helper_command",
                score_delta=-40,
                rationale="Shell-backed helper command operates on local non-sensitive data without templated command construction.",
                evidence={
                    "command_evidence": inputs.command_evidence,
                },
            )
        )
    if _benign_llm_safe_tool_usage(inputs):
        suppressions.append(
            SuppressionFactor(
                code="benign_llm_safe_tool_usage",
                score_delta=-25,
                rationale="LLM involvement is limited to safe, non-sensitive local or public-content tool usage.",
                evidence={
                    "llm_evidence": inputs.llm_evidence,
                },
            )
        )
    return suppressions


def _guardrails_hold(inputs: DecisionInputs) -> bool:
    return (
        not inputs.risky_command
        and inputs.source.sensitivity != SensitivityTier.HIGH
        and not inputs.overprivileged_outward_action
    )


def _public_fetch_to_public_upload(inputs: DecisionInputs) -> bool:
    return (
        _guardrails_hold(inputs)
        and inputs.source.from_public_lineage
        and inputs.sink.semantics == SinkSemantics.PUBLIC_UPLOAD_OR_POST
        and inputs.source.sensitivity == SensitivityTier.LOW
    )


def _public_fetch_to_transform_or_note(inputs: DecisionInputs) -> bool:
    return (
        _guardrails_hold(inputs)
        and inputs.source.from_public_lineage
        and inputs.source.sensitivity == SensitivityTier.LOW
        and inputs.sink.semantics in {SinkSemantics.PUBLIC_FETCH_ONLY, SinkSemantics.UNKNOWN_NETWORK_SINK}
    )


def _mirror_style_public_relay(inputs: DecisionInputs) -> bool:
    relay_nodes = [node for node in inputs.primary_chain if node.get("role") == "relay"]
    return (
        _guardrails_hold(inputs)
        and bool(relay_nodes)
        and inputs.source.from_public_lineage
        and inputs.source.sensitivity == SensitivityTier.LOW
        and inputs.sink.semantics == SinkSemantics.PUBLIC_UPLOAD_OR_POST
    )


def _legal_helper_command(inputs: DecisionInputs) -> bool:
    if inputs.risky_command or inputs.outward_network:
        return False
    if inputs.source.sensitivity == SensitivityTier.HIGH:
        return False
    commands = " ".join(str(item.get("command", "")) for item in inputs.command_evidence)
    return any(token in commands for token in {"tools/helper.py", "python tools/helper.py", "wc ", "sha", "tar "})


def _benign_llm_safe_tool_usage(inputs: DecisionInputs) -> bool:
    return (
        inputs.llm_involved
        and not inputs.risky_command
        and inputs.source.sensitivity in {SensitivityTier.LOW, SensitivityTier.UNKNOWN}
        and inputs.sink.semantics in {SinkSemantics.PUBLIC_FETCH_ONLY, SinkSemantics.TOOL_INTERNAL_ENDPOINT, SinkSemantics.UNKNOWN_NETWORK_SINK}
    )
