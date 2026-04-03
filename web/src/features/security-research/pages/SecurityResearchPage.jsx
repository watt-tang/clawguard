import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
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
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toISOString().slice(0, 10);
}

function compactSummary(value = "", maxLength = 220) {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();
  if (!normalized) return "-";
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trim()}...`;
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

function ProviderBadge({ provider }) {
  const toneMap = {
    online: "top",
    rate_limited: "preprint",
    error: "danger",
    manual: "scope",
  };
  const textMap = {
    online: "已接通",
    rate_limited: "限流",
    error: "异常",
    manual: "待合规接入",
  };

  return <Badge tone={toneMap[provider.status] || "scope"}>{textMap[provider.status] || "未知状态"}</Badge>;
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
      <p className="research-highlight-summary" title={paper.abstractOrSummary}>
        {compactSummary(paper.abstractOrSummary, 200)}
      </p>
      <div className="research-highlight-meta">
        <span>{paper.projectScope}</span>
        <span>相关度 {paper.relevanceScore}</span>
      </div>
    </article>
  );
}

function ProviderCard({ providerKey, provider }) {
  return (
    <article className={`research-provider-card is-${provider.status || "unknown"}`}>
      <div className="research-provider-head">
        <div>
          <div className="research-provider-name">{provider.name || providerKey}</div>
          <div className="research-provider-subtitle">{provider.note || "暂无说明"}</div>
        </div>
        <ProviderBadge provider={provider} />
      </div>
      <div className="research-provider-metrics">
        <div className="research-provider-metric">
          <span>本次入库</span>
          <strong>{provider.count ?? 0}</strong>
        </div>
        <div className="research-provider-metric">
          <span>接入方式</span>
          <strong>{provider.enabled ? "自动" : "外部方案"}</strong>
        </div>
      </div>
      {provider.error ? <div className="research-provider-error">{provider.error}</div> : null}
      {provider.recommendation ? <div className="research-provider-tip">{provider.recommendation}</div> : null}
    </article>
  );
}

function FilterField({ id, label, children }) {
  return (
    <label className="research-filter-field" htmlFor={id}>
      <span className="research-filter-label">{label}</span>
      {children}
    </label>
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
    void loadOverview();
  }, []);

  useEffect(() => {
    void loadPapers();
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
  const providers = Object.entries(sourceMeta?.providers || {});
  const keywords = sourceMeta?.keywords || [];
  const latestPapers = overview?.latest || [];

  return (
    <div className="oc-page research-page">
      <section className="research-hero">
        <div className="research-hero-main">
          <div className="oc-page-tag">学术进展页面</div>
          <h2 className="oc-page-title">安全研究情报台</h2>
          <p className="oc-page-desc">
            自动聚合 OpenClaw / Claw / Skill / Plugin / Agent 生态安全研究，优先展示白名单顶会论文，并将 arXiv
            严格标记为预印本，方便做生态安全分析与研究跟踪。
          </p>

          <div className="research-toolbar">
            <button type="button" className="oc-primary-btn" disabled={refreshing} onClick={handleRefresh}>
              <RefreshCw size={14} />
              <span>{refreshing ? "更新中..." : "立即更新"}</span>
            </button>
            <span className="research-toolbar-meta">最近同步：{sourceMeta?.lastSyncedAt || "-"}</span>
            <span className="research-toolbar-meta">自动更新周期：{scheduler?.intervalDays || 7} 天</span>
          </div>

          <div className="research-keyword-cloud">
            {keywords.map((keyword) => (
              <button
                key={keyword}
                type="button"
                className={`research-keyword-chip${filters.keyword === keyword ? " is-active" : ""}`}
                onClick={() => setFilters((prev) => ({ ...prev, page: 1, keyword }))}
              >
                {keyword}
              </button>
            ))}
          </div>

          <div className="research-live-note" aria-live="polite">
            {overviewError || papersError || "接口状态已同步到下方数据源面板，限流与未接入源会显示原因和解决方案。"}
          </div>
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
          <h3>数据源状态</h3>
          <span>区分已接通、限流和待合规接入的数据源</span>
        </div>
        <div className="research-provider-grid">
          {providers.map(([providerKey, provider]) => (
            <ProviderCard key={providerKey} providerKey={providerKey} provider={provider} />
          ))}
        </div>
      </section>

      <section className="research-panel">
        <div className="research-panel-header">
          <h3>重点研究</h3>
          <span>顶会优先，按相关度与时间综合排序</span>
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
          <span>快速观察研究聚焦范围、会议来源和最新动态</span>
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
            <div className="research-mini-bars">
              {[
                ["OpenClaw", totals?.openclaw ?? 0],
                ["Claw", totals?.claw ?? 0],
                ["Skill", totals?.skill ?? 0],
                ["Agent", totals?.agent ?? 0],
                ["Plugin", totals?.plugin ?? 0],
              ].map(([label, value]) => {
                const maxValue = Math.max(
                  totals?.openclaw ?? 0,
                  totals?.claw ?? 0,
                  totals?.skill ?? 0,
                  totals?.agent ?? 0,
                  totals?.plugin ?? 0,
                  1,
                );
                const width = `${Math.max(10, Math.round((Number(value) / maxValue) * 100))}%`;
                return (
                  <div key={label} className="research-mini-bar-row">
                    <span>{label}</span>
                    <div className="research-mini-bar-track">
                      <div className="research-mini-bar-fill" style={{ width }} />
                    </div>
                    <strong>{value}</strong>
                  </div>
                );
              })}
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
            <div className="research-venue-list">
              {(overview?.venues || []).map((item) => (
                <div key={`venue-${item.venue}`} className="research-venue-item">
                  <span>{item.venue}</span>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="research-analysis-card">
            <div className="research-analysis-title">最新入库</div>
            <div className="research-latest-list">
              {latestPapers.slice(0, 5).map((paper) => (
                <div key={paper.id} className="research-latest-item">
                  <div className="research-latest-icon">
                    {paper.sourceType === "conference_paper" ? <Sparkles size={14} /> : <BookOpen size={14} />}
                  </div>
                  <div className="research-latest-copy">
                    <strong>{paper.title}</strong>
                    <span>
                      {paper.venue} · {formatDate(paper.publishedAt)}
                    </span>
                  </div>
                </div>
              ))}
              {!latestPapers.length ? <div className="research-empty">暂无最新动态。</div> : null}
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
          <FilterField id="research-source-type" label="来源类型">
            <select
              id="research-source-type"
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
          </FilterField>

          <FilterField id="research-venue" label="会议 / 来源">
            <select
              id="research-venue"
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
          </FilterField>

          <FilterField id="research-scope" label="项目范围">
            <select
              id="research-scope"
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
          </FilterField>

          <FilterField id="research-sort" label="排序方式">
            <select
              id="research-sort"
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
          </FilterField>

          <FilterField id="research-keyword" label="关键词">
            <div className="research-search-wrap">
              <Search size={15} className="research-search-icon" />
              <input
                id="research-keyword"
                className="research-input research-input-search"
                placeholder="搜索标题 / 摘要 / 标签"
                value={filters.keyword}
                onChange={(event) => setFilters((prev) => ({ ...prev, page: 1, keyword: event.target.value }))}
              />
            </div>
          </FilterField>
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
                    <div className="research-paper-summary" title={paper.abstractOrSummary}>
                      {compactSummary(paper.abstractOrSummary, 260)}
                    </div>
                    <div className="research-paper-authors">{(paper.authors || []).join(", ") || "-"}</div>
                  </td>
                  <td>
                    <div className="research-chip-row">
                      <SourceTypeBadge sourceType={paper.sourceType} isTopVenue={paper.isTopVenue} />
                      <Badge tone="venue">{paper.venue}</Badge>
                      {paper.sourcePrimary ? <Badge tone="tag">{paper.sourcePrimary}</Badge> : null}
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
          {papersLoading ? <div className="research-empty">论文列表加载中...</div> : null}
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

      <section className="research-panel research-panel-footnote">
        <div className="research-footnote">
          <Zap size={16} />
          <span>
            当前学术页已打通 `Crossref`、`DBLP`、`arXiv`。`Google Scholar`
            未做直接抓取，如需接入建议使用合规检索服务或人工导入管线接到现有标准化流程。
          </span>
        </div>
      </section>
    </div>
  );
}
