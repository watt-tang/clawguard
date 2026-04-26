from __future__ import annotations

from urllib.parse import urlparse

from app.analyzer.endpoint_semantics import endpoint_semantics
from app.analyzer.risk_model import SinkAssessment, SinkSemantics


def classify_sink(primary_chain: list[dict], tool_calls: list[object], network_events: list[object]) -> SinkAssessment:
    """Classify the best available sink candidate for outbound-risk decisions."""

    chain_sink = next(
        (
            node
            for node in reversed(primary_chain)
            if node.get("node_type") == "network_endpoint" and node.get("endpoint_role", "sink") == "sink"
        ),
        None,
    )
    chain_llm_relay = next(
        (
            node
            for node in reversed(primary_chain)
            if node.get("node_type") == "network_endpoint"
            and node.get("endpoint_role") == "relay"
            and node.get("is_llm_provider") is True
        ),
        None,
    )
    if chain_sink is not None:
        label = _preferred_sink_label(chain_sink)
        return _assessment_for_url(
            url=label,
            method=_method_for_url(label, tool_calls),
            declared_endpoint=True,
            tool_linked_http_action=bool(_matching_http_tool(label, tool_calls)) or bool(chain_llm_relay),
            chain_sink=chain_sink,
            relay_node=chain_llm_relay,
        )

    http_tools = [
        event for event in tool_calls
        if getattr(event, "event", "") == "start" and getattr(event, "tool_type", "") == "http_request"
    ]
    if http_tools:
        tool = _select_highest_risk_http_tool(http_tools)
        config = getattr(tool, "metadata", {}).get("config", {})
        return _assessment_for_url(
            url=str(config.get("url", "")),
            method=str(config.get("method", "GET")).upper(),
            declared_endpoint=True,
            tool_linked_http_action=True,
        )

    if network_events:
        address = str(
            getattr(network_events[-1], "sink_display_label", None)
            or getattr(network_events[-1], "display_label", None)
            or getattr(network_events[-1], "original_domain", None)
            or getattr(network_events[-1], "address", "")
        )
        return _assessment_for_url(
            url=address,
            method="",
            declared_endpoint=False,
            tool_linked_http_action=False,
            chain_sink={
                "label": address,
                "sink_display_label": getattr(network_events[-1], "sink_display_label", ""),
                "sink_raw_ip": getattr(network_events[-1], "sink_raw_ip", ""),
                "sink_domain": getattr(network_events[-1], "sink_domain", ""),
                "sink_url": getattr(network_events[-1], "sink_url", ""),
                "sink_port": getattr(network_events[-1], "sink_port", None),
                "sink_type": getattr(network_events[-1], "sink_type", "unknown"),
                "is_controlled_sink": getattr(network_events[-1], "is_controlled_sink", False),
                "network_evidence_sources": getattr(network_events[-1], "network_evidence_sources", []),
                "original_target_candidates": getattr(network_events[-1], "original_target_candidates", []),
                "selected_sink_reason": getattr(network_events[-1], "selected_sink_reason", ""),
                "endpoint_kind": getattr(network_events[-1], "endpoint_kind", None),
            },
        )

    return SinkAssessment(reasons=["No network sink candidate could be established."])


def _select_highest_risk_http_tool(http_tools: list[object]) -> object:
    ranked = [
        (_http_tool_risk_rank(event), index, event)
        for index, event in enumerate(http_tools)
    ]
    return max(ranked, key=lambda item: (item[0], item[1]))[2]


def _http_tool_risk_rank(event: object) -> int:
    config = getattr(event, "metadata", {}).get("config", {})
    method = str(config.get("method", "GET")).upper()
    url = str(config.get("url", "")).lower()
    score = 0
    if method in {"POST", "PUT", "PATCH"}:
        score += 4
    if any(token in url for token in {"register", "signup", "sign-up", "token", "credential", "api_key", "apikey", "oauth"}):
        score += 3
    if any(token in url for token in {"webhook", "callback", "hook"}):
        score += 2
    return score


def _assessment_for_url(
    *,
    url: str,
    method: str,
    declared_endpoint: bool,
    tool_linked_http_action: bool,
    chain_sink: dict | None = None,
    relay_node: dict | None = None,
) -> SinkAssessment:
    sink_meta = dict(chain_sink or {})
    url = (
        _clean_text(url)
        or _clean_text(sink_meta.get("sink_url"))
        or _clean_text(sink_meta.get("sink_domain"))
        or _clean_text(sink_meta.get("sink_display_label"))
        or _clean_text(sink_meta.get("label"))
    )
    parsed = urlparse(url)
    host = parsed.hostname or _clean_text(sink_meta.get("sink_domain")) or _clean_text(sink_meta.get("host"))
    is_internal = host in {"localhost", "127.0.0.1", "::1"} or host.endswith(".internal")
    relay_meta = dict(relay_node or {})
    effective_relay_meta = relay_meta or (
        sink_meta
        if sink_meta.get("endpoint_role") == "relay" and sink_meta.get("is_llm_provider") is True
        else {}
    )
    llm_mediated = bool(effective_relay_meta) and (not url or url == "unknown")
    reasons: list[str] = []

    if is_internal:
        semantics = SinkSemantics.TOOL_INTERNAL_ENDPOINT
        reasons.append("Sink resolves to a local or internal-only endpoint.")
    elif llm_mediated:
        semantics = SinkSemantics.LLM_MEDIATED_UNKNOWN_SINK
        reasons.append("Observed outbound flow reaches an external LLM API relay, but the downstream sink remains unresolved.")
    elif sink_meta.get("is_controlled_sink") is True:
        semantics = SinkSemantics.UNKNOWN_NETWORK_SINK
        reasons.append("Only a controlled or reserved sink address was observed, so the destination remains unresolved.")
    elif any(token in url.lower() for token in {"webhook", "callback", "hook"}):
        semantics = SinkSemantics.CALLBACK_OR_WEBHOOK
        reasons.append("URL contains callback/webhook markers.")
    elif method == "GET":
        semantics = SinkSemantics.PUBLIC_FETCH_ONLY
        reasons.append("HTTP method is GET, so the observed sink is a fetch-only endpoint.")
    elif method in {"POST", "PUT", "PATCH"}:
        semantics = SinkSemantics.PUBLIC_UPLOAD_OR_POST
        reasons.append("HTTP method is outward-facing upload/post semantics.")
    else:
        semantics = SinkSemantics.UNKNOWN_NETWORK_SINK
        reasons.append("Sink lacks enough HTTP semantics to be classified more precisely.")

    sink_fields = endpoint_semantics(
        label=url,
        host=host,
        endpoint_kind=sink_meta.get("endpoint_kind"),
    )
    if url == "unknown":
        sink_fields["sink_resolution_status"] = "llm-mediated" if llm_mediated else "unresolved"
    relay_fields = endpoint_semantics(
        label=str(effective_relay_meta.get("label", "")),
        host=effective_relay_meta.get("host"),
        endpoint_kind=effective_relay_meta.get("endpoint_kind"),
    ) if effective_relay_meta else {
        "is_llm_provider": False,
        "llm_provider_name": "unknown",
    }
    sink_resolution_status = (
        _clean_text(sink_meta.get("sink_resolution_status"))
        or str(sink_fields.get("sink_resolution_status", "unresolved"))
    )
    endpoint_role = _clean_text(sink_meta.get("endpoint_role")) or str(sink_fields.get("endpoint_role", "sink"))
    sink_display_label = _clean_text(sink_meta.get("sink_display_label")) or url
    sink_domain = _clean_text(sink_meta.get("sink_domain")) or host
    sink_url = _clean_text(sink_meta.get("sink_url"))
    if not sink_url and parsed.scheme in {"http", "https"}:
        sink_url = url

    return SinkAssessment(
        label=url,
        semantics=semantics,
        method=method,
        reasons=reasons,
        declared_endpoint=declared_endpoint,
        tool_linked_http_action=tool_linked_http_action,
        is_external=(not is_internal) and bool(url or effective_relay_meta),
        endpoint_role=endpoint_role,
        is_llm_provider=bool(sink_meta.get("is_llm_provider", sink_fields.get("is_llm_provider", False))),
        llm_provider_name=_clean_text(sink_meta.get("llm_provider_name")) or str(sink_fields.get("llm_provider_name", "unknown")),
        sink_resolution_status=sink_resolution_status,
        sink_display_label=sink_display_label,
        sink_raw_ip=_clean_text(sink_meta.get("sink_raw_ip")),
        sink_domain=sink_domain,
        sink_url=sink_url,
        sink_port=sink_meta.get("sink_port"),
        sink_type=str(sink_meta.get("sink_type", "unknown")),
        is_controlled_sink=bool(sink_meta.get("is_controlled_sink", False)),
        network_evidence_sources=list(sink_meta.get("network_evidence_sources", [])),
        original_target_candidates=list(sink_meta.get("original_target_candidates", [])),
        selected_sink_reason=str(sink_meta.get("selected_sink_reason", "")),
        relay_label=str(effective_relay_meta.get("label", "")),
        relay_is_llm_provider=bool(relay_fields.get("is_llm_provider", False)),
        relay_llm_provider_name=str(relay_fields.get("llm_provider_name", "unknown")),
    )


def _matching_http_tool(url: str, tool_calls: list[object]) -> object | None:
    for event in tool_calls:
        if getattr(event, "event", "") != "start" or getattr(event, "tool_type", "") != "http_request":
            continue
        if str(getattr(event, "metadata", {}).get("config", {}).get("url", "")) == url:
            return event
    return None


def _method_for_url(url: str, tool_calls: list[object]) -> str:
    tool = _matching_http_tool(url, tool_calls)
    if tool is None:
        return ""
    return str(getattr(tool, "metadata", {}).get("config", {}).get("method", "GET")).upper()


def _preferred_sink_label(node: dict) -> str:
    return str(
        node.get("sink_url")
        or node.get("sink_domain")
        or node.get("sink_display_label")
        or node.get("label", "")
    )


def _clean_text(value: object) -> str:
    if value is None:
        return ""
    text = str(value).strip()
    if not text or text.lower() == "none":
        return ""
    return text
