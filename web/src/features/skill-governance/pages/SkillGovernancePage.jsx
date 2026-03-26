import { useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Box,
  FileArchive,
  FileCode2,
  FileSearch,
  FolderOpen,
  LoaderCircle,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { scanSkillBySlug, scanSkillFiles } from "../services/skillScanService.js";

const TABS = [
  { id: "intelligence", label: "基础情报" },
  { id: "sandbox", label: "文件沙箱" },
  { id: "skill-detect", label: "Skill 扫描", badge: "NEW" },
];

const SOURCE_OPTIONS = [
  { id: "zip", title: "Skill 压缩包", desc: "适合上传完整发布包或导出的样本。", icon: FileArchive, accept: ".zip", multiple: true },
  { id: "manifest", title: "SKILL.md / 清单文件", desc: "适合快速检查说明、配置和清单文件。", icon: FileCode2, accept: ".md,.txt,.json,.yaml,.yml", multiple: true },
  { id: "folder", title: "目录上传", desc: "适合直接扫描本地 Skill 工程目录。", icon: FolderOpen, accept: "", multiple: true, directory: true },
];

const SEVERITY_ORDER = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"];
const SEVERITY_LABELS = { CRITICAL: "严重", HIGH: "高危", MEDIUM: "中危", LOW: "低危", INFO: "提示", SAFE: "安全", UNKNOWN: "未知" };
const SEVERITY_RANK = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, INFO: 4, SAFE: 5, UNKNOWN: 6 };
const RUN_STATE_LABELS = { completed: "已完成", skipped: "已跳过", failed: "执行失败", unavailable: "不可用" };
const MODE_LABELS = { guest: "访客模式", authenticated: "登录模式" };
const CONCLUSION_META = {
  block: { tone: "critical", badge: "建议阻断", title: "发现高危风险，建议先阻断", desc: "本轮结果已出现严重风险信号，建议先隔离样本，再决定是否继续安装、上线或分发。" },
  manual_review_required: { tone: "high", badge: "人工复核", title: "存在高危结果，需要优先复核", desc: "已有高危发现命中，建议先确认风险类别、命中文件和触发扫描器，再推进后续处置。" },
  review_recommended: { tone: "medium", badge: "建议核验", title: "发现中风险线索，建议继续审查", desc: "当前更适合结合上下文继续判断，优先复核外链、脚本行为和权限请求。" },
  allow_with_caution: { tone: "low", badge: "谨慎放行", title: "整体风险较低，但仍建议保留关注", desc: "聚合结果未达到阻断阈值，建议保留审计记录，并对关键文件做抽样复核。" },
  partial_result: { tone: "medium", badge: "结果不完整", title: "部分扫描器未成功执行", desc: "当前报告可用于初步判断，但建议补齐失败或不可用的扫描器后再形成最终结论。" },
  clear: { tone: "clean", badge: "通过初筛", title: "未形成明确风险结论", desc: "本轮统一扫描未发现明确风险结论，但关键脚本、依赖来源和外链仍建议人工抽查。" },
};

function formatBytes(value) {
  if (!value && value !== 0) return "--";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(2)} MB`;
}

function formatScanTime(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function formatDurationMs(value) {
  const durationMs = Number(value);
  if (!Number.isFinite(durationMs) || durationMs < 0) return "--";
  if (durationMs < 1000) return `${Math.round(durationMs)} ms`;

  const totalSeconds = durationMs / 1000;
  if (totalSeconds < 60) {
    return totalSeconds < 10 ? `${totalSeconds.toFixed(1)} 秒` : `${Math.round(totalSeconds)} 秒`;
  }

  const totalMinutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  if (totalMinutes < 60) {
    return seconds > 0 ? `${totalMinutes} 分 ${seconds} 秒` : `${totalMinutes} 分`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours} 小时 ${minutes} 分` : `${hours} 小时`;
}

function resolveRunDurationMs(run) {
  const directDuration = Number(run?.duration_ms);
  if (Number.isFinite(directDuration) && directDuration >= 0) {
    return directDuration;
  }

  if (!run?.started_at || !run?.completed_at) {
    return null;
  }

  const startedAt = new Date(run.started_at).getTime();
  const completedAt = new Date(run.completed_at).getTime();
  if (!Number.isFinite(startedAt) || !Number.isFinite(completedAt) || completedAt < startedAt) {
    return null;
  }

  return completedAt - startedAt;
}

function getRunDurationLabel(run) {
  const state = String(run?.state || "").toLowerCase();
  const durationMs = resolveRunDurationMs(run);

  if (durationMs !== null) {
    return `参考用时 ${formatDurationMs(durationMs)}`;
  }

  if (state === "skipped" || state === "unavailable") {
    return "未执行";
  }

  if (state === "failed") {
    return "耗时未知";
  }

  return "统计中";
}

function normalizeSeverity(value) {
  const severity = String(value || "").trim().toUpperCase();
  return Object.hasOwn(SEVERITY_LABELS, severity) ? severity : "UNKNOWN";
}

function inferType(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".zip")) return "压缩包";
  if (name.endsWith(".md")) return "Markdown";
  if (name.endsWith(".json") || name.endsWith(".yaml") || name.endsWith(".yml")) return "配置文件";
  return "普通文件";
}

function makeUploadRecords(fileList, sourceId) {
  return Array.from(fileList).map((file) => ({
    id: `${sourceId}-${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
    name: file.name,
    size: file.size,
    path: file.webkitRelativePath || "",
    sourceId,
    type: inferType(file),
    file,
    updatedAt: new Date().toLocaleString("zh-CN", { hour12: false }),
  }));
}

function getTopSeverity(summary = {}) {
  return SEVERITY_ORDER.find((severity) => (summary[severity] ?? 0) > 0) || null;
}

function getCategoryHighlights(findings) {
  const grouped = new Map();
  findings.forEach((item) => {
    const category = item.category || "未分类";
    const severity = normalizeSeverity(item.severity);
    const current = grouped.get(category);
    if (current) {
      current.count += 1;
      if (SEVERITY_RANK[severity] < SEVERITY_RANK[current.severity]) current.severity = severity;
      return;
    }
    grouped.set(category, { category, count: 1, severity });
  });
  return Array.from(grouped.values())
    .sort((left, right) => {
      const severityDiff = SEVERITY_RANK[left.severity] - SEVERITY_RANK[right.severity];
      if (severityDiff !== 0) return severityDiff;
      return right.count - left.count;
    })
    .slice(0, 4);
}

function SeverityBadge({ severity }) {
  const level = normalizeSeverity(severity);
  return <span className={`skill-severity-badge is-${level.toLowerCase()}`}>{SEVERITY_LABELS[level] || level}</span>;
}

function RunStateBadge({ state }) {
  const value = String(state || "unavailable").toLowerCase();
  return <span className={`skill-run-state-badge is-${value}`}>{RUN_STATE_LABELS[value] || value}</span>;
}

function SkillDetectWorkspace({ auth }) {
  const isAuthenticated = Boolean(auth?.isLoggedIn);
  const authState = isAuthenticated ? "authenticated" : "guest";
  const [uploads, setUploads] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dragging, setDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSource, setScanSource] = useState("");
  const [scanError, setScanError] = useState("");
  const [scanReport, setScanReport] = useState(null);
  const [runtimeConfig, setRuntimeConfig] = useState({
    deepseekApiKey: "",
    deepseekModel: "deepseek-chat",
    deepseekBaseUrl: "https://api.deepseek.com/v1",
  });

  const zipInputRef = useRef(null);
  const manifestInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const multiInputRef = useRef(null);

  const totalSize = useMemo(() => uploads.reduce((sum, item) => sum + item.size, 0), [uploads]);
  const summary = scanReport?.summary || {};
  const scannerRuns = Array.isArray(scanReport?.scanner_runs) ? scanReport.scanner_runs : [];
  const findings = Array.isArray(scanReport?.findings) ? scanReport.findings : [];
  const severitySummary = summary.findings_by_severity || {};
  const findingsCount = summary.deduplicated_finding_count ?? findings.length;
  const rawFindingsCount = summary.raw_finding_count ?? findings.length;
  const visibleFindings = findings.slice(0, 200);
  const resultMeta = CONCLUSION_META[summary.overall_conclusion] || CONCLUSION_META.clear;
  const topSeverity = getTopSeverity(severitySummary);
  const categoryHighlights = useMemo(() => getCategoryHighlights(findings), [findings]);
  const affectedFileCount = useMemo(() => new Set(findings.map((item) => item.file_path).filter(Boolean)).size, [findings]);
  const totalDurationLabel = useMemo(() => formatDurationMs(scanReport?.duration_ms), [scanReport?.duration_ms]);
  const lockedScannerCount = useMemo(
    () => scannerRuns.filter((item) => item.state === "skipped" && String(item.skipped_reason || "").includes("authenticated")).length,
    [scannerRuns],
  );

  function buildScanOptions() {
    return {
      authState,
      language: "zh",
      timeoutMs: 300000,
      ...(isAuthenticated
        ? {
            deepseekApiKey: runtimeConfig.deepseekApiKey,
            deepseekModel: runtimeConfig.deepseekModel,
            deepseekBaseUrl: runtimeConfig.deepseekBaseUrl,
          }
        : {}),
    };
  }

  function appendUploads(fileList, sourceId) {
    if (!fileList?.length) return;
    setUploads((current) => [...makeUploadRecords(fileList, sourceId), ...current]);
  }

  function updateRuntimeConfig(field, value) {
    setRuntimeConfig((current) => ({ ...current, [field]: value }));
  }

  async function handleScanUploads() {
    if (!uploads.length) {
      setScanError("请先上传至少一个 Skill 文件或目录。");
      return;
    }

    setIsScanning(true);
    setScanSource("upload");
    setScanError("");
    try {
      const report = await scanSkillFiles(uploads, buildScanOptions());
      setScanReport(report);
    } catch (error) {
      setScanReport(null);
      setScanError(error instanceof Error ? error.message : "扫描失败，请重试。");
    } finally {
      setIsScanning(false);
    }
  }

  async function handleScanBySlug() {
    const slug = searchText.trim();
    if (!slug) {
      setScanError("请输入 Skill slug 后再扫描。");
      return;
    }

    setIsScanning(true);
    setScanSource("slug");
    setScanError("");
    try {
      const report = await scanSkillBySlug(slug, "", buildScanOptions());
      setScanReport(report);
    } catch (error) {
      setScanReport(null);
      setScanError(error instanceof Error ? error.message : "扫描失败，请重试。");
    } finally {
      setIsScanning(false);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    appendUploads(event.dataTransfer.files, "drag");
  }

  function removeUpload(id) {
    setUploads((current) => current.filter((item) => item.id !== id));
  }

  return (
    <section className="skill-detect-shell">
      <div className="skill-detect-grid">
        <div className="skill-upload-card">
          <div
            className={`skill-dropzone${dragging ? " is-dragging" : ""}`}
            onDragEnter={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setDragging(false);
            }}
            onDrop={handleDrop}
            onClick={() => multiInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                multiInputRef.current?.click();
              }
            }}
          >
            <div className="skill-dropzone-icon">
              <UploadCloud size={28} strokeWidth={1.8} />
            </div>
            <div className="skill-dropzone-title">点击或拖拽上传待扫描 Skill 样本</div>
            <div className="skill-dropzone-desc">
              支持压缩包、清单文件和工程目录。系统会自动识别样本类型，并按当前模式调度可用扫描器。
            </div>
            <div className="skill-dropzone-actions">
              <button className="oc-primary-btn" type="button" onClick={(event) => { event.stopPropagation(); multiInputRef.current?.click(); }}>
                选择文件
              </button>
              <button className="oc-ghost-btn" type="button" onClick={(event) => { event.stopPropagation(); folderInputRef.current?.click(); }}>
                上传目录
              </button>
            </div>
            <input
              ref={multiInputRef}
              className="skill-hidden-input"
              type="file"
              multiple
              accept=".zip,.md,.txt,.json,.yaml,.yml"
              onChange={(event) => appendUploads(event.target.files, "multi")}
            />
          </div>

          <div className="skill-source-grid">
            {SOURCE_OPTIONS.map((option) => {
              const Icon = option.icon;
              const ref = option.id === "zip" ? zipInputRef : option.id === "manifest" ? manifestInputRef : folderInputRef;
              return (
                <button key={option.id} type="button" className="skill-source-card" onClick={() => ref.current?.click()}>
                  <div className="skill-source-icon">
                    <Icon size={18} strokeWidth={1.8} />
                  </div>
                  <div className="skill-source-copy">
                    <div className="skill-source-title">{option.title}</div>
                    <div className="skill-source-desc">{option.desc}</div>
                  </div>
                  <input
                    ref={ref}
                    className="skill-hidden-input"
                    type="file"
                    accept={option.accept}
                    multiple={option.multiple}
                    onChange={(event) => appendUploads(event.target.files, option.id)}
                    {...(option.directory ? { webkitdirectory: "true", directory: "true" } : {})}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="skill-search-card">
          <div className="skill-card-head">
            <div>
              <div className="skill-card-title">统一调度设置</div>
              <div className="skill-card-desc">先确认当前扫描模式，再决定是否补充运行时配置。页面只负责调度，不会修改样本内容。</div>
            </div>
            <span className={`oc-badge ${isAuthenticated ? "oc-badge-online" : "oc-badge-review"}`}>{MODE_LABELS[authState]}</span>
          </div>

          <div className="skill-mode-grid">
            <div className={`skill-mode-card${isAuthenticated ? " is-authenticated" : " is-guest"}`}>
              <div className="skill-mode-icon">
                {isAuthenticated ? <ShieldCheck size={18} strokeWidth={1.8} /> : <ShieldAlert size={18} strokeWidth={1.8} />}
              </div>
              <div className="skill-mode-copy">
                <div className="skill-mode-title">{MODE_LABELS[authState]}</div>
                <div className="skill-mode-desc">
                  {isAuthenticated
                    ? "将尝试调度全部已注册扫描器；如果未填写 API Key，依赖模型或外部资源的扫描器会自动跳过。"
                    : "仅运行静态、免费且无需外部资源的扫描器，API 和 Skill 型能力会暂时跳过。"}
                </div>
              </div>
            </div>

            <div className="skill-mode-card skill-mode-card--stack">
              <div className="skill-mode-kpi">
                <span>当前账号</span>
                <strong>{isAuthenticated ? auth?.user?.username || "已登录用户" : "guest"}</strong>
              </div>
              <div className="skill-mode-kpi">
                <span>可用能力</span>
                <strong>{isAuthenticated ? "scanner1-6" : "免费静态能力"}</strong>
              </div>
            </div>
          </div>

          {isAuthenticated ? (
            <div className="skill-runtime-panel">
              <div className="skill-card-title">运行时 API 配置</div>
              <div className="skill-card-desc">仅在当前浏览器会话中使用，不写入源码，也不会持久化保存。</div>
              <div className="skill-runtime-grid">
                <label className="skill-runtime-field">
                  <span>DeepSeek API Key</span>
                  <input className="oc-input" type="password" value={runtimeConfig.deepseekApiKey} placeholder="仅在需要启用 LLM 扫描器时填写" onChange={(event) => updateRuntimeConfig("deepseekApiKey", event.target.value)} />
                </label>
                <label className="skill-runtime-field">
                  <span>模型</span>
                  <input className="oc-input" value={runtimeConfig.deepseekModel} onChange={(event) => updateRuntimeConfig("deepseekModel", event.target.value)} />
                </label>
                <label className="skill-runtime-field">
                  <span>Base URL</span>
                  <input className="oc-input" value={runtimeConfig.deepseekBaseUrl} onChange={(event) => updateRuntimeConfig("deepseekBaseUrl", event.target.value)} />
                </label>
              </div>
            </div>
          ) : (
            <div className="skill-search-state">
              <ShieldAlert size={18} strokeWidth={1.8} />
              <span>当前未登录，系统会跳过需要认证、模型调用或外部资源的扫描器。</span>
            </div>
          )}

          <div className="skill-search-bar">
            <div className="skill-search-input-wrap">
              <Search size={16} className="skill-search-input-icon" />
              <input className="oc-input skill-query-input" value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="输入 Skill slug，例如 owner/skill-name" />
            </div>
            <button className="oc-primary-btn" type="button" onClick={handleScanBySlug} disabled={isScanning}>
              {isScanning && scanSource === "slug" ? "扫描中..." : "按 slug 扫描"}
            </button>
          </div>

          <div className="skill-search-state">
            <FileSearch size={18} strokeWidth={1.8} />
            <span>{searchText ? `当前 slug：${searchText}` : "可直接输入远程 Skill slug，系统会先拉取样本，再交给统一调度器分析。"}</span>
          </div>

          <div className="skill-search-tips">
            <div className="skill-tip-chip">支持本地样本上传</div>
            <div className="skill-tip-chip">支持远程 slug 拉取</div>
            <div className="skill-tip-chip">返回统一扫描报告</div>
          </div>
        </div>
      </div>

      <div className="skill-upload-summary">
        <div className="skill-summary-card">
          <span className="skill-summary-label">已接收样本</span>
          <strong>{uploads.length}</strong>
        </div>
        <div className="skill-summary-card">
          <span className="skill-summary-label">累计体积</span>
          <strong>{formatBytes(totalSize)}</strong>
        </div>
        <div className="skill-summary-card">
          <span className="skill-summary-label">目录上传</span>
          <strong>{uploads.filter((item) => item.path).length}</strong>
        </div>
      </div>

      <div className="skill-upload-list">
        <div className="skill-card-head">
          <div>
            <div className="skill-card-title">样本接收清单</div>
            <div className="skill-card-desc">展示当前会话中已上传的待扫描样本。</div>
          </div>
          <div className="skill-list-actions">
            <button className="oc-primary-btn" type="button" onClick={handleScanUploads} disabled={!uploads.length || isScanning}>
              {isScanning && scanSource === "upload" ? "扫描中..." : "扫描已上传样本"}
            </button>
            {uploads.length ? (
              <button className="oc-ghost-btn" type="button" onClick={() => setUploads([])} disabled={isScanning}>
                清空列表
              </button>
            ) : null}
          </div>
        </div>

        {uploads.length ? (
          <div className="skill-upload-table">
            {uploads.map((item) => (
              <div key={item.id} className="skill-upload-row">
                <div className="skill-upload-main">
                  <div className="skill-upload-name">{item.name}</div>
                  <div className="skill-upload-meta">
                    <span>{item.type}</span>
                    <span>{formatBytes(item.size)}</span>
                    <span>{item.updatedAt}</span>
                    {item.path ? <span className="is-mono">{item.path}</span> : null}
                  </div>
                </div>
                <div className="skill-upload-row-right">
                  <span className="oc-badge oc-badge-online">已接收</span>
                  <button className="skill-row-remove" type="button" onClick={() => removeUpload(item.id)} aria-label={`删除 ${item.name}`}>
                    <X size={14} strokeWidth={2} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="skill-empty-state">
            <ShieldAlert size={20} strokeWidth={1.8} />
            <span>当前还没有待扫描样本，上传文件后即可触发统一安全扫描。</span>
          </div>
        )}
      </div>

      <div className="skill-upload-list skill-result-panel">
        <div className="skill-card-head skill-card-head--result">
          <div>
            <div className="skill-card-title">扫描结果</div>
            <div className="skill-card-desc">展示统一调度器聚合后的 scanner 执行状态、发现项和总体结论。</div>
          </div>
          {scanReport ? <span className="oc-badge oc-badge-review">{scanSource === "slug" ? "来源：ClawHub slug" : "来源：本地上传"}</span> : null}
        </div>

        {isScanning ? (
          <div className="skill-empty-state">
            <LoaderCircle size={20} strokeWidth={1.8} className="skill-spin" />
            <span>扫描进行中，请稍候...</span>
          </div>
        ) : null}

        {scanError ? (
          <div className="skill-empty-state skill-error-state">
            <AlertCircle size={20} strokeWidth={1.8} />
            <span>{scanError}</span>
          </div>
        ) : null}

        {!isScanning && !scanError && !scanReport ? (
          <div className="skill-empty-state">
            <ShieldAlert size={20} strokeWidth={1.8} />
            <span>尚未执行扫描。可上传样本后点击“扫描已上传样本”，或输入 slug 直接触发统一调度。</span>
          </div>
        ) : null}

        {scanReport ? (
          <>
            <section className={`skill-result-hero is-${resultMeta.tone}`}>
              <div className="skill-result-hero-main">
                <div className={`skill-result-hero-icon is-${resultMeta.tone}`}>
                  {resultMeta.tone === "clean" ? <Sparkles size={22} strokeWidth={1.9} /> : resultMeta.tone === "critical" ? <ShieldAlert size={22} strokeWidth={1.9} /> : resultMeta.tone === "high" ? <AlertCircle size={22} strokeWidth={1.9} /> : <FileSearch size={22} strokeWidth={1.9} />}
                </div>
                <div className="skill-result-hero-copy">
                  <span className={`skill-result-hero-badge is-${resultMeta.tone}`}>{resultMeta.badge}</span>
                  <h3 className="skill-result-hero-title">{resultMeta.title}</h3>
                  <p className="skill-result-hero-desc">{resultMeta.desc}</p>
                  <div className="skill-result-meta">
                    <span>扫描目标：{String(scanReport.target_path || "").split(/[\\/]/).filter(Boolean).at(-1) || "--"}</span>
                    <span>完成时间：{formatScanTime(scanReport.completed_at)}</span>
                    <span>运行模式：{MODE_LABELS[scanReport.auth_state] || scanReport.auth_state || "--"}</span>
                    <span>总体结论：{resultMeta.badge}</span>
                  </div>
                </div>
              </div>

              <div className="skill-result-hero-side">
                <div className="skill-result-hero-stat">
                  <span className="skill-result-hero-stat-label">最高级别</span>
                  <strong>{topSeverity ? SEVERITY_LABELS[topSeverity] : "无命中"}</strong>
                </div>
                <div className="skill-result-hero-stat">
                  <span className="skill-result-hero-stat-label">优先核查</span>
                  <strong>{categoryHighlights[0]?.category || "调度结果与失败项"}</strong>
                </div>
              </div>
            </section>

            <div className="skill-result-summary-grid">
              <div className="skill-metric-card"><span className="skill-summary-label">去重发现</span><strong>{findingsCount}</strong><span className="skill-metric-hint">聚合后结果</span></div>
              <div className="skill-metric-card"><span className="skill-summary-label">原始发现</span><strong>{rawFindingsCount}</strong><span className="skill-metric-hint">去重前统计</span></div>
              <div className="skill-metric-card"><span className="skill-summary-label">完成扫描器</span><strong>{summary?.scanner_runs?.completed ?? 0}</strong><span className="skill-metric-hint">共 {scannerRuns.length} 个</span></div>
              <div className="skill-metric-card"><span className="skill-summary-label">影响文件</span><strong>{affectedFileCount}</strong><span className="skill-metric-hint">涉及路径数</span></div>
              <div className="skill-metric-card"><span className="skill-summary-label">调度总耗时</span><strong>{totalDurationLabel}</strong><span className="skill-metric-hint">整体参考值</span></div>
            </div>

            <div className="skill-card-desc" style={{ marginBottom: "12px" }}>
              单个扫描器的耗时仅统计本次统一调度中的单次运行，受重试、网络和外部依赖影响较大，仅供参考。
            </div>
            <div className="skill-severity-strip">
              {SEVERITY_ORDER.map((severity) => (
                <div key={severity} className={`skill-severity-card is-${severity.toLowerCase()}`}>
                  <div className="skill-severity-card-top">
                    <SeverityBadge severity={severity} />
                    <span className="skill-severity-count">{severitySummary[severity] ?? 0}</span>
                  </div>
                  <div className="skill-severity-card-foot">聚合发现</div>
                </div>
              ))}
            </div>

            <div className="skill-run-grid">
              {scannerRuns.map((run) => (
                <div key={run?.scanner?.id || `${run.state}-${Math.random().toString(36).slice(2, 6)}`} className={`skill-run-card is-${run.state}`}>
                  <div className="skill-run-head">
                    <div>
                      <div className="skill-run-title">{run?.scanner?.name || run?.scanner?.id || "未知扫描器"}</div>
                      <div className="skill-run-meta">{(run?.scanner?.id || "--")} · {(run?.scanner?.kind || "--")} · {(run?.scanner?.resource_tier || "--")}</div>
                    </div>
                    <RunStateBadge state={run.state} />
                  </div>
                  <div className="skill-run-facts">
                    <span>{run.finding_count ?? 0} 条发现</span>
                    <span title="耗时为参考值，未执行或异常中断的扫描器不适合横向比较。">{getRunDurationLabel(run)}</span>
                    <SeverityBadge severity={run.max_severity} />
                  </div>
                  {run.error ? <div className="skill-run-note is-error">{run.error}</div> : null}
                  {!run.error && run.skipped_reason ? <div className="skill-run-note">{run.skipped_reason}</div> : null}
                </div>
              ))}
            </div>

            <div className="skill-result-insight-grid">
              <div className="skill-insight-card">
                <div className="skill-insight-head">
                  <div className="skill-insight-icon"><ShieldAlert size={18} strokeWidth={1.8} /></div>
                  <div>
                    <div className="skill-card-title">风险聚焦</div>
                    <div className="skill-card-desc">按类别聚合命中结果，帮助先看最值得排查的区域。</div>
                  </div>
                </div>
                {categoryHighlights.length ? (
                  <div className="skill-insight-list">
                    {categoryHighlights.map((item) => (
                      <div key={item.category} className="skill-insight-row">
                        <div className="skill-insight-main">
                          <span className="skill-insight-name">{item.category}</span>
                          <span className="skill-insight-meta">{item.count} 条命中</span>
                        </div>
                        <SeverityBadge severity={item.severity} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="skill-inline-empty">本次扫描没有命中类别，可继续做人工抽查。</div>
                )}
              </div>

              <div className="skill-insight-card">
                <div className="skill-insight-head">
                  <div className="skill-insight-icon"><FileSearch size={18} strokeWidth={1.8} /></div>
                  <div>
                    <div className="skill-card-title">处置建议</div>
                    <div className="skill-card-desc">根据本次调度结果给出下一步动作，方便快速继续排查。</div>
                  </div>
                </div>
                <div className="skill-recommend-list">
                  <div className="skill-recommend-item">{lockedScannerCount > 0 ? `当前有 ${lockedScannerCount} 个需认证 scanner 未执行，登录后可补齐更完整结果。` : "本轮调度已覆盖当前模式下的全部注册 scanner。"}</div>
                  <div className="skill-recommend-item">{scanSource === "slug" ? "若样本来自远程仓库，建议同步确认下载链路、版本元数据和实际内容是否一致。" : "若样本来自本地上传，建议保留原始包与扫描报告作为追溯依据。"}</div>
                  <div className="skill-recommend-item">{summary.overall_conclusion === "clear" ? "当前没有形成聚合风险结论，但仍建议抽查关键脚本、外链与依赖来源。" : "优先根据扫描器来源、风险类别和文件定位做人工复核，再决定是否放行。"} </div>
                </div>
              </div>
            </div>

            {visibleFindings.length ? (
              <div className="skill-table-shell">
                <div className="skill-table-toolbar">
                  <div>
                    <div className="skill-card-title">命中明细</div>
                    <div className="skill-card-desc">保留统一归一化后的 findings，便于继续按文件、规则和扫描器来源做人工判断。</div>
                  </div>
                  <div className="skill-table-toolbar-note">当前展示 {visibleFindings.length} 条结果</div>
                </div>
                <div className="skill-finding-table-wrap">
                  <table className="skill-finding-table">
                    <thead>
                      <tr>
                        <th>级别</th>
                        <th>类别</th>
                        <th>标题与说明</th>
                        <th>文件定位</th>
                        <th>扫描器</th>
                        <th>片段 / 建议</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleFindings.map((item, index) => (
                        <tr key={`${item.fingerprint || "finding"}-${index}`}>
                          <td><SeverityBadge severity={item.severity} /></td>
                          <td>{item.category || "--"}</td>
                          <td>
                            <div className="skill-finding-title">{item.title || "--"}</div>
                            {item.description && item.description !== item.title ? <div className="skill-finding-text">{item.description}</div> : null}
                            {Array.isArray(item.rule_ids) && item.rule_ids.length ? <div className="skill-finding-meta">规则：{item.rule_ids.join(", ")}</div> : null}
                          </td>
                          <td className="is-mono">
                            {item.file_path || "--"}
                            {item.line_number ? <div className="skill-finding-meta">行号：{item.line_number}</div> : null}
                          </td>
                          <td>
                            <div className="skill-scanner-chip-list">
                              {Array.isArray(item.scanners) && item.scanners.length ? item.scanners.map((scannerId) => <span key={scannerId} className="skill-scanner-chip">{scannerId}</span>) : <span className="skill-scanner-chip is-empty">--</span>}
                            </div>
                          </td>
                          <td className="is-mono">{item.snippet || item.metadata?.suggestion || "--"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="skill-empty-state skill-clean-state">
                <Sparkles size={20} strokeWidth={1.8} />
                <span>本次扫描未发现命中的聚合风险项。</span>
              </div>
            )}
          </>
        ) : null}
      </div>
    </section>
  );
}

function SkillPlaceholder({ title, desc, icon: Icon }) {
  return (
    <div className="skill-subpanel">
      <div className="skill-empty-state">
        <Icon size={20} strokeWidth={1.8} />
        <div>
          <div className="skill-card-title">{title}</div>
          <div className="skill-card-desc">{desc}</div>
        </div>
      </div>
    </div>
  );
}

export default function SkillGovernancePage({ auth }) {
  const [activeTab, setActiveTab] = useState("skill-detect");

  return (
    <div className="oc-page skill-page">
      <section className="oc-page-header skill-page-header">
        <div className="oc-page-header-main">
          <div className="oc-page-tag">Skill 生态后门投毒治理</div>
          <h2 className="oc-page-title">Skill 扫描中心</h2>
          <p className="oc-page-desc">面向 Skill 包、SKILL.md 清单与目录样本的统一扫描入口，支持拖拽上传、批量接收和 slug 直扫，并整合 6 个 scanner 的执行结果。</p>
        </div>
      </section>

      <div className="skill-tabs" role="tablist" aria-label="Skill 工作台标签">
        {TABS.map((tab) => (
          <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} className={`skill-tab${activeTab === tab.id ? " is-active" : ""}`} onClick={() => setActiveTab(tab.id)}>
            <span>{tab.label}</span>
            {tab.badge ? <span className="skill-tab-badge">{tab.badge}</span> : null}
          </button>
        ))}
      </div>

      {activeTab === "skill-detect" ? <SkillDetectWorkspace auth={auth} /> : activeTab === "intelligence" ? (
        <SkillPlaceholder title="基础情报面板" desc="用于聚合 Skill 来源、信誉、家族关联与传播画像等情报信息，支撑研判和溯源。" icon={Sparkles} />
      ) : (
        <SkillPlaceholder title="文件沙箱分析" desc="用于承接 Skill 文件的静态分析、行为观察与投毒链路回放，辅助识别高风险样本。" icon={Box} />
      )}
    </div>
  );
}
