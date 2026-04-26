from __future__ import annotations

from app.analyzer.risk_model import (
    DecisionInputs,
    FinalDecision,
    RiskFactor,
    SensitivityTier,
    SinkSemantics,
)


def _has_evidence_backed_external_sink(inputs: DecisionInputs) -> bool:
    """External sink severity depends on outbound evidence, not sink resolution quality."""

    if not inputs.sink.is_external:
        return False
    return any(
        (
            inputs.sink.declared_endpoint,
            inputs.sink.tool_linked_http_action,
            bool(inputs.sink.network_evidence_sources),
            bool(inputs.primary_chain),
            "network_access" in inputs.detected_behaviors,
        )
    )


def _supports_critical_external_transfer(inputs: DecisionInputs) -> bool:
    """Critical exfiltration severity is source-to-network driven and resolution-agnostic."""

    return (
        inputs.source.sensitivity == SensitivityTier.HIGH
        and _has_evidence_backed_external_sink(inputs)
    )


def _supports_generated_artifact_external_transfer(inputs: DecisionInputs) -> bool:
    return (
        inputs.source.sensitivity == SensitivityTier.MEDIUM
        and not inputs.source.from_public_lineage
        and _has_evidence_backed_external_sink(inputs)
        and inputs.sink.semantics in {
            SinkSemantics.PUBLIC_UPLOAD_OR_POST,
            SinkSemantics.CALLBACK_OR_WEBHOOK,
            SinkSemantics.LLM_MEDIATED_UNKNOWN_SINK,
            SinkSemantics.UNKNOWN_NETWORK_SINK,
        }
    )


def _supports_external_account_or_credential_registration(inputs: DecisionInputs) -> bool:
    if not inputs.llm_involved or not inputs.sink.is_external:
        return False
    if inputs.sink.semantics != SinkSemantics.PUBLIC_UPLOAD_OR_POST:
        return False
    label = str(inputs.sink.label or inputs.sink.sink_url or inputs.sink.sink_display_label).lower()
    return any(
        token in label
        for token in {
            "register",
            "signup",
            "sign-up",
            "credential",
            "credentials",
            "api_key",
            "apikey",
            "token",
            "oauth",
        }
    )


def score_risk_factors(inputs: DecisionInputs) -> tuple[int, list[RiskFactor], FinalDecision]:
    """Convert structured evidence into auditable risk factors and a final decision."""

    factors: list[RiskFactor] = []
    if _supports_critical_external_transfer(inputs):
        factors.append(
            RiskFactor(
                code="high_sensitivity_source_to_external_sink",
                score_delta=80,
                rationale=(
                    "High-sensitivity source is connected to an evidence-backed external network direction. "
                    "Sink resolution status does not reduce severity by itself."
                ),
                evidence={
                    "source": inputs.source.to_dict(),
                    "sink": inputs.sink.to_dict(),
                },
            )
        )
    if _supports_generated_artifact_external_transfer(inputs):
        factors.append(
            RiskFactor(
                code="generated_artifact_external_transfer",
                score_delta=55,
                rationale="Locally generated artifact is transferred outward without public-only lineage.",
                evidence={"source": inputs.source.to_dict(), "sink": inputs.sink.to_dict()},
            )
        )
    if inputs.overprivileged_outward_action:
        factors.append(
            RiskFactor(
                code="overprivileged_outward_tool_action",
                score_delta=45,
                rationale="Outward-facing http_request tool transfers locally produced data.",
                evidence={"tool_evidence": inputs.tool_evidence, "source": inputs.source.to_dict()},
            )
        )
    if inputs.risky_command:
        factors.append(
            RiskFactor(
                code="unsafe_command_construction",
                score_delta=70,
                rationale="Command evidence indicates templated or shell-abusive command construction.",
                evidence={"reasons": inputs.risky_command_reasons, "commands": inputs.command_evidence},
            )
        )
    if _supports_external_account_or_credential_registration(inputs):
        factors.append(
            RiskFactor(
                code="llm_directed_external_account_registration",
                score_delta=80,
                rationale=(
                    "LLM-directed execution attempted to create or register an external account, token, "
                    "or credential-bearing resource through an outward POST request."
                ),
                evidence={"sink": inputs.sink.to_dict(), "llm_evidence": inputs.llm_evidence},
            )
        )
    if inputs.llm_involved and (inputs.outward_network or inputs.risky_command):
        factors.append(
            RiskFactor(
                code="llm_induced_risky_action",
                score_delta=25,
                rationale="LLM steps appear on the path to an outward action or risky command.",
                evidence={"llm_evidence": inputs.llm_evidence},
            )
        )
    if (
        inputs.source.sensitivity == SensitivityTier.UNKNOWN
        and inputs.outward_network
        and inputs.sink.semantics in {
            SinkSemantics.CALLBACK_OR_WEBHOOK,
            SinkSemantics.LLM_MEDIATED_UNKNOWN_SINK,
            SinkSemantics.UNKNOWN_NETWORK_SINK,
        }
    ):
        factors.append(
            RiskFactor(
                code="unknown_source_external_sink",
                score_delta=25,
                rationale="Outbound transfer reached an external sink while the source remained unresolved.",
                evidence={"sink": inputs.sink.to_dict()},
            )
        )
    raw_score = sum(item.score_delta for item in factors)
    if raw_score >= 60:
        decision = FinalDecision.MALICIOUS
    elif raw_score >= 30:
        decision = FinalDecision.NEEDS_REVIEW
    else:
        decision = FinalDecision.BENIGN
    return raw_score, factors, decision
