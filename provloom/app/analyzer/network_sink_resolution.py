from __future__ import annotations

import ipaddress
import re
import shlex
from typing import Any
from urllib.parse import urlparse

from app.analyzer.endpoint_semantics import endpoint_semantics, infer_endpoint_kind


URL_RE = re.compile(r"https?://[^\s'\"<>]+")
IP_PORT_RE = re.compile(r"^(?P<host>(?:\d{1,3}\.){3}\d{1,3})(?::(?P<port>\d{1,5}))?$")
DOMAIN_RE = re.compile(
    r"^(?=.{1,253}$)(?!-)(?:[A-Za-z0-9-]{1,63}\.)+[A-Za-z]{2,63}\.?$"
)
HOST_HEADER_RE = re.compile(r"Host:\s*(?P<host>[A-Za-z0-9._-]+)", re.IGNORECASE)
TLS_SNI_RE = re.compile(r"(?:sni|server_name)[=: ]+(?P<host>[A-Za-z0-9._-]+)", re.IGNORECASE)
CONTROLLED_SINK_IPS = {"10.255.255.254"}

_NETWORK_COMMAND_TOKENS = {
    "curl",
    "wget",
    "nc",
    "ncat",
    "netcat",
    "ping",
    "dig",
    "nslookup",
    "host",
    "telnet",
    "traceroute",
}
_NETWORK_TARGET_FLAGS = {
    "-H",
    "--header",
    "--resolve",
    "--connect-to",
    "--url",
    "--proxy",
    "--referer",
    "-x",
}


def extract_network_candidates_from_text(text: Any, *, source: str) -> list[dict[str, Any]]:
    if isinstance(text, list):
        joined = " ".join(str(item) for item in text)
    else:
        joined = str(text or "")
    joined = joined.strip()
    if not joined:
        return []

    candidates: list[dict[str, Any]] = []
    for url in URL_RE.findall(joined):
        candidates.append(candidate_from_url(url, source=source))

    for regex in (HOST_HEADER_RE, TLS_SNI_RE):
        for match in regex.finditer(joined):
            candidates.append(candidate_from_domain(match.group("host"), source=source))

    try:
        tokens = shlex.split(joined)
    except ValueError:
        tokens = joined.split()

    networkish_context = any(token in _NETWORK_COMMAND_TOKENS for token in tokens[:3])
    for index, token in enumerate(tokens):
        cleaned = token.strip("\"'(),[]{}")
        if not cleaned or cleaned.startswith(("http://", "https://")):
            continue
        ip_match = IP_PORT_RE.match(cleaned)
        if ip_match:
            host = ip_match.group("host")
            port_text = ip_match.group("port")
            candidates.append(
                candidate_from_ip_port(
                    host=host,
                    port=int(port_text) if port_text else None,
                    source=source,
                )
            )
            continue
        if not _looks_like_domain(cleaned):
            continue
        if _token_has_network_context(tokens, index) or networkish_context:
            candidates.append(candidate_from_domain(cleaned, source=source))

    return _dedupe_candidates(candidates)


def candidate_from_url(url: str, *, source: str) -> dict[str, Any]:
    parsed = urlparse(url.strip())
    host = parsed.hostname
    port = parsed.port
    if host and port is None:
        if parsed.scheme == "https":
            port = 443
        elif parsed.scheme == "http":
            port = 80
    endpoint_kind = infer_endpoint_kind(label=url, host=host, source=source)
    metadata = _base_candidate(
        label=url,
        host=host,
        port=port,
        source=source,
        endpoint_kind=endpoint_kind,
        sink_type="url",
        sink_url=url,
        sink_domain=host,
        is_controlled_sink=_is_controlled_host(host),
    )
    metadata["sink_display_label"] = url
    metadata["address"] = url
    metadata["display_label"] = url
    if metadata["is_controlled_sink"]:
        metadata["sink_type"] = "blackhole"
        metadata["sink_resolution_status"] = "controlled"
    return metadata


def candidate_from_domain(domain: str, *, source: str) -> dict[str, Any]:
    cleaned = domain.strip().rstrip(".").lower()
    endpoint_kind = infer_endpoint_kind(label=cleaned, host=cleaned, source=source)
    sink_type = "dns_only" if source == "dns" else "domain"
    metadata = _base_candidate(
        label=cleaned,
        host=cleaned,
        port=None,
        source=source,
        endpoint_kind=endpoint_kind,
        sink_type=sink_type,
        sink_url=None,
        sink_domain=cleaned,
        is_controlled_sink=False,
    )
    metadata["sink_display_label"] = f"domain: {cleaned}"
    metadata["address"] = f"domain:{cleaned}"
    metadata["display_label"] = metadata["sink_display_label"]
    return metadata


def candidate_from_ip_port(
    *,
    host: str,
    port: int | None,
    source: str,
    raw_address: str | None = None,
) -> dict[str, Any]:
    label = _build_host_port_label(host=host, port=port)
    controlled = _is_controlled_host(host)
    sink_type = "blackhole" if controlled else "ip"
    metadata = _base_candidate(
        label=label,
        host=host,
        port=port,
        source=source,
        endpoint_kind="raw_ip_port",
        sink_type=sink_type,
        sink_url=None,
        sink_domain=None,
        is_controlled_sink=controlled,
    )
    metadata["sink_raw_ip"] = host
    metadata["resolved_ip"] = None if controlled else host
    metadata["address"] = raw_address or label
    if controlled:
        metadata["sink_display_label"] = "network:unresolved"
        metadata["display_label"] = "network:unresolved"
        metadata["sink_resolution_status"] = "controlled"
        metadata["selected_sink_reason"] = "Only a controlled or reserved IP endpoint was observed."
    else:
        metadata["sink_display_label"] = label
        metadata["display_label"] = label
    return metadata


def candidate_from_network_event(event: Any) -> dict[str, Any] | None:
    original_url = str(getattr(event, "original_url", "") or "").strip()
    if original_url:
        return candidate_from_url(original_url, source=_primary_evidence_source(event))

    original_domain = str(getattr(event, "original_domain", "") or "").strip()
    if original_domain:
        return candidate_from_domain(original_domain, source=_primary_evidence_source(event))

    label = str(getattr(event, "display_label", None) or getattr(event, "address", "") or "").strip()
    host = getattr(event, "host", None)
    port = getattr(event, "port", None)
    if label.startswith(("http://", "https://")):
        return candidate_from_url(label, source=_primary_evidence_source(event))
    if host and not _looks_like_ip(host):
        return candidate_from_domain(host, source=_primary_evidence_source(event))
    if host:
        raw_address = str(getattr(event, "raw_address", None) or getattr(event, "address", "") or "").strip() or None
        return candidate_from_ip_port(host=host, port=port, source=_primary_evidence_source(event), raw_address=raw_address)
    return None


def resolve_best_network_sink(
    *,
    raw_address: str | None,
    raw_host: str | None,
    raw_port: int | None,
    candidates: list[dict[str, Any]],
) -> dict[str, Any]:
    merged = _dedupe_candidates(candidates)
    raw_candidate = None
    if raw_host:
        raw_candidate = candidate_from_ip_port(
            host=raw_host,
            port=raw_port,
            source="connect",
            raw_address=raw_address,
        )
        merged = _dedupe_candidates(merged + [raw_candidate])

    relay_candidates = [candidate for candidate in merged if candidate.get("endpoint_role") == "relay"]
    sink_candidates = [candidate for candidate in merged if candidate.get("endpoint_role") != "relay"]

    selected: dict[str, Any]
    reason: str
    if relay_candidates:
        selected = min(relay_candidates, key=_relay_priority)
        reason = "Selected the semantic LLM provider endpoint instead of lower-level transport endpoints."
    elif sink_candidates:
        selected = min(sink_candidates, key=_sink_priority)
        reason = _selection_reason(selected)
    else:
        selected = _unknown_candidate()
        reason = "No URL, domain, or usable IP candidate could be recovered from telemetry."

    raw_ip = raw_host if _looks_like_ip(raw_host) else None
    combined_sources = sorted(
        {
            source
            for candidate in merged
            for source in candidate.get("network_evidence_sources", [])
            if source
        }
    )
    original_candidates = [
        candidate.get("sink_url")
        or candidate.get("sink_domain")
        or candidate.get("sink_display_label")
        or candidate.get("display_label")
        for candidate in merged
        if (candidate.get("sink_url") or candidate.get("sink_domain") or candidate.get("sink_display_label"))
    ]

    resolved = dict(selected)
    if raw_address:
        resolved["raw_address"] = raw_address
    if raw_host:
        resolved["raw_host"] = raw_host
    if raw_port is not None:
        resolved["raw_port"] = raw_port
    if raw_ip:
        resolved["sink_raw_ip"] = raw_ip
        if not resolved.get("resolved_ip") and not _is_controlled_host(raw_ip):
            resolved["resolved_ip"] = raw_ip
    if raw_port is not None and resolved.get("sink_port") is None:
        resolved["sink_port"] = raw_port
        resolved["port"] = raw_port
    resolved["network_evidence_sources"] = combined_sources
    resolved["original_target_candidates"] = _stable_unique_strings(original_candidates)
    resolved["selected_sink_reason"] = reason
    resolved["original_url"] = resolved.get("sink_url")
    resolved["original_domain"] = resolved.get("sink_domain")
    resolved["display_label"] = resolved.get("sink_display_label", resolved.get("display_label", "unknown"))
    if not resolved.get("address"):
        resolved["address"] = resolved["display_label"]
    if resolved.get("sink_type") == "blackhole" and resolved.get("sink_resolution_status") != "controlled":
        resolved["sink_resolution_status"] = "controlled"
    return resolved


def event_metadata_from_resolution(resolved: dict[str, Any]) -> dict[str, Any]:
    return {
        "address": resolved.get("address"),
        "display_label": resolved.get("display_label"),
        "host": resolved.get("host"),
        "port": resolved.get("port"),
        "endpoint_kind": resolved.get("endpoint_kind"),
        "endpoint_source": resolved.get("endpoint_source"),
        "endpoint_role": resolved.get("endpoint_role"),
        "is_llm_provider": resolved.get("is_llm_provider"),
        "llm_provider_name": resolved.get("llm_provider_name"),
        "sink_resolution_status": resolved.get("sink_resolution_status"),
        "raw_address": resolved.get("raw_address"),
        "raw_host": resolved.get("raw_host"),
        "raw_port": resolved.get("raw_port"),
        "original_domain": resolved.get("original_domain"),
        "original_url": resolved.get("original_url"),
        "resolved_ip": resolved.get("resolved_ip"),
        "sink_display_label": resolved.get("sink_display_label"),
        "sink_raw_ip": resolved.get("sink_raw_ip"),
        "sink_domain": resolved.get("sink_domain"),
        "sink_url": resolved.get("sink_url"),
        "sink_port": resolved.get("sink_port"),
        "sink_type": resolved.get("sink_type"),
        "is_controlled_sink": resolved.get("is_controlled_sink"),
        "network_evidence_sources": list(resolved.get("network_evidence_sources", [])),
        "original_target_candidates": list(resolved.get("original_target_candidates", [])),
        "selected_sink_reason": resolved.get("selected_sink_reason"),
        "llm_relay": resolved.get("llm_relay"),
    }


def _base_candidate(
    *,
    label: str,
    host: str | None,
    port: int | None,
    source: str,
    endpoint_kind: str,
    sink_type: str,
    sink_url: str | None,
    sink_domain: str | None,
    is_controlled_sink: bool,
) -> dict[str, Any]:
    semantics = endpoint_semantics(label=label, host=host, endpoint_kind=endpoint_kind)
    sink_resolution_status = "resolved"
    if is_controlled_sink and semantics["endpoint_role"] != "relay":
        sink_resolution_status = "controlled"
    return {
        "address": label,
        "display_label": label,
        "host": host,
        "port": port,
        "endpoint_kind": endpoint_kind,
        "endpoint_source": source,
        "sink_display_label": label,
        "sink_raw_ip": host if _looks_like_ip(host) else None,
        "sink_domain": sink_domain,
        "sink_url": sink_url,
        "sink_port": port,
        "sink_type": sink_type,
        "is_controlled_sink": is_controlled_sink,
        "network_evidence_sources": [source],
        "resolved_ip": host if _looks_like_ip(host) and not is_controlled_sink else None,
        "selected_sink_reason": "",
        "original_target_candidates": [label],
        **semantics,
        "sink_resolution_status": "llm-mediated" if semantics["endpoint_role"] == "relay" else sink_resolution_status,
    }


def _dedupe_candidates(candidates: list[dict[str, Any]]) -> list[dict[str, Any]]:
    merged: dict[tuple[str, str], dict[str, Any]] = {}
    for candidate in candidates:
        label = str(candidate.get("address") or candidate.get("sink_display_label") or "unknown")
        role = str(candidate.get("endpoint_role", "sink"))
        key = (role, label)
        existing = merged.get(key)
        if existing is None:
            merged[key] = dict(candidate)
            continue
        sources = sorted(
            {
                *existing.get("network_evidence_sources", []),
                *candidate.get("network_evidence_sources", []),
            }
        )
        existing["network_evidence_sources"] = sources
        original_candidates = [
            *existing.get("original_target_candidates", []),
            *candidate.get("original_target_candidates", []),
        ]
        existing["original_target_candidates"] = _stable_unique_strings(original_candidates)
        for field in (
            "sink_url",
            "sink_domain",
            "sink_raw_ip",
            "sink_port",
            "resolved_ip",
            "selected_sink_reason",
            "raw_address",
            "raw_host",
            "raw_port",
        ):
            if existing.get(field) in (None, "", []):
                existing[field] = candidate.get(field)
    return list(merged.values())


def _relay_priority(candidate: dict[str, Any]) -> tuple[int, str]:
    sink_type = str(candidate.get("sink_type", "unknown"))
    rank = {"url": 0, "domain": 1, "dns_only": 2, "ip": 3, "blackhole": 4, "unknown": 5}.get(sink_type, 6)
    return rank, str(candidate.get("sink_display_label", ""))


def _sink_priority(candidate: dict[str, Any]) -> tuple[int, str]:
    sink_type = str(candidate.get("sink_type", "unknown"))
    resolution = str(candidate.get("sink_resolution_status", "unresolved"))
    if resolution == "controlled":
        return 4, str(candidate.get("sink_display_label", ""))
    rank = {
        "url": 0,
        "domain": 1,
        "dns_only": 1,
        "ip": 2,
        "blackhole": 4,
        "unknown": 5,
    }.get(sink_type, 5)
    return rank, str(candidate.get("sink_display_label", ""))


def _selection_reason(candidate: dict[str, Any]) -> str:
    sink_type = str(candidate.get("sink_type", "unknown"))
    if sink_type == "url":
        return "Selected a concrete URL sink recovered from higher-level telemetry."
    if sink_type in {"domain", "dns_only"}:
        return "Selected a recovered domain or hostname instead of a lower-level transport IP."
    if sink_type == "ip":
        return "Selected a non-reserved external IP sink because no higher-level URL or domain was available."
    if sink_type == "blackhole":
        return "Only a controlled or reserved sink address was observed, so the sink remains unresolved."
    return "Sink target could not be resolved beyond generic network activity."


def _unknown_candidate() -> dict[str, Any]:
    return {
        "address": "unknown",
        "display_label": "unknown",
        "host": None,
        "port": None,
        "endpoint_kind": "unknown",
        "endpoint_source": "unknown",
        "endpoint_role": "sink",
        "is_llm_provider": False,
        "llm_provider_name": "unknown",
        "sink_resolution_status": "unresolved",
        "sink_display_label": "unknown",
        "sink_raw_ip": None,
        "sink_domain": None,
        "sink_url": None,
        "sink_port": None,
        "sink_type": "unknown",
        "is_controlled_sink": False,
        "network_evidence_sources": [],
        "original_target_candidates": [],
        "selected_sink_reason": "",
        "resolved_ip": None,
        "llm_relay": False,
    }


def _primary_evidence_source(event: Any) -> str:
    sources = list(getattr(event, "network_evidence_sources", []) or [])
    if sources:
        return str(sources[0])
    return str(getattr(event, "endpoint_source", None) or "connect")


def _looks_like_domain(value: str) -> bool:
    candidate = value.strip().rstrip(".").lower()
    if not candidate or "/" in candidate or candidate.startswith("-"):
        return False
    if _looks_like_ip(candidate):
        return False
    return bool(DOMAIN_RE.match(candidate))


def _token_has_network_context(tokens: list[str], index: int) -> bool:
    previous = tokens[index - 1] if index > 0 else ""
    if previous in _NETWORK_TARGET_FLAGS:
        return True
    if previous.startswith("-") and any(flag in previous for flag in ("url", "host", "proxy")):
        return True
    return False


def _looks_like_ip(value: str | None) -> bool:
    if not value:
        return False
    try:
        ipaddress.ip_address(value)
    except ValueError:
        return False
    return True


def _is_controlled_host(host: str | None) -> bool:
    if not host or not _looks_like_ip(host):
        return False
    if host in CONTROLLED_SINK_IPS:
        return True
    ip_obj = ipaddress.ip_address(host)
    return any(
        (
            ip_obj.is_private,
            ip_obj.is_loopback,
            ip_obj.is_link_local,
            ip_obj.is_multicast,
            ip_obj.is_reserved,
            ip_obj.is_unspecified,
        )
    )


def _build_host_port_label(*, host: str, port: int | None) -> str:
    if port is None:
        return host
    return f"{host}:{port}"


def _stable_unique_strings(values: list[str | None]) -> list[str]:
    result: list[str] = []
    seen: set[str] = set()
    for value in values:
        cleaned = str(value or "").strip()
        if not cleaned or cleaned in seen:
            continue
        seen.add(cleaned)
        result.append(cleaned)
    return result
