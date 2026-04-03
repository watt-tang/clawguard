import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, RefreshCw } from "lucide-react";
import { PAGE_SIZE_OPTIONS } from "../../../config.js";
import {
  fetchSecurityResearchOverview,
  fetchSecurityResearchPapers,
  triggerSecurityResearchRefresh,
} from "../services/dataService.js";

const SOURCE_TYPE_OPTIONS = [
  { label: "全部来源", value: "" },
  { label: "顶会论文", value: "conference_paper" },
  { label: "预印本", value: "preprint" },
];

const SORT_OPTIONS = [
  { label: "时间倒序", value: "published_desc" },
  { label: "时间正序", value: "published_asc" },
  { label: "相关性优先", value: "relevance_desc" },
];

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toISOString().slice(0, 10);
}

function Badge({ tone = "neutral", children }) {
  return <span className={`research-badge research-badge-${tone}`}>{children}</span>;
}

function SourceTypeBadge({ sourceType, isTopVenue }) {
  if (sourceType === "conference_paper" || isTopVenue) {
    return <Badge tone="top">顶会</Badge>;
  }
  return <Badge tone="preprint">预印本</Badge>;
}

function Pager({ page, pageSize, total, onPage, onPageSize }) {
  const totalPages = Math.max(1, Math.ceil(Math.max(total, 1) / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const pageNums = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
    const nums = new Set([1, totalPages, page]);
    for (let delta = -2; delta <= 2; delta += 1) {
      const next = page + delta;
      if (next >= 1 && next <= totalPages) nums.add(next);
    }
    return Array.from(nums).sort((a, b) => a - b);
  }, [page, totalPages]);

  return (
    <div className="research-pager">
      <span className="research-pager-info">
        共 {total.toLocaleString("zh-CN")} 条，当前第 {page} / {totalPages} 页
      </span>
      <div className="research-pager-actions">
        <button type="button" className="research-pager-btn" disabled={!canPrev} onClick={() => onPage(page - 1)}>
          <ChevronLeft size={14} />
        </button>
        {pageNums.map((pageNum, index) => {
          const prev = pageNums[index - 1];
          const hasGap = prev && pageNum - prev > 1;
          return (
            <span key={pageNum} className="research-pager-seq">
              {hasGap ? <span className="research-pager-ellipsis">...</span> : null}
              <button
                type="button"
                className={`research-pager-btn${pageNum === page ? " is-active" : ""}`}
                onClick={() => onPage(pageNum)}
              >
                {pageNum}
              </button>
            </span>
          );
        })}
        <button type="button" className="research-pager-btn" disabled={!canNext} onClick={() => onPage(page + 1)}>
          <ChevronRight size={14} />
        </button>
        <select className="research-select" value={pageSize} onChange={(event) => onPageSize(Number(event.target.value))}>
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size} / 页
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function HighlightCard({ paper }) {
  return (
    <article className="research-highlight-card">
      <div className="research-highlight-top">
        <div className="research-highlight-badges">
          <SourceTypeBadge sourceType={paper.sourceType} isTopVenue={paper.isTopVenue} />
          <Badge tone="venue">{paper.venue}</Badge>
        </div>
        <span className="research-highlight-date">{formatDate(paper.publishedAt)}</span>
      </div>
      <h3 className="research-highlight-title">{paper.title}</h3>
      <p className="research-highlight-summary">{paper.abstractOrSummary}</p>
      <div className="research-highlight-meta">
        <span>{paper.projectScope}</span>
        <span>相关度 {paper.relevanceScore}</span>
      </div>
    </article>
  );
}

export default function SecurityResearchPage() {
  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState("");
  const [papersData, setPapersData] = useState(null);
  const [papersLoading, setPapersLoading] = useState(true);
  const [papersError, setPapersError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: PAGE_SIZE_OPTIONS[0],
    sourceType: "",
    venue: "",
    projectScope: "",
    keyword: "",
    sort: "published_desc",
  });

  async function loadOverview() {
    setOverviewLoading(true);
    setOverviewError("");
    try {
      const data = await fetchSecurityResearchOverview();
      setOverview(data);
    } catch (error) {
      setOverviewError(error.message || "加载失败");
    } finally {
      setOverviewLoading(false);
    }
  }

  async function loadPapers() {
    setPapersLoading(true);
    setPapersError("");
    try {
      const data = await fetchSecurityResearchPapers({
        page: filters.page,
        page_size: filters.pageSize,
        source_type: filters.sourceType,
        venue: filters.venue,
        project_scope: filters.projectScope,
        keyword: filters.keyword,
        sort: filters.sort,
      });
      setPapersData(data);
    } catch (error) {
      setPapersError(error.message || "加载失败");
    } finally {
      setPapersLoading(false);
    }
  }

  useEffect(() => {
    loadOverview();
  }, []);

  useEffect(() => {
    loadPapers();
  }, [filters.page, filters.pageSize, filters.sourceType, filters.venue, filters.projectScope, filters.keyword, filters.sort]);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await triggerSecurityResearchRefresh();
      await Promise.all([loadOverview(), loadPapers()]);
    } catch (error) {
      setOverviewError(error.message || "刷新失败");
    } finally {
      setRefreshing(false);
    }
  }

  const venues = papersData?.filterOptions?.venues || [];
  const projectScopes = papersData?.filterOptions?.projectScopes || [];
  const totals = overview?.totals;
  const sourceMeta = overview?.sourceMeta;
  const scheduler = sourceMeta?.scheduler;

  return (
    <div className="oc-page research-page">
      <section className="research-hero">
        <div className="research-hero-main">
          <div className="oc-page-tag">学术进展页面</div>
          <h2 className="oc-page-title">安全研究前沿</h2>
          <p className="oc-page-desc">
            面向 OpenClaw / Claw / Skill / Plugin / Agent 生态的学术研究情报面板，自动聚合顶会论文与 arXiv 预印本，
            支持生态安全分析、关键词筛选和时间排序。
          </p>
          <div className="research-toolbar">
            <button type="button" className="oc-primary-btn" disabled={refreshing} onClick={handleRefresh}>
              <RefreshCw size={14} />
              <span>{refreshing ? "刷新中..." : "立即更新"}</span>
            </button>
            <span className="research-toolbar-meta">最近同步：{sourceMeta?.lastSyncedAt || "-"}</span>
            <span className="research-toolbar-meta">自动周期：{scheduler?.intervalDays || 7} 天</span>
          </div>
          {overviewError ? <div className="research-error">{overviewError}</div> : null}
        </div>

        <div className="research-kpi-grid">
          <div className="research-kpi-card">
            <strong>{overviewLoading ? "--" : totals?.totalPapers ?? 0}</strong>
            <span>论文总量</span>
          </div>
          <div className="research-kpi-card">
            <strong>{overviewLoading ? "--" : totals?.conferencePaperCount ?? 0}</strong>
            <span>顶会论文</span>
          </div>
          <div className="research-kpi-card">
            <strong>{overviewLoading ? "--" : totals?.preprintCount ?? 0}</strong>
            <span>预印本</span>
          </div>
          <div className="research-kpi-card">
            <strong>{overviewLoading ? "--" : totals?.agent ?? 0}</strong>
            <span>Agent 相关</span>
          </div>
        </div>
      </section>

      <section className="research-panel">
        <div className="research-panel-header">
          <h3>重点研究</h3>
          <span>顶会优先，按相关度和时间综合展示</span>
        </div>
        <div className="research-highlight-grid">
          {(overview?.featured || []).map((paper) => (
            <HighlightCard key={paper.id} paper={paper} />
          ))}
          {!overviewLoading && !(overview?.featured || []).length ? <div className="research-empty">暂无重点研究数据。</div> : null}
        </div>
      </section>

      <section className="research-panel">
        <div className="research-panel-header">
          <h3>生态分析</h3>
          <span>可快速观察当前研究集中在哪些生态对象与来源</span>
        </div>
        <div className="research-analysis-grid">
          <div className="research-analysis-card">
            <div className="research-analysis-title">范围分布</div>
            <div className="research-chip-row">
              <Badge tone="scope">openclaw {totals?.openclaw ?? 0}</Badge>
              <Badge tone="scope">claw {totals?.claw ?? 0}</Badge>
              <Badge tone="scope">skill {totals?.skill ?? 0}</Badge>
              <Badge tone="scope">agent {totals?.agent ?? 0}</Badge>
              <Badge tone="scope">plugin {totals?.plugin ?? 0}</Badge>
            </div>
          </div>
          <div className="research-analysis-card">
            <div className="research-analysis-title">来源状态</div>
            <div className="research-analysis-stack">
              <span>Crossref：{sourceMeta?.providers?.crossref?.ok ? "正常" : sourceMeta?.providers?.crossref?.error || "异常"}</span>
              <span>arXiv：{sourceMeta?.providers?.arxiv?.ok ? "正常" : sourceMeta?.providers?.arxiv?.error || "异常"}</span>
              <span>DBLP：预留接口</span>
              <span>Google Scholar：预留接口</span>
            </div>
          </div>
          <div className="research-analysis-card">
            <div className="research-analysis-title">会议分布</div>
            <div className="research-chip-row">
              {(overview?.venues || []).map((item) => (
                <Badge key={item.venue} tone="venue">
                  {item.venue} {item.count}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="research-panel">
        <div className="research-panel-header">
          <h3>论文列表</h3>
          <span>支持关键词筛选、时间排序和来源区分</span>
        </div>

        <div className="research-filter-bar">
          <select
            className="research-select"
            value={filters.sourceType}
            onChange={(event) => setFilters((prev) => ({ ...prev, page: 1, sourceType: event.target.value }))}
          >
            {SOURCE_TYPE_OPTIONS.map((option) => (
              <option key={option.value || "all-source"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            className="research-select"
            value={filters.venue}
            onChange={(event) => setFilters((prev) => ({ ...prev, page: 1, venue: event.target.value }))}
          >
            <option value="">全部会议</option>
            {venues.map((venue) => (
              <option key={venue} value={venue}>
                {venue}
              </option>
            ))}
          </select>

          <select
            className="research-select"
            value={filters.projectScope}
            onChange={(event) => setFilters((prev) => ({ ...prev, page: 1, projectScope: event.target.value }))}
          >
            <option value="">全部范围</option>
            {projectScopes.map((scope) => (
              <option key={scope} value={scope}>
                {scope}
              </option>
            ))}
          </select>

          <select
            className="research-select"
            value={filters.sort}
            onChange={(event) => setFilters((prev) => ({ ...prev, page: 1, sort: event.target.value }))}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <input
            className="research-input"
            placeholder="搜索标题 / 摘要 / 标签关键词"
            value={filters.keyword}
            onChange={(event) => setFilters((prev) => ({ ...prev, page: 1, keyword: event.target.value }))}
          />
        </div>

        {papersError ? <div className="research-error">{papersError}</div> : null}

        <div className="research-table-wrap">
          <table className="research-table">
            <thead>
              <tr>
                <th>论文</th>
                <th>来源</th>
                <th>范围</th>
                <th>时间</th>
                <th>标签</th>
                <th>链接</th>
              </tr>
            </thead>
            <tbody>
              {(papersData?.rows || []).map((paper) => (
                <tr key={paper.id}>
                  <td>
                    <div className="research-paper-title">{paper.title}</div>
                    <div className="research-paper-summary">{paper.abstractOrSummary}</div>
                    <div className="research-paper-authors">{(paper.authors || []).join(", ") || "-"}</div>
                  </td>
                  <td>
                    <div className="research-chip-row">
                      <SourceTypeBadge sourceType={paper.sourceType} isTopVenue={paper.isTopVenue} />
                      <Badge tone="venue">{paper.venue}</Badge>
                    </div>
                  </td>
                  <td>
                    <Badge tone="scope">{paper.projectScope}</Badge>
                  </td>
                  <td>{formatDate(paper.publishedAt)}</td>
                  <td>
                    <div className="research-chip-row">
                      {(paper.tags || []).slice(0, 6).map((tag) => (
                        <Badge key={`${paper.id}-${tag}`} tone="tag">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td>
                    {paper.sourceUrl ? (
                      <a className="research-link" href={paper.sourceUrl} target="_blank" rel="noreferrer">
                        <ExternalLink size={14} />
                        <span>查看</span>
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!papersLoading && !(papersData?.rows || []).length ? <div className="research-empty">当前筛选条件下暂无结果。</div> : null}
        </div>

        {!papersLoading && (papersData?.total ?? 0) > 0 ? (
          <Pager
            page={filters.page}
            pageSize={filters.pageSize}
            total={papersData?.total ?? 0}
            onPage={(nextPage) => setFilters((prev) => ({ ...prev, page: nextPage }))}
            onPageSize={(nextPageSize) => setFilters((prev) => ({ ...prev, page: 1, pageSize: nextPageSize }))}
          />
        ) : null}
      </section>
    </div>
  );
}
