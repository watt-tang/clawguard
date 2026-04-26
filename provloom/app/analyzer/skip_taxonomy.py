from __future__ import annotations

from dataclasses import dataclass
from typing import Any


SKIP_UNSUPPORTED_CAPABILITY_PROFILE = "unsupported_capability_profile"
SKIP_AUTH_OR_EXTERNAL_ACCOUNT_REQUIRED = "auth_or_external_account_required"
SKIP_ECOSYSTEM_ADAPTER_MISSING = "ecosystem_adapter_missing"
SKIP_TRIGGER_CONDITION_UNSATISFIED = "trigger_condition_unsatisfied"
SKIP_RESOURCE_BUDGET_EXCEEDED = "resource_budget_exceeded"
SKIP_HEAVY_DEPENDENCY_NOT_ADMITTED = "heavy_dependency_not_admitted"
SKIP_DESIGN_LEVEL_ONLY_RISK = "design_level_only_risk"
SKIP_INSUFFICIENT_EXECUTION_CONTEXT = "insufficient_execution_context"

SKIP_CATEGORIES = {
    SKIP_UNSUPPORTED_CAPABILITY_PROFILE,
    SKIP_AUTH_OR_EXTERNAL_ACCOUNT_REQUIRED,
    SKIP_ECOSYSTEM_ADAPTER_MISSING,
    SKIP_TRIGGER_CONDITION_UNSATISFIED,
    SKIP_RESOURCE_BUDGET_EXCEEDED,
    SKIP_HEAVY_DEPENDENCY_NOT_ADMITTED,
    SKIP_DESIGN_LEVEL_ONLY_RISK,
    SKIP_INSUFFICIENT_EXECUTION_CONTEXT,
}


@dataclass
class SkipBundle:
    skip_category: str
    skip_explanation: dict[str, Any]
    partial_evidence: dict[str, Any]
    profile_promotion_recommended: str
    execution_outcome: str


def categorize_skip(
    *,
    skip_reason: str | None,
    capability_profile: dict[str, Any] | None,
    execution_plan: dict[str, Any] | None,
    trigger_hits: list[str] | None = None,
    budget_exceeded: bool = False,
    static_report: dict[str, Any] | None = None,
) -> str:
    reason = str(skip_reason or "").strip().lower()
    tags = set((capability_profile or {}).get("capability_tags") or [])

    if budget_exceeded:
        return SKIP_RESOURCE_BUDGET_EXCEEDED
    if trigger_hits is not None and len(trigger_hits) == 0 and reason in {"", "trigger_condition_unsatisfied"}:
        return SKIP_TRIGGER_CONDITION_UNSATISFIED
    if reason.startswith("unsupported_runtime") or reason == "unsupported_action_type":
        return SKIP_UNSUPPORTED_CAPABILITY_PROFILE
    if reason in {"llm_skill_requires_api_key", "auth_or_external_account_required"}:
        return SKIP_AUTH_OR_EXTERNAL_ACCOUNT_REQUIRED
    if reason == "ecosystem_adapter_missing":
        return SKIP_ECOSYSTEM_ADAPTER_MISSING
    if reason == "external_dependency_missing":
        return SKIP_HEAVY_DEPENDENCY_NOT_ADMITTED
    if reason == "invalid_skill_definition":
        return SKIP_INSUFFICIENT_EXECUTION_CONTEXT

    if "requires_oauth_or_login" in tags:
        return SKIP_AUTH_OR_EXTERNAL_ACCOUNT_REQUIRED
    if _has_design_only_risk(static_report):
        return SKIP_DESIGN_LEVEL_ONLY_RISK
    return SKIP_INSUFFICIENT_EXECUTION_CONTEXT


def build_skip_bundle(
    *,
    skip_category: str,
    skip_reason: str | None,
    capability_profile: dict[str, Any] | None,
    execution_plan: dict[str, Any] | None,
    static_report: dict[str, Any] | None,
    trigger_plan: dict[str, Any] | None,
    trigger_hits: list[str] | None = None,
    trigger_used: list[str] | None = None,
    budget_exceeded: bool = False,
    status: str = "skipped",
) -> SkipBundle:
    cap = capability_profile or {}
    plan = execution_plan or {}
    static = static_report or {}
    tplan = trigger_plan or {}

    detected_required_capabilities = list(cap.get("capability_tags") or [])
    unsatisfied = _unsatisfied_requirements(
        skip_category=skip_category,
        skip_reason=skip_reason,
        capability_profile=cap,
        execution_plan=plan,
        trigger_hits=trigger_hits or [],
    )
    candidate_risks = _candidate_risk_mechanisms(capability_profile=cap, static_report=static)
    static_summary = {
        "detected_behaviors": list(static.get("detected_behaviors", [])),
        "risk_score": int(static.get("risk_score", 0)),
        "root_cause_detail": static.get("root_cause_detail", "unknown"),
    }
    recommended_promotion = str(plan.get("promoted_profile") or plan.get("effective_profile") or cap.get("recommended_profile") or "")
    recommended_adapters = list((plan.get("profile_config", {}) or {}).get("adapters_enabled", []))
    partial = build_partial_evidence(
        observed_behaviors=list(static.get("detected_behaviors", [])),
        source_assessment=static.get("source_assessment") or {},
        sink_assessment=static.get("sink_assessment") or {},
        candidate_risk_mechanisms=candidate_risks,
        root_cause_detail=str(static.get("root_cause_detail", "unknown")),
    )
    meaningful = bool(partial.get("observed_behaviors") or partial.get("partial_root_cause_hypotheses"))
    explanation = {
        "skip_reason": skip_reason,
        "detected_required_capabilities": detected_required_capabilities,
        "unsatisfied_requirements": unsatisfied,
        "candidate_risk_mechanisms": candidate_risks,
        "static_evidence_summary": static_summary,
        "recommended_profile_promotion": recommended_promotion,
        "recommended_adapter_set": recommended_adapters,
        "whether_partial_analysis_is_meaningful": meaningful,
        "trigger_context": {
            "trigger_depth": tplan.get("trigger_depth", ""),
            "trigger_budget_class": tplan.get("budget_class", ""),
            "trigger_used_count": len(trigger_used or []),
            "trigger_hit_count": len(trigger_hits or []),
        },
    }
    outcome = classify_execution_outcome(
        status=status,
        skip_category=skip_category,
        partial_meaningful=meaningful,
        budget_exceeded=budget_exceeded,
    )
    return SkipBundle(
        skip_category=skip_category,
        skip_explanation=explanation,
        partial_evidence=partial,
        profile_promotion_recommended=recommended_promotion,
        execution_outcome=outcome,
    )


def build_partial_evidence(
    *,
    observed_behaviors: list[str],
    source_assessment: dict[str, Any],
    sink_assessment: dict[str, Any],
    candidate_risk_mechanisms: list[str],
    root_cause_detail: str,
) -> dict[str, Any]:
    hypotheses = []
    if root_cause_detail and root_cause_detail != "unknown":
        hypotheses.append(root_cause_detail)
    hypotheses.extend(candidate_risk_mechanisms)
    strength = _provisional_strength(observed_behaviors, source_assessment, sink_assessment)
    return {
        "observed_behaviors": observed_behaviors,
        "partial_source_assessment": source_assessment,
        "partial_sink_assessment": sink_assessment,
        "partial_root_cause_hypotheses": _dedupe(hypotheses),
        "evidence_strength": {
            "provisional": strength,
        },
    }


def classify_execution_outcome(
    *,
    status: str,
    skip_category: str | None,
    partial_meaningful: bool,
    budget_exceeded: bool,
) -> str:
    normalized = str(status or "").strip().lower()
    if normalized == "completed":
        if budget_exceeded or (skip_category in {SKIP_TRIGGER_CONDITION_UNSATISFIED, SKIP_RESOURCE_BUDGET_EXCEEDED}) or partial_meaningful:
            return "completed_partial"
        return "completed_full"
    if normalized == "skipped":
        return "skipped_bounded"
    if normalized == "failed":
        if budget_exceeded:
            return "failed_bounded"
        return "failed_runtime"
    return "unknown"


def _unsatisfied_requirements(
    *,
    skip_category: str,
    skip_reason: str | None,
    capability_profile: dict[str, Any],
    execution_plan: dict[str, Any],
    trigger_hits: list[str],
) -> list[str]:
    requirements = list(capability_profile.get("blocking_requirements") or [])
    if skip_reason:
        requirements.append(f"raw_skip_reason:{skip_reason}")
    if skip_category == SKIP_ECOSYSTEM_ADAPTER_MISSING:
        required_adapters = list((execution_plan.get("profile_config", {}) or {}).get("adapters_enabled", []))
        if required_adapters:
            requirements.append("required_adapters_missing:" + ",".join(required_adapters))
    if skip_category == SKIP_TRIGGER_CONDITION_UNSATISFIED and not trigger_hits:
        requirements.append("no_trigger_hits_observed")
    if skip_category == SKIP_RESOURCE_BUDGET_EXCEEDED:
        requirements.append("resource_budget_exceeded_in_current_profile")
    if skip_category == SKIP_HEAVY_DEPENDENCY_NOT_ADMITTED:
        requirements.append("external_or_heavy_dependency_not_admitted")
    return _dedupe(requirements)


def _candidate_risk_mechanisms(*, capability_profile: dict[str, Any], static_report: dict[str, Any]) -> list[str]:
    tags = set(capability_profile.get("capability_tags") or [])
    detected = set(static_report.get("detected_behaviors") or [])
    mechanisms: list[str] = []
    if "network_access" in detected or any(tag in tags for tag in {"requires_web_platform", "requires_callback_or_webhook", "requires_messaging_stack"}):
        mechanisms.append("outward_transfer_or_sync")
    if "sensitive_file_read" in detected or "requires_external_api_key" in tags:
        mechanisms.append("sensitive_artifact_exposure")
    if "process_spawn" in detected or "shell_execution" in detected or "requires_local_helper_tooling" in tags:
        mechanisms.append("unsafe_or_risky_command_execution")
    if "read_then_exfiltration" in detected:
        mechanisms.append("source_to_sink_exfiltration_chain")
    if "requires_document_or_office_stack" in tags:
        mechanisms.append("document_relay_or_upload")
    return _dedupe(mechanisms)


def _has_design_only_risk(static_report: dict[str, Any] | None) -> bool:
    report = static_report or {}
    score = int(report.get("risk_score", 0))
    detected = set(report.get("detected_behaviors") or [])
    return score >= 20 or bool({"network_access", "read_then_exfiltration", "sensitive_file_read"} & detected)


def _provisional_strength(
    observed_behaviors: list[str],
    source_assessment: dict[str, Any],
    sink_assessment: dict[str, Any],
) -> str:
    source_known = bool(source_assessment and source_assessment.get("sensitivity") not in {None, "", "UNKNOWN"})
    sink_known = bool(sink_assessment and sink_assessment.get("semantics") not in {None, "", "UNKNOWN_NETWORK_SINK"})
    if len(observed_behaviors) >= 3 and source_known and sink_known:
        return "high"
    if observed_behaviors and (source_known or sink_known):
        return "medium"
    if observed_behaviors:
        return "low"
    return "minimal"


def _dedupe(items: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for item in items:
        if not item or item in seen:
            continue
        seen.add(item)
        result.append(item)
    return result

