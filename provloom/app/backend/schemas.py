from __future__ import annotations

import os
from dataclasses import asdict, dataclass, field
from typing import Any


DEFAULT_LLM_PROVIDER = "siliconflow"
DEFAULT_LLM_BASE_URL = "https://api.siliconflow.cn/v1"
DEFAULT_LLM_API_KEY = os.getenv("PROVLOOM_LLM_API_KEY", "")
DEFAULT_LLM_MODEL = "deepseek-ai/DeepSeek-V3"
LEGACY_DEEPSEEK_BASE_URL = "https://api.deepseek.com"
LEGACY_DEEPSEEK_MODEL = "deepseek-chat"

_PROVIDER_ALIASES = {
    "": DEFAULT_LLM_PROVIDER,
    "openai-compatible": DEFAULT_LLM_PROVIDER,
    "openai_compatible": DEFAULT_LLM_PROVIDER,
    "siliconflow": "siliconflow",
    "silicon-flow": "siliconflow",
    "silicon_flow": "siliconflow",
    "deepseek": "deepseek",
}


def normalize_llm_provider(provider: Any) -> str:
    raw = str(provider or DEFAULT_LLM_PROVIDER).strip().lower()
    return _PROVIDER_ALIASES.get(raw, raw)


def default_llm_base_url(provider: Any = DEFAULT_LLM_PROVIDER) -> str:
    normalized = normalize_llm_provider(provider)
    if normalized == "deepseek":
        return LEGACY_DEEPSEEK_BASE_URL
    return DEFAULT_LLM_BASE_URL


def default_llm_model(provider: Any = DEFAULT_LLM_PROVIDER) -> str:
    normalized = normalize_llm_provider(provider)
    if normalized == "deepseek":
        return LEGACY_DEEPSEEK_MODEL
    return DEFAULT_LLM_MODEL


def default_llm_api_key(provider: Any = DEFAULT_LLM_PROVIDER) -> str:
    normalized = normalize_llm_provider(provider)
    if normalized == "siliconflow":
        return DEFAULT_LLM_API_KEY
    return ""


@dataclass
class LLMConfig:
    enabled: bool = False
    provider: str = DEFAULT_LLM_PROVIDER
    base_url: str = DEFAULT_LLM_BASE_URL
    api_key: str = DEFAULT_LLM_API_KEY
    model: str = DEFAULT_LLM_MODEL
    temperature: float = 0.0
    max_steps: int = 8

    @classmethod
    def from_dict(cls, payload: dict[str, Any]) -> "LLMConfig":
        enabled = bool(payload.get("enabled", False))
        provider = normalize_llm_provider(payload.get("provider", DEFAULT_LLM_PROVIDER))
        base_url = str(payload.get("base_url") or default_llm_base_url(provider)).strip()
        api_key = str(payload.get("api_key") or default_llm_api_key(provider)).strip()
        model = str(payload.get("model") or default_llm_model(provider)).strip()
        temperature = float(payload.get("temperature", 0.0))
        max_steps = int(payload.get("max_steps", 8))
        if enabled and not api_key:
            raise ValueError("`llm_config.api_key` is required when llm_config.enabled=true.")
        return cls(
            enabled=enabled,
            provider=provider,
            base_url=base_url,
            api_key=api_key,
            model=model,
            temperature=temperature,
            max_steps=max_steps,
        )

    def to_public_dict(self) -> dict[str, Any]:
        return {
            "enabled": self.enabled,
            "provider": self.provider,
            "base_url": self.base_url,
            "model": self.model,
            "temperature": self.temperature,
            "max_steps": self.max_steps,
        }


@dataclass
class AnalyzeSkillRequest:
    skill_path: str
    input_payload: dict[str, Any] = field(default_factory=dict)
    timeout_seconds: int = 30
    network_policy: str = "default"
    analysis_mode: str = "rule_plus_epg"
    llm_config: LLMConfig = field(default_factory=LLMConfig)

    @classmethod
    def from_dict(cls, payload: dict[str, Any]) -> "AnalyzeSkillRequest":
        skill_path = payload.get("skill_path")
        input_payload = payload.get("input_payload", {})
        timeout_seconds = payload.get("timeout_seconds", 30)
        network_policy = payload.get("network_policy", "default")
        analysis_mode = payload.get("analysis_mode", "rule_plus_epg")
        llm_config = LLMConfig.from_dict(payload.get("llm_config", {}))

        if not isinstance(skill_path, str) or not skill_path.strip():
            raise ValueError("`skill_path` must be a non-empty string.")
        if not isinstance(input_payload, dict):
            raise ValueError("`input_payload` must be a JSON object.")
        if not isinstance(timeout_seconds, int) or not (1 <= timeout_seconds <= 300):
            raise ValueError("`timeout_seconds` must be an integer between 1 and 300.")
        if network_policy not in {"default", "disabled"}:
            raise ValueError("`network_policy` must be one of: default, disabled.")
        if analysis_mode not in {"rule_only", "rule_plus_epg", "static_only"}:
            raise ValueError("`analysis_mode` must be one of: rule_only, rule_plus_epg, static_only.")

        return cls(
            skill_path=skill_path,
            input_payload=input_payload,
            timeout_seconds=timeout_seconds,
            network_policy=network_policy,
            analysis_mode=analysis_mode,
            llm_config=llm_config,
        )


@dataclass
class EvidenceEvent:
    timestamp: str
    category: str
    action: str
    detail: str
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class AnalyzeSkillResponse:
    execution_id: str
    status: str
    skill_path: str
    skill_file: str
    sandbox_image: str
    runtime_name: str
    network_policy: str
    analysis_mode: str
    llm_config: dict[str, Any]
    exit_code: int | None
    timed_out: bool
    stdout: str
    stderr: str
    trace_summary: dict[str, Any]
    risk_score: int
    risk_level: str
    risk_level_name: str
    primary_risk: dict[str, Any]
    risk_labels: list[dict[str, Any]]
    risk_summary: str
    detected_behaviors: list[str]
    evidence_timeline: list[EvidenceEvent]
    file_events: list[dict[str, Any]]
    network_events: list[dict[str, Any]]
    process_events: list[dict[str, Any]]
    tool_calls: list[dict[str, Any]]
    llm_events: list[dict[str, Any]]
    data_flows: list[dict[str, Any]]
    resource_usage: dict[str, Any]
    normalized_events: list[dict[str, Any]] = field(default_factory=list)
    primary_chain: list[dict[str, Any]] = field(default_factory=list)
    root_cause: str = "unknown"
    root_cause_detail: str = "unknown"
    root_cause_v2: dict[str, Any] = field(default_factory=dict)
    graph_summary: dict[str, Any] = field(default_factory=dict)
    final_decision: str = "unknown"
    triggered_factors: list[dict[str, Any]] = field(default_factory=list)
    suppression_factors: list[dict[str, Any]] = field(default_factory=list)
    decision_evidence: dict[str, Any] = field(default_factory=dict)
    capability_profile: dict[str, Any] = field(default_factory=dict)
    capability_tags: list[str] = field(default_factory=list)
    recommended_execution_profile: str = ""
    recommended_trigger_mode: str = ""
    estimated_budget_class: str = ""
    execution_feasibility: str = ""
    blocking_requirements: list[str] = field(default_factory=list)
    enabled_adapters: list[str] = field(default_factory=list)
    adapter_events_summary: dict[str, Any] = field(default_factory=dict)
    synthetic_artifact_summary: dict[str, Any] = field(default_factory=dict)
    trigger_plan: dict[str, Any] = field(default_factory=dict)
    trigger_used: list[str] = field(default_factory=list)
    trigger_hits: list[str] = field(default_factory=list)
    trigger_unexecuted: list[str] = field(default_factory=list)
    trigger_events_summary: dict[str, Any] = field(default_factory=dict)
    severity_label: str = ""
    evidence_strength: str = ""
    decision_rationale: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class TaskResponse:
    execution_id: str
    status: str
    created_at: str
    updated_at: str
    request: dict[str, Any]
    result: dict[str, Any] | None = None
    error: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)
