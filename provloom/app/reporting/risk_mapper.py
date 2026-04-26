from __future__ import annotations

from typing import Any


BEHAVIOR_LABELS = {
    "file_write": {
        "name": "本地文件写入",
        "description": "Skill 在沙箱中创建、修改或覆盖了文件。",
        "severity": "medium",
    },
    "network_access": {
        "name": "外部网络访问",
        "description": "Skill 发起了对外网络连接或 HTTP 请求。",
        "severity": "high",
    },
    "process_spawn": {
        "name": "子进程执行",
        "description": "Skill 启动了额外进程，说明其执行路径超出纯文本推理。",
        "severity": "high",
    },
    "shell_execution": {
        "name": "Shell 执行",
        "description": "Skill 通过 shell 执行命令，具备更强的系统操作能力。",
        "severity": "critical",
    },
    "sensitive_file_read": {
        "name": "敏感文件读取",
        "description": "Skill 读取了系统或用户侧敏感路径中的文件。",
        "severity": "critical",
    },
    "read_then_exfiltration": {
        "name": "疑似读取后外传",
        "description": "先读取敏感内容，再发生网络外联，存在数据外传嫌疑。",
        "severity": "critical",
    },
    "execution_timeout": {
        "name": "执行超时",
        "description": "Skill 在规定时间内未完成，可能存在卡死、阻塞或滥用资源风险。",
        "severity": "medium",
    },
}

SEVERITY_WEIGHT = {
    "low": 1,
    "medium": 2,
    "high": 3,
    "critical": 4,
}

RISK_LEVELS = [
    {"min": 0, "max": 19, "level": "low", "name": "低风险"},
    {"min": 20, "max": 49, "level": "medium", "name": "中风险"},
    {"min": 50, "max": 79, "level": "high", "name": "高风险"},
    {"min": 80, "max": 100, "level": "critical", "name": "严重风险"},
]


def map_risk_profile(risk_score: int, detected_behaviors: list[str]) -> dict[str, Any]:
    labels = [_map_behavior(code) for code in detected_behaviors]
    primary = _pick_primary(labels)
    level = _risk_level(risk_score)
    summary = _build_summary(level["name"], primary, labels)
    return {
        "risk_level": level["level"],
        "risk_level_name": level["name"],
        "primary_risk": primary,
        "risk_labels": labels,
        "risk_summary": summary,
    }


def enrich_log_payload(payload: dict[str, Any]) -> dict[str, Any]:
    result = payload.get("result")
    if not isinstance(result, dict):
        return payload

    enriched = map_risk_profile(
        risk_score=int(result.get("risk_score", 0)),
        detected_behaviors=list(result.get("detected_behaviors", [])),
    )
    result.update(enriched)
    return payload


def _map_behavior(code: str) -> dict[str, str]:
    item = BEHAVIOR_LABELS.get(code)
    if item is None:
        return {
            "code": code,
            "name": code,
            "description": "未登记的风险行为，请结合原始时间线人工判断。",
            "severity": "unknown",
        }
    return {
        "code": code,
        "name": item["name"],
        "description": item["description"],
        "severity": item["severity"],
    }


def _pick_primary(labels: list[dict[str, str]]) -> dict[str, str]:
    if not labels:
        return {
            "code": "none",
            "name": "未发现显著风险行为",
            "description": "本次执行未命中已配置的高优先级风险规则。",
            "severity": "low",
        }
    return max(labels, key=lambda item: SEVERITY_WEIGHT.get(item["severity"], 0))


def _risk_level(score: int) -> dict[str, str]:
    for item in RISK_LEVELS:
        if item["min"] <= score <= item["max"]:
            return {"level": item["level"], "name": item["name"]}
    return {"level": "unknown", "name": "未知风险"}


def _build_summary(level_name: str, primary: dict[str, str], labels: list[dict[str, str]]) -> str:
    if not labels:
        return f"{level_name}，未检测到命中的高风险行为。"
    risk_names = "、".join(item["name"] for item in labels[:4])
    if len(labels) > 4:
        risk_names += " 等"
    return f"{level_name}，主要风险是“{primary['name']}”，本次执行还命中了 {risk_names}。"
