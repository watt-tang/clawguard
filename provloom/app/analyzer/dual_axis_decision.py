from __future__ import annotations

from typing import Any


SEVERITY_BENIGN = "benign_like"
SEVERITY_WEAK = "weakly_suspicious"
SEVERITY_SUBSTANTIAL = "substantial_risk"
SEVERITY_SEVERE = "severe_risk"

EVIDENCE_SPECULATIVE = "speculative"
EVIDENCE_PARTIAL = "partial"
EVIDENCE_CHAIN_BACKED = "chain_backed"
EVIDENCE_STRONG = "strongly_evidenced"


def infer_dual_axis_decision(
    *,
    risk_score: int,
    risk_level: str,
    detected_behaviors: list[str],
    source_assessment: dict[str, Any] | None,
    sink_assessment: dict[str, Any] | None,
    primary_chain: list[dict[str, Any]] | None,
    trigger_used: list[str] | None = None,
    trigger_hits: list[str] | None = None,
    enabled_adapters: list[str] | None = None,
    execution_outcome: str | None = None,
    skip_category: str | None = None,
    llm_involved: bool = False,
) -> dict[str, Any]:
    source = source_assessment or {}
    sink = sink_assessment or {}
    behaviors = set(detected_behaviors or [])
    chain = primary_chain or []
    used = trigger_used or []
    hits = trigger_hits or []
    adapters = enabled_adapters or []
    outcome = str(execution_outcome or "")
    skip = str(skip_category or "")

    source_sensitivity = str(source.get("sensitivity", "UNKNOWN"))
    sink_semantics = str(sink.get("semantics", "UNKNOWN_NETWORK_SINK"))
    sink_external = bool(sink.get("is_external", False)) or "network_access" in behaviors
    unknown_source = source_sensitivity in {"UNKNOWN", ""}
    unknown_sink = sink_semantics in {"UNKNOWN_NETWORK_SINK", ""}
    has_sensitive_source = source_sensitivity == "HIGH_SENSITIVITY" or "sensitive_file_read" in behaviors
    has_read_then_exfil = "read_then_exfiltration" in behaviors
    risky_command_signal = "shell_execution" in behaviors or ("process_spawn" in behaviors and "network_access" not in behaviors)
    chain_nontrivial = _is_nontrivial_chain(chain)

    severity_factors: list[str] = []
    evidence_factors: list[str] = []
    uncertainty_factors: list[str] = []

    if risk_score >= 80 and sink_external:
        severity = SEVERITY_SEVERE
        severity_factors.append("critical_score_with_external_sink")
    elif has_sensitive_source and sink_external and chain_nontrivial:
        severity = SEVERITY_SEVERE
        severity_factors.append("high_sensitivity_source_to_external_sink_with_nontrivial_chain")
    elif has_read_then_exfil or (has_sensitive_source and sink_external) or (risky_command_signal and sink_external):
        severity = SEVERITY_SUBSTANTIAL
        severity_factors.append("substantial_source_sink_or_command_signal")
    elif sink_external or risky_command_signal or "process_spawn" in behaviors:
        severity = SEVERITY_WEAK
        severity_factors.append("limited_suspicious_activity_without_strong_chain")
    else:
        severity = SEVERITY_BENIGN
        severity_factors.append("no_meaningful_suspicious_signal")

    if has_sensitive_source and sink_external and chain_nontrivial and not unknown_source and not unknown_sink:
        evidence = EVIDENCE_CHAIN_BACKED
        evidence_factors.append("source_sink_chain_is_nontrivial_and_resolved")
    elif chain_nontrivial and not unknown_source and not unknown_sink and hits:
        evidence = EVIDENCE_STRONG
        evidence_factors.append("chain_resolved_with_trigger_hits")
    elif _is_partial_context(outcome=outcome, skip_category=skip, trigger_used=used, trigger_hits=hits):
        evidence = EVIDENCE_PARTIAL
        evidence_factors.append("partial_execution_or_trigger_context")
    elif unknown_source or unknown_sink:
        evidence = EVIDENCE_SPECULATIVE
        evidence_factors.append("source_or_sink_uncertainty_limits_evidence")
    elif sink_external or risky_command_signal:
        evidence = EVIDENCE_PARTIAL
        evidence_factors.append("signal_present_without_full_chain")
    else:
        evidence = EVIDENCE_STRONG
        evidence_factors.append("benign_or_well_resolved_context")

    if unknown_source:
        uncertainty_factors.append("source_is_unknown_or_unresolved")
    if unknown_sink:
        uncertainty_factors.append("sink_is_unknown_or_unresolved")
    if used and not hits:
        uncertainty_factors.append("trigger_suite_used_but_no_trigger_hits")
    if skip in {"ecosystem_adapter_missing", "auth_or_external_account_required"}:
        uncertainty_factors.append("execution_context_blocked_by_adapter_or_auth_requirement")
    if llm_involved:
        uncertainty_factors.append("llm_involvement_requires_extra_causal_scrutiny")
    if adapters and not hits:
        uncertainty_factors.append("adapters_enabled_but_chain_not_fully_recovered")

    return {
        "severity_label": severity,
        "evidence_strength": evidence,
        "decision_rationale": {
            "severity_factors": severity_factors,
            "evidence_factors": evidence_factors,
            "uncertainty_factors": uncertainty_factors,
            "legacy_risk": {
                "risk_score": int(risk_score),
                "risk_level": risk_level,
            },
            "observability_context": {
                "trigger_used_count": len(used),
                "trigger_hit_count": len(hits),
                "enabled_adapter_count": len(adapters),
                "execution_outcome": outcome,
                "skip_category": skip or None,
            },
        },
    }


def _is_nontrivial_chain(primary_chain: list[dict[str, Any]]) -> bool:
    if len(primary_chain) >= 3:
        return True
    node_types = {str(item.get("node_type", "")) for item in primary_chain}
    return "network_endpoint" in node_types and ("file" in node_types or "data" in node_types)


def _is_partial_context(
    *,
    outcome: str,
    skip_category: str,
    trigger_used: list[str],
    trigger_hits: list[str],
) -> bool:
    if outcome in {"completed_partial", "skipped_bounded", "failed_bounded"}:
        return True
    if skip_category in {
        "trigger_condition_unsatisfied",
        "resource_budget_exceeded",
        "ecosystem_adapter_missing",
        "insufficient_execution_context",
    }:
        return True
    return bool(trigger_used) and not trigger_hits
