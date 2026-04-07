import { useEffect, useMemo, useState } from "react";
import { Activity, ChevronLeft, ChevronRight, Radar, ShieldAlert, Waves } from "lucide-react";
import CollapsePanel from "../../openclaw-exposure/components/CollapsePanel.jsx";
import { PAGE_SIZE_OPTIONS } from "../../../config.js";
import { useEChart } from "../../../hooks/useEChart.js";
import {
  fetchOpenclawRiskIssues,
  fetchOpenclawRiskOverview,
  triggerOpenclawRiskRefresh,
} from "../services/dataService.js";

const SEVERITY_OPTIONS = [
  { label: "全部等级", value: "" },
  { label: "Critical", value: "critical" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const SOURCE_OPTIONS = [
  { label: "全部来源", value: "" },
  { label: "GitHub Advisory", value: "github" },
  { label: "NVD CVE", value: "nvd" },
];

const FIX_STATUS_OPTIONS = [
  { label: "全部状态", value: "" },
  { label: "已修复", value: "fixed" },
  { label: "未修复", value: "unfixed" },
  { label: "待确认", value: "unknown" },
];

function formatDate(value) {
  if (!value) return "-";
  return String(value).replace("T", " ").slice(0, 16);
}

function RiskBadge({ tone = "neutral", children }) {
  return <span className={`risk-badge risk-badge-${tone}`}>{children}</span>;
}

function SourceBadge({ value }) {
  return <span className="risk-source-badge">{value || "-"}</span>;
}

function RiskChartCard({ title, subtitle, icon: Icon, children }) {
  return (
    <section className="risk-viz-card">
      <div className="risk-viz-head">
        <div className="risk-viz-icon">
          <Icon size={16} strokeWidth={2} />
        </div>
        <div>
          <div className="risk-viz-title">{title}</div>
          <div className="risk-viz-subtitle">{subtitle}</div>
        </div>
      </div>
      {children}
    </section>
  );
}

function SeverityDonutChart({ breakdown }) {
  const dataset = [
    { name: "Critical", value: breakdown?.critical ?? 0, color: "#a61b47" },
    { name: "High", value: breakdown?.high ?? 0, color: "#cf4d2e" },
    { name: "Medium", value: breakdown?.medium ?? 0, color: "#d79a1d" },
    { name: "Low", value: breakdown?.low ?? 0, color: "#2d8f67" },
    { name: "Unknown", value: breakdown?.unknown ?? 0, color: "#6d6780" },
  ].filter((item) => item.value > 0);
  const total = dataset.reduce((sum, item) => sum + item.value, 0);

  const { chartRef } = useEChart(
    () => ({
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(28, 18, 32, 0.92)",
        borderWidth: 0,
        textStyle: { color: "#fff" },
      },
      series: [
        {
          type: "pie",
          radius: ["58%", "78%"],
          center: ["50%", "52%"],
          label: { show: false },
          labelLine: { show: false },
          itemStyle: { borderColor: "#fff", borderWidth: 4 },
          data: dataset.map((item) => ({ value: item.value, name: item.name, itemStyle: { color: item.color } })),
        },
      ],
      graphic: [
        {
          type: "text",
          left: "center",
          top: "40%",
          style: {
            text: String(total),
            fill: "#241b2b",
            font: "700 30px 'Segoe UI'",
          },
        },
        {
          type: "text",
          left: "center",
          top: "54%",
          style: {
            text: "漏洞总量",
            fill: "#786e82",
            font: "500 12px 'Segoe UI'",
          },
        },
      ],
    }),
    [JSON.stringify(dataset), total],
  );

  return (
    <>
      <div ref={chartRef} className="risk-chart-canvas" />
      <div className="risk-legend-grid">
        {dataset.map((item) => (
          <div key={item.name} className="risk-legend-item">
            <span className="risk-legend-dot" style={{ backgroundColor: item.color }} />
            <span>{item.name}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </>
  );
}

function SourceBarChart({ breakdown }) {
  const values = [
    { name: "GitHub Advisory", value: breakdown?.github ?? 0, color: "#8f2ca1" },
    { name: "NVD CVE", value: breakdown?.nvd ?? 0, color: "#2f6fed" },
  ];

  const { chartRef } = useEChart(
    () => ({
      grid: { left: 12, right: 12, top: 14, bottom: 8, containLabel: true },
      xAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "rgba(126, 12, 110, 0.08)" } },
        axisLabel: { color: "#776d80" },
      },
      yAxis: {
        type: "category",
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { color: "#3c3244", fontWeight: 600 },
        data: values.map((item) => item.name),
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(28, 18, 32, 0.92)",
        borderWidth: 0,
        textStyle: { color: "#fff" },
      },
      series: [
        {
          type: "bar",
          barWidth: 18,
          data: values.map((item) => ({
            value: item.value,
            itemStyle: {
              color: item.color,
              borderRadius: [0, 10, 10, 0],
            },
          })),
        },
      ],
    }),
    [JSON.stringify(values)],
  );

  return <div ref={chartRef} className="risk-chart-canvas risk-chart-canvas-bar" />;
}

function FixProgressVisual({ fixProgress }) {
  const fixed = fixProgress?.fixed ?? 0;
  const unfixed = fixProgress?.unfixed ?? 0;
  const unknown = fixProgress?.unknown ?? 0;
  const total = Math.max(fixed + unfixed + unknown, 1);

  return (
    <div className="risk-progress-shell">
      <div className="risk-progress-track">
        <span className="risk-progress-segment is-fixed" style={{ width: `${(fixed / total) * 100}%` }} />
        <span className="risk-progress-segment is-unfixed" style={{ width: `${(unfixed / total) * 100}%` }} />
        <span className="risk-progress-segment is-unknown" style={{ width: `${(unknown / total) * 100}%` }} />
      </div>
      <div className="risk-progress-stats">
        <div className="risk-progress-stat">
          <span>已修复</span>
          <strong>{fixed}</strong>
        </div>
        <div className="risk-progress-stat">
          <span>未修复</span>
          <strong>{unfixed}</strong>
        </div>
        <div className="risk-progress-stat">
          <span>待确认</span>
          <strong>{unknown}</strong>
        </div>
      </div>
    </div>
  );
}

function TablePager({ page, pageSize, total, onPage, onPageSize }) {
  const totalPages = Math.max(1, Math.ceil(Math.max(total, 1) / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const pageNums = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const nums = new Set([1, totalPages, page]);
    for (let delta = -2; delta <= 2; delta += 1) {
      const next = page + delta;
      if (next >= 1 && next <= totalPages) nums.add(next);
    }
    return Array.from(nums).sort((a, b) => a - b);
  }, [page, totalPages]);

  return (
    <div className="oc-pager">
      <span className="oc-pager-info">
        共 {total.toLocaleString("zh-CN")} 条，当前第 {page} / {totalPages} 页
      </span>
      <div className="oc-pager-controls">
        <button
          className="oc-pager-btn"
          type="button"
          disabled={!canPrev}
          onClick={() => onPage(page - 1)}
          aria-label="上一页"
        >
          <ChevronLeft size={14} />
        </button>

        {pageNums.map((pageNum, index) => {
          const prev = pageNums[index - 1];
          const hasGap = prev && pageNum - prev > 1;
          return (
            <span key={pageNum} className="oc-pager-pages">
              {hasGap ? <span className="oc-pager-ellipsis">...</span> : null}
              <button
                type="button"
                className={`oc-pager-btn${pageNum === page ? " is-active" : ""}`}
                onClick={() => onPage(pageNum)}
              >
                {pageNum}
              </button>
            </span>
          );
        })}

        <button
          className="oc-pager-btn"
          type="button"
          disabled={!canNext}
          onClick={() => onPage(page + 1)}
          aria-label="下一页"
        >
          <ChevronRight size={14} />
        </button>

        <select
          className="oc-select"
          value={pageSize}
          onChange={(event) => onPageSize(Number(event.target.value))}
          aria-label="每页条数"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size} 条 / 页
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function FeedCard({ issue }) {
  return (
    <article className="risk-issue-card">
      <div className="risk-issue-card-top">
        <div>
          <div className="risk-issue-id">{issue.id}</div>
          <h3 className="risk-issue-title">{issue.title}</h3>
        </div>
        <div className="risk-issue-badges">
          <RiskBadge tone={issue.severity}>{String(issue.severity || "unknown").toUpperCase()}</RiskBadge>
          <RiskBadge tone={issue.fixState?.status}>{issue.fixState?.label || "待确认"}</RiskBadge>
        </div>
      </div>
      <p className="risk-issue-summary">{issue.summary || issue.description || "暂无摘要。"}</p>
      <div className="risk-issue-meta">
        <span>来源：{issue.sourceLabels?.join(" / ") || "-"}</span>
        <span>CVSS：{issue.score ?? "-"}</span>
        <span>修复版本：{issue.fixedVersion || "-"}</span>
      </div>
    </article>
  );
}

export default function OpenclawRiskPage() {
  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState("");
  const [issuesData, setIssuesData] = useState(null);
  const [issuesLoading, setIssuesLoading] = useState(true);
  const [issuesError, setIssuesError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: PAGE_SIZE_OPTIONS[0],
    severity: "",
    source: "",
    fixStatus: "",
    keyword: "",
  });

  const loadOverview = async () => {
    setOverviewLoading(true);
    setOverviewError("");
    try {
      const data = await fetchOpenclawRiskOverview();
      setOverview(data);
    } catch (error) {
      setOverviewError(error.message || "加载失败");
    } finally {
      setOverviewLoading(false);
    }
  };

  const loadIssues = async () => {
    setIssuesLoading(true);
    setIssuesError("");
    try {
      const data = await fetchOpenclawRiskIssues({
        page: filters.page,
        page_size: filters.pageSize,
        severity: filters.severity,
        source: filters.source,
        fix_status: filters.fixStatus,
        keyword: filters.keyword,
      });
      setIssuesData(data);
    } catch (error) {
      setIssuesError(error.message || "加载失败");
    } finally {
      setIssuesLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  useEffect(() => {
    loadIssues();
  }, [filters.page, filters.pageSize, filters.severity, filters.source, filters.fixStatus, filters.keyword]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await triggerOpenclawRiskRefresh();
      await Promise.all([loadOverview(), loadIssues()]);
    } catch (error) {
      setOverviewError(error.message || "刷新失败");
    } finally {
      setRefreshing(false);
    }
  };

  const totals = overview?.totals;
  const sourceMeta = overview?.sourceMeta;
  const scheduler = sourceMeta?.scheduler;
  const storage = sourceMeta?.storage;
  const breakdowns = useMemo(() => {
    const critical = overview?.breakdowns?.severity?.critical ?? totals?.criticalCount ?? 0;
    const high =
      overview?.breakdowns?.severity?.high ??
      totals?.highCount ??
      Math.max((totals?.highRiskCount ?? 0) - critical, 0);
    const medium = overview?.breakdowns?.severity?.medium ?? totals?.mediumCount ?? 0;
    const low = overview?.breakdowns?.severity?.low ?? totals?.lowCount ?? 0;
    const unknown = overview?.breakdowns?.severity?.unknown ?? totals?.unknownSeverityCount ?? totals?.unknownCount ?? 0;

    return {
      severity: {
        critical,
        high,
        medium,
        low,
        unknown,
      },
      sources: {
        github: overview?.breakdowns?.sources?.github ?? totals?.githubAdvisories ?? 0,
        nvd: overview?.breakdowns?.sources?.nvd ?? totals?.nvdCves ?? 0,
      },
      fixStatus: {
        fixed: overview?.breakdowns?.fixStatus?.fixed ?? overview?.fixProgress?.fixed ?? totals?.fixedCount ?? 0,
        unfixed: overview?.breakdowns?.fixStatus?.unfixed ?? overview?.fixProgress?.unfixed ?? totals?.unfixedCount ?? 0,
        unknown: overview?.breakdowns?.fixStatus?.unknown ?? overview?.fixProgress?.unknown ?? totals?.unknownCount ?? 0,
      },
    };
  }, [overview, totals]);

  return (
    <div className="oc-page">
      <div className="oc-page-header">
        <div className="oc-page-header-main">
          <div className="oc-page-tag">风险漏洞追踪</div>
          <h2 className="oc-page-title">OpenClaw 风险漏洞追踪</h2>
          <p className="oc-page-desc">
            持续跟踪 OpenClaw 漏洞、CVE 关联、修复状态与数据库快照，后端按周自动更新，前端直接读取最新持久化结果。
          </p>
          <div className="risk-toolbar">
            <button type="button" className="oc-primary-btn" onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? "刷新中..." : "立即刷新样本"}
            </button>
            <span className="risk-toolbar-meta">最近同步：{sourceMeta?.lastSyncedAt || "-"}</span>
            <span className="risk-toolbar-meta">自动周期：{scheduler?.intervalDays || 7} 天</span>
          </div>
        </div>

        <div className="oc-page-header-kpi">
          <div className="oc-kpi">
            <span className="oc-kpi-val">{overviewLoading ? "--" : totals?.totalIssues ?? 0}</span>
            <span className="oc-kpi-label">漏洞总量</span>
          </div>
          <div className="oc-kpi">
            <span className="oc-kpi-val">{overviewLoading ? "--" : totals?.highRiskCount ?? 0}</span>
            <span className="oc-kpi-label">高危漏洞</span>
          </div>
          <div className="oc-kpi">
            <span className="oc-kpi-val">{overviewLoading ? "--" : `${overview?.fixProgress?.percentFixed ?? 0}%`}</span>
            <span className="oc-kpi-label">修复进度</span>
          </div>
        </div>
      </div>

      <section className="risk-viz-grid">
        <RiskChartCard title="严重级别分布" subtitle="按漏洞严重性观察当前攻击面密度" icon={ShieldAlert}>
          <SeverityDonutChart breakdown={breakdowns?.severity} />
        </RiskChartCard>

        <RiskChartCard title="来源覆盖" subtitle="比较 GitHub 官方告警与 NVD 收录强度" icon={Radar}>
          <SourceBarChart breakdown={breakdowns?.sources} />
        </RiskChartCard>

        <RiskChartCard title="修复推进波形" subtitle="用结构化条带观察已修复、未修复与待确认" icon={Waves}>
          <div className="risk-viz-kicker">
            <strong>{overview?.fixProgress?.percentFixed ?? 0}%</strong>
            <span>当前修复完成率</span>
          </div>
          <FixProgressVisual fixProgress={breakdowns?.fixStatus} />
          <div className="risk-viz-mini-metrics">
            <div>
              <span>Critical</span>
              <strong>{totals?.criticalCount ?? 0}</strong>
            </div>
            <div>
              <span>High</span>
              <strong>{totals?.highCount ?? 0}</strong>
            </div>
            <div>
              <span>Medium+</span>
              <strong>{(totals?.mediumCount ?? 0) + (totals?.lowCount ?? 0)}</strong>
            </div>
          </div>
        </RiskChartCard>

        <RiskChartCard title="运行态势" subtitle="观察当前运行状态与快照信息" icon={Activity}>
          <div className="risk-signal-grid">
            <div className="risk-signal-card">
              <span>最新稳定版</span>
              <strong>{overview?.latestStable?.tagName || "-"}</strong>
            </div>
            <div className="risk-signal-card">
              <span>刷新状态</span>
              <strong>{scheduler?.status || "idle"}</strong>
            </div>
            <div className="risk-signal-card">
              <span>GitHub</span>
              <strong>{sourceMeta?.github?.ok ? "正常" : "异常"}</strong>
            </div>
            <div className="risk-signal-card">
              <span>NVD</span>
              <strong>{sourceMeta?.nvd?.ok ? "正常" : "异常"}</strong>
            </div>
          </div>
        </RiskChartCard>
      </section>

      <CollapsePanel title="运行状态与快照信息" defaultOpen={true}>
        {overviewError ? <div className="risk-empty">{overviewError}</div> : null}
        <div className="risk-overview-grid">
          <div className="risk-overview-card">
            <div className="risk-overview-title">当前快照</div>
            <div className="risk-overview-highlight">{storage?.snapshotKey || "-"}</div>
            <div className="risk-overview-meta is-stack">
              <span>快照 ID：{storage?.snapshotId ?? "-"}</span>
              <span>缓存目录：{storage?.cacheDir || storage?.cacheRoot || "-"}</span>
            </div>
          </div>

          <div className="risk-overview-card">
            <div className="risk-overview-title">版本与修复</div>
            <div className="risk-overview-highlight">{overview?.latestStable?.tagName || "-"}</div>
            <div className="risk-overview-meta is-stack">
              <span>已修复：{overview?.fixProgress?.fixed ?? 0}</span>
              <span>未修复：{overview?.fixProgress?.unfixed ?? 0}</span>
              <span>待确认：{overview?.fixProgress?.unknown ?? 0}</span>
            </div>
          </div>

          <div className="risk-overview-card">
            <div className="risk-overview-title">调度器与来源</div>
            <div className="risk-overview-meta is-stack">
              <span>调度状态：{scheduler?.status || "idle"}</span>
              <span>最近完成：{formatDate(scheduler?.lastCompletedAt)}</span>
              <span>GitHub：{sourceMeta?.github?.ok ? "正常" : sourceMeta?.github?.error || "异常"}</span>
              <span>NVD：{sourceMeta?.nvd?.ok ? "正常" : sourceMeta?.nvd?.error || "异常"}</span>
            </div>
          </div>
        </div>
      </CollapsePanel>

      <CollapsePanel title="最新漏洞" defaultOpen={true}>
        <div className="risk-issue-grid">
          {(overview?.latest || []).map((issue) => (
            <FeedCard key={`latest-${issue.canonicalId || issue.id}`} issue={issue} />
          ))}
          {!overviewLoading && !(overview?.latest || []).length ? <div className="risk-empty">暂无最新漏洞数据。</div> : null}
        </div>
      </CollapsePanel>

      <CollapsePanel title="高危漏洞" defaultOpen={true}>
        <div className="risk-issue-grid">
          {(overview?.highRisk || []).map((issue) => (
            <FeedCard key={`high-${issue.canonicalId || issue.id}`} issue={issue} />
          ))}
          {!overviewLoading && !(overview?.highRisk || []).length ? <div className="risk-empty">暂无高危漏洞数据。</div> : null}
        </div>
      </CollapsePanel>

      <CollapsePanel title="漏洞样本明细" defaultOpen={true}>
        <div className="risk-filter-bar">
          <select value={filters.severity} onChange={(event) => setFilters((prev) => ({ ...prev, page: 1, severity: event.target.value }))}>
            {SEVERITY_OPTIONS.map((option) => (
              <option key={option.value || "all-severity"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select value={filters.source} onChange={(event) => setFilters((prev) => ({ ...prev, page: 1, source: event.target.value }))}>
            {SOURCE_OPTIONS.map((option) => (
              <option key={option.value || "all-source"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select value={filters.fixStatus} onChange={(event) => setFilters((prev) => ({ ...prev, page: 1, fixStatus: event.target.value }))}>
            {FIX_STATUS_OPTIONS.map((option) => (
              <option key={option.value || "all-fix"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            className="oc-input"
            placeholder="搜索 CVE / GHSA / 标题关键词"
            value={filters.keyword}
            onChange={(event) => setFilters((prev) => ({ ...prev, page: 1, keyword: event.target.value }))}
          />
        </div>

        {issuesError ? <div className="risk-empty">{issuesError}</div> : null}

        <div className="risk-table-wrap">
          <table className="risk-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>摘要</th>
                <th>来源</th>
                <th>等级</th>
                <th>CVSS</th>
                <th>修复状态</th>
                <th>修复版本</th>
                <th>发布时间</th>
              </tr>
            </thead>
            <tbody>
              {(issuesData?.rows || []).map((issue) => (
                <tr key={issue.canonicalId || issue.id}>
                  <td className="risk-table-id">{issue.id}</td>
                  <td>
                    <div className="risk-table-title">{issue.title}</div>
                    <div className="risk-table-sub">{issue.summary || "-"}</div>
                  </td>
                  <td>
                    <div className="risk-table-badge-row">
                      {(issue.sourceLabels?.length ? issue.sourceLabels : ["-"]).map((label) => (
                        <SourceBadge key={`${issue.id}-${label}`} value={label} />
                      ))}
                    </div>
                  </td>
                  <td>
                    <RiskBadge tone={issue.severity}>{String(issue.severity || "unknown").toUpperCase()}</RiskBadge>
                  </td>
                  <td>{issue.score ?? "-"}</td>
                  <td>
                    <div className="risk-table-badge-row">
                      <RiskBadge tone={issue.fixState?.status}>{issue.fixState?.label || "-"}</RiskBadge>
                    </div>
                    <div className="risk-table-sub">{issue.fixState?.reason || ""}</div>
                  </td>
                  <td>{issue.fixedVersion || "-"}</td>
                  <td>{formatDate(issue.publishedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!issuesLoading && !(issuesData?.rows || []).length ? <div className="risk-empty">当前筛选条件下没有结果。</div> : null}
        </div>

        {!issuesLoading && (issuesData?.total ?? 0) > 0 ? (
          <TablePager
            page={filters.page}
            pageSize={filters.pageSize}
            total={issuesData?.total ?? 0}
            onPage={(nextPage) => setFilters((prev) => ({ ...prev, page: nextPage }))}
            onPageSize={(nextPageSize) => setFilters((prev) => ({ ...prev, page: 1, pageSize: nextPageSize }))}
          />
        ) : null}
      </CollapsePanel>
    </div>
  );
}
