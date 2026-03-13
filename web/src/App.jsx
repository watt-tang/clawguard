import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronsLeftRightEllipsis,
  ClipboardList,
  Globe,
  Grid2x2,
  House,
  Languages,
  RefreshCcw,
  ScanSearch,
  Settings,
  Shield,
  ShieldCheck,
} from "lucide-react";

const filters = ["全部状态", "全部范围", "全部版本", "全部实例", "关联漏洞数量"];

const navGroups = [
  { icon: House, label: "平台主页" },
  { icon: ShieldCheck, label: "OpenClaw安全治理总览" },
  { icon: AlertTriangle, label: "OpenClaw风险漏洞追踪" },
  { icon: Globe, label: "OpenClaw公网暴露监测", active: true },
  { icon: Shield, label: "Skill生态后门投毒治理" },
  { icon: ScanSearch, label: "OpenClaw部署安全检测" },
];

const rowHeight = 84;
const overscan = 8;
const initialViewportHeight = 780;

function FilterChip({ label }) {
  return (
    <button className="filter-chip" type="button">
      <span>{label}</span>
      <ChevronDown size={15} strokeWidth={1.75} />
    </button>
  );
}

function NavItem({ icon: Icon, label, active = false }) {
  return (
    <button className={`nav-item${active ? " is-active" : ""}`} type="button">
      <Icon size={17} strokeWidth={1.9} />
      <span>{label}</span>
    </button>
  );
}

function StatusPill({ value }) {
  const className =
    value === "持续在线"
      ? "status-pill status-online"
      : value === "近期出现"
        ? "status-pill status-recent"
        : "status-pill status-review";

  return <span className={className}>{value}</span>;
}

function ScopePill({ value }) {
  return <span className="scope-pill">{value}</span>;
}

function formatSnapshotDate(dateKey) {
  if (!dateKey) {
    return "未识别";
  }
  return `${dateKey.slice(0, 4)}-${dateKey.slice(4, 6)}-${dateKey.slice(6, 8)}`;
}

function useVirtualRows(total) {
  const scrollRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(initialViewportHeight);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) {
      return undefined;
    }

    const handleScroll = () => {
      setScrollTop(element.scrollTop);
    };

    const handleResize = () => {
      setViewportHeight(element.clientHeight || initialViewportHeight);
    };

    handleResize();
    element.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      element.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const visibleCount = Math.ceil(viewportHeight / rowHeight) + overscan * 2;
  const endIndex = Math.min(total, startIndex + visibleCount);

  return {
    scrollRef,
    startIndex,
    endIndex,
    offsetTop: startIndex * rowHeight,
    totalHeight: total * rowHeight,
  };
}

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const { scrollRef, startIndex, endIndex, offsetTop, totalHeight } = useVirtualRows(
    data?.rows.length ?? 0
  );

  useEffect(() => {
    let active = true;

    fetch("/data/exposure-data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((payload) => {
        if (active) {
          setData(payload);
        }
      })
      .catch((fetchError) => {
        if (active) {
          setError(fetchError.message || "数据加载失败");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const rows = data?.rows ?? [];
  const visibleRows = useMemo(() => rows.slice(startIndex, endIndex), [rows, startIndex, endIndex]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">CG</div>
          <div>
            <div className="brand-name">clawguard</div>
            <div className="brand-subtitle">校园暴露面监测</div>
          </div>
        </div>

        <div className="sidebar-divider" />

        <nav className="nav-list" aria-label="主导航">
          {navGroups.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </nav>

        <div className="sidebar-pattern" />
      </aside>

      <section className="content-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button" type="button" aria-label="返回">
              <ChevronLeft size={18} />
            </button>
            <div className="topbar-title">
              <ClipboardList size={17} />
              <span>暴露服务详情</span>
            </div>
          </div>

          <div className="topbar-right">
            <button className="icon-button" type="button" aria-label="刷新">
              <RefreshCcw size={18} />
            </button>
            <button className="icon-button" type="button" aria-label="设置">
              <Settings size={18} />
            </button>
            <button className="icon-button" type="button" aria-label="全屏">
              <ChevronsLeftRightEllipsis size={18} />
            </button>
            <button className="icon-button" type="button" aria-label="语言">
              <Languages size={18} />
            </button>
          </div>
        </header>

        <section className="hero-strip">
          <div className="hero-copy">
            <div className="hero-badge">NKU 校园科技安全视图</div>
            <h1>暴露服务详情</h1>
            <p>
              参考安全平台后台的信息组织方式，保留克制的青莲紫识别层，聚焦 IP 地址与最后发现时间。页面中的时间直接取自
              `web/clawdbot_alive` 对应快照文件的真实修改时间。
            </p>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <span>数据总量</span>
              <strong>{data ? data.total.toLocaleString("zh-CN") : "--"}</strong>
            </div>
            <div className="stat-card">
              <span>最新快照</span>
              <strong>{data ? formatSnapshotDate(data.latestSnapshot) : "--"}</strong>
            </div>
            <div className="stat-card">
              <span>加载模式</span>
              <strong>全量 + 虚拟滚动</strong>
            </div>
          </div>
        </section>

        <section className="workspace-panel">
          <div className="filters-bar">
            <div className="filters-row">
              {filters.map((filterLabel) => (
                <FilterChip key={filterLabel} label={filterLabel} />
              ))}
            </div>
            <div className="filters-actions">
              <button className="ghost-button" type="button">
                导出占位
              </button>
              <button className="primary-button" type="button">
                添加策略
              </button>
            </div>
          </div>

          <div className="toolbar-row">
            <div className="toolbar-caption">
              <Grid2x2 size={16} />
              <span>表格视图</span>
            </div>
            <div className="toolbar-meta">
              <span>{data ? `已加载 ${data.total.toLocaleString("zh-CN")} 条记录` : "正在读取数据"}</span>
              <span className="meta-dot" />
              <span>{data ? `快照源：${data.sourceDir}` : "请稍候"}</span>
            </div>
          </div>

          {error ? <div className="state-box">数据加载失败：{error}</div> : null}
          {!error && !data ? <div className="state-box">正在加载全部真实数据…</div> : null}

          {data ? (
            <div className="grid-table">
              <div className="grid-header">
                <div className="col ip-col">IP地址</div>
                <div className="col host-col">主机名</div>
                <div className="col service-col">端口 / 服务</div>
                <div className="col geo-col">地理位置</div>
                <div className="col status-col">运行状态</div>
                <div className="col env-col">境内实例</div>
                <div className="col loc-col">境内位置</div>
                <div className="col version-col">版本号</div>
                <div className="col vuln-col">历史漏洞关联</div>
                <div className="col time-col">最后发现时间</div>
              </div>

              <div className="grid-body" ref={scrollRef}>
                <div style={{ height: totalHeight, position: "relative" }}>
                  <div className="grid-rows" style={{ transform: `translateY(${offsetTop}px)` }}>
                    {visibleRows.map((row) => (
                      <div className="grid-row" key={row.id}>
                        <div className="col ip-col">
                          <div className="ip-block">
                            <span className="ip-text">{row.ip}</span>
                            <span className="ip-subtext">公网暴露资产</span>
                          </div>
                        </div>
                        <div className="col host-col">-</div>
                        <div className="col service-col">
                          <div className="service-block">
                            <strong>18789 / OpenClaw</strong>
                            <span>{row.instance}</span>
                          </div>
                        </div>
                        <div className="col geo-col">
                          <div className="geo-block">
                            <strong>{row.country}</strong>
                            <span>{row.asn}</span>
                          </div>
                        </div>
                        <div className="col status-col">
                          <StatusPill value={row.status} />
                        </div>
                        <div className="col env-col">
                          <ScopePill value={row.envLabel} />
                        </div>
                        <div className="col loc-col">{row.location}</div>
                        <div className="col version-col">
                          <span className="version-dot">{row.version}</span>
                        </div>
                        <div className="col vuln-col">
                          <span className="vuln-text">{row.vulnCount}</span>
                        </div>
                        <div className="col time-col">{row.lastSeen}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </section>
    </div>
  );
}
