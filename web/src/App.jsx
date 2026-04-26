import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ChevronRight,
  Clock3,
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
import GlobalSearchBar from "./components/GlobalSearchBar.jsx";
import { PAGE_IDS } from "./config.js";
import { useAuth } from "./hooks/useAuth.js";
import {
  CLAW_EXPOSURE_PRODUCTS,
  DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY,
  getClawExposureProduct,
} from "../shared/clawExposureProducts.mjs";
import OpenclawExposurePage from "./features/openclaw-exposure/pages/OpenclawExposurePage.jsx";
import OpenclawGovernancePage from "./features/openclaw-governance/pages/OpenclawGovernancePage.jsx";
import OpenclawRiskPage from "./features/openclaw-risk/pages/OpenclawRiskPage.jsx";
import SecurityResearchPage from "./features/security-research/pages/SecurityResearchPage.jsx";
import SkillGovernancePage from "./features/skill-governance/pages/SkillGovernancePage.jsx";
import nkuLogo from "./pic/南开logo.png";

const RAW_MODULES = [
  {
    icon: House,
    label: "平台主页",
    pageId: PAGE_IDS.HOME,
    description: "查看平台总览、模块导航与首页分层入口。",
    status: "默认入口",
  },
  {
    icon: ShieldCheck,
    label: "claw系列产品安全总览",
    pageId: "openclaw-governance",
    description: "聚合安全事件、告警、处置进度与风险看板。",
    status: "已上线",
  },
  {
    icon: AlertTriangle,
    label: "OpenClaw 风险漏洞追踪",
    pageId: "openclaw-risk",
    description: "持续跟踪 OpenClaw 漏洞、CVE 关联与修复进度。",
    status: "已上线",
  },
  {
    icon: Globe,
    label: "Claw系列公网暴露监测",
    pageId: PAGE_IDS.OPENCLAW_EXPOSURE,
    description: "默认展示 OpenClaw，并支持切换查看 GoClaw、IronClaw、PicoClaw、TinyClaw 与 ZeroClaw。",
    status: "已上线",
  },
  {
    icon: Shield,
    label: "Skill 生态后门投毒治理",
    pageId: "skill-governance",
    description: "面向 Skill 生态的后门识别、投毒治理与风险研判。",
    status: "已上线",
  },
  {
    icon: ScanSearch,
    label: "学术安全前沿",
    pageId: "openclaw-deploy",
    description: "聚合 OpenClaw / Skill / Agent / Plugin 安全研究与生态分析。",
    status: "已上线",
  },
];

const MODULES = RAW_MODULES;

const PRIMARY_HOME_PAGE_IDS = [PAGE_IDS.OPENCLAW_EXPOSURE, "skill-governance"];

const STATUS_TICKERS = [
  "系统状态 NORMAL",
  "Claw 系列公网暴露监测链路在线",
  "Skill 风险扫描策略已加载",
  "全局导航入口已分层",
];

function TopUtilityBar({ userName, role, isLoggedIn, modules, onGoHome, onNavigate, onAuthAction }) {
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

      <div className="top-utility-center">
        <GlobalSearchBar modules={modules} onNavigate={onNavigate} />
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
      <span className={`module-tab-status${module.status === "已上线" ? " is-online" : ""}`}>
        {module.status}
      </span>
    </button>
  );
}

function ProductSwitchCard({ selectedProductKey, onProductChange }) {
  const selectedProduct = getClawExposureProduct(selectedProductKey);

  return (
    <div className="module-product-switch-card">
      <div className="module-product-switch-icon">
        <Globe size={16} strokeWidth={2} />
      </div>
      <div className="module-product-switch-main">
        <label className="module-product-switch-label" htmlFor="claw-product-switch">
          切换其他产品
        </label>
        <select
          id="claw-product-switch"
          className="module-product-switch-select"
          value={selectedProduct.key}
          onChange={(event) => onProductChange(event.target.value)}
        >
          {CLAW_EXPOSURE_PRODUCTS.map((product) => (
            <option key={product.key} value={product.key}>
              {product.name}
            </option>
          ))}
        </select>
      </div>
      <span className={`module-product-switch-risk is-${selectedProduct.riskTone || "review"}`}>
        {selectedProduct.riskLabel}
      </span>
    </div>
  );
}

function ModuleIntro({ activeModule, title, description, eyebrow, extra }) {
  const displayTitle = title || activeModule.label;
  const displayDescription = description || activeModule.description;

  return (
    <section className="module-intro-card">
      <div className="module-intro-main">
        <div className="module-intro-eyebrow">
          <Sparkles size={13} strokeWidth={2} />
          <span>{eyebrow || "OpenClaw Security Console"}</span>
        </div>
        <div className="module-intro-title-row">
          <h1 className="module-intro-title">{displayTitle}</h1>
          {extra}
        </div>
        <p className="module-intro-desc">{displayDescription}</p>
      </div>

      <div className="module-intro-meta">
        <span className="module-intro-path">控制台</span>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="module-intro-path is-current">{displayTitle}</span>
      </div>
    </section>
  );
}

function LiveStatusStrip({ onlineCount, riskCount, lastUpdate }) {
  const items = [...STATUS_TICKERS, ...STATUS_TICKERS];

  return (
    <section className="oc-status-strip" aria-label="平台动态状态">
      <div className="oc-status-marquee">
        <div className="oc-status-strip-prefix">
          <Activity size={14} strokeWidth={2} />
          <span>平台动态</span>
        </div>
        <div className="oc-status-marquee-track">
          <span className="oc-status-marquee-item is-meta">
            <Clock3 size={13} strokeWidth={2} />
            更新时间 {lastUpdate}
          </span>
          <span className="oc-status-marquee-item is-meta">
            在线模块 {onlineCount}
          </span>
          <span className="oc-status-marquee-item is-meta">
            导航入口 {riskCount}
          </span>
          {items.map((item, index) => (
            <span key={`${item}-${index}`} className="oc-status-marquee-item">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomePortalCard({ module, onNavigate, featured = false }) {
  const Icon = module.icon;

  return (
    <button
      type="button"
      className={`oc-home-module-card oc-home-module-button${featured ? " is-featured" : " is-secondary"}`}
      onClick={() => onNavigate(module.pageId)}
    >
      <div className="oc-home-module-glow" aria-hidden="true" />
      <div className="oc-home-module-header">
        <div className="oc-home-module-icon">
          <Icon size={featured ? 24 : 20} strokeWidth={1.9} />
        </div>
        <span className="oc-badge oc-badge-online">{module.status}</span>
      </div>

      <div className="oc-home-module-body">
        <div className="oc-home-module-title">{module.label}</div>
        <div className="oc-home-module-desc">{module.description}</div>
      </div>

      <div className="oc-home-module-foot">
        <span className="oc-home-module-entry">{featured ? "核心安全入口" : "辅助导航入口"}</span>
        <span className="oc-home-module-arrow">
          进入模块
          <ChevronRight size={16} strokeWidth={2.1} />
        </span>
      </div>
    </button>
  );
}

function DashboardHome({ modules, onNavigate }) {
  const homeModules = modules.filter((module) => module.pageId !== PAGE_IDS.HOME);
  const primaryModules = homeModules.filter((module) => PRIMARY_HOME_PAGE_IDS.includes(module.pageId));
  const secondaryModules = homeModules.filter((module) => !PRIMARY_HOME_PAGE_IDS.includes(module.pageId));

  return (
    <div className="oc-home">
      <div className="oc-home-bg" aria-hidden="true">
        <span className="oc-home-grid" />
        <span className="oc-home-orb oc-home-orb-a" />
        <span className="oc-home-orb oc-home-orb-b" />
        <span className="oc-home-orb oc-home-orb-c" />
        <span className="oc-home-particles">
          {Array.from({ length: 10 }).map((_, index) => (
            <i key={`particle-${index}`} style={{ "--particle-index": index }} />
          ))}
        </span>
      </div>

      <section className="oc-home-hero">
        <img className="oc-home-logo-watermark" src={nkuLogo} alt="" aria-hidden="true" />
        <div className="oc-home-hero-layout">
          <div className="oc-home-hero-main">
            <div className="oc-home-badge">Platform Gateway</div>
            <h1 className="oc-home-title">ClawGuard 生态安全监测平台</h1>
            <p className="oc-home-subtitle">
              面向 Claw 生态的统一安全入口，帮助用户快速进入公网暴露监测与 Skill 风险治理等核心能力页面。
            </p>
          </div>

        </div>
      </section>

      <section className="oc-home-primary" aria-label="主功能入口">
        {primaryModules.map((module) => (
          <HomePortalCard key={module.pageId} module={module} onNavigate={onNavigate} featured />
        ))}
      </section>

      <section aria-label="辅助导航入口">

        <div className="oc-home-secondary">
          {secondaryModules.map((module) => (
            <HomePortalCard key={module.pageId} module={module} onNavigate={onNavigate} />
          ))}
        </div>
      </section>
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
          <p className="oc-page-desc">
            {module.description}
            当前模块信息架构已映射至顶部入口，后续可在此区域继续扩展真实业务内容。
          </p>
        </div>
      </section>

      <div className="oc-placeholder">
        <div className="oc-placeholder-icon">···</div>
        <div className="oc-placeholder-text">该模块暂未开放详细内容，当前保留结构入口与内容承接位。</div>
      </div>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState(PAGE_IDS.HOME);
  const [activeExposureProductKey, setActiveExposureProductKey] = useState(DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const auth = useAuth();
  const navModules = MODULES.filter((module) => module.pageId !== PAGE_IDS.HOME);
  const activeExposureProduct = useMemo(
    () => getClawExposureProduct(activeExposureProductKey),
    [activeExposureProductKey],
  );

  const activeModule = useMemo(
    () => MODULES.find((module) => module.pageId === activePage) ?? MODULES[0],
    [activePage],
  );
  const isExposurePage = activePage === PAGE_IDS.OPENCLAW_EXPOSURE;

  function handleNavigate(pageId) {
    if (pageId === PAGE_IDS.OPENCLAW_EXPOSURE && activePage !== PAGE_IDS.OPENCLAW_EXPOSURE) {
      setActiveExposureProductKey(DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY);
    }
    setActivePage(pageId);
  }

  function renderPage() {
  if (activePage === PAGE_IDS.HOME) {
    return <DashboardHome modules={MODULES} onNavigate={handleNavigate} />;
  }

  if (activePage === PAGE_IDS.OPENCLAW_EXPOSURE) {
    return (
      <OpenclawExposurePage
        key={activeExposureProduct.key}
        auth={auth}
        product={activeExposureProduct}
      />
    );
  }

  if (activePage === "openclaw-governance") {
    return <OpenclawGovernancePage auth={auth} />;
  }

  if (activePage === "openclaw-risk") {
    return <OpenclawRiskPage auth={auth} />;
  }

  if (activePage === "skill-governance") {
    return <SkillGovernancePage auth={auth} />;
  }

  if (activePage === "openclaw-deploy") {
    return <SecurityResearchPage auth={auth} />;
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
        modules={MODULES}
        onGoHome={() => handleNavigate(PAGE_IDS.HOME)}
        onNavigate={handleNavigate}
        onAuthAction={handleAuthAction}
      />

      <div className="console-body">
        {activePage === PAGE_IDS.HOME ? (
          <div className="home-status-row">
            <LiveStatusStrip
              onlineCount={MODULES.filter((module) => module.pageId !== PAGE_IDS.HOME && module.status === "已上线").length}
              riskCount={MODULES.filter((module) => module.pageId !== PAGE_IDS.HOME).length}
              lastUpdate="2026-04-06 17:20"
            />
          </div>
        ) : null}

        {activePage !== PAGE_IDS.HOME ? (
          <section className="module-nav-shell">
            <div className="module-nav-topline">
              <div>
                <div className="module-nav-label">模块导航</div>
                <p className="module-nav-caption">聚合平台功能入口，可在不同安全模块之间快速切换并查看对应内容。</p>
              </div>

            </div>

            <div
              className="module-tab-grid"
              role="tablist"
              aria-label="平台模块导航"
              style={{ gridTemplateColumns: `repeat(${Math.max(navModules.length, 1)}, minmax(0, 1fr))` }}
            >
              {navModules.map((module) => (
                <ModuleTab
                  key={module.pageId}
                  module={module}
                  active={module.pageId === activePage}
                  onClick={handleNavigate}
                />
              ))}
            </div>
          </section>
        ) : null}

        <main className="content-shell">
          {activePage !== PAGE_IDS.HOME ? (
            <ModuleIntro
              activeModule={activeModule}
              title={isExposurePage ? activeExposureProduct.navLabel : activeModule.label}
              description={isExposurePage ? activeExposureProduct.description : activeModule.description}
              eyebrow={isExposurePage ? "Claw Series Exposure Console" : undefined}
              extra={
                isExposurePage ? (
                  <ProductSwitchCard
                    selectedProductKey={activeExposureProduct.key}
                    onProductChange={setActiveExposureProductKey}
                  />
                ) : null
              }
            />
          ) : null}
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
