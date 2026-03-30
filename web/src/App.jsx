import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ChevronRight,
  Globe,
  House,
  LogIn,
  LogOut,
  ScanSearch,
  Shield,
  ShieldCheck,
  Sparkles,
  University,
} from "lucide-react";
import { PAGE_IDS } from "./config.js";
import { useAuth } from "./hooks/useAuth.js";
import OpenclawExposurePage from "./features/openclaw-exposure/pages/OpenclawExposurePage.jsx";
import SkillGovernancePage from "./features/skill-governance/pages/SkillGovernancePage.jsx";
import nkuLogo from "./pic/南开logo.png";

const MODULES = [
  {
    icon: House,
    label: "平台主页",
    pageId: PAGE_IDS.HOME,
    description: "查看平台总览、模块说明与建设进度。",
    status: "默认入口",
  },
  {
    icon: ShieldCheck,
    label: "claw系列产品安全总览",
    pageId: "openclaw-governance",
    description: "聚合安全事件、告警、处置进度与风险看板。",
    status: "建设中",
  },
  {
    icon: AlertTriangle,
    label: "OpenClaw 风险漏洞追踪",
    pageId: "openclaw-risk",
    description: "持续跟踪 OpenClaw 漏洞、CVE 关联与修复进度。",
    status: "建设中",
  },
  {
    icon: Globe,
    label: "OpenClaw 公网暴露监测",
    pageId: PAGE_IDS.OPENCLAW_EXPOSURE,
    description: "查看全球分布、趋势分析与暴露服务详情。",
    status: "已上线",
  },
  {
    icon: Shield,
    label: "Skill 生态后门投毒治理",
    pageId: "skill-governance",
    description: "面向 Skill 生态的供应链监测、后门识别与投毒治理。",
    status: "前端已就绪",
  },
  {
    icon: ScanSearch,
    label: "OpenClaw 部署安全检测",
    pageId: "openclaw-deploy",
    description: "检测部署环境中的配置风险与合规问题。",
    status: "建设中",
  },
];

const QUICK_TAGS = ["实时监测", "重点暴露", "最新发现", "技能检测", "公网资产", "边界服务"];

function TopUtilityBar({ userName, role, isLoggedIn, onGoHome, onAuthAction }) {
  const safeUserName = userName || "guest";
  const roleLabel = role === "admin" ? "平台管理员" : role === "user" ? "普通用户" : "未登录";

  return (
    <header className="top-utility-bar">
      <div className="top-utility-left">
        <button className="utility-home-btn" type="button" onClick={onGoHome}>
          <House size={14} strokeWidth={2} />
          <span>主页</span>
        </button>

        <div className="utility-brand">
          <div className="utility-brand-mark">
            <University size={14} strokeWidth={2} />
          </div>
          <div className="utility-brand-text">
            <strong>南开大学</strong>
            <span>ClawGuard 平台</span>
          </div>
        </div>
      </div>

      <div className="top-utility-right">
        <div className="utility-account">
          <div className="utility-account-avatar">{safeUserName.slice(0, 1).toUpperCase()}</div>
          <div className="utility-account-meta">
            <strong>{safeUserName}</strong>
            <span>{roleLabel}</span>
          </div>
        </div>
        <button className="utility-ghost-btn" type="button" onClick={onAuthAction}>
          {isLoggedIn ? <LogOut size={14} strokeWidth={2} /> : <LogIn size={14} strokeWidth={2} />}
          <span>{isLoggedIn ? "退出" : "登录"}</span>
        </button>
      </div>
    </header>
  );
}

function AppLoginModal({ onLogin, onRegister, onClose }) {
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
        <div className="oc-modal-title">{mode === "login" ? "账号登录" : "用户注册"}</div>
        <p className="oc-modal-desc">
          {mode === "login" ? "请输入账号与密码登录平台。" : "创建新账号后将自动登录。"}
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
          <input
            className="oc-input"
            placeholder="用户名"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoFocus
          />
          <input
            type="password"
            className="oc-input"
            placeholder="密码"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {mode === "register" ? (
            <input
              className="oc-input"
              placeholder="手机号"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
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

function ModuleTab({ module, active, onClick }) {
  const Icon = module.icon;

  return (
    <button
      className={`module-tab${active ? " is-active" : ""}`}
      type="button"
      onClick={() => onClick(module.pageId)}
      aria-pressed={active}
    >
      <div className="module-tab-icon">
        <Icon size={16} strokeWidth={1.9} />
      </div>
      <div className="module-tab-copy">
        <span className="module-tab-title">{module.label}</span>
        <span className="module-tab-desc">{module.description}</span>
      </div>
      <span className={`module-tab-status${module.status === "已上线" || module.status === "前端已就绪" ? " is-online" : ""}`}>
        {module.status}
      </span>
    </button>
  );
}

function ModuleIntro({ activeModule }) {
  return (
    <section className="module-intro-card">
      <div>
        <div className="module-intro-eyebrow">
          <Sparkles size={13} strokeWidth={2} />
          <span>OpenClaw Security Console</span>
        </div>
        <h1 className="module-intro-title">{activeModule.label}</h1>
        <p className="module-intro-desc">{activeModule.description}</p>
      </div>

      <div className="module-intro-meta">
        <span className="module-intro-path">控制台</span>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="module-intro-path is-current">{activeModule.label}</span>
      </div>
    </section>
  );
}

function DashboardHome({ modules, activePage, onNavigate }) {
  const homeModules = modules.filter((module) => module.pageId !== PAGE_IDS.HOME);
  const homeModuleCards = [...homeModules, ...Array(Math.max(0, 8 - homeModules.length)).fill(null)];

  return (
    <div className="oc-home">
      <div className="oc-home-hero">
        <div className="oc-home-hero-layout">
          <div className="oc-home-hero-main">
            <div className="oc-home-badge">NKU OpenClaw Security View</div>
            <h1 className="oc-home-title">ClawGuard 生态安全监测平台</h1>
            <p className="oc-home-subtitle">
              面向 OpenClaw 系列生态的公网暴露面监测与安全治理平台，聚焦资产识别、风险量化、版本演化与持续响应。
            </p>
            <div className="oc-home-meta">
              <span>统一资产视图、实时风险态势与治理协同一体化呈现。</span>
            </div>
            <div className="oc-home-highlights">
              <div className="oc-home-highlight">
                <strong>7x24</strong>
                <span>连续监测</span>
              </div>
              <div className="oc-home-highlight">
                <strong>Global</strong>
                <span>全球暴露视角</span>
              </div>
              <div className="oc-home-highlight">
                <strong>OpenClaw</strong>
                <span>生态治理闭环</span>
              </div>
            </div>
          </div>
          <aside className="oc-home-hero-brand" aria-label="南开大学品牌标识">
            <div className="oc-home-hero-brand-inner">
              <img className="oc-home-logo" src={nkuLogo} alt="南开大学 Logo" />
            </div>
            <div className="oc-home-brand-text">
              <strong>Nankai University</strong>
              <span>OpenClaw Security Console</span>
            </div>
          </aside>
        </div>
      </div>

      <div className="oc-home-modules">
        {homeModuleCards.map((module, index) => {
          if (!module) {
            return <div key={`placeholder-${index}`} className="oc-home-module-card oc-home-module-placeholder" aria-hidden="true" />;
          }

          const Icon = module.icon;
          const isActive = module.pageId === activePage;
          const isOnline = module.status === "已上线" || module.status === "前端已就绪";

          return (
            <button
              key={module.pageId}
              type="button"
              className={`oc-home-module-card oc-home-module-button${isActive ? " is-active" : ""}`}
              onClick={() => onNavigate(module.pageId)}
            >
              <div className="oc-home-module-header">
                <Icon size={20} strokeWidth={1.8} />
                <span className={`oc-badge ${isOnline ? "oc-badge-online" : "oc-badge-review"}`}>{module.status}</span>
              </div>
              <div className="oc-home-module-title">{module.label}</div>
              <div className="oc-home-module-desc">{module.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PlaceholderPage({ module }) {
  return (
    <div className="oc-placeholder-page">
      <section className="oc-page-header">
        <div className="oc-page-header-main">
          <div className="oc-page-tag">模块建设中</div>
          <h2 className="oc-page-title">{module.label}</h2>
          <p className="oc-page-desc">{module.description} 当前模块信息架构已映射至顶部入口，后续可在此区域继续扩展真实业务内容。</p>
        </div>
      </section>

      <div className="oc-placeholder">
        <div className="oc-placeholder-icon">···</div>
        <div className="oc-placeholder-text">该模块暂未开放详细内容，现阶段仅保留结构入口与内容承接位。</div>
      </div>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState(PAGE_IDS.HOME);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const auth = useAuth();

  const activeModule = useMemo(
    () => MODULES.find((module) => module.pageId === activePage) ?? MODULES[0],
    [activePage],
  );

  function renderPage() {
    if (activePage === PAGE_IDS.HOME) {
      return <DashboardHome modules={MODULES} activePage={activePage} onNavigate={setActivePage} />;
    }

    if (activePage === PAGE_IDS.OPENCLAW_EXPOSURE) {
      return <OpenclawExposurePage auth={auth} />;
    }

    if (activePage === "skill-governance") {
      return <SkillGovernancePage auth={auth} />;
    }

    return <PlaceholderPage module={activeModule} />;
  }

  function handleAuthAction() {
    if (auth.isLoggedIn) {
      auth.logout();
      return;
    }
    setShowLoginModal(true);
  }

  function handleAppLogin(username, password) {
    const result = auth.login(username, password);
    if (result.ok) {
      setShowLoginModal(false);
    }
    return result;
  }

  function handleAppRegister(username, password, phone, inviteCode) {
    const result = auth.register(username, password, phone, inviteCode);
    if (result.ok) {
      setShowLoginModal(false);
    }
    return result;
  }

  return (
    <div className="console-shell">
      <TopUtilityBar
        userName={auth.user?.username ?? "guest"}
        role={auth.user?.role}
        isLoggedIn={auth.isLoggedIn}
        onGoHome={() => setActivePage(PAGE_IDS.HOME)}
        onAuthAction={handleAuthAction}
      />

      <div className="console-body">
        {activePage !== PAGE_IDS.HOME ? (
          <section className="module-nav-shell">
            <div className="module-nav-topline">
              <div>
                <div className="module-nav-label">模块导航</div>
                <p className="module-nav-caption">聚合平台功能入口，可在不同安全模块之间快速切换并查看对应内容。</p>
              </div>

              <div className="module-quick-tags" aria-label="快捷标签">
                {QUICK_TAGS.map((tag, index) => (
                  <span key={tag} className={`module-quick-tag${index === 0 ? " is-active" : ""}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="module-tab-grid" role="tablist" aria-label="平台模块导航">
              {MODULES.map((module) => (
                <ModuleTab
                  key={module.pageId}
                  module={module}
                  active={module.pageId === activePage}
                  onClick={setActivePage}
                />
              ))}
            </div>
          </section>
        ) : null}

        <main className="content-shell">
          <ModuleIntro activeModule={activeModule} />
          {renderPage()}
        </main>
      </div>

      {showLoginModal ? (
        <AppLoginModal
          onLogin={handleAppLogin}
          onRegister={handleAppRegister}
          onClose={() => setShowLoginModal(false)}
        />
      ) : null}
    </div>
  );
}
