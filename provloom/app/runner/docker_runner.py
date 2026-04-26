from __future__ import annotations

import json
import os
import shutil
import subprocess
import tempfile
import threading
import time
import uuid
from pathlib import Path
from threading import Lock
from shlex import quote

from app.backend.schemas import LLMConfig
from app.analyzer.trigger_synthesis import TriggerPlan, build_trigger_event_injections, materialize_artifact_triggers
from app.runtime.adapter_layer import AdapterContext, AdapterManager
from app.runtime.skill_parser import load_skill_definition, resolve_skill_target
from app.runner.models import ResourceUsage, SandboxExecution
from app.telemetry.collector import build_data_flow_hints, load_llm_events, load_runtime_events
from app.runner.trace_parser import parse_trace_dir


class DockerUnavailableError(RuntimeError):
    pass


class SandboxRunError(RuntimeError):
    pass


class DockerRunner:
    _build_lock = Lock()
    _image_built = False

    def __init__(
        self,
        image_name: str = "skill-runtime-sandbox:latest",
        dockerfile_dir: str = "docker/sandbox",
        artifacts_root: str = "artifacts/runs",
    ) -> None:
        self.image_name = image_name
        self.dockerfile_dir = Path(dockerfile_dir)
        # Docker bind mounts require absolute host paths for reproducible benchmark runs.
        self.artifacts_root = Path(artifacts_root).resolve()
        self.artifacts_root.mkdir(parents=True, exist_ok=True)

    def run(
        self,
        execution_id: str,
        skill_path: str,
        input_payload: dict,
        timeout_seconds: int,
        network_policy: str,
        llm_config: LLMConfig,
        memory_limit_mb: int = 256,
        execution_profile: str = "base_lightweight",
        trigger_depth_level: int = 1,
        telemetry_verbosity: str = "standard",
        browser_enabled: bool = False,
        adapters_enabled: list[str] | None = None,
        escalation_allowed: bool = False,
        trigger_plan: dict | None = None,
        trigger_prompt_used: list[str] | None = None,
    ) -> SandboxExecution:
        source_dir, skill_file = resolve_skill_target(skill_path)
        skill_definition = load_skill_definition(
            source_dir,
            skill_file,
            allow_empty_actions=llm_config.enabled,
        )
        self._ensure_docker_available()
        self._build_image()

        with tempfile.TemporaryDirectory(prefix="skill-sandbox-") as temp_dir:
            temp_root = Path(temp_dir)
            mounted_skill_dir = temp_root / "skill"
            artifacts_dir = self.artifacts_root / execution_id
            shutil.copytree(source_dir, mounted_skill_dir)
            if artifacts_dir.exists():
                shutil.rmtree(artifacts_dir)
            artifacts_dir.mkdir(parents=True, exist_ok=True)

            (artifacts_dir / "input-payload.json").write_text(
                json.dumps(input_payload, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )
            (artifacts_dir / "llm-config.json").write_text(
                json.dumps({
                    "enabled": llm_config.enabled,
                    "provider": llm_config.provider,
                    "base_url": llm_config.base_url,
                    "api_key": llm_config.api_key,
                    "model": llm_config.model,
                    "temperature": llm_config.temperature,
                    "max_steps": llm_config.max_steps,
                }, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )
            adapter_ctx = AdapterContext(
                skill_workspace=mounted_skill_dir,
                artifacts_dir=artifacts_dir,
                execution_id=execution_id,
                execution_profile=execution_profile,
                browser_enabled=browser_enabled,
                adapters_enabled=list(adapters_enabled or []),
            )
            adapter_manager = AdapterManager(
                enabled_adapters=list(adapters_enabled or []),
                browser_enabled=browser_enabled,
            )
            adapter_manager.setup(adapter_ctx)
            (artifacts_dir / "adapter-state.json").write_text(
                json.dumps(
                    {
                        "enabled_adapters": adapter_manager.enabled_adapters(),
                        "synthetic_artifact_summary": adapter_manager.synthetic_artifact_summary(),
                        "adapter_events_summary": adapter_manager.adapter_events_summary(),
                    },
                    ensure_ascii=False,
                    indent=2,
                ),
                encoding="utf-8",
            )
            parsed_trigger_plan = TriggerPlan.from_dict(trigger_plan or {})
            trigger_artifact_used = materialize_artifact_triggers(mounted_skill_dir, parsed_trigger_plan)
            trigger_event_injections = build_trigger_event_injections(parsed_trigger_plan)
            trigger_event_bundle = self._build_trigger_event_bundle(trigger_event_injections)
            trigger_used = list(trigger_prompt_used or []) + trigger_artifact_used + [item.get("trigger_id", "") for item in trigger_event_injections]
            trigger_used = [item for item in trigger_used if item]
            (artifacts_dir / "trigger-plan.json").write_text(
                json.dumps(
                    {
                        "trigger_plan": parsed_trigger_plan.to_dict(),
                        "trigger_used": trigger_used,
                        "trigger_event_injections": trigger_event_injections,
                    },
                    ensure_ascii=False,
                    indent=2,
                ),
                encoding="utf-8",
            )

            runner_script = self._build_runner_script(skill_file=skill_file, timeout_seconds=timeout_seconds)
            container_name = f"skill-sandbox-{uuid.uuid4().hex[:10]}"

            docker_cmd = [
                "docker",
                "run",
                "--name",
                container_name,
                "--cap-drop",
                "ALL",
                "--security-opt",
                "no-new-privileges",
                "--pids-limit",
                "64",
                "--memory",
                f"{max(64, int(memory_limit_mb))}m",
                "--cpus",
                "1.0",
                "--mount",
                f"type=bind,src={mounted_skill_dir},dst=/workspace/skill",
                "--mount",
                f"type=bind,src={artifacts_dir},dst=/artifacts",
                "--add-host",
                "host.docker.internal:host-gateway",
            ]
            if network_policy == "disabled":
                docker_cmd.extend(["--network", "none"])

            docker_cmd.extend([
                "-e",
                f"PROVLOOM_EXECUTION_PROFILE={execution_profile}",
                "-e",
                f"PROVLOOM_TRIGGER_DEPTH={int(trigger_depth_level)}",
                "-e",
                f"PROVLOOM_TELEMETRY_VERBOSITY={telemetry_verbosity}",
                "-e",
                f"PROVLOOM_BROWSER_ENABLED={'1' if browser_enabled else '0'}",
                "-e",
                f"PROVLOOM_ADAPTERS_ENABLED={','.join(adapters_enabled or [])}",
                "-e",
                f"PROVLOOM_ESCALATION_ALLOWED={'1' if escalation_allowed else '0'}",
                self.image_name,
                "sh",
                "-lc",
                runner_script,
            ])

            monitor_stop = threading.Event()
            peak_holder = {"peak": 0}
            monitor_thread = threading.Thread(
                target=self._poll_container_memory,
                args=(container_name, monitor_stop, peak_holder),
                daemon=True,
            )

            try:
                monitor_thread.start()
                result = subprocess.run(
                    docker_cmd,
                    text=True,
                    capture_output=True,
                    check=False,
                    timeout=timeout_seconds + 60,
                )
            except subprocess.TimeoutExpired as exc:
                monitor_stop.set()
                monitor_thread.join(timeout=2)
                self._force_cleanup(container_name)
                raise SandboxRunError(f"Sandbox hard-timeout exceeded for task {execution_id}") from exc
            finally:
                monitor_stop.set()
                if monitor_thread.is_alive():
                    monitor_thread.join(timeout=2)

            self._sanitize_llm_config_artifact(artifacts_dir / "llm-config.json")
            meta = self._load_meta(artifacts_dir / "meta.json")
            stdout = self._read_text(artifacts_dir / "stdout.log")
            stderr = self._read_text(artifacts_dir / "stderr.log")
            trace_artifacts = parse_trace_dir(artifacts_dir)
            tool_calls = load_runtime_events(artifacts_dir / "runtime-events.jsonl")
            llm_events = load_llm_events(artifacts_dir / "runtime-events.jsonl")

            file_events = trace_artifacts.files
            network_events = trace_artifacts.network
            process_events = [
                event
                for event in trace_artifacts.processes
                if event.action != "skip"
            ]
            data_flows = build_data_flow_hints(file_events, network_events, tool_calls)
            adapter_events = adapter_manager.adapter_events()
            file_events = file_events + adapter_events.file_events
            network_events = network_events + adapter_events.network_events
            tool_calls = tool_calls + adapter_events.tool_calls
            data_flows = data_flows + adapter_events.data_flows
            file_events = file_events + trigger_event_bundle["file_events"]
            network_events = network_events + trigger_event_bundle["network_events"]
            tool_calls = tool_calls + trigger_event_bundle["tool_calls"]
            data_flows = data_flows + trigger_event_bundle["data_flows"]
            resource_usage = self._collect_resource_usage(
                container_name=container_name,
                peak_memory_bytes=peak_holder["peak"],
                mounted_skill_dir=mounted_skill_dir,
                artifacts_dir=artifacts_dir,
            )

            if result.returncode != 0 and not meta:
                self._force_cleanup(container_name)
                raise SandboxRunError(
                    "Docker run failed before analysis artifacts were generated. "
                    f"stderr={result.stderr.strip()}"
                )

            try:
                return SandboxExecution(
                    execution_id=execution_id,
                    skill_path=str(source_dir),
                    skill_file=skill_file,
                    sandbox_image=self.image_name,
                    runtime_name=skill_definition.runtime,
                    command=["python", "-m", "app.runtime.container_runtime"],
                    exit_code=meta.get("exit_code"),
                    timed_out=bool(meta.get("timed_out", False)),
                    stdout=stdout,
                    stderr=stderr or result.stderr,
                    trace_artifacts=trace_artifacts,
                    file_events=file_events,
                    network_events=network_events,
                    process_events=process_events,
                    tool_calls=tool_calls,
                    llm_events=llm_events,
                    data_flows=data_flows,
                    resource_usage=resource_usage,
                    artifacts_dir=str(artifacts_dir),
                    enabled_adapters=adapter_manager.enabled_adapters(),
                    adapter_events_summary=adapter_manager.adapter_events_summary(),
                    synthetic_artifact_summary=adapter_manager.synthetic_artifact_summary(),
                    trigger_plan=parsed_trigger_plan.to_dict(),
                    trigger_used=trigger_used,
                    trigger_hits=[],
                    trigger_unexecuted=[],
                    trigger_events_summary={
                        "event_injection_count": len(trigger_event_injections),
                        "file_events": len(trigger_event_bundle["file_events"]),
                        "network_events": len(trigger_event_bundle["network_events"]),
                        "tool_calls": len(trigger_event_bundle["tool_calls"]),
                    },
                )
            finally:
                adapter_manager.teardown(adapter_ctx)
                self._force_cleanup(container_name)

    def _ensure_docker_available(self) -> None:
        if shutil.which("docker") is None:
            raise DockerUnavailableError(
                "Docker CLI is not available. Please install Docker and ensure `docker` is on PATH."
            )

    def _build_image(self) -> None:
        with self._build_lock:
            if self._image_built:
                return
            # Reuse an existing local image to keep benchmark reruns stable.
            inspect_result = subprocess.run(
                ["docker", "image", "inspect", self.image_name],
                text=True,
                capture_output=True,
                check=False,
            )
            if inspect_result.returncode == 0:
                self._image_built = True
                return
            cmd = [
                "docker",
                "build",
                "-t",
                self.image_name,
                "--network",
                "host",
                "--build-arg",
                f"HTTP_PROXY={os.environ.get('HTTP_PROXY', '')}",
                "--build-arg",
                f"HTTPS_PROXY={os.environ.get('HTTPS_PROXY', '')}",
                "--build-arg",
                f"NO_PROXY={os.environ.get('NO_PROXY', '')}",
                "-f",
                str(self.dockerfile_dir / "Dockerfile"),
                ".",
            ]
            result = subprocess.run(cmd, text=True, capture_output=True, check=False)
            if result.returncode != 0:
                raise SandboxRunError(f"Failed to build sandbox image: {result.stderr.strip()}")
            self._image_built = True

    def _build_runner_script(self, skill_file: str, timeout_seconds: int) -> str:
        skill_file_quoted = quote(skill_file)
        return f"""
set -eu
cd /workspace/skill
TIMED_OUT=0
EXIT_CODE=0
if timeout --preserve-status {timeout_seconds}s sh -lc 'PYTHONPATH=/opt/skill_sandbox /usr/bin/time -v -o /artifacts/runtime-resource-usage.txt strace -ff -tt -s 256 -o /artifacts/trace.log -e trace=file,process,network python -m app.runtime.container_runtime --skill-root /workspace/skill --skill-file {skill_file_quoted} --input-payload /artifacts/input-payload.json --runtime-events /artifacts/runtime-events.jsonl --llm-config /artifacts/llm-config.json > /artifacts/stdout.log 2> /artifacts/stderr.log'; then
  EXIT_CODE=0
else
  EXIT_CODE=$?
  if [ "$EXIT_CODE" = "124" ]; then
    TIMED_OUT=1
  fi
fi
printf '{{"exit_code": %s, "timed_out": %s}}' "$EXIT_CODE" "$TIMED_OUT" > /artifacts/meta.json
exit 0
""".strip()

    def _force_cleanup(self, container_name: str) -> None:
        subprocess.run(
            ["docker", "rm", "-f", container_name],
            text=True,
            capture_output=True,
            check=False,
        )

    def _sanitize_llm_config_artifact(self, path: Path) -> None:
        if not path.exists():
            return
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            return
        if "api_key" not in payload:
            return
        payload["api_key"] = "***redacted***" if payload.get("api_key") else ""
        path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    def _collect_resource_usage(
        self,
        container_name: str,
        peak_memory_bytes: int,
        mounted_skill_dir: Path,
        artifacts_dir: Path,
    ) -> ResourceUsage:
        inspect_data = self._inspect_container(container_name)
        runtime_peak_bytes = self._parse_gnu_time_peak_bytes(artifacts_dir / "runtime-resource-usage.txt")
        if runtime_peak_bytes and runtime_peak_bytes > peak_memory_bytes:
            peak_memory_bytes = runtime_peak_bytes
        skill_bundle_bytes = self._dir_size_bytes(mounted_skill_dir)
        artifacts_bytes = self._dir_size_bytes(artifacts_dir)
        writable_layer_bytes = inspect_data.get("SizeRw")
        rootfs_bytes = inspect_data.get("SizeRootFs")
        estimated_total_disk_bytes = sum(
            value for value in [skill_bundle_bytes, artifacts_bytes, writable_layer_bytes] if isinstance(value, int)
        )
        memory_limit_bytes = ((inspect_data.get("HostConfig") or {}).get("Memory")) or None
        if memory_limit_bytes == 0:
            memory_limit_bytes = None
        return ResourceUsage(
            memory_limit_bytes=memory_limit_bytes,
            memory_peak_bytes=peak_memory_bytes or None,
            memory_peak_human=self._format_bytes(peak_memory_bytes) if peak_memory_bytes else None,
            writable_layer_bytes=writable_layer_bytes,
            writable_layer_human=self._format_bytes(writable_layer_bytes),
            rootfs_bytes=rootfs_bytes,
            rootfs_human=self._format_bytes(rootfs_bytes),
            skill_bundle_bytes=skill_bundle_bytes,
            skill_bundle_human=self._format_bytes(skill_bundle_bytes),
            artifacts_bytes=artifacts_bytes,
            artifacts_human=self._format_bytes(artifacts_bytes),
            estimated_total_disk_bytes=estimated_total_disk_bytes or None,
            estimated_total_disk_human=self._format_bytes(estimated_total_disk_bytes),
        )

    def _inspect_container(self, container_name: str) -> dict:
        result = subprocess.run(
            ["docker", "inspect", "--size", container_name],
            text=True,
            capture_output=True,
            check=False,
        )
        if result.returncode != 0 or not result.stdout.strip():
            return {}
        payload = json.loads(result.stdout)
        if not payload:
            return {}
        return payload[0]

    def _poll_container_memory(
        self,
        container_name: str,
        stop_event: threading.Event,
        peak_holder: dict[str, int],
    ) -> None:
        while not stop_event.is_set():
            try:
                result = subprocess.run(
                    ["docker", "stats", "--no-stream", "--format", "{{.MemUsage}}", container_name],
                    text=True,
                    capture_output=True,
                    check=False,
                    timeout=2,
                )
            except subprocess.TimeoutExpired:
                # Keep the monitor non-blocking so benchmark execution can finish
                # even if docker stats occasionally stalls.
                time.sleep(0.2)
                continue
            if result.returncode == 0:
                usage = result.stdout.strip()
                if usage:
                    current_usage = usage.split("/", 1)[0].strip()
                    parsed = self._parse_size_to_bytes(current_usage)
                    if parsed > peak_holder["peak"]:
                        peak_holder["peak"] = parsed
            time.sleep(0.2)

    @staticmethod
    def _dir_size_bytes(path: Path) -> int:
        total = 0
        if not path.exists():
            return total
        for subpath in path.rglob("*"):
            if subpath.is_file():
                total += subpath.stat().st_size
        return total

    @staticmethod
    def _parse_size_to_bytes(value: str) -> int:
        text = value.strip()
        if not text or text.lower() == "0b":
            return 0
        units = {
            "kib": 1024,
            "kb": 1000,
            "mib": 1024 ** 2,
            "mb": 1000 ** 2,
            "gib": 1024 ** 3,
            "gb": 1000 ** 3,
            "b": 1,
        }
        lower = text.lower()
        for unit, multiplier in sorted(units.items(), key=lambda item: len(item[0]), reverse=True):
            if lower.endswith(unit):
                number = lower[: -len(unit)].strip()
                return int(float(number) * multiplier)
        return int(float(text))

    @staticmethod
    def _parse_gnu_time_peak_bytes(path: Path) -> int:
        if not path.exists():
            return 0
        for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
            if "Maximum resident set size" not in line:
                continue
            _, raw_value = line.split(":", 1)
            kib = int(raw_value.strip())
            return kib * 1024
        return 0

    @staticmethod
    def _format_bytes(value: int | None) -> str | None:
        if value is None:
            return None
        units = ["B", "KiB", "MiB", "GiB", "TiB"]
        size = float(value)
        for unit in units:
            if size < 1024 or unit == units[-1]:
                if unit == "B":
                    return f"{int(size)} {unit}"
                return f"{size:.2f} {unit}"
            size /= 1024

    @staticmethod
    def _load_meta(path: Path) -> dict:
        if not path.exists():
            return {}
        return json.loads(path.read_text(encoding="utf-8"))

    @staticmethod
    def _read_text(path: Path) -> str:
        if not path.exists():
            return ""
        return path.read_text(encoding="utf-8", errors="replace")

    @staticmethod
    def _build_trigger_event_bundle(injections: list[dict[str, str]]) -> dict[str, list]:
        from app.runner.models import DataFlowEvent, FileEvent, NetworkEvent, ToolCallEvent

        files: list[FileEvent] = []
        networks: list[NetworkEvent] = []
        tools: list[ToolCallEvent] = []
        flows: list[DataFlowEvent] = []
        now = time.time()

        for idx, item in enumerate(injections, start=1):
            ts = datetime_from_epoch(now + idx * 0.001)
            trigger_id = str(item.get("trigger_id", f"trigger_event_{idx}"))
            family = str(item.get("family", "event"))
            endpoint = str(item.get("endpoint", "")).strip()
            artifact_path = str(item.get("artifact_path", "")).strip()

            tools.append(
                ToolCallEvent(
                    timestamp=ts,
                    tool_id=f"trigger_{trigger_id}",
                    tool_name=f"Trigger Event {family}",
                    tool_type="trigger_event",
                    event="finish",
                    status="ok",
                    source="trigger",
                    metadata={"trigger_id": trigger_id, "family": family, "synthetic": True, "payload": item},
                )
            )
            if endpoint:
                networks.append(
                    NetworkEvent(
                        timestamp=ts,
                        address=endpoint,
                        action="connect",
                        raw=f"trigger:{family}",
                        source="trigger",
                        sink_resolution_status="resolved",
                        sink_url=endpoint,
                        sink_type="url",
                        network_evidence_sources=["trigger_plan"],
                        selected_sink_reason=f"trigger_event:{family}",
                    )
                )
            if artifact_path:
                files.append(
                    FileEvent(
                        timestamp=ts,
                        path=artifact_path,
                        action="read",
                        raw=f"trigger:{family}",
                        source="trigger",
                    )
                )
            if endpoint and artifact_path:
                flows.append(
                    DataFlowEvent(
                        timestamp=ts,
                        source="trigger_artifact",
                        source_detail=artifact_path,
                        sink="trigger_endpoint",
                        sink_detail=endpoint,
                        note=f"Synthetic trigger flow for {family}",
                    )
                )
        return {
            "file_events": files,
            "network_events": networks,
            "tool_calls": tools,
            "data_flows": flows,
        }


def datetime_from_epoch(value: float) -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime(value)) + f".{int((value % 1) * 1000):03d}Z"
