from __future__ import annotations

import argparse
import json
import subprocess
import sys
import urllib.request
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from app.runtime.llm_client import OpenAICompatibleClient
from app.runtime.skill_parser import SkillAction, SkillDefinition, load_skill_definition


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


class SkillToolExecutor:
    def __init__(self, skill_root: Path, context: dict[str, Any], emit_func) -> None:
        self.skill_root = skill_root
        self.context = context
        self._emit = emit_func

    def execute_action(
        self,
        action: SkillAction,
        overrides: dict[str, Any] | None = None,
        step_id: str | None = None,
        parent_event_id: str | None = None,
    ) -> dict[str, Any]:
        base_config = dict(action.config)
        if overrides:
            base_config.update(overrides)
        resolved = _resolve_templates(base_config, self.context)
        start_event_id = self._emit("tool_call", "start", {
            "tool_id": action.id,
            "tool_name": action.name,
            "tool_type": action.type,
            "config": resolved,
        }, step_id=step_id, parent_event_id=parent_event_id)

        try:
            if action.type == "read_file":
                result = self._read_file(resolved)
            elif action.type == "write_file":
                result = self._write_file(resolved)
            elif action.type == "run_command":
                result = self._run_command(resolved)
            elif action.type == "http_request":
                result = self._http_request(resolved)
            else:
                raise RuntimeError(f"Unsupported action type: {action.type}")
        except Exception as exc:  # pragma: no cover
            result = {
                "status": "failed",
                "exit_code": 1,
                "stdout": "",
                "stderr": str(exc),
            }

        self._emit("tool_call", "finish", {
            "tool_id": action.id,
            "tool_name": action.name,
            "tool_type": action.type,
            "status": result["status"],
            "exit_code": result["exit_code"],
            "stdout_preview": result["stdout"][:200],
            "stderr_preview": result["stderr"][:200],
        }, step_id=step_id, parent_event_id=start_event_id)
        return result

    def execute_virtual_tool(
        self,
        tool_id: str,
        arguments: dict[str, Any] | None = None,
        step_id: str | None = None,
        parent_event_id: str | None = None,
    ) -> dict[str, Any]:
        tool_spec = self._virtual_tool_specs().get(tool_id)
        if tool_spec is None:
            raise RuntimeError(f"Unsupported virtual tool: {tool_id}")

        action = SkillAction(
            id=tool_id,
            type=tool_spec["type"],
            name=tool_spec["name"],
            description=tool_spec["description"],
            arguments_schema=tool_spec.get("arguments_schema", {}),
        )
        return self.execute_action(
            action,
            overrides=arguments or {},
            step_id=step_id,
            parent_event_id=parent_event_id,
        )

    def get_tool_catalog(self, actions: list[SkillAction]) -> list[dict[str, Any]]:
        if actions:
            return [
                {
                    "id": action.id,
                    "name": action.name,
                    "type": action.type,
                    "description": action.description,
                    "default_config": action.config,
                    "arguments_schema": action.arguments_schema,
                }
                for action in actions
            ]

        return list(self._virtual_tool_specs().values())

    @staticmethod
    def _virtual_tool_specs() -> dict[str, dict[str, Any]]:
        return {
            "read_file": {
                "id": "read_file",
                "name": "Read File",
                "type": "read_file",
                "description": "Read a UTF-8 text file from the sandbox filesystem.",
                "default_config": {},
                "arguments_schema": {
                    "type": "object",
                    "properties": {
                        "path": {"type": "string", "description": "Absolute or relative file path to read."},
                    },
                    "required": ["path"],
                },
            },
            "write_file": {
                "id": "write_file",
                "name": "Write File",
                "type": "write_file",
                "description": "Write or append UTF-8 text into a file inside the sandbox filesystem.",
                "default_config": {},
                "arguments_schema": {
                    "type": "object",
                    "properties": {
                        "path": {"type": "string"},
                        "content": {"type": "string"},
                        "append": {"type": "boolean"},
                    },
                    "required": ["path", "content"],
                },
            },
            "run_command": {
                "id": "run_command",
                "name": "Run Command",
                "type": "run_command",
                "description": "Execute a command or shell snippet in the skill workspace.",
                "default_config": {"shell": False},
                "arguments_schema": {
                    "type": "object",
                    "properties": {
                        "command": {
                            "description": "Shell string or argv array for the command to run.",
                            "oneOf": [{"type": "string"}, {"type": "array", "items": {"type": "string"}}],
                        },
                        "shell": {"type": "boolean"},
                    },
                    "required": ["command"],
                },
            },
            "http_request": {
                "id": "http_request",
                "name": "HTTP Request",
                "type": "http_request",
                "description": "Send an outbound HTTP request from inside the sandbox.",
                "default_config": {"method": "GET", "headers": {}, "timeout_seconds": 10},
                "arguments_schema": {
                    "type": "object",
                    "properties": {
                        "url": {"type": "string"},
                        "method": {"type": "string"},
                        "headers": {"type": "object"},
                        "body": {"type": "string"},
                        "timeout_seconds": {"type": "integer"},
                    },
                    "required": ["url"],
                },
            },
        }

    def _read_file(self, config: dict[str, Any]) -> dict[str, Any]:
        path = Path(config["path"])
        content = path.read_text(encoding="utf-8")
        sys.stdout.write(content)
        sys.stdout.flush()
        return {
            "status": "success",
            "exit_code": 0,
            "stdout": content,
            "stderr": "",
            "path": str(path),
        }

    def _write_file(self, config: dict[str, Any]) -> dict[str, Any]:
        path = Path(config["path"])
        path.parent.mkdir(parents=True, exist_ok=True)
        mode = "a" if config.get("append") else "w"
        content = config.get("content", "")
        with path.open(mode, encoding="utf-8") as handle:
            handle.write(content)
        return {
            "status": "success",
            "exit_code": 0,
            "stdout": content,
            "stderr": "",
            "path": str(path),
        }

    def _run_command(self, config: dict[str, Any]) -> dict[str, Any]:
        shell = bool(config.get("shell", False))
        command = config["command"]
        if shell:
            popen_args = {"args": command, "shell": True}
        else:
            popen_args = {"args": command if isinstance(command, list) else command.split(), "shell": False}
        completed = subprocess.run(
            cwd=self.skill_root,
            capture_output=True,
            text=True,
            check=False,
            **popen_args,
        )
        if completed.stdout:
            sys.stdout.write(completed.stdout)
            sys.stdout.flush()
        if completed.stderr:
            sys.stderr.write(completed.stderr)
            sys.stderr.flush()
        return {
            "status": "success" if completed.returncode == 0 else "failed",
            "exit_code": completed.returncode,
            "stdout": completed.stdout,
            "stderr": completed.stderr,
            "command": command,
        }

    def _http_request(self, config: dict[str, Any]) -> dict[str, Any]:
        method = config.get("method", "GET").upper()
        body = config.get("body")
        headers = config.get("headers", {})
        data = body.encode("utf-8") if isinstance(body, str) else None
        request = urllib.request.Request(config["url"], method=method, data=data, headers=headers)
        with urllib.request.urlopen(request, timeout=int(config.get("timeout_seconds", 10))) as response:
            payload = response.read().decode("utf-8", errors="replace")
        if payload:
            sys.stdout.write(payload)
            sys.stdout.flush()
        return {
            "status": "success",
            "exit_code": 0,
            "stdout": payload,
            "stderr": "",
            "url": config["url"],
            "method": method,
        }


class ProvLoomSkillRuntime:
    def __init__(
        self,
        skill_root: Path,
        skill_file: str,
        input_payload: dict[str, Any],
        events_path: Path,
        llm_config: dict[str, Any] | None = None,
    ) -> None:
        self.skill_root = skill_root
        self.skill_file = skill_file
        self.input_payload = input_payload
        self.events_path = events_path
        self.llm_config = llm_config or {}
        self.definition = load_skill_definition(
            skill_root,
            skill_file,
            allow_empty_actions=bool(self.llm_config.get("enabled")),
        )
        self.context: dict[str, Any] = {
            "input_payload": input_payload,
            "actions": {},
            "skill": {
                "name": self.definition.name,
                "description": self.definition.description,
                "file": self.definition.skill_file,
            },
        }
        self.executor = SkillToolExecutor(self.skill_root, self.context, self._emit)

    def execute(self) -> int:
        self._emit("runtime", "start", {
            "skill_name": self.definition.name,
            "skill_file": self.definition.skill_file,
            "action_count": len(self.definition.actions),
            "runtime": self.definition.runtime,
            "llm_enabled": bool(self.llm_config.get("enabled")),
        })

        if self.llm_config.get("enabled") or self.definition.runtime in {"deepseek-agent", "llm-agent", "llm-native"}:
            exit_code = LLMAgentSkillRuntime(
                definition=self.definition,
                input_payload=self.input_payload,
                context=self.context,
                executor=self.executor,
                emit_func=self._emit,
                llm_config=self.llm_config,
            ).execute()
        else:
            exit_code = 0
            for action in self.definition.actions:
                result = self.executor.execute_action(action)
                self.context["actions"][action.id] = result
                if result["exit_code"] != 0:
                    exit_code = result["exit_code"]
                    if not action.continue_on_error:
                        break

        self._emit("runtime", "finish", {
            "skill_name": self.definition.name,
            "exit_code": exit_code,
        })
        return exit_code

    def _emit(
        self,
        category: str,
        event: str,
        payload: dict[str, Any],
        step_id: str | None = None,
        parent_event_id: str | None = None,
    ) -> str:
        event_id = f"{category}-{uuid.uuid4().hex}"
        record = {
            "event_id": event_id,
            "timestamp": utc_now(),
            "source": "runtime",
            "step_id": step_id,
            "category": category,
            "event": event,
            "parent_event_id": parent_event_id,
            "payload": payload,
        }
        with self.events_path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(record, ensure_ascii=False) + "\n")
        return event_id


class LLMAgentSkillRuntime:
    def __init__(
        self,
        definition: SkillDefinition,
        input_payload: dict[str, Any],
        context: dict[str, Any],
        executor: SkillToolExecutor,
        emit_func,
        llm_config: dict[str, Any],
    ) -> None:
        self.definition = definition
        self.input_payload = input_payload
        self.context = context
        self.executor = executor
        self._emit = emit_func
        self.llm_config = llm_config
        self.tool_catalog = executor.get_tool_catalog(definition.actions)
        self.client = OpenAICompatibleClient(
            base_url=llm_config["base_url"],
            api_key=llm_config["api_key"],
            model=llm_config["model"],
            temperature=float(llm_config.get("temperature", 0.0)),
            provider=str(llm_config.get("provider", "openai-compatible")),
        )

    def execute(self) -> int:
        max_steps = int(self.llm_config.get("max_steps", 8))
        messages = [
            {"role": "system", "content": self._system_prompt()},
            {"role": "user", "content": self._user_prompt()},
        ]
        last_exit_code = 0

        for step in range(1, max_steps + 1):
            step_id = f"step-{step}"
            request_event_id = self._emit("llm", "request", {
                "step": step,
                "provider": self.llm_config.get("provider", "openai-compatible"),
                "model": self.llm_config["model"],
                "base_url": self.client.base_url,
                "endpoint_host": urlparse(self.client.base_url).hostname,
                "message_count": len(messages),
            }, step_id=step_id)
            response = self.client.chat(messages)
            self._emit("llm", "response", {
                "step": step,
                "content_preview": response.content[:400],
            }, step_id=step_id, parent_event_id=request_event_id)

            parsed = _extract_json_object(response.content)
            action = parsed.get("action", {})
            action_name = action.get("tool", "finish")
            arguments = action.get("arguments", {}) or {}
            messages.append({"role": "assistant", "content": response.content})

            if action_name == "finish":
                final_message = parsed.get("message", "")
                if final_message:
                    sys.stdout.write(final_message + "\n")
                    sys.stdout.flush()
                if not self.definition.actions:
                    return 0
                return last_exit_code

            result, tool_key, skill_action = self._execute_tool(
                action_name,
                arguments,
                step_id=step_id,
                parent_event_id=request_event_id,
            )
            self.context["actions"][tool_key] = result
            last_exit_code = result["exit_code"]
            observation = json.dumps(
                {
                    "tool": tool_key,
                    "status": result["status"],
                    "exit_code": result["exit_code"],
                    "stdout": result["stdout"][:2000],
                    "stderr": result["stderr"][:2000],
                },
                ensure_ascii=False,
            )
            messages.append({"role": "user", "content": f"Tool result:\n{observation}"})

            if result["exit_code"] != 0 and not skill_action.continue_on_error:
                return result["exit_code"]

        return last_exit_code or 1

    def _find_action(self, tool_id: str) -> SkillAction | None:
        for action in self.definition.actions:
            if action.id == tool_id:
                return action
        return None

    def _execute_tool(
        self,
        tool_id: str,
        arguments: dict[str, Any],
        step_id: str | None = None,
        parent_event_id: str | None = None,
    ) -> tuple[dict[str, Any], str, SkillAction]:
        action = self._find_action(tool_id)
        if action is not None:
            return (
                self.executor.execute_action(
                    action,
                    overrides=arguments,
                    step_id=step_id,
                    parent_event_id=parent_event_id,
                ),
                action.id,
                action,
            )
        if not self.definition.actions:
            virtual_action = SkillAction(
                id=tool_id,
                type=tool_id,
                name=tool_id,
                continue_on_error=True,
            )
            return (
                self.executor.execute_virtual_tool(
                    tool_id,
                    arguments,
                    step_id=step_id,
                    parent_event_id=parent_event_id,
                ),
                tool_id,
                virtual_action,
            )
        raise RuntimeError(f"Unknown tool requested by model: {tool_id}")

    def _system_prompt(self) -> str:
        return (
            "You are the runtime brain for the ProvLoom skill sandbox.\n"
            "You must decide which tool to call next based on the skill and user input.\n"
            "If the SKILL.md is instruction-heavy and does not declare explicit actions, interpret it as a real skill and use the built-in tools to carry out the workflow.\n"
            "Missing optional files or failed probes are observations, not final failure; use the error to choose the next useful step.\n"
            "Prefer staying inside the skill workspace unless the skill explicitly requires another path.\n"
            "Return ONLY valid JSON.\n"
            "Response schema:\n"
            "{\n"
            '  "message": "short reason or final summary",\n'
            '  "action": {\n'
            '    "tool": "<tool_id or finish>",\n'
            '    "arguments": { ... optional overrides ... }\n'
            "  }\n"
            "}\n"
            f"Available tools:\n{json.dumps(self.tool_catalog, ensure_ascii=False, indent=2)}"
        )

    def _user_prompt(self) -> str:
        return (
            f"Skill name: {self.definition.name}\n"
            f"Skill description: {self.definition.description}\n"
            f"Skill runtime: {self.definition.runtime}\n"
            f"Skill root directory: {self.definition.skill_root}\n"
            f"Skill markdown:\n{self.definition.raw_markdown}\n\n"
            f"Input payload:\n{json.dumps(self.input_payload, ensure_ascii=False, indent=2)}\n"
            "Start executing the skill. Choose one tool at a time and finish when done.\n"
            "If the skill requires artifacts, write them into the workspace so the sandbox can observe them."
        )


def _resolve_templates(value: Any, context: dict[str, Any]) -> Any:
    if isinstance(value, dict):
        return {key: _resolve_templates(sub_value, context) for key, sub_value in value.items()}
    if isinstance(value, list):
        return [_resolve_templates(item, context) for item in value]
    if not isinstance(value, str):
        return value

    result = value
    while "{{" in result and "}}" in result:
        start = result.index("{{")
        end = result.index("}}", start)
        expr = result[start + 2:end].strip()
        resolved = _lookup(expr, context)
        result = result[:start] + str(resolved) + result[end + 2:]
    return result


def _lookup(expression: str, context: dict[str, Any]) -> Any:
    current: Any = context
    for part in expression.split("."):
        if isinstance(current, dict):
            current = current.get(part, "")
        else:
            current = getattr(current, part, "")
    return current


def _extract_json_object(text: str) -> dict[str, Any]:
    candidate = text.strip()
    if candidate.startswith("```"):
        lines = candidate.splitlines()
        if len(lines) >= 3:
            candidate = "\n".join(lines[1:-1]).strip()
    start = candidate.find("{")
    end = candidate.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise RuntimeError(f"LLM response is not valid JSON: {text}")
    return json.loads(candidate[start:end + 1])


def main() -> int:
    parser = argparse.ArgumentParser(description="ProvLoom skill runtime")
    parser.add_argument("--skill-root", required=True)
    parser.add_argument("--skill-file", default="SKILL.md")
    parser.add_argument("--input-payload", required=True)
    parser.add_argument("--runtime-events", required=True)
    parser.add_argument("--llm-config")
    args = parser.parse_args()

    input_payload = json.loads(Path(args.input_payload).read_text(encoding="utf-8"))
    llm_config = {}
    if args.llm_config:
        llm_config = json.loads(Path(args.llm_config).read_text(encoding="utf-8"))
    runtime = ProvLoomSkillRuntime(
        skill_root=Path(args.skill_root),
        skill_file=args.skill_file,
        input_payload=input_payload,
        events_path=Path(args.runtime_events),
        llm_config=llm_config,
    )
    return runtime.execute()


if __name__ == "__main__":
    raise SystemExit(main())
