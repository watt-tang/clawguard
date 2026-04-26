from __future__ import annotations

import json
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Protocol

from app.runner.models import DataFlowEvent, FileEvent, NetworkEvent, ToolCallEvent


ADAPTER_BROWSER = "browser"
ADAPTER_WEBHOOK = "webhook"
ADAPTER_DOCUMENT = "document"
ADAPTER_MESSAGING = "messaging"
ADAPTER_CREDENTIAL_STATE = "credential_state"


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass
class AdapterEventBundle:
    file_events: list[FileEvent] = field(default_factory=list)
    network_events: list[NetworkEvent] = field(default_factory=list)
    tool_calls: list[ToolCallEvent] = field(default_factory=list)
    data_flows: list[DataFlowEvent] = field(default_factory=list)

    def merge(self, other: "AdapterEventBundle") -> None:
        self.file_events.extend(other.file_events)
        self.network_events.extend(other.network_events)
        self.tool_calls.extend(other.tool_calls)
        self.data_flows.extend(other.data_flows)

    def summary(self) -> dict[str, int]:
        return {
            "file_events": len(self.file_events),
            "network_events": len(self.network_events),
            "tool_calls": len(self.tool_calls),
            "data_flows": len(self.data_flows),
        }


@dataclass
class AdapterContext:
    skill_workspace: Path
    artifacts_dir: Path
    execution_id: str
    execution_profile: str
    browser_enabled: bool
    adapters_enabled: list[str]


class BaseAdapter(Protocol):
    name: str
    capability_coverage: list[str]

    def setup(self, ctx: AdapterContext) -> None:
        ...

    def teardown(self, ctx: AdapterContext) -> None:
        ...

    def expose_test_artifacts(self, ctx: AdapterContext) -> list[dict[str, Any]]:
        ...

    def provide_mock_events(self, ctx: AdapterContext) -> AdapterEventBundle:
        ...

    def get_adapter_state(self) -> dict[str, Any]:
        ...

    def explainability_metadata(self) -> dict[str, Any]:
        ...


class _AdapterBase:
    name = "base"
    capability_coverage: list[str] = []

    def __init__(self) -> None:
        self._state: dict[str, Any] = {}
        self._artifacts: list[dict[str, Any]] = []

    def setup(self, ctx: AdapterContext) -> None:
        _ = ctx

    def teardown(self, ctx: AdapterContext) -> None:
        _ = ctx

    def expose_test_artifacts(self, ctx: AdapterContext) -> list[dict[str, Any]]:
        _ = ctx
        return list(self._artifacts)

    def provide_mock_events(self, ctx: AdapterContext) -> AdapterEventBundle:
        _ = ctx
        return AdapterEventBundle()

    def get_adapter_state(self) -> dict[str, Any]:
        return dict(self._state)

    def explainability_metadata(self) -> dict[str, Any]:
        return {
            "adapter": self.name,
            "capability_coverage": list(self.capability_coverage),
        }

    def _record_artifact(self, *, path: Path, artifact_type: str, synthetic_sensitive: bool, description: str) -> None:
        self._artifacts.append(
            {
                "path": str(path),
                "artifact_type": artifact_type,
                "synthetic": True,
                "synthetic_sensitive": synthetic_sensitive,
                "adapter": self.name,
                "description": description,
            }
        )


class BrowserAdapter(_AdapterBase):
    name = ADAPTER_BROWSER
    capability_coverage = ["requires_browser", "ui_navigation_semantics"]

    def setup(self, ctx: AdapterContext) -> None:
        sandbox_dir = ctx.skill_workspace / ".provloom" / "adapters" / "browser"
        sandbox_dir.mkdir(parents=True, exist_ok=True)
        state_path = sandbox_dir / "session.json"
        payload = {
            "synthetic": True,
            "profile": "browser_lightweight",
            "headless": True,
            "note": "No real browser session is created; this is adapter state only.",
        }
        state_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        self._state = {"session_state_path": str(state_path.relative_to(ctx.skill_workspace))}
        self._record_artifact(
            path=state_path.relative_to(ctx.skill_workspace),
            artifact_type="browser_state",
            synthetic_sensitive=False,
            description="Synthetic browser adapter state",
        )


class WebhookAdapter(_AdapterBase):
    name = ADAPTER_WEBHOOK
    capability_coverage = ["requires_callback_or_webhook", "callback_semantics"]

    def setup(self, ctx: AdapterContext) -> None:
        base = ctx.skill_workspace / ".provloom" / "adapters" / "webhook"
        base.mkdir(parents=True, exist_ok=True)
        endpoint = "https://mock-webhook.local/callback"
        callback_log = base / "callback-log.jsonl"
        callback_event = {
            "timestamp": utc_now(),
            "event": "callback_received",
            "source": "synthetic_webhook",
            "request_id": f"cb-{ctx.execution_id[:8]}",
            "path": "/callback",
            "method": "POST",
            "payload": {"status": "ok", "delivery": "synthetic"},
        }
        callback_log.write_text(json.dumps(callback_event, ensure_ascii=False) + "\n", encoding="utf-8")
        endpoint_file = base / "endpoint.txt"
        endpoint_file.write_text(endpoint + "\n", encoding="utf-8")
        self._state = {
            "endpoint": endpoint,
            "callback_log": str(callback_log.relative_to(ctx.skill_workspace)),
        }
        self._record_artifact(
            path=callback_log.relative_to(ctx.skill_workspace),
            artifact_type="webhook_callback_log",
            synthetic_sensitive=False,
            description="Synthetic webhook callback request log",
        )
        self._record_artifact(
            path=endpoint_file.relative_to(ctx.skill_workspace),
            artifact_type="webhook_endpoint",
            synthetic_sensitive=False,
            description="Synthetic webhook endpoint hint",
        )

    def provide_mock_events(self, ctx: AdapterContext) -> AdapterEventBundle:
        ts = utc_now()
        endpoint = self._state.get("endpoint", "https://mock-webhook.local/callback")
        log_path = self._state.get("callback_log", ".provloom/adapters/webhook/callback-log.jsonl")
        return AdapterEventBundle(
            file_events=[
                FileEvent(
                    timestamp=ts,
                    path=log_path,
                    action="read",
                    raw="adapter:webhook callback log consumed",
                    source="adapter",
                )
            ],
            network_events=[
                NetworkEvent(
                    timestamp=ts,
                    address=endpoint,
                    action="connect",
                    raw="adapter:webhook synthetic callback endpoint",
                    source="adapter",
                    sink_resolution_status="resolved",
                    sink_url=endpoint,
                    sink_type="callback",
                    network_evidence_sources=["adapter:webhook"],
                    selected_sink_reason="synthetic_webhook_endpoint",
                )
            ],
            tool_calls=[
                ToolCallEvent(
                    timestamp=ts,
                    tool_id="adapter_webhook_callback",
                    tool_name="Webhook Adapter Callback",
                    tool_type="adapter_webhook",
                    event="finish",
                    status="ok",
                    source="adapter",
                    metadata={
                        "adapter": self.name,
                        "semantic": "callback_received",
                        "synthetic": True,
                        "execution_profile": ctx.execution_profile,
                    },
                )
            ],
        )


class CredentialStateAdapter(_AdapterBase):
    name = ADAPTER_CREDENTIAL_STATE
    capability_coverage = ["requires_external_api_key", "requires_oauth_or_login", "credential_state_semantics"]

    def setup(self, ctx: AdapterContext) -> None:
        base = ctx.skill_workspace / ".provloom" / "adapters" / "credential_state"
        base.mkdir(parents=True, exist_ok=True)
        env_file = base / "fake.env"
        token_file = base / "fake_token.json"
        account_file = base / "fake_account_profile.json"
        scopes_file = base / "fake_scopes.txt"

        env_file.write_text("FAKE_API_KEY=sk-provloom-synthetic\nFAKE_ACCOUNT_ID=acct_synthetic\n", encoding="utf-8")
        token_file.write_text(
            json.dumps(
                {
                    "access_token": "tok_synthetic_adapter",
                    "refresh_token": "ref_synthetic_adapter",
                    "provider": "mock-platform",
                    "synthetic": True,
                },
                ensure_ascii=False,
                indent=2,
            ),
            encoding="utf-8",
        )
        account_file.write_text(
            json.dumps(
                {
                    "account": "synthetic-user",
                    "permissions": ["read", "write", "forward"],
                    "synthetic": True,
                },
                ensure_ascii=False,
                indent=2,
            ),
            encoding="utf-8",
        )
        scopes_file.write_text("docs.read\ndocs.write\nmessages.send\n", encoding="utf-8")
        self._state = {
            "credential_env_path": str(env_file.relative_to(ctx.skill_workspace)),
            "token_path": str(token_file.relative_to(ctx.skill_workspace)),
        }
        for rel, kind in [
            (env_file.relative_to(ctx.skill_workspace), "fake_env"),
            (token_file.relative_to(ctx.skill_workspace), "fake_token"),
            (account_file.relative_to(ctx.skill_workspace), "fake_account_profile"),
            (scopes_file.relative_to(ctx.skill_workspace), "fake_permission_scopes"),
        ]:
            self._record_artifact(
                path=rel,
                artifact_type=kind,
                synthetic_sensitive=True,
                description="Synthetic credential-state artifact for semantics recovery",
            )

    def provide_mock_events(self, ctx: AdapterContext) -> AdapterEventBundle:
        ts = utc_now()
        env_path = self._state.get("credential_env_path", ".provloom/adapters/credential_state/fake.env")
        return AdapterEventBundle(
            file_events=[
                FileEvent(
                    timestamp=ts,
                    path=env_path,
                    action="read",
                    raw="adapter:credential_state synthetic credential file exposed",
                    source="adapter",
                )
            ],
            tool_calls=[
                ToolCallEvent(
                    timestamp=ts,
                    tool_id="adapter_credential_state",
                    tool_name="Credential State Adapter",
                    tool_type="adapter_credential_state",
                    event="finish",
                    status="ok",
                    source="adapter",
                    metadata={
                        "adapter": self.name,
                        "semantic": "synthetic_sensitive_artifact_exposed",
                        "synthetic": True,
                        "execution_profile": ctx.execution_profile,
                    },
                )
            ],
        )


class DocumentAdapter(_AdapterBase):
    name = ADAPTER_DOCUMENT
    capability_coverage = ["requires_document_or_office_stack", "document_io_semantics"]

    def setup(self, ctx: AdapterContext) -> None:
        base = ctx.skill_workspace / ".provloom" / "adapters" / "document"
        base.mkdir(parents=True, exist_ok=True)
        note = base / "mock_note.md"
        report = base / "mock_report.txt"
        table = base / "mock_table.csv"
        note.write_text("# Mock Note\n\nThis is synthetic document input.\n", encoding="utf-8")
        report.write_text("Synthetic report body\n", encoding="utf-8")
        table.write_text("name,value\nmock,1\n", encoding="utf-8")
        self._state = {
            "document_inputs": [
                str(note.relative_to(ctx.skill_workspace)),
                str(report.relative_to(ctx.skill_workspace)),
                str(table.relative_to(ctx.skill_workspace)),
            ]
        }
        for rel in self._state["document_inputs"]:
            self._record_artifact(
                path=Path(rel),
                artifact_type="mock_document",
                synthetic_sensitive=False,
                description="Synthetic document input artifact",
            )

    def provide_mock_events(self, ctx: AdapterContext) -> AdapterEventBundle:
        ts = utc_now()
        inputs = self._state.get("document_inputs", [])
        file_events = [
            FileEvent(
                timestamp=ts,
                path=item,
                action="read",
                raw="adapter:document synthetic input consumed",
                source="adapter",
            )
            for item in inputs
        ]
        return AdapterEventBundle(
            file_events=file_events,
            tool_calls=[
                ToolCallEvent(
                    timestamp=ts,
                    tool_id="adapter_document",
                    tool_name="Document Adapter",
                    tool_type="adapter_document",
                    event="finish",
                    status="ok",
                    source="adapter",
                    metadata={
                        "adapter": self.name,
                        "semantic": "document_read_write_ready",
                        "synthetic": True,
                        "execution_profile": ctx.execution_profile,
                    },
                )
            ],
        )


class MessagingAdapter(_AdapterBase):
    name = ADAPTER_MESSAGING
    capability_coverage = ["requires_messaging_stack", "message_receive_send_forward_semantics"]

    def setup(self, ctx: AdapterContext) -> None:
        base = ctx.skill_workspace / ".provloom" / "adapters" / "messaging"
        base.mkdir(parents=True, exist_ok=True)
        inbox = base / "inbox.jsonl"
        outbox = base / "outbox.jsonl"
        forward_log = base / "forward_log.jsonl"
        inbox.write_text(json.dumps({"id": "m1", "from": "mock-user", "text": "hello", "synthetic": True}) + "\n", encoding="utf-8")
        outbox.write_text("", encoding="utf-8")
        forward_log.write_text("", encoding="utf-8")
        self._state = {
            "inbox_path": str(inbox.relative_to(ctx.skill_workspace)),
            "outbox_path": str(outbox.relative_to(ctx.skill_workspace)),
            "forward_log_path": str(forward_log.relative_to(ctx.skill_workspace)),
            "relay_endpoint": "https://mock-messaging-relay.local/forward",
        }
        for rel, kind in [
            (self._state["inbox_path"], "mock_inbox"),
            (self._state["outbox_path"], "mock_outbox"),
            (self._state["forward_log_path"], "mock_forward_log"),
        ]:
            self._record_artifact(
                path=Path(rel),
                artifact_type=kind,
                synthetic_sensitive=False,
                description="Synthetic messaging artifact",
            )

    def provide_mock_events(self, ctx: AdapterContext) -> AdapterEventBundle:
        ts = utc_now()
        endpoint = self._state.get("relay_endpoint", "https://mock-messaging-relay.local/forward")
        inbox = self._state.get("inbox_path", ".provloom/adapters/messaging/inbox.jsonl")
        outbox = self._state.get("outbox_path", ".provloom/adapters/messaging/outbox.jsonl")
        return AdapterEventBundle(
            file_events=[
                FileEvent(timestamp=ts, path=inbox, action="read", raw="adapter:messaging read inbox", source="adapter"),
                FileEvent(timestamp=ts, path=outbox, action="write", raw="adapter:messaging write outbox", source="adapter"),
            ],
            network_events=[
                NetworkEvent(
                    timestamp=ts,
                    address=endpoint,
                    action="connect",
                    raw="adapter:messaging forward relay endpoint",
                    source="adapter",
                    sink_resolution_status="resolved",
                    sink_url=endpoint,
                    sink_type="relay",
                    network_evidence_sources=["adapter:messaging"],
                    selected_sink_reason="synthetic_messaging_forward",
                )
            ],
            tool_calls=[
                ToolCallEvent(
                    timestamp=ts,
                    tool_id="adapter_messaging_receive",
                    tool_name="Messaging Adapter Receive",
                    tool_type="adapter_messaging",
                    event="finish",
                    status="ok",
                    source="adapter",
                    metadata={"adapter": self.name, "semantic": "receive", "synthetic": True, "execution_profile": ctx.execution_profile},
                ),
                ToolCallEvent(
                    timestamp=ts,
                    tool_id="adapter_messaging_send",
                    tool_name="Messaging Adapter Send",
                    tool_type="adapter_messaging",
                    event="finish",
                    status="ok",
                    source="adapter",
                    metadata={"adapter": self.name, "semantic": "send", "synthetic": True, "execution_profile": ctx.execution_profile},
                ),
                ToolCallEvent(
                    timestamp=ts,
                    tool_id="adapter_messaging_forward",
                    tool_name="Messaging Adapter Forward",
                    tool_type="adapter_messaging",
                    event="finish",
                    status="ok",
                    source="adapter",
                    metadata={"adapter": self.name, "semantic": "forward", "synthetic": True, "execution_profile": ctx.execution_profile},
                ),
            ],
            data_flows=[
                DataFlowEvent(
                    timestamp=ts,
                    source="message_inbox",
                    source_detail=inbox,
                    sink="message_relay",
                    sink_detail=endpoint,
                    note="Synthetic messaging forward flow",
                )
            ],
        )


class AdapterManager:
    def __init__(self, *, enabled_adapters: list[str], browser_enabled: bool) -> None:
        normalized = [item.strip().lower() for item in enabled_adapters if str(item).strip()]
        self._requested_names = normalized
        self._browser_enabled = browser_enabled
        self._instances: list[_AdapterBase] = []
        self._artifacts: list[dict[str, Any]] = []
        self._events = AdapterEventBundle()

    def setup(self, ctx: AdapterContext) -> None:
        for adapter in self._resolve_adapters():
            adapter.setup(ctx)
            self._instances.append(adapter)
            self._artifacts.extend(adapter.expose_test_artifacts(ctx))
            self._events.merge(adapter.provide_mock_events(ctx))

    def teardown(self, ctx: AdapterContext) -> None:
        for adapter in self._instances:
            try:
                adapter.teardown(ctx)
            except Exception:
                continue

    def enabled_adapters(self) -> list[str]:
        return [adapter.name for adapter in self._instances]

    def synthetic_artifact_summary(self) -> dict[str, Any]:
        return {
            "count": len(self._artifacts),
            "paths": [item.get("path") for item in self._artifacts],
            "artifacts": self._artifacts,
        }

    def adapter_events(self) -> AdapterEventBundle:
        return self._events

    def adapter_events_summary(self) -> dict[str, Any]:
        return {
            "counts": self._events.summary(),
            "adapters": self.enabled_adapters(),
        }

    def _resolve_adapters(self) -> list[_AdapterBase]:
        mapping = {
            ADAPTER_WEBHOOK: WebhookAdapter,
            ADAPTER_DOCUMENT: DocumentAdapter,
            ADAPTER_MESSAGING: MessagingAdapter,
            ADAPTER_CREDENTIAL_STATE: CredentialStateAdapter,
            ADAPTER_BROWSER: BrowserAdapter,
        }
        names = list(self._requested_names)
        if self._browser_enabled and ADAPTER_BROWSER not in names:
            names.append(ADAPTER_BROWSER)
        instances: list[_AdapterBase] = []
        for name in names:
            cls = mapping.get(name)
            if cls is None:
                continue
            instances.append(cls())
        return instances

