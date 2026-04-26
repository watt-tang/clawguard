from __future__ import annotations

import json
import urllib.error
import urllib.request
from dataclasses import dataclass
from typing import Any


@dataclass
class LLMResponse:
    content: str
    raw: dict[str, Any]


class OpenAICompatibleClient:
    def __init__(
        self,
        base_url: str,
        api_key: str,
        model: str,
        temperature: float = 0.0,
        provider: str = "openai-compatible",
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.model = model
        self.temperature = temperature
        self.provider = provider

    def chat(self, messages: list[dict[str, str]]) -> LLMResponse:
        payload = {
            "model": self.model,
            "temperature": self.temperature,
            "messages": messages,
        }
        request = urllib.request.Request(
            f"{self.base_url}/chat/completions",
            method="POST",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}",
            },
            data=json.dumps(payload).encode("utf-8"),
        )
        try:
            with urllib.request.urlopen(request, timeout=120) as response:
                raw_body = response.read().decode("utf-8")
        except urllib.error.HTTPError as exc:
            raise RuntimeError(self._format_http_error(exc)) from exc
        except urllib.error.URLError as exc:
            reason = getattr(exc, "reason", exc)
            raise RuntimeError(
                f"LLM request failed for provider={self.provider} model={self.model} "
                f"base_url={self.base_url}: {reason}"
            ) from exc

        try:
            data = json.loads(raw_body)
        except json.JSONDecodeError as exc:
            preview = raw_body[:400].replace("\n", " ")
            raise RuntimeError(
                f"LLM returned non-JSON response for provider={self.provider} model={self.model} "
                f"base_url={self.base_url}: {preview}"
            ) from exc

        try:
            content = data["choices"][0]["message"]["content"]
        except (KeyError, IndexError, TypeError) as exc:
            preview = json.dumps(data, ensure_ascii=False)[:400]
            raise RuntimeError(
                f"LLM response format was unexpected for provider={self.provider} "
                f"model={self.model}: {preview}"
            ) from exc
        return LLMResponse(content=content, raw=data)

    def _format_http_error(self, error: urllib.error.HTTPError) -> str:
        body = ""
        if error.fp is not None:
            body = error.read().decode("utf-8", errors="replace")
        detail = body.strip()
        if detail:
            try:
                parsed = json.loads(detail)
                detail = json.dumps(parsed, ensure_ascii=False)
            except json.JSONDecodeError:
                detail = detail.replace("\n", " ")
            detail = detail[:400]
        else:
            detail = error.reason if getattr(error, "reason", None) else "empty response body"
        return (
            f"LLM request returned HTTP {error.code} for provider={self.provider} "
            f"model={self.model} base_url={self.base_url}: {detail}"
        )
