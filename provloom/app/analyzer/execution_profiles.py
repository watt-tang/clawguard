from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


PROFILE_BASE_LIGHTWEIGHT = "base_lightweight"
PROFILE_BROWSER_LIGHTWEIGHT = "browser_lightweight"
PROFILE_ADAPTER_BACKED = "adapter_backed"
PROFILE_DEEP_EXECUTION = "deep_execution"
PROFILE_AUTO = "auto"

ALL_PROFILES = {
    PROFILE_BASE_LIGHTWEIGHT,
    PROFILE_BROWSER_LIGHTWEIGHT,
    PROFILE_ADAPTER_BACKED,
    PROFILE_DEEP_EXECUTION,
}

TELEMETRY_COMPACT = "compact"
TELEMETRY_STANDARD = "standard"
TELEMETRY_VERBOSE = "verbose"

EXECUTION_MODE_FULL = "full"
EXECUTION_MODE_PARTIAL_ONLY = "partial_only"

CAPABILITY_REQUIRES_BROWSER = "requires_browser"
CAPABILITY_REQUIRES_CALLBACK_OR_WEBHOOK = "requires_callback_or_webhook"
CAPABILITY_REQUIRES_DOCUMENT_OR_OFFICE_STACK = "requires_document_or_office_stack"
CAPABILITY_REQUIRES_MESSAGING_STACK = "requires_messaging_stack"
CAPABILITY_REQUIRES_LONG_HORIZON_TASK = "requires_long_horizon_task"
CAPABILITY_REQUIRES_OAUTH_OR_LOGIN = "requires_oauth_or_login"


@dataclass
class ExecutionProfileConfig:
    name: str
    timeout_seconds: int
    memory_limit_mb: int
    browser_enabled: bool
    adapters_enabled: list[str] = field(default_factory=list)
    trigger_depth_level: int = 1
    telemetry_verbosity: str = TELEMETRY_STANDARD
    escalation_allowed: bool = False

    def to_dict(self) -> dict[str, Any]:
        return {
            "name": self.name,
            "timeout_seconds": self.timeout_seconds,
            "memory_limit_mb": self.memory_limit_mb,
            "browser_enabled": self.browser_enabled,
            "adapters_enabled": self.adapters_enabled,
            "trigger_depth_level": self.trigger_depth_level,
            "telemetry_verbosity": self.telemetry_verbosity,
            "escalation_allowed": self.escalation_allowed,
        }


@dataclass
class ExecutionPlan:
    first_attempt_profile: str
    effective_profile: str
    profile_config: ExecutionProfileConfig
    selection_source: str
    selection_reasons: list[str] = field(default_factory=list)
    execution_mode: str = EXECUTION_MODE_FULL
    allow_profile_promotion: bool = False
    max_promotion_steps: int = 0
    promoted_profile: str = ""
    promotion_reason: str = ""
    budget_exceeded: bool = False
    promotion_steps_used: int = 0
    profile_catalog_version: str = "v1"

    def to_dict(self) -> dict[str, Any]:
        return {
            "first_attempt_profile": self.first_attempt_profile,
            "effective_profile": self.effective_profile,
            "profile_config": self.profile_config.to_dict(),
            "selection_source": self.selection_source,
            "selection_reasons": self.selection_reasons,
            "execution_mode": self.execution_mode,
            "allow_profile_promotion": self.allow_profile_promotion,
            "max_promotion_steps": self.max_promotion_steps,
            "promoted_profile": self.promoted_profile,
            "promotion_reason": self.promotion_reason,
            "budget_exceeded": self.budget_exceeded,
            "promotion_steps_used": self.promotion_steps_used,
            "profile_catalog_version": self.profile_catalog_version,
        }


def execution_plan_from_dict(payload: dict[str, Any], default_timeout_seconds: int) -> ExecutionPlan:
    catalog = build_profile_catalog(default_timeout_seconds=default_timeout_seconds)
    profile_name = str(payload.get("effective_profile") or payload.get("first_attempt_profile") or PROFILE_BASE_LIGHTWEIGHT)
    cfg_payload = payload.get("profile_config") or {}
    cfg = catalog.get(profile_name, catalog[PROFILE_BASE_LIGHTWEIGHT])
    if isinstance(cfg_payload, dict) and cfg_payload:
        cfg = ExecutionProfileConfig(
            name=str(cfg_payload.get("name", cfg.name)),
            timeout_seconds=int(cfg_payload.get("timeout_seconds", cfg.timeout_seconds)),
            memory_limit_mb=int(cfg_payload.get("memory_limit_mb", cfg.memory_limit_mb)),
            browser_enabled=bool(cfg_payload.get("browser_enabled", cfg.browser_enabled)),
            adapters_enabled=list(cfg_payload.get("adapters_enabled", cfg.adapters_enabled)),
            trigger_depth_level=int(cfg_payload.get("trigger_depth_level", cfg.trigger_depth_level)),
            telemetry_verbosity=str(cfg_payload.get("telemetry_verbosity", cfg.telemetry_verbosity)),
            escalation_allowed=bool(cfg_payload.get("escalation_allowed", cfg.escalation_allowed)),
        )
    return ExecutionPlan(
        first_attempt_profile=str(payload.get("first_attempt_profile", cfg.name)),
        effective_profile=str(payload.get("effective_profile", cfg.name)),
        profile_config=cfg,
        selection_source=str(payload.get("selection_source", "auto")),
        selection_reasons=list(payload.get("selection_reasons", [])),
        execution_mode=str(payload.get("execution_mode", EXECUTION_MODE_FULL)),
        allow_profile_promotion=bool(payload.get("allow_profile_promotion", False)),
        max_promotion_steps=int(payload.get("max_promotion_steps", 0)),
        promoted_profile=str(payload.get("promoted_profile", "")),
        promotion_reason=str(payload.get("promotion_reason", "")),
        budget_exceeded=bool(payload.get("budget_exceeded", False)),
        promotion_steps_used=int(payload.get("promotion_steps_used", 0)),
        profile_catalog_version=str(payload.get("profile_catalog_version", "v1")),
    )


def build_profile_catalog(default_timeout_seconds: int) -> dict[str, ExecutionProfileConfig]:
    base_timeout = max(30, int(default_timeout_seconds))
    return {
        PROFILE_BASE_LIGHTWEIGHT: ExecutionProfileConfig(
            name=PROFILE_BASE_LIGHTWEIGHT,
            timeout_seconds=base_timeout,
            memory_limit_mb=256,
            browser_enabled=False,
            adapters_enabled=[],
            trigger_depth_level=1,
            telemetry_verbosity=TELEMETRY_STANDARD,
            escalation_allowed=False,
        ),
        PROFILE_BROWSER_LIGHTWEIGHT: ExecutionProfileConfig(
            name=PROFILE_BROWSER_LIGHTWEIGHT,
            timeout_seconds=min(max(base_timeout + 180, 120), 1800),
            memory_limit_mb=384,
            browser_enabled=True,
            adapters_enabled=["browser"],
            trigger_depth_level=2,
            telemetry_verbosity=TELEMETRY_STANDARD,
            escalation_allowed=True,
        ),
        PROFILE_ADAPTER_BACKED: ExecutionProfileConfig(
            name=PROFILE_ADAPTER_BACKED,
            timeout_seconds=min(max(base_timeout + 120, 120), 1800),
            memory_limit_mb=320,
            browser_enabled=False,
            adapters_enabled=["credential_state", "webhook", "document", "messaging"],
            trigger_depth_level=2,
            telemetry_verbosity=TELEMETRY_VERBOSE,
            escalation_allowed=True,
        ),
        PROFILE_DEEP_EXECUTION: ExecutionProfileConfig(
            name=PROFILE_DEEP_EXECUTION,
            timeout_seconds=min(max(base_timeout + 420, 300), 2400),
            memory_limit_mb=512,
            browser_enabled=True,
            adapters_enabled=["credential_state", "webhook", "document", "messaging", "browser"],
            trigger_depth_level=3,
            telemetry_verbosity=TELEMETRY_VERBOSE,
            escalation_allowed=False,
        ),
    }


def select_execution_profile(
    capability_profile: dict[str, Any],
    requested_profile: str = PROFILE_AUTO,
) -> tuple[str, str, list[str]]:
    requested = (requested_profile or PROFILE_AUTO).strip()
    tags = set(capability_profile.get("capability_tags") or [])
    complexity = int(capability_profile.get("complexity_score") or 0)
    reasons: list[str] = []

    if requested and requested != PROFILE_AUTO:
        if requested not in ALL_PROFILES:
            return PROFILE_BASE_LIGHTWEIGHT, "fallback_invalid_manual", [
                f"Unknown manual execution profile `{requested}`; fallback to base_lightweight."
            ]
        return requested, "manual", [f"Manual execution profile override `{requested}` is applied."]

    profile = PROFILE_BASE_LIGHTWEIGHT
    source = "auto"
    if (
        CAPABILITY_REQUIRES_CALLBACK_OR_WEBHOOK in tags
        or CAPABILITY_REQUIRES_DOCUMENT_OR_OFFICE_STACK in tags
        or CAPABILITY_REQUIRES_MESSAGING_STACK in tags
    ):
        profile = PROFILE_ADAPTER_BACKED
        reasons.append("Auto-selected adapter_backed due to callback/document/messaging capabilities.")
    elif CAPABILITY_REQUIRES_LONG_HORIZON_TASK in tags and complexity >= 6:
        profile = PROFILE_DEEP_EXECUTION
        reasons.append("Auto-selected deep_execution due to long-horizon + high complexity.")
    elif CAPABILITY_REQUIRES_BROWSER in tags:
        profile = PROFILE_BROWSER_LIGHTWEIGHT
        reasons.append("Auto-selected browser_lightweight due to browser requirement.")
    else:
        reasons.append("Auto-selected base_lightweight as conservative default.")

    if CAPABILITY_REQUIRES_OAUTH_OR_LOGIN in tags and profile == PROFILE_BASE_LIGHTWEIGHT:
        profile = PROFILE_ADAPTER_BACKED
        reasons.append("Promoted auto choice to adapter_backed due to auth/login requirement.")

    return profile, source, reasons


def build_execution_plan(
    capability_profile: dict[str, Any],
    requested_profile: str,
    allow_profile_promotion: bool,
    max_promotion_steps: int,
    default_timeout_seconds: int,
) -> ExecutionPlan:
    profile_name, selection_source, reasons = select_execution_profile(
        capability_profile=capability_profile,
        requested_profile=requested_profile,
    )
    catalog = build_profile_catalog(default_timeout_seconds=default_timeout_seconds)
    config = catalog.get(profile_name, catalog[PROFILE_BASE_LIGHTWEIGHT])

    tags = set(capability_profile.get("capability_tags") or [])
    execution_mode = EXECUTION_MODE_FULL
    if CAPABILITY_REQUIRES_OAUTH_OR_LOGIN in tags and profile_name in {
        PROFILE_BASE_LIGHTWEIGHT,
        PROFILE_ADAPTER_BACKED,
    }:
        execution_mode = EXECUTION_MODE_PARTIAL_ONLY
        reasons.append("Auth/login requirements imply partial-only evidence in current sandbox.")

    return ExecutionPlan(
        first_attempt_profile=config.name,
        effective_profile=config.name,
        profile_config=config,
        selection_source=selection_source,
        selection_reasons=reasons,
        execution_mode=execution_mode,
        allow_profile_promotion=bool(allow_profile_promotion),
        max_promotion_steps=max(0, int(max_promotion_steps)),
    )


def update_plan_with_budget_outcome(
    plan: ExecutionPlan,
    timed_out: bool,
    memory_peak_bytes: int | None,
    memory_limit_bytes: int | None,
) -> ExecutionPlan:
    exceeded = bool(timed_out)
    reason_parts: list[str] = []
    if timed_out:
        reason_parts.append("execution_timeout")

    if memory_peak_bytes and memory_limit_bytes:
        if memory_peak_bytes >= int(memory_limit_bytes * 0.90):
            exceeded = True
            reason_parts.append("memory_near_limit")

    plan.budget_exceeded = exceeded
    if not exceeded:
        return plan

    if not plan.allow_profile_promotion or plan.max_promotion_steps <= 0:
        plan.promotion_reason = "budget_exceeded_but_promotion_disabled"
        return plan

    next_profile = _next_profile(plan.first_attempt_profile)
    if not next_profile:
        plan.promotion_reason = "budget_exceeded_at_profile_ceiling"
        return plan

    plan.promoted_profile = next_profile
    plan.promotion_steps_used = 1
    plan.promotion_reason = "budget_exceeded:" + ",".join(reason_parts or ["unknown"])
    return plan


def _next_profile(profile: str) -> str:
    chain = {
        PROFILE_BASE_LIGHTWEIGHT: PROFILE_BROWSER_LIGHTWEIGHT,
        PROFILE_BROWSER_LIGHTWEIGHT: PROFILE_DEEP_EXECUTION,
        PROFILE_ADAPTER_BACKED: PROFILE_DEEP_EXECUTION,
        PROFILE_DEEP_EXECUTION: "",
    }
    return chain.get(profile, "")
