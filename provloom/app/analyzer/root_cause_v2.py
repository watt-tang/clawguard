from __future__ import annotations

from typing import Any


MECHANISM_UNSAFE_DATAFLOW_DESIGN = "unsafe_dataflow_design"
MECHANISM_UNSAFE_COMMAND_CONSTRUCTION = "unsafe_command_construction"
MECHANISM_OVERPRIVILEGED_EXTERNAL_TRANSFER = "overprivileged_external_transfer"
MECHANISM_PROMPT_MEDIATED_ACTION = "prompt_mediated_action"
MECHANISM_ECOSYSTEM_COUPLED_EXTERNALIZATION = "ecosystem_coupled_externalization"
MECHANISM_AMBIGUOUS_CONNECTED_WORKFLOW = "ambiguous_connected_workflow"
MECHANISM_BENIGN_PUBLIC_RELAY = "benign_public_relay"
MECHANISM_INSUFFICIENT_CONTEXT = "insufficient_context"

DRIVER_AUTHORED_SKILL_LOGIC = "authored_skill_logic"
DRIVER_TOOL_SELECTION = "tool_selection"
DRIVER_LLM_DECISION = "llm_decision"
DRIVER_PLATFORM_ADAPTER_PATH = "platform_adapter_path"
DRIVER_EXTERNAL_CALLBACK = "external_callback"
DRIVER_MIXED = "mixed"

EVIDENCE_GRAPH_BACKED = "graph_backed"
EVIDENCE_BEHAVIOR_ONLY = "behavior_only"
EVIDENCE_STATIC_ONLY = "static_only"
EVIDENCE_TRIGGER_INCOMPLETE = "trigger_incomplete"
EVIDENCE_ADAPTER_LIMITED = "adapter_limited"


def infer_root_cause_v2(
    *,
    legacy_root_cause: str,
    legacy_root_cause_detail: str,
    detected_behaviors: list[str] | None,
    source_assessment: dict[str, Any] | None,
    sink_assessment: dict[str, Any] | None,
    primary_chain: list[dict[str, Any]] | None,
    root_cause_evidence: dict[str, Any] | None = None,
    execution_outcome: str | None = None,
    skip_category: str | None = None,
    trigger_used: list[str] | None = None,
    trigger_hits: list[str] | None = None,
    enabled_adapters: list[str] | None = None,
    llm_involved: bool = False,
    analysis_mode: str | None = None,
) -> dict[str, Any]:
    behaviors = set(detected_behaviors or [])
    source = source_assessment or {}
    sink = sink_assessment or {}
    chain = primary_chain or []
    evidence = root_cause_evidence or {}
    used = trigger_used or []
    hits = trigger_hits or []
    adapters = enabled_adapters or []
    skip = str(skip_category or "")
    outcome = str(execution_outcome or "")
    detail = str(legacy_root_cause_detail or "unknown")

    source_sensitivity = str(source.get("sensitivity", "UNKNOWN"))
    source_public_lineage = bool(source.get("from_public_lineage", False))
    source_label = str(source.get("label", ""))
    sink_semantics = str(sink.get("semantics", "UNKNOWN_NETWORK_SINK"))
    sink_external = bool(sink.get("is_external", False)) or ("network_access" in behaviors)
    chain_backed = _is_graph_backed(chain, evidence)
    static_mode = str(analysis_mode or "") == "static_only"

    has_sensitive_source = source_sensitivity == "HIGH_SENSITIVITY" or "sensitive_file_read" in behaviors
    has_generated_source = source_sensitivity == "MEDIUM_SENSITIVITY" or _looks_like_generated_artifact(source_label)
    has_risky_command = "shell_execution" in behaviors or detail == "unsafe_command_construction"
    has_prompt_injection_signal = detail == "prompt_injection_suspected"
    has_outward_transfer = sink_external and sink_semantics != "PUBLIC_FETCH_ONLY"
    is_callback_semantics = sink_semantics == "CALLBACK_OR_WEBHOOK"

    mechanism = MECHANISM_INSUFFICIENT_CONTEXT
    if static_mode and not behaviors:
        mechanism = MECHANISM_INSUFFICIENT_CONTEXT
    elif source_public_lineage and source_sensitivity == "LOW_SENSITIVITY" and sink_semantics in {
        "PUBLIC_UPLOAD_OR_POST",
        "PUBLIC_FETCH_ONLY",
    } and not has_risky_command and not has_sensitive_source:
        mechanism = MECHANISM_BENIGN_PUBLIC_RELAY
    elif has_prompt_injection_signal:
        mechanism = MECHANISM_PROMPT_MEDIATED_ACTION
    elif has_risky_command:
        mechanism = MECHANISM_UNSAFE_COMMAND_CONSTRUCTION
    elif has_sensitive_source and has_outward_transfer:
        mechanism = MECHANISM_UNSAFE_DATAFLOW_DESIGN
    elif has_generated_source and has_outward_transfer and not source_public_lineage:
        mechanism = MECHANISM_OVERPRIVILEGED_EXTERNAL_TRANSFER
    elif skip in {
        "ecosystem_adapter_missing",
        "auth_or_external_account_required",
        "trigger_condition_unsatisfied",
    } or sink_semantics == "LLM_MEDIATED_UNKNOWN_SINK":
        mechanism = MECHANISM_ECOSYSTEM_COUPLED_EXTERNALIZATION
    elif "network_access" in behaviors or "process_spawn" in behaviors or chain:
        mechanism = MECHANISM_AMBIGUOUS_CONNECTED_WORKFLOW

    primary_driver = DRIVER_AUTHORED_SKILL_LOGIC
    if mechanism == MECHANISM_PROMPT_MEDIATED_ACTION:
        primary_driver = DRIVER_LLM_DECISION
    elif mechanism == MECHANISM_UNSAFE_COMMAND_CONSTRUCTION:
        primary_driver = DRIVER_TOOL_SELECTION if "process_spawn" in behaviors else DRIVER_AUTHORED_SKILL_LOGIC
    elif mechanism == MECHANISM_ECOSYSTEM_COUPLED_EXTERNALIZATION:
        if is_callback_semantics:
            primary_driver = DRIVER_EXTERNAL_CALLBACK
        elif skip in {"ecosystem_adapter_missing", "auth_or_external_account_required"}:
            primary_driver = DRIVER_PLATFORM_ADAPTER_PATH
        else:
            primary_driver = DRIVER_MIXED if llm_involved else DRIVER_PLATFORM_ADAPTER_PATH
    elif is_callback_semantics:
        primary_driver = DRIVER_EXTERNAL_CALLBACK

    if llm_involved and mechanism in {
        MECHANISM_UNSAFE_DATAFLOW_DESIGN,
        MECHANISM_OVERPRIVILEGED_EXTERNAL_TRANSFER,
        MECHANISM_AMBIGUOUS_CONNECTED_WORKFLOW,
    }:
        primary_driver = DRIVER_MIXED

    evidence_status = EVIDENCE_BEHAVIOR_ONLY
    if static_mode:
        evidence_status = EVIDENCE_STATIC_ONLY
    elif skip in {"ecosystem_adapter_missing", "auth_or_external_account_required"}:
        evidence_status = EVIDENCE_ADAPTER_LIMITED
    elif skip == "trigger_condition_unsatisfied" or (used and not hits):
        evidence_status = EVIDENCE_TRIGGER_INCOMPLETE
    elif chain_backed:
        evidence_status = EVIDENCE_GRAPH_BACKED
    elif outcome in {"skipped_bounded", "failed_bounded"} and adapters:
        evidence_status = EVIDENCE_ADAPTER_LIMITED
    elif not behaviors and not chain:
        evidence_status = EVIDENCE_STATIC_ONLY if static_mode else EVIDENCE_BEHAVIOR_ONLY

    rationale = {
        "mechanism_factors": _mechanism_factors(
            mechanism=mechanism,
            source_sensitivity=source_sensitivity,
            sink_semantics=sink_semantics,
            sink_external=sink_external,
            has_risky_command=has_risky_command,
            has_prompt_injection_signal=has_prompt_injection_signal,
            source_public_lineage=source_public_lineage,
            llm_involved=llm_involved,
            skip_category=skip,
        ),
        "driver_factors": _driver_factors(
            primary_driver=primary_driver,
            llm_involved=llm_involved,
            sink_semantics=sink_semantics,
            skip_category=skip,
        ),
        "evidence_factors": _evidence_factors(
            evidence_status=evidence_status,
            chain_backed=chain_backed,
            static_mode=static_mode,
            trigger_used=used,
            trigger_hits=hits,
            adapters=adapters,
            skip_category=skip,
        ),
        "legacy_mapping": {
            "root_cause": legacy_root_cause,
            "root_cause_detail": legacy_root_cause_detail,
        },
    }

    return {
        "mechanism_class": mechanism,
        "primary_driver": primary_driver,
        "evidence_status": evidence_status,
        "attribution_rationale": rationale,
        "legacy_root_cause": legacy_root_cause,
        "legacy_root_cause_detail": legacy_root_cause_detail,
    }


def _looks_like_generated_artifact(path: str) -> bool:
    if not path:
        return False
    return path.startswith("runtime_output/") or (not path.startswith("/") and not path.startswith("public/"))


def _is_graph_backed(primary_chain: list[dict[str, Any]], root_cause_evidence: dict[str, Any]) -> bool:
    if len(primary_chain) >= 3:
        return True
    edge_refs = list(root_cause_evidence.get("graph_edge_refs", []))
    node_ids = list(root_cause_evidence.get("graph_node_ids", []))
    return bool(edge_refs) and len(node_ids) >= 2


def _mechanism_factors(
    *,
    mechanism: str,
    source_sensitivity: str,
    sink_semantics: str,
    sink_external: bool,
    has_risky_command: bool,
    has_prompt_injection_signal: bool,
    source_public_lineage: bool,
    llm_involved: bool,
    skip_category: str,
) -> list[str]:
    factors = [
        f"selected_mechanism={mechanism}",
        f"source_sensitivity={source_sensitivity}",
        f"sink_semantics={sink_semantics}",
        f"sink_external={str(sink_external).lower()}",
    ]
    if has_risky_command:
        factors.append("risky_command_signal_present")
    if has_prompt_injection_signal:
        factors.append("prompt_injection_signal_present")
    if source_public_lineage:
        factors.append("public_lineage_source")
    if llm_involved:
        factors.append("llm_involved")
    if skip_category:
        factors.append(f"skip_category={skip_category}")
    return factors


def _driver_factors(
    *,
    primary_driver: str,
    llm_involved: bool,
    sink_semantics: str,
    skip_category: str,
) -> list[str]:
    factors = [f"selected_driver={primary_driver}"]
    if llm_involved:
        factors.append("llm_context_present")
    if sink_semantics == "CALLBACK_OR_WEBHOOK":
        factors.append("callback_semantics_detected")
    if skip_category in {"ecosystem_adapter_missing", "auth_or_external_account_required"}:
        factors.append("platform_dependency_limits_execution")
    return factors


def _evidence_factors(
    *,
    evidence_status: str,
    chain_backed: bool,
    static_mode: bool,
    trigger_used: list[str],
    trigger_hits: list[str],
    adapters: list[str],
    skip_category: str,
) -> list[str]:
    factors = [f"selected_evidence_status={evidence_status}"]
    if chain_backed:
        factors.append("primary_chain_or_graph_edges_present")
    if static_mode:
        factors.append("static_mode_only")
    if trigger_used:
        factors.append(f"trigger_used_count={len(trigger_used)}")
    if trigger_hits:
        factors.append(f"trigger_hit_count={len(trigger_hits)}")
    if adapters:
        factors.append(f"enabled_adapter_count={len(adapters)}")
    if skip_category:
        factors.append(f"skip_category={skip_category}")
    return factors
