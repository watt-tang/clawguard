from __future__ import annotations

from typing import Any
from urllib.parse import urlparse


_LLM_PROVIDER_HOST_PATTERNS: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("openai", ("openai.com",)),
    ("anthropic", ("anthropic.com",)),
    ("deepseek", ("deepseek.com",)),
    ("siliconflow", ("siliconflow.cn", "siliconflow.com")),
    (
        "gemini",
        (
            "generativelanguage.googleapis.com",
            "aiplatform.googleapis.com",
            "vertexai.googleapis.com",
            "ai.google.dev",
        ),
    ),
    ("openrouter", ("openrouter.ai",)),
    ("groq", ("groq.com",)),
    ("together", ("together.xyz",)),
    ("cohere", ("cohere.com",)),
    ("xai", ("x.ai",)),
)


def infer_endpoint_kind(*, label: str, host: str | None, source: str | None) -> str:
    if source == "llm_base_url":
        return "model_api"
    if llm_provider_name(label=label, host=host) != "unknown":
        return "model_api"
    if _looks_like_ip(host):
        return "raw_ip_port"
    if label.startswith(("http://", "https://")) or host:
        return "third_party_saas"
    return "unknown"


def endpoint_semantics(
    *,
    label: str,
    host: str | None,
    endpoint_kind: str | None,
) -> dict[str, Any]:
    provider_name = llm_provider_name(label=label, host=host)
    is_llm_provider = endpoint_kind == "model_api" or provider_name != "unknown"
    endpoint_role = "relay" if is_llm_provider else "sink"

    if endpoint_role == "relay":
        sink_resolution_status = "llm-mediated"
    elif _is_resolved_endpoint_label(label):
        sink_resolution_status = "resolved"
    else:
        sink_resolution_status = "unresolved"

    return {
        "endpoint_role": endpoint_role,
        "is_llm_provider": is_llm_provider,
        "llm_provider_name": provider_name,
        "sink_resolution_status": sink_resolution_status,
        "llm_relay": is_llm_provider,
    }


def llm_provider_name(*, label: str, host: str | None) -> str:
    resolved_host = (host or _host_from_label(label)).lower()
    if not resolved_host:
        return "unknown"
    for provider, patterns in _LLM_PROVIDER_HOST_PATTERNS:
        if any(_host_matches(resolved_host, pattern) for pattern in patterns):
            return provider
    return "unknown"


def _host_from_label(label: str) -> str:
    parsed = urlparse(label)
    return (parsed.hostname or "").lower()


def _host_matches(host: str, pattern: str) -> bool:
    normalized = pattern.lower()
    return host == normalized or host.endswith(f".{normalized}")


def _is_resolved_endpoint_label(label: str) -> bool:
    cleaned = str(label or "").strip().lower()
    return bool(cleaned) and cleaned != "unknown"


def _looks_like_ip(value: str | None) -> bool:
    if not value:
        return False
    parts = value.split(".")
    return len(parts) == 4 and all(part.isdigit() for part in parts)
