
# Claw Security Dashboard Dataset

## Overview

This dataset describes the attack surface, exposed interfaces, and official sources of Claw ecosystem products.

---

## Summary Metrics (for dashboard)

- Total Products: 17
- Publicly Accessible Products: 10
- High-Risk Candidates (estimated): 6
- Products with Webhook Exposure: 3+
- Products with WS/SSE: 5+

---

## Product Table

| Product    | Official Website                     | GitHub                                     | star  | Fingerprint / Exposure                                | Exposed Interfaces                                                                                                                                                       |
| ---------- | ------------------------------------ | ------------------------------------------ | ----- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| NanoClaw   | N/A                                  | https://github.com/qwibitai/nanoclaw       | 26.6k | None                                                  | None                                                                                                                                                                     |
| Nanobot    | N/A                                  | https://github.com/HKUDS/nanobot           | 38.1k | None                                                  | None                                                                                                                                                                     |
| EasyClaw   | N/A                                  | N/A                                        |       | Not open source                                       | Unknown                                                                                                                                                                  |
| ZeroClaw   | https://zeroclaw.org/zh              | https://github.com/zeroclaw-labs/zeroclaw  | 29.5k | Port 42617 `<title>ZeroClaw</title>`                | GET `/health` `/metrics` `/_app/*<br>`POST `/linq` `/pair` `/webhook<br>`API `/api/*` `/admin/*<br>`SSE `/api/events<br>`WS `/ws/chat` `/ws/nodes` |
| PicoClaw   | https://picoclaw.net/zh/             | https://github.com/sipeed/picoclaw         | 27.6k | Port 18800 `<title>PicoClaw</title>`                | `/api/config` `/api/system/*<br>``/api/oauth/*<br>``/api/skills*` CRUD `<br>/api/sessions*``<br>/api/gateway/*``<br>/pico/ws`                                      |
| IronClaw   | N/A                                  | https://github.com/nearai/ironclaw         | 11.5k | Port 3000 `<title>IronClaw</title>`                 | `/api/*` (Bearer Auth)`<br>/api/health``<br>`WS/SSE supports token                                                                                                   |
| TinyClaw   | https://tinyclaw.dev/zh              | N/A                                        |       | Port 3000 `<title>TinyClaw Mission Control</title>` | `/api/message<br>``/api/agents` `/api/tasks<br>``/api/projects<br>``/api/queue/*<br>``/api/events/stream`                                                            |
| NullClaw   | https://nullclaw.io                  | https://github.com/nullclaw/nullclaw       |       | None                                                  | None                                                                                                                                                                     |
| MimiClaw   | N/A                                  | N/A                                        |       | None                                                  | None                                                                                                                                                                     |
| SeaClaw    | https://seaclawagent.com/            | N/A                                        |       | Port 3000 `<title>Human Control</title>`            | `/health` `/ready<br>``/webhook` `/pair` `/a2a<br>``/telegram` `/slack/events` `/line<br>``/api/messages`                                                    |
| FemtoClaw  | N/A                                  | N/A                                        |       | None                                                  | None                                                                                                                                                                     |
| GoClaw     | N/A                                  | https://github.com/nextlevelbuilder/goclaw | 1.6k  | Port 3000 `<title>GoClaw Dashboard</title>`         | `/` `/login` SPA `<br>/@vite/client``<br>/v1/openapi.json``<br>/health`                                                                                            |
| LispClaw   | N/A                                  | N/A                                        |       | Unknown                                               | Unknown                                                                                                                                                                  |
| LobsterAI  | https://lobsterai.youdao.com/#/index | N/A                                        |       | Port 5175 `<title>LobsterAI</title>`                | `/healthz` `/api/health<br>``/v1/messages<br>``/api/search<br>``/mcp/execute`                                                                                        |
| MoltWorker | N/A                                  | https://github.com/cloudflare/moltworker   | 9.8k  | Port 4173 `<title>Moltbot Admin</title>`            | `/_admin/` `/api/status<br>``/api/admin/*<br>``/debug/*<br>``/cdp?secret=`                                                                                           |
| RivonClaw  | N/A                                  | https://github.com/gaoyangz77/rivonclaw    | 252   | Port 3210 `<title>RivonClaw</title>`                | `/api/status` `/api/tools/*<br>``/api/provider-keys<br>``/api/chat-sessions<br>``/api/auth/*` `/api/oauth/*`                                                       |

---

## Attack Surface Classification

### High Risk Interfaces

- `/webhook`
- `/api/admin/*`
- `/debug/*`
- `/cdp?secret=`
- `/api/skills`
- `/api/tasks`

### Medium Risk Interfaces

- `/ws/*`
- `/api/events`
- `/api/oauth/*`
- `/api/sessions`

### Low Risk Interfaces

- `/health`
- `/metrics`
- `/status`

---

## Authentication Patterns

| Pattern      | Example              |
| ------------ | -------------------- |
| Bearer Token | IronClaw `/api/*`  |
| Query Token  | WS/SSE `?token=`   |
| No Auth      | Webhook endpoints    |
| Mixed        | PicoClaw / RivonClaw |

---

## Attack Surface Matrix (Simplified)

| Product    | API | WS | Webhook | Admin | Auth    |
| ---------- | --- | -- | ------- | ----- | ------- |
| PicoClaw   | ✅  | ✅ | ❌      | ❌    | Partial |
| ZeroClaw   | ✅  | ✅ | ✅      | ✅    | Weak    |
| IronClaw   | ✅  | ✅ | ❌      | ❌    | Strong  |
| TinyClaw   | ✅  | ❌ | ❌      | ❌    | Unknown |
| SeaClaw    | ✅  | ❌ | ✅      | ❌    | Weak    |
| MoltWorker | ✅  | ✅ | ❌      | ✅    | Weak    |
| RivonClaw  | ✅  | ❌ | ❌      | ❌    | Mixed   |

---

## Attack Chain Example

Webhook → Agent → Skill Execution → Gateway → Model → External API

Potential Risks:

- Remote Execution
- Data Exfiltration
- Agent Hijacking

---

## Notes

- The Claw ecosystem originates from OpenClaw and has many derived implementations :contentReference[oaicite:0]{index=0}
- Most systems follow a "Gateway + Agent + Tool/Skill" architecture :contentReference[oaicite:1]{index=1}
- Security differences mainly lie in:
  - Authentication enforcement
  - Sandbox isolation
  - External integration exposure

---

## Suggested Data Structure (for Codex)

```json
{
  "product": "PicoClaw",
  "port": 18800,
  "fingerprint": "title:PicoClaw",
  "interfaces": [
    {"path": "/api/config", "method": "GET"},
    {"path": "/api/skills", "method": "CRUD"}
  ],
  "risk": "MEDIUM"
}
```
