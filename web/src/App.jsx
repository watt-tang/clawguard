import { useState } from "react";
import {
  AlertTriangle,
  Globe,
  House,
  Shield,
  ShieldCheck,
  ScanSearch,
} from "lucide-react";
import { PAGE_IDS } from "./config.js";
import { useAuth } from "./hooks/useAuth.js";
import HomePage from "./pages/HomePage.jsx";
import OpenclawExposurePage from "./pages/OpenclawExposurePage.jsx";

// ─── 导航配置 ──────────────────────────────────────────────────────────────────

const navGroups = [
  { icon: House,         label: "平台主页",               pageId: PAGE_IDS.HOME },
  { icon: ShieldCheck,   label: "OpenClaw安全治理总览",    pageId: null },
  { icon: AlertTriangle, label: "OpenClaw风险漏洞追踪",    pageId: null },
  { icon: Globe,         label: "OpenClaw公网暴露监测",    pageId: PAGE_IDS.OPENCLAW_EXPOSURE },
  { icon: Shield,        label: "Skill生态后门投毒治理",   pageId: null },
  { icon: ScanSearch,    label: "OpenClaw部署安全检测",    pageId: null },
];

// ─── 子组件 ────────────────────────────────────────────────────────────────────

function NavItem({ icon: Icon, label, active = false, disabled = false, onClick }) {
  return (
    <button
      className={`nav-item${active ? " is-active" : ""}${disabled ? " is-disabled" : ""}`}
      type="button"
      onClick={disabled ? undefined : onClick}
      title={disabled ? "建设中" : label}
    >
      <Icon size={17} strokeWidth={1.9} />
      <span>{label}</span>
      {disabled && <span className="nav-item-wip">建设中</span>}
    </button>
  );
}

// ─── 应用根组件 ────────────────────────────────────────────────────────────────

export default function App() {
  const [activePage, setActivePage] = useState(PAGE_IDS.OPENCLAW_EXPOSURE);
  const auth = useAuth();

  function renderPage() {
    switch (activePage) {
      case PAGE_IDS.HOME:
        return <HomePage />;
      case PAGE_IDS.OPENCLAW_EXPOSURE:
        return <OpenclawExposurePage auth={auth} />;
      default:
        return (
          <div className="oc-placeholder">
            <div className="oc-placeholder-icon">🚧</div>
            <div className="oc-placeholder-text">该模块建设中，敬请期待</div>
          </div>
        );
    }
  }

  return (
    <div className="app-shell">
      {/* 侧边栏 */}
      <aside className="sidebar">
        <div className="sidebar-inner">
          <div className="brand-block">
            <div className="brand-mark">CG</div>
            <div>
              <div className="brand-name">clawguard</div>
              <div className="brand-subtitle">校园暴露面监测</div>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">主导航</div>
            <nav className="nav-list" aria-label="主导航">
              {navGroups.map((item) => (
                <NavItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  active={activePage === item.pageId}
                  disabled={item.pageId === null}
                  onClick={() => item.pageId && setActivePage(item.pageId)}
                />
              ))}
            </nav>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">快捷标签</div>
            <div className="sidebar-tags">
              {["实时监测", "重点暴露", "最新发现", "校园节点", "公网资产", "边界服务"].map(
                (tag) => (
                  <button
                    key={tag}
                    className={`sidebar-tag${tag === "实时监测" ? " is-active" : ""}`}
                    type="button"
                  >
                    {tag}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="sidebar-pattern" />
        </div>
      </aside>

      {/* 内容区 */}
      <main className="content-shell">
        {renderPage()}
      </main>
    </div>
  );
}
