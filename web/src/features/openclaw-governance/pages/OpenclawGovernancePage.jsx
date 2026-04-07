import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Clock3,
  LogIn,
  LogOut,
  Network,
  Radar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEChart } from "../../../hooks/useEChart.js";
import { fetchGovernanceOverview } from "../services/dataService.js";
import { maskField } from "../../openclaw-exposure/utils/ipMask.js";

const CLAW_SUMMARY = {
  totalProducts: 17,
  publicProducts: 10,
  highRiskCandidates: 6,
  webhookExposure: "3+",
  wsOrSse: "5+",
};

export const CLAW_PRODUCTS = [
  {
    name: "NanoClaw",
    official: "",
    github: "https://github.com/qwibitai/nanoclaw",
    port: "-",
    fingerprint: "None",
    auth: "-",
    authTone: "neutral",
    risk: "低风险",
    riskTone: "low",
    interfaceSummary: "无已知暴露接口",
    interfaces: [],
    highlights: "未观察到明确公网暴露面。",
  },
  {
    name: "Nanobot",
    official: "",
    github: "https://github.com/HKUDS/nanobot",
    port: "-",
    fingerprint: "None",
    auth: "-",
    authTone: "neutral",
    risk: "低风险",
    riskTone: "low",
    interfaceSummary: "无已知暴露接口",
    interfaces: [],
    highlights: "暂无公开暴露面记录。",
  },
  {
    name: "EasyClaw",
    official: "",
    github: "",
    port: "-",
    fingerprint: "Not open source",
    auth: "未知",
    authTone: "review",
    risk: "未知",
    riskTone: "neutral",
    interfaceSummary: "未知",
    interfaces: [],
    highlights: "未开源，接口面未知。",
  },
  {
    name: "ZeroClaw",
    official: "https://zeroclaw.org/zh",
    github: "https://github.com/zeroclaw-labs/zeroclaw",
    port: "42617",
    fingerprint: "<title>ZeroClaw</title>",
    auth: "弱鉴权",
    authTone: "warning",
    risk: "高风险",
    riskTone: "high",
    interfaceSummary: "API / WS / Webhook / Admin",
    interfaces: ["GET /health", "/metrics", "/_app/*", "POST /linq", "/pair", "/webhook", "/api/*", "/admin/*", "SSE /api/events", "WS /ws/chat", "/ws/nodes"],
    highlights: "同时具备 Webhook、Admin、WS/SSE，是攻击面最完整的产品之一。",
    unauthCount: 3,
    matrix: { api: 95, ws: 92, webhook: 90, admin: 94, auth: 28 },
  },
  {
    name: "PicoClaw",
    official: "https://picoclaw.net/zh/",
    github: "https://github.com/sipeed/picoclaw",
    port: "18800",
    fingerprint: "<title>PicoClaw</title>",
    auth: "部分鉴权",
    authTone: "review",
    risk: "中风险",
    riskTone: "medium",
    interfaceSummary: "Config / OAuth / Skills / Sessions / WS",
    interfaces: ["/api/config", "/api/system/*", "/api/oauth/*", "/api/skills*", "/api/sessions*", "/api/gateway/*", "/pico/ws"],
    highlights: "接口面完整，包含 Skills CRUD、Session 与 Gateway 接口。",
    unauthCount: 1,
    matrix: { api: 88, ws: 72, webhook: 0, admin: 10, auth: 54 },
  },
  {
    name: "IronClaw",
    official: "",
    github: "https://github.com/nearai/ironclaw",
    port: "3000",
    fingerprint: "<title>IronClaw</title>",
    auth: "强鉴权",
    authTone: "safe",
    risk: "中风险",
    riskTone: "medium",
    interfaceSummary: "Bearer API / WS / SSE",
    interfaces: ["/api/* (Bearer Auth)", "/api/health", "WS/SSE with token"],
    highlights: "鉴权模式清晰，但仍存在实时通道暴露。",
    unauthCount: 0,
    matrix: { api: 70, ws: 64, webhook: 0, admin: 0, auth: 88 },
  },
  {
    name: "TinyClaw",
    official: "https://tinyclaw.dev/zh",
    github: "",
    port: "3000",
    fingerprint: "<title>TinyClaw Mission Control</title>",
    auth: "未知",
    authTone: "review",
    risk: "中风险",
    riskTone: "medium",
    interfaceSummary: "Message / Tasks / Projects / Stream",
    interfaces: ["/api/message", "/api/agents", "/api/tasks", "/api/projects", "/api/queue/*", "/api/events/stream"],
    highlights: "任务、项目与流式事件并存，适合纳入行为链观察。",
    unauthCount: 1,
    matrix: { api: 80, ws: 18, webhook: 0, admin: 0, auth: 36 },
  },
  {
    name: "NullClaw",
    official: "https://nullclaw.io",
    github: "https://github.com/nullclaw/nullclaw",
    port: "-",
    fingerprint: "None",
    auth: "-",
    authTone: "neutral",
    risk: "低风险",
    riskTone: "low",
    interfaceSummary: "无已知暴露接口",
    interfaces: [],
    highlights: "未观察到明确暴露接口。",
  },
  {
    name: "MimiClaw",
    official: "",
    github: "",
    port: "-",
    fingerprint: "None",
    auth: "-",
    authTone: "neutral",
    risk: "低风险",
    riskTone: "low",
    interfaceSummary: "无已知暴露接口",
    interfaces: [],
    highlights: "暂无公开入口信息。",
  },
  {
    name: "SeaClaw",
    official: "https://seaclawagent.com/",
    github: "",
    port: "3000",
    fingerprint: "<title>Human Control</title>",
    auth: "弱鉴权",
    authTone: "warning",
    risk: "高风险",
    riskTone: "high",
    interfaceSummary: "Webhook / Pair / A2A / Messaging",
    interfaces: ["/health", "/ready", "/webhook", "/pair", "/a2a", "/telegram", "/slack/events", "/line", "/api/messages"],
    highlights: "Webhook 与外部通信入口较多，易形成消息注入和外联扩散。",
    unauthCount: 2,
    matrix: { api: 76, ws: 0, webhook: 92, admin: 8, auth: 30 },
  },
  {
    name: "FemtoClaw",
    official: "",
    github: "",
    port: "-",
    fingerprint: "None",
    auth: "-",
    authTone: "neutral",
    risk: "低风险",
    riskTone: "low",
    interfaceSummary: "无已知暴露接口",
    interfaces: [],
    highlights: "暂无公开入口信息。",
  },
  {
    name: "GoClaw",
    official: "",
    github: "https://github.com/nextlevelbuilder/goclaw",
    port: "3000",
    fingerprint: "<title>GoClaw Dashboard</title>",
    auth: "公开入口",
    authTone: "warning",
    risk: "低风险",
    riskTone: "low",
    interfaceSummary: "SPA / OpenAPI / Health",
    interfaces: ["/", "/login", "/@vite/client", "/v1/openapi.json", "/health"],
    highlights: "开发态与 OpenAPI 暴露使其适合做接口枚举。",
    unauthCount: 1,
    matrix: { api: 62, ws: 0, webhook: 0, admin: 0, auth: 24 },
  },
  {
    name: "LispClaw",
    official: "",
    github: "",
    port: "-",
    fingerprint: "Unknown",
    auth: "未知",
    authTone: "review",
    risk: "未知",
    riskTone: "neutral",
    interfaceSummary: "未知",
    interfaces: [],
    highlights: "接口面未知。",
  },
  {
    name: "LobsterAI",
    official: "https://lobsterai.youdao.com/#/index",
    github: "",
    port: "5175",
    fingerprint: "<title>LobsterAI</title>",
    auth: "混合",
    authTone: "review",
    risk: "中风险",
    riskTone: "medium",
    interfaceSummary: "Health / Search / MCP Execute",
    interfaces: ["/healthz", "/api/health", "/v1/messages", "/api/search", "/mcp/execute"],
    highlights: "MCP 执行接口与消息接口组合，适合关注工具调用风险。",
    unauthCount: 1,
    matrix: { api: 74, ws: 0, webhook: 0, admin: 0, auth: 48 },
  },
  {
    name: "MoltWorker",
    official: "",
    github: "https://github.com/cloudflare/moltworker",
    port: "4173",
    fingerprint: "<title>Moltbot Admin</title>",
    auth: "弱鉴权",
    authTone: "warning",
    risk: "高风险",
    riskTone: "high",
    interfaceSummary: "Admin / Debug / Secret Query",
    interfaces: ["/_admin", "/api/status", "/api/admin/*", "/debug/*", "/cdp?secret="],
    highlights: "存在 Admin、Debug 和 secret query 三类高敏入口。",
    unauthCount: 2,
    matrix: { api: 84, ws: 36, webhook: 0, admin: 98, auth: 22 },
  },
  {
    name: "RivonClaw",
    official: "",
    github: "https://github.com/gaoyangz77/rivonclaw",
    port: "3210",
    fingerprint: "<title>RivonClaw</title>",
    auth: "混合",
    authTone: "review",
    risk: "中风险",
    riskTone: "medium",
    interfaceSummary: "Tools / Provider Keys / OAuth",
    interfaces: ["/api/status", "/api/tools/*", "/api/provider-keys", "/api/chat-sessions", "/api/auth/*", "/api/oauth/*"],
    highlights: "涉及工具调用、密钥管理和 OAuth，是典型聚合入口。",
    unauthCount: 1,
    matrix: { api: 86, ws: 0, webhook: 0, admin: 18, auth: 44 },
  },
];

const HIGH_RISK_INTERFACES = ["/webhook", "/api/admin/*", "/debug/*", "/cdp?secret=", "/api/skills", "/api/tasks"];
const MEDIUM_RISK_INTERFACES = ["/ws/*", "/api/events", "/api/oauth/*", "/api/sessions"];
const LOW_RISK_INTERFACES = ["/health", "/metrics", "/status"];

function formatNumber(value) {
  return Number(value || 0).toLocaleString("zh-CN");
}

function GovernanceSection({ title, subtitle, icon: Icon, children, extra }) {
  return (
    <section className="cg-overview-section">
      <div className="cg-overview-section-head">
        <div className="cg-overview-section-title-wrap">
          <div className="cg-overview-section-icon">
            <Icon size={15} strokeWidth={2} />
          </div>
          <div>
            <div className="cg-overview-section-title">{title}</div>
            <div className="cg-overview-section-subtitle">{subtitle}</div>
          </div>
        </div>
        {extra}
      </div>
      {children}
    </section>
  );
}

function KpiCard({ label, value, tone = "default" }) {
  return (
    <div className={`cg-kpi-card is-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EcosystemRelationChart() {
  const nodes = [
    { id: "gateway", name: "Gateway", x: 22, y: 28, symbolSize: 34, itemStyle: { color: "#7e0c6e" } },
    { id: "agent", name: "Agent", x: 24, y: 64, symbolSize: 30, itemStyle: { color: "#911481" } },
    { id: "skill", name: "Skill", x: 54, y: 24, symbolSize: 28, itemStyle: { color: "#a63a97" } },
    { id: "model", name: "Model", x: 56, y: 62, symbolSize: 28, itemStyle: { color: "#94a3b8" } },
    { id: "external", name: "External", x: 84, y: 43, symbolSize: 30, itemStyle: { color: "#cbd5e1" } },
  ];

  const links = [
    { source: "gateway", target: "skill" },
    { source: "gateway", target: "model" },
    { source: "agent", target: "skill" },
    { source: "agent", target: "model" },
    { source: "skill", target: "external" },
    { source: "model", target: "external" },
  ];

  const { chartRef } = useEChart(
    () => ({
      tooltip: { show: false },
      animationDuration: 420,
      animationDurationUpdate: 320,
      series: [
        {
          type: "graph",
          layout: "none",
          roam: false,
          label: {
            show: true,
            color: "#334155",
            fontSize: 11,
            fontWeight: 600,
          },
          edgeSymbol: ["none", "arrow"],
          edgeSymbolSize: [0, 7],
          lineStyle: {
            width: 1,
            color: "rgba(100,116,139,0.52)",
            curveness: 0.1,
          },
          emphasis: {
            focus: "adjacency",
            scale: 1.08,
            lineStyle: {
              width: 1.6,
              color: "rgba(126,12,110,0.32)",
            },
          },
          data: nodes,
          links,
        },
      ],
    }),
    [],
  );

  return <div ref={chartRef} className="cg-eco-chart" />;
}

function getHeatLevel(value, columnKey) {
  if (columnKey === "auth") {
    if (value >= 75) return "safe";
    if (value >= 45) return "medium";
    return "high";
  }
  if (value >= 80) return "high";
  if (value >= 45) return "medium";
  if (value > 0) return "low";
  return "empty";
}

function AttackSurfaceMatrix({ products }) {
  const columns = [
    { key: "api", label: "API" },
    { key: "ws", label: "WS" },
    { key: "webhook", label: "Webhook" },
    { key: "admin", label: "Admin" },
    { key: "auth", label: "Auth" },
  ];

  return (
    <div className="cg-matrix">
      <div className="cg-matrix-head">
        <span>产品</span>
        {columns.map((column) => (
          <span key={column.key}>{column.label}</span>
        ))}
      </div>

      <div className="cg-matrix-body">
        {products.map((product) => (
          <div key={product.name} className="cg-matrix-row">
            <div className="cg-matrix-product">
              <strong>{product.name}</strong>
              <span>{product.interfaceSummary}</span>
            </div>
            {columns.map((column) => {
              const value = product.matrix[column.key];
              const level = getHeatLevel(value, column.key);
              return (
                <div key={`${product.name}-${column.key}`} className={`cg-matrix-cell is-${level}`}>
                  <div className="cg-matrix-cell-bar">
                    <div className="cg-matrix-cell-bar-fill" style={{ width: `${Math.max(6, value)}%` }} />
                  </div>
                  <span>{value}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function AttackPathPanel() {
  const steps = [
    {
      title: "Webhook 注入",
      desc: "从对外开放入口进入系统执行链路，是最常见的首跳场景。",
      tone: "high",
      tag: "高风险",
    },
    {
      title: "Agent 转发",
      desc: "外部请求被带入任务或消息上下文，开始影响内部处理流程。",
      tone: "medium",
      tag: "重点关注",
    },
    {
      title: "Skill 执行",
      desc: "工具与技能被触发后，系统能力范围明显放大。",
      tone: "medium",
      tag: "可利用",
    },
    {
      title: "Gateway / Model",
      desc: "请求继续流向模型服务或外部接口，带来进一步扩散风险。",
      tone: "low",
      tag: "扩散面",
    },
  ];

  return (
    <div className="cg-timeline">
      {steps.map((step, index) => (
        <div key={step.title} className="cg-timeline-item">
          <div className="cg-timeline-rail">
            <span className={`cg-timeline-dot is-${step.tone}`} />
            {index < steps.length - 1 ? <span className="cg-timeline-line" /> : null}
          </div>
          <div className="cg-timeline-content">
            <div className="cg-timeline-top">
              <strong>{step.title}</strong>
              <span className={`cg-risk-badge is-${step.tone}`}>{step.tag}</span>
            </div>
            <p>{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductLink({ row }) {
  const href = row.official || row.github;
  const label = row.official ? "官网" : row.github ? "GitHub" : "";

  if (!href) {
    return <span className="cg-link-empty" />;
  }

  return (
    <a className="cg-product-link" href={href} target="_blank" rel="noreferrer">
      <span>{label}</span>
      <ArrowUpRight size={13} strokeWidth={2} />
    </a>
  );
}

function maskPort(port) {
  if (!port || port === "-") return port || "-";
  return "****";
}

function maskFingerprint(fingerprint) {
  if (!fingerprint || fingerprint === "None" || fingerprint === "Unknown" || fingerprint === "Not open source") {
    return fingerprint || "-";
  }
  return maskField(fingerprint);
}

function maskInterfaceItems(items) {
  if (!Array.isArray(items) || !items.length) return [];
  return items.map(() => "***");
}

function LoginModal({ onLogin, onRegister, onClose }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (mode === "register" && password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    const result = mode === "login"
      ? onLogin(username, password)
      : onRegister(username, password, phone, inviteCode);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setError("");
  }

  return (
    <div className="oc-modal-overlay" onClick={onClose}>
      <div className="oc-modal" onClick={(event) => event.stopPropagation()}>
        <div className="oc-modal-title">{mode === "login" ? "登录查看完整接口信息" : "注册账号"}</div>
        <p className="oc-modal-desc">
          {mode === "login"
            ? "登录后可解锁真实指纹、端口和接口详情。"
            : "注册后自动登录并解锁完整接口信息。"}
        </p>

        <div className="oc-modal-switch">
          <button
            type="button"
            className={`oc-modal-switch-btn${mode === "login" ? " is-active" : ""}`}
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            登录
          </button>
          <button
            type="button"
            className={`oc-modal-switch-btn${mode === "register" ? " is-active" : ""}`}
            onClick={() => {
              setMode("register");
              setError("");
            }}
          >
            注册
          </button>
        </div>

        <form onSubmit={handleSubmit} className="oc-modal-form">
          <input className="oc-input" placeholder="用户名" value={username} onChange={(event) => setUsername(event.target.value)} autoFocus />
          <input
            type="password"
            className="oc-input"
            placeholder="密码"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {mode === "register" ? (
            <input className="oc-input" placeholder="手机号" value={phone} onChange={(event) => setPhone(event.target.value)} />
          ) : null}
          {mode === "register" ? (
            <input
              className="oc-input"
              placeholder="邀请码"
              value={inviteCode}
              onChange={(event) => setInviteCode(event.target.value)}
            />
          ) : null}
          {mode === "register" ? (
            <input
              type="password"
              className="oc-input"
              placeholder="确认密码"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          ) : null}
          {mode === "register" ? <div className="oc-modal-tip">注册需填写手机号和邀请码；密码至少 6 位。</div> : null}
          {error ? <div className="oc-modal-error">{error}</div> : null}
          <button type="submit" className="oc-primary-btn">
            {mode === "login" ? "登录" : "注册并登录"}
          </button>
        </form>
      </div>
    </div>
  );
}

function InterfaceTable({ rows, auth }) {
  const { isLoggedIn, login, register, logout } = auth;
  const [showLogin, setShowLogin] = useState(false);

  function handleLogin(username, password) {
    const result = login(username, password);
    if (result.ok) setShowLogin(false);
    return result;
  }

  function handleRegister(username, password, phone, inviteCode) {
    const result = register(username, password, phone, inviteCode);
    if (result.ok) setShowLogin(false);
    return result;
  }

  return (
    <div className="cg-api-table-wrap">
      <div className="cg-api-toolbar">
        {isLoggedIn ? (
          <div className="cg-api-auth-box is-unlocked">
            <span>已登录，接口详情、指纹和端口已解锁。</span>
            <button type="button" className="oc-ghost-btn" onClick={logout}>
              <LogOut size={13} />
              退出登录
            </button>
          </div>
        ) : (
          <div className="cg-api-auth-box">
            <span>当前处于脱敏展示模式，指纹 / 端口和接口详情已打码。</span>
            <button type="button" className="oc-link-btn" onClick={() => setShowLogin(true)}>
              <LogIn size={13} />
              登录后解锁
            </button>
          </div>
        )}
      </div>

      <div className="cg-api-table">
        <div className="cg-api-table-head">
          <span>产品</span>
          <span>官网 / 源码</span>
          <span>指纹 / 端口</span>
          <span>鉴权</span>
          <span>风险</span>
          <span>接口详情</span>
        </div>
        <div className="cg-api-table-body">
          {rows.map((row) => (
            <article key={row.name} className="cg-api-row">
              <div className="cg-api-name">
                <strong>{row.name}</strong>
                <span>{row.highlights}</span>
              </div>
              <div>
                <ProductLink row={row} />
              </div>
              <div className="cg-api-signature">
                <span className={!isLoggedIn && row.port && row.port !== "-" ? "cg-is-masked" : ""}>
                  Port {isLoggedIn ? row.port : maskPort(row.port)}
                </span>
                <code className={!isLoggedIn && row.fingerprint && row.fingerprint !== "None" ? "cg-is-masked" : ""}>
                  {isLoggedIn ? row.fingerprint : maskFingerprint(row.fingerprint)}
                </code>
              </div>
              <div>
                <span className={`cg-risk-badge is-${row.authTone}`}>{row.auth}</span>
              </div>
              <div>
                <span className={`cg-risk-badge is-${row.riskTone}`}>{row.risk}</span>
              </div>
              <div className="cg-api-detail">
                <div className={`cg-api-summary${!isLoggedIn ? " cg-is-masked" : ""}`}>
                  {isLoggedIn ? row.interfaceSummary : maskField(row.interfaceSummary)}
                </div>
                {row.interfaces.length ? (
                  <details className="cg-api-disclosure">
                    <summary>{isLoggedIn ? "展开" : "登录后展开"}</summary>
                    <div className="cg-api-interface-list">
                      {(isLoggedIn ? row.interfaces : maskInterfaceItems(row.interfaces)).map((item, index) => (
                        <code key={`${row.name}-${index}`}>{item}</code>
                      ))}
                    </div>
                  </details>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>

      {showLogin ? <LoginModal onLogin={handleLogin} onRegister={handleRegister} onClose={() => setShowLogin(false)} /> : null}
    </div>
  );
}

export default function OpenclawGovernancePage({ auth }) {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    fetchGovernanceOverview()
      .then((payload) => {
        if (!alive) return;
        setOverview(payload);
        setLoading(false);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err.message || "加载总览数据失败");
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const matrixProducts = useMemo(
    () => CLAW_PRODUCTS.filter((item) => item.matrix),
    [],
  );

  const unauthenticatedInterfaces = useMemo(
    () => CLAW_PRODUCTS.reduce((sum, item) => sum + (item.unauthCount || 0), 0),
    [],
  );

  const helperStats = useMemo(
    () => [
      { label: "公网可访问产品", value: CLAW_SUMMARY.publicProducts },
      { label: "高风险接口类型", value: HIGH_RISK_INTERFACES.length },
      { label: "支持 WS / SSE 的产品", value: CLAW_SUMMARY.wsOrSse },
      { label: "存在 Webhook 暴露的产品", value: CLAW_SUMMARY.webhookExposure },
    ],
    [],
  );

  return (
    <div className="oc-page cg-overview-page">
      <section className="oc-page-header cg-overview-hero">
        <div className="cg-overview-hero-copy">
          <div className="oc-page-tag">
            <Sparkles size={13} strokeWidth={2} />
            <span>Claw 系列总览</span>
          </div>
          <h2 className="oc-page-title">Claw 系列产品安全总览</h2>
          <p className="oc-page-desc">
            面向 Claw 系列产品的统一安全总览页面，集中展示资产规模、重点风险、攻击面分布与接口信息，帮助用户快速理解当前生态暴露情况与治理重点。
          </p>
          <div className="cg-overview-meta">
            <div className="cg-overview-meta-item">
              <ShieldCheck size={14} strokeWidth={2} />
              <span>当前状态：建议持续重点治理</span>
            </div>
            <div className="cg-overview-meta-item">
              <Clock3 size={14} strokeWidth={2} />
              <span>数据更新时间：{loading ? "--" : overview?.exposure?.updatedAt || "-"}</span>
            </div>
          </div>
        </div>

        <div className="cg-kpi-strip">
          <KpiCard label="总资产数" value={formatNumber(CLAW_SUMMARY.totalProducts)} tone="primary" />
          <KpiCard label="高风险数" value={formatNumber(CLAW_SUMMARY.highRiskCandidates)} tone="danger" />
          <KpiCard label="未鉴权接口数" value={formatNumber(unauthenticatedInterfaces)} tone="warning" />
        </div>
      </section>

      <div className="cg-overview-helper-strip">
        {helperStats.map((item) => (
          <div key={item.label} className="cg-helper-item">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>

      <GovernanceSection
        title="攻击面矩阵"
        subtitle="从接口、实时通道、Webhook、管理入口与鉴权强度五个维度展示各产品暴露情况"
        icon={Radar}
        extra={<span className="cg-section-flag">核心</span>}
      >
        <AttackSurfaceMatrix products={matrixProducts} />
      </GovernanceSection>

      <section className="cg-overview-bottom-grid">
        <GovernanceSection
          title="生态图"
          subtitle="展示 Gateway、Agent、Skill、Model 与外部服务之间的核心关系"
          icon={Network}
        >
          <EcosystemRelationChart />
        </GovernanceSection>

        <GovernanceSection
          title="攻击路径"
          subtitle="按步骤展示从入口进入到能力放大的主要风险链路"
          icon={AlertTriangle}
        >
          <AttackPathPanel />
        </GovernanceSection>
      </section>

      <GovernanceSection
        title="接口详情"
        subtitle="按产品汇总官网入口、指纹信息、鉴权状态与接口范围，支持按需展开查看详情"
        icon={Activity}
      >
        <InterfaceTable rows={CLAW_PRODUCTS} auth={auth} />
      </GovernanceSection>

      {error ? (
        <div className="research-error">{error}</div>
      ) : null}
    </div>
  );
}
