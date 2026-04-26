from __future__ import annotations

import codecs
import re
from pathlib import Path
from urllib.parse import urlparse

from app.runner.models import FileEvent, NetworkEvent, ProcessEvent, TraceArtifacts

TRACE_RE = re.compile(r"^(?P<ts>\d{2}:\d{2}:\d{2}\.\d{6}) (?P<body>.*)$")
STRING_RE = re.compile(r'"([^"]+)"')
CONNECT_RE = re.compile(r'connect\([^)]*sin_port=htons\((?P<port>\d+)\), sin_addr=inet_addr\("(?P<host>[^"]+)"\)')
CONNECT6_RE = re.compile(r'connect\([^)]*sin6_port=htons\((?P<port>\d+)\)[^)]*inet_pton\(AF_INET6, "(?P<host>[^"]+)"')
HOST_HEADER_RE = re.compile(r"Host:\s*(?P<host>[A-Za-z0-9._-]+)", re.IGNORECASE)
TLS_SNI_RE = re.compile(r"(?:sni|server_name)[=: ]+(?P<host>[A-Za-z0-9._-]+)", re.IGNORECASE)
URL_RE = re.compile(r"https?://[^\s'\"<>]+")
IP_PORT_RE = re.compile(r"\b(?P<host>(?:\d{1,3}\.){3}\d{1,3})(?::(?P<port>\d{1,5}))\b")
CALL_FD_RE = re.compile(r"^(?P<call>[a-zA-Z0-9_]+)\((?P<fd>\d+)")


def parse_trace_dir(trace_dir: Path) -> TraceArtifacts:
    artifacts = TraceArtifacts()
    for trace_file in sorted(trace_dir.glob("trace.log*")):
        pid = trace_file.name.split(".")[-1] if "." in trace_file.name else None
        dns_events_by_fd: dict[str, NetworkEvent] = {}
        for line in trace_file.read_text(encoding="utf-8", errors="replace").splitlines():
            body = _extract_trace_body(line)
            _enrich_dns_event_from_line(body=body, dns_events_by_fd=dns_events_by_fd)
            parsed = _parse_line(line=line, pid=pid)
            if not parsed:
                continue
            category, event, body = parsed
            if category == "file":
                artifacts.files.append(event)
            elif category == "network":
                artifacts.network.append(event)
                fd = _extract_fd(body)
                if fd is not None and event.port == 53:
                    dns_events_by_fd[fd] = event
                elif fd is not None:
                    dns_events_by_fd.pop(fd, None)
            elif category == "process":
                artifacts.processes.append(event)
            artifacts.timeline.append(_to_timeline_item(category, event))
    artifacts.timeline.sort(key=lambda item: item["timestamp"])
    return artifacts


def _parse_line(line: str, pid: str | None):
    match = TRACE_RE.match(line.strip())
    if not match:
        return None
    timestamp = match.group("ts")
    body = match.group("body")

    if body.startswith(("open(", "openat(", "openat2(")):
        return "file", _parse_file_open(timestamp, body, pid), body
    if body.startswith(("unlink(", "unlinkat(", "rename(", "renameat(")):
        return "file", FileEvent(timestamp=timestamp, path=_extract_first_string(body), action="delete_or_rename", raw=body, pid=pid), body
    if body.startswith(("execve(", "clone(", "clone3(", "vfork(", "fork(")):
        return "process", _parse_process(timestamp, body, pid), body
    if body.startswith("connect("):
        return "network", _parse_network(timestamp, body, pid), body
    return None


def _extract_trace_body(line: str) -> str | None:
    match = TRACE_RE.match(line.strip())
    if not match:
        return None
    return match.group("body")


def _parse_file_open(timestamp: str, body: str, pid: str | None) -> FileEvent:
    path = _extract_first_string(body)
    action = "read"
    if "O_WRONLY" in body or "O_RDWR" in body:
        action = "write"
    if "O_CREAT" in body:
        action = "create"
    return FileEvent(timestamp=timestamp, path=path, action=action, raw=body, pid=pid)


def _parse_process(timestamp: str, body: str, pid: str | None) -> ProcessEvent:
    if "= -1 ENOENT" in body:
        return ProcessEvent(timestamp=timestamp, action="skip", command="skip", raw=body, pid=pid)
    command = _extract_first_string(body)
    action = body.split("(", 1)[0]
    return ProcessEvent(timestamp=timestamp, action=action, command=command, raw=body, pid=pid)


def _parse_network(timestamp: str, body: str, pid: str | None) -> NetworkEvent:
    host: str | None = None
    port: int | None = None
    endpoint_kind = "unknown"
    endpoint_source = "trace_connect"

    match = CONNECT_RE.search(body) or CONNECT6_RE.search(body)
    if match:
        host = match.group("host")
        port = int(match.group("port"))
        endpoint_kind = "ip_port"
    else:
        host = _extract_network_host_hint(body)
        raw_ip = IP_PORT_RE.search(body)
        if raw_ip:
            host = raw_ip.group("host")
            port_text = raw_ip.group("port")
            port = int(port_text) if port_text else None
            endpoint_kind = "ip_port"
            endpoint_source = "trace_raw"

    address = _build_address(host=host, port=port)
    display_label = _build_display_label(host=host, port=port)
    return NetworkEvent(
        timestamp=timestamp,
        address=address,
        action="connect",
        raw=body,
        host=host,
        port=port,
        display_label=display_label,
        endpoint_kind=endpoint_kind,
        endpoint_source=endpoint_source,
        raw_address=address,
        raw_host=host,
        raw_port=port,
        pid=pid,
    )


def _extract_first_string(text: str) -> str:
    match = STRING_RE.search(text)
    return match.group(1) if match else "unknown"


def _extract_network_host_hint(text: str) -> str | None:
    for regex in (HOST_HEADER_RE, TLS_SNI_RE):
        match = regex.search(text)
        if match:
            return match.group("host")

    url_match = URL_RE.search(text)
    if url_match:
        parsed = urlparse(url_match.group(0))
        return parsed.hostname

    return None


def _extract_fd(body: str) -> str | None:
    match = CALL_FD_RE.match(body)
    if not match:
        return None
    return match.group("fd")


def _enrich_dns_event_from_line(body: str | None, dns_events_by_fd: dict[str, NetworkEvent]) -> None:
    if not body:
        return
    fd = _extract_fd(body)
    if fd is None or fd not in dns_events_by_fd:
        return
    domains = _extract_dns_query_names(body)
    if not domains:
        return
    event = dns_events_by_fd[fd]
    event.original_domain = domains[0]
    event.network_evidence_sources = _merge_sources(event.network_evidence_sources, ["dns"])
    event.original_target_candidates = _merge_sources(event.original_target_candidates, domains)


def _extract_dns_query_names(body: str) -> list[str]:
    results: list[str] = []
    for encoded in STRING_RE.findall(body):
        payload = _decode_trace_string(encoded)
        if not payload:
            continue
        qname = _parse_dns_qname(payload)
        if qname:
            results.append(qname)
    return results


def _decode_trace_string(encoded: str) -> bytes:
    try:
        return codecs.decode(encoded, "unicode_escape").encode("latin1", errors="ignore")
    except Exception:
        return b""


def _parse_dns_qname(payload: bytes) -> str | None:
    if len(payload) <= 12:
        return None
    offset = 12
    labels: list[str] = []
    while offset < len(payload):
        length = payload[offset]
        if length == 0:
            break
        if length > 63 or offset + 1 + length > len(payload):
            return None
        label_bytes = payload[offset + 1: offset + 1 + length]
        if not label_bytes or not all(32 <= byte < 127 for byte in label_bytes):
            return None
        labels.append(label_bytes.decode("ascii", errors="ignore"))
        offset += 1 + length
    if not labels:
        return None
    return ".".join(labels)


def _merge_sources(existing: list[str], new_items: list[str]) -> list[str]:
    merged: list[str] = []
    seen: set[str] = set()
    for item in [*existing, *new_items]:
        cleaned = str(item or "").strip()
        if not cleaned or cleaned in seen:
            continue
        seen.add(cleaned)
        merged.append(cleaned)
    return merged


def _build_address(host: str | None, port: int | None) -> str:
    if not host:
        return "unknown"
    if port is None:
        return host
    return f"{host}:{port}"


def _build_display_label(host: str | None, port: int | None) -> str | None:
    if not host:
        return None
    if port is None:
        return host
    return f"{host}:{port}"


def _to_timeline_item(category: str, event):
    if category == "file":
        detail = f"{event.action} {event.path}"
        metadata = {"path": event.path, "pid": event.pid}
        action = event.action
    elif category == "network":
        detail = f"{event.action} {event.sink_display_label or event.display_label or event.address}"
        metadata = {
            "address": event.address,
            "display_label": event.display_label,
            "sink_display_label": event.sink_display_label,
            "host": event.host,
            "port": event.port,
            "endpoint_kind": event.endpoint_kind,
            "endpoint_source": event.endpoint_source,
            "original_domain": event.original_domain,
            "original_url": event.original_url,
            "pid": event.pid,
        }
        action = event.action
    else:
        detail = f"{event.action} {event.command}"
        metadata = {"command": event.command, "pid": event.pid}
        action = event.action

    return {
        "timestamp": event.timestamp,
        "category": category,
        "action": action,
        "detail": detail,
        "metadata": metadata,
    }
