import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  AlertCircle,
  BarChart3,
  Box,
  Database,
  Eye,
  EyeOff,
  FileArchive,
  FileCode2,
  FileSearch,
  FolderOpen,
  GitBranch,
  LoaderCircle,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { getSkillScanStatus, scanSkillByRepositoryUrl, scanSkillBySlug, scanSkillFiles } from "../services/skillScanService.js";
import { getSkillIntelligenceOverview } from "../services/skillIntelligenceService.js";
import { searchSkills } from "../services/skillSearchService.js";

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

function SkillDetectWorkspace({ auth }) {
  const isAuthenticated = Boolean(auth?.isLoggedIn);
  const authState = isAuthenticated ? "authenticated" : "guest";
  const [uploads, setUploads] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchMeta, setSearchMeta] = useState({ query: "", total: 0 });
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSource, setScanSource] = useState("");
  const [scanError, setScanError] = useState("");
  const [scanReport, setScanReport] = useState(null);
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState("");
  const [detectionReport, setDetectionReport] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [runtimeConfig, setRuntimeConfig] = useState({
    deepseekApiKey: "",
    deepseekModel: "deepseek-chat",
    deepseekBaseUrl: "https://api.deepseek.com/v1",
  });

  const zipInputRef = useRef(null);
  const manifestInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const multiInputRef = useRef(null);
  const scanPollingTokenRef = useRef(0);

  const totalSize = useMemo(() => uploads.reduce((sum, item) => sum + item.size, 0), [uploads]);
  const summary = scanReport?.summary || {};
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
  const analysisStageLabel = useMemo(() => {
    if (isAiScanning) return "深度分析中";
    if (detectionReport?.content) return "已生成报告";
    if (scanReport) return "静态分析完成";
    return "--";
  }, [isAiScanning, detectionReport?.content, scanReport]);

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

  async function waitForDeepScan(scanId, token) {
    setIsAiScanning(true);
    setAiStatusMessage("AI 深度分析进行中，静态结果已先展示。");
    const maxAttempts = 120;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      if (scanPollingTokenRef.current !== token) {
        return;
      }

      await new Promise((resolve) => {
        setTimeout(resolve, 2500);
      });

      if (scanPollingTokenRef.current !== token) {
        return;
      }

      try {
        const status = await getSkillScanStatus(scanId);
        if (scanPollingTokenRef.current !== token) {
          return;
        }

        if (status.status === "completed" && status.report) {
          setScanReport(status.report);
          setDetectionReport(status.detectionReport || null);
          setIsAiScanning(false);
          setAiStatusMessage("AI 深度分析已完成，结果已更新。");
          return;
        }

        if (status.status === "failed") {
          setIsAiScanning(false);
          setAiStatusMessage("");
          setScanError(status.message || "静态结果已返回，但 AI 深度分析失败。");
          return;
        }
      } catch (error) {
        if (scanPollingTokenRef.current !== token) {
          return;
        }
        setIsAiScanning(false);
        setAiStatusMessage("");
        setScanError(error instanceof Error ? error.message : "轮询 AI 深度分析状态失败。");
        return;
      }
    }

    if (scanPollingTokenRef.current === token) {
      setIsAiScanning(false);
      setAiStatusMessage("AI 深度分析仍在后台运行，可稍后重试扫描查看最新结果。");
    }
  }

  function downloadDetectionReport() {
    const content = String(detectionReport?.content || "");
    if (!content) {
      return;
    }
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = detectionReport?.fileName || "skill-detection-report.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  useEffect(() => () => {
    scanPollingTokenRef.current += 1;
  }, []);

  useEffect(() => {
    const seededApiKey = String(auth?.user?.defaultApiKey || "").trim();
    if (!seededApiKey) {
      return;
    }
    setRuntimeConfig((current) => (
      current.deepseekApiKey
        ? current
        : { ...current, deepseekApiKey: seededApiKey }
    ));
  }, [auth?.user?.defaultApiKey]);

  async function handleScanUploads() {
    if (!uploads.length) {
      setScanError("请先上传至少一个 Skill 文件或目录。");
      return;
    }

    setIsScanning(true);
    setScanSource("upload");
    setScanError("");
    setIsAiScanning(false);
    setAiStatusMessage("");
    setDetectionReport(null);
    scanPollingTokenRef.current += 1;
    const token = scanPollingTokenRef.current;
    try {
      const response = await scanSkillFiles(uploads, buildScanOptions());
      setScanReport(response.report);
      setDetectionReport(response.detectionReport || null);
      if (response.pending && response.scanId) {
        void waitForDeepScan(response.scanId, token);
      }
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
    setIsAiScanning(false);
    setAiStatusMessage("");
    setDetectionReport(null);
    scanPollingTokenRef.current += 1;
    const token = scanPollingTokenRef.current;
    try {
      const response = await scanSkillBySlug(slug, "", buildScanOptions());
      setScanReport(response.report);
      setDetectionReport(response.detectionReport || null);
      if (response.pending && response.scanId) {
        void waitForDeepScan(response.scanId, token);
      }
    } catch (error) {
      setScanReport(null);
      setScanError(error instanceof Error ? error.message : "扫描失败，请重试。");
    } finally {
      setIsScanning(false);
    }
  }

  async function handleSearchSkills() {
    const query = searchText.trim();
    if (!query) {
      setSearchResults([]);
      setSearchMeta({ query: "", total: 0 });
      setSearchError("请输入关键词后再搜索。");
      return;
    }

    setIsSearching(true);
    setSearchError("");
    try {
      const result = await searchSkills(query, 12);
      setSearchResults(result.items || []);
      setSearchMeta({ query: result.query || query, total: Number(result.total || 0) });
    } catch (error) {
      setSearchResults([]);
      setSearchMeta({ query, total: 0 });
      setSearchError(error instanceof Error ? error.message : "数据库搜索失败，请稍后重试。");
    } finally {
      setIsSearching(false);
    }
  }

  async function handleScanByRepository(record) {
    const repositoryUrl = String(record?.repositoryUrl || "").trim();
    if (!repositoryUrl) {
      setScanError("该 Skill 缺少可扫描的 repository URL。");
      return;
    }

    setIsScanning(true);
    setScanSource("repository");
    setScanError("");
    setIsAiScanning(false);
    setAiStatusMessage("");
    setDetectionReport(null);
    scanPollingTokenRef.current += 1;
    const token = scanPollingTokenRef.current;
    try {
      const response = await scanSkillByRepositoryUrl(repositoryUrl, buildScanOptions());
      setScanReport(response.report);
      setDetectionReport(response.detectionReport || null);
      if (response.pending && response.scanId) {
        void waitForDeepScan(response.scanId, token);
      }
    } catch (error) {
      setScanReport(null);
      setScanError(error instanceof Error ? error.message : "按仓库复扫失败，请稍后重试。");
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
                <strong>{isAuthenticated ? "静态分析LLM分析" : "免费静态能力"}</strong>
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
                  <div className="skill-secret-input-wrap">
                    <input
                      className="oc-input skill-secret-input"
                      type={showApiKey ? "text" : "password"}
                      value={runtimeConfig.deepseekApiKey}
                      placeholder="仅在需要启用 LLM 扫描器时填写"
                      onChange={(event) => updateRuntimeConfig("deepseekApiKey", event.target.value)}
                    />
                    <button
                      type="button"
                      className="skill-secret-toggle-btn"
                      onClick={() => setShowApiKey((current) => !current)}
                      aria-label={showApiKey ? "隐藏 API Key" : "显示 API Key"}
                      title={showApiKey ? "隐藏 API Key" : "显示 API Key"}
                    >
                      {showApiKey ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
                    </button>
                  </div>
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
              <input
                className="oc-input skill-query-input"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    void handleSearchSkills();
                  }
                }}
                placeholder="输入 Skill 名称、作者或仓库地址"
              />
            </div>
            <button className="oc-ghost-btn" type="button" onClick={handleSearchSkills} disabled={isSearching}>
              {isSearching ? "搜索中..." : "搜索数据库"}
            </button>
            <button className="oc-primary-btn" type="button" onClick={handleScanBySlug} disabled={isScanning}>
              {isScanning && scanSource === "slug" ? "扫描中..." : "按输入直扫"}
            </button>
          </div>

          <div className="skill-search-state">
            <FileSearch size={18} strokeWidth={1.8} />
            <span>{searchText ? `当前查询：${searchText}` : "可先搜索数据库中的 Skill 元数据，也可以直接输入 ClawHub slug 做远程直扫。"}</span>
          </div>

          {searchError ? (
            <div className="skill-search-state skill-search-state--error">
              <AlertCircle size={18} strokeWidth={1.8} />
              <span>{searchError}</span>
            </div>
          ) : null}

          {searchMeta.query ? (
            <div className="skill-search-result-head">
              <div>
                <div className="skill-card-title">数据库搜索结果</div>
                <div className="skill-card-desc">关键词 “{searchMeta.query}” 命中 {searchMeta.total} 条，展示前 {searchResults.length} 条。</div>
              </div>
            </div>
          ) : null}

          {searchResults.length ? (
            <div className="skill-search-result-list">
              {searchResults.map((item) => (
                <div key={item.id} className="skill-search-result-card">
                  <div className="skill-search-result-top">
                    <div>
                      <div className="skill-search-result-title">{item.name}</div>
                      <div className="skill-search-result-meta">
                        <span>{item.author || "未知作者"}</span>
                        {item.language ? <span>{item.language}</span> : null}
                        <span>{item.stars || 0} stars</span>
                        {item.latestScanStatus ? <span>最近扫描：{item.latestScanStatus}</span> : null}
                      </div>
                    </div>
                    <button
                      className="oc-primary-btn"
                      type="button"
                      onClick={() => handleScanByRepository(item)}
                      disabled={isScanning}
                    >
                      {isScanning && scanSource === "repository" ? "复扫中..." : "按仓库复扫"}
                    </button>
                  </div>
                  {item.description ? <div className="skill-card-desc">{item.description}</div> : null}
                  <div className="skill-search-result-foot">
                    <span className="is-mono">{item.repositoryUrl}</span>
                    {item.latestRiskLabel ? <span className={`skill-search-risk-chip is-${item.latestRiskLabel}`}>{item.latestRiskLabel}</span> : null}
                    {item.latestMaxSeverity ? <SeverityBadge severity={item.latestMaxSeverity} /> : null}
                    {item.latestFindingCount ? <span className="skill-search-count-chip">{item.latestFindingCount} findings</span> : null}
                  </div>
                  {item.latestErrorMessage ? <div className="skill-finding-meta">最近错误：{item.latestErrorMessage}</div> : null}
                </div>
              ))}
            </div>
          ) : searchMeta.query && !isSearching && !searchError ? (
            <div className="skill-inline-empty">没有命中数据库记录，可以直接把完整 slug 输入右侧按钮做远程直扫。</div>
          ) : null}

          <div className="skill-search-tips">
            <div className="skill-tip-chip">支持本地样本上传</div>
            <div className="skill-tip-chip">支持数据库检索</div>
            <div className="skill-tip-chip">支持远程 slug 拉取</div>
            <div className="skill-tip-chip">支持仓库地址复扫</div>
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
            <div className="skill-card-desc">展示统一调度器聚合后的风险发现、综合结论与处置建议。</div>
          </div>
          {scanReport ? (
            <span className="oc-badge oc-badge-review">
              {scanSource === "slug" ? "来源：ClawHub slug" : scanSource === "repository" ? "来源：数据库仓库复扫" : "来源：本地上传"}
            </span>
          ) : null}
        </div>

        {isScanning ? (
          <div className="skill-empty-state">
            <LoaderCircle size={20} strokeWidth={1.8} className="skill-spin" />
            <span>扫描进行中，请稍候...</span>
          </div>
        ) : null}

        {isAiScanning || aiStatusMessage ? (
          <div className="skill-empty-state">
            <LoaderCircle size={20} strokeWidth={1.8} className={isAiScanning ? "skill-spin" : ""} />
            <span>{aiStatusMessage || "AI 深度分析正在后台运行。"}</span>
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

            {detectionReport?.content ? (
              <div className="skill-upload-list" style={{ marginBottom: "12px" }}>
                <div className="skill-card-head">
                  <div>
                    <div className="skill-card-title">检测报告</div>
                    <div className="skill-card-desc">已基于深度分析生成 Markdown 报告，可预览并下载留存。</div>
                  </div>
                  <button className="oc-primary-btn" type="button" onClick={downloadDetectionReport}>
                    下载报告
                  </button>
                </div>
                <div className="skill-markdown-report">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {detectionReport.content}
                  </ReactMarkdown>
                </div>
              </div>
            ) : null}

            <div className="skill-result-summary-grid">
              <div className="skill-metric-card"><span className="skill-summary-label">去重发现</span><strong>{findingsCount}</strong><span className="skill-metric-hint">聚合后结果</span></div>
              <div className="skill-metric-card"><span className="skill-summary-label">原始发现</span><strong>{rawFindingsCount}</strong><span className="skill-metric-hint">去重前统计</span></div>
              <div className="skill-metric-card"><span className="skill-summary-label">分析阶段</span><strong>{analysisStageLabel}</strong></div>
              <div className="skill-metric-card"><span className="skill-summary-label">影响文件</span><strong>{affectedFileCount}</strong><span className="skill-metric-hint">涉及路径数</span></div>
              <div className="skill-metric-card"><span className="skill-summary-label">调度总耗时</span><strong>{totalDurationLabel}</strong><span className="skill-metric-hint">整体参考值</span></div>
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
                  <div className="skill-recommend-item">{scanSource === "upload" ? "若样本来自本地上传，建议保留原始包与扫描报告作为追溯依据。" : "若样本来自远程仓库，建议同步确认下载链路、版本元数据和实际内容是否一致。"}</div>
                  <div className="skill-recommend-item">{summary.overall_conclusion === "clear" ? "当前没有形成聚合风险结论，但仍建议抽查关键脚本、外链与依赖来源。" : "优先根据风险类别和文件定位做人工复核，再决定是否放行。"} </div>
                </div>
              </div>
            </div>

            {visibleFindings.length ? (
              <div className="skill-table-shell">
                <div className="skill-table-toolbar">
                  <div>
                    <div className="skill-card-title">命中明细</div>
                    <div className="skill-card-desc">保留统一归一化后的 findings，便于继续按文件与规则做人工判断。</div>
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

function formatPercent(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "--";
  return `${amount.toFixed(amount >= 10 ? 1 : 1)}%`;
}

function formatCompactCount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "--";
  return new Intl.NumberFormat("zh-CN", {
    notation: amount >= 10000 ? "compact" : "standard",
    maximumFractionDigits: amount >= 10000 ? 1 : 0,
  }).format(amount);
}

function getFailureReasonLabel(reason) {
  const labels = {
    timeout: "超时",
    network: "网络 / 拉取异常",
    "invalid-url": "仓库地址无效",
    "missing-skill-md": "缺少 SKILL.md",
    "windows-path": "Windows 路径限制",
    other: "其他异常",
    unknown: "未知",
  };
  return labels[reason] || reason;
}

function getUnknownReasonLabel(reason) {
  const labels = {
    "missing-skill-md": "仓库缺少 SKILL.md",
    "invalid-repository": "仓库地址无效",
    "unsupported-host": "仓库源不受支持",
    other: "其他待确认原因",
  };
  return labels[reason] || reason;
}

function SkillIntelligencePanel() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOverview() {
      setLoading(true);
      setError("");
      try {
        const data = await getSkillIntelligenceOverview();
        if (!cancelled) {
          setOverview(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "基础情报加载失败。");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOverview();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="skill-subpanel">
        <div className="skill-empty-state">
          <LoaderCircle size={20} strokeWidth={1.8} className="skill-spin" />
          <div>
            <div className="skill-card-title">基础情报加载中</div>
            <div className="skill-card-desc">正在汇总最近批次的扫描覆盖、失败压力与风险分布。</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="skill-subpanel">
        <div className="skill-empty-state skill-error-state">
          <AlertCircle size={20} strokeWidth={1.8} />
          <div>
            <div className="skill-card-title">基础情报暂时不可用</div>
            <div className="skill-card-desc">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  const summary = overview?.summary || {};
  const latestBatch = overview?.latestBatch || null;
  const riskDistribution = Array.isArray(overview?.riskDistribution) ? overview.riskDistribution : [];
  const recentBatches = Array.isArray(overview?.recentBatches) ? overview.recentBatches : [];
  const failureClusters = Array.isArray(overview?.failureClusters) ? overview.failureClusters : [];
  const scannedSkills = Number(summary.scannedSkills || 0);
  const ringStyle = {
    background: `conic-gradient(
      #0f766e 0% ${summary.completionRate || 0}%,
      #dc2626 ${summary.completionRate || 0}% ${(summary.completionRate || 0) + (summary.failureRate || 0)}%,
      #d97706 ${(summary.completionRate || 0) + (summary.failureRate || 0)}% 100%
    )`,
  };

  return (
    <section className="skill-intel-shell">
      <div className="skill-intel-hero">
        <div className="skill-intel-hero-copy">
          <span className="skill-intel-badge">基础情报 / 最近批次</span>
          <h3 className="skill-intel-title">Skill 扫描态势已经接入情报面板</h3>
          <p className="skill-intel-desc">
            用最近一次数据库批量扫描作为底座，集中观察覆盖率、异常压力、风险标签分布和近几批次的执行趋势。
          </p>
          <div className="skill-intel-meta">
            <span>最近批次 #{latestBatch?.id ?? "--"}</span>
            <span>更新时间 {formatScanTime(latestBatch?.updatedAt)}</span>
            <span>语料仓库 {formatCompactCount(summary.totalRepos)}</span>
          </div>
        </div>

        <div className="skill-intel-ring-card">
          <div className="skill-intel-ring" style={ringStyle}>
            <div className="skill-intel-ring-inner">
              <strong>{formatPercent(summary.coverageRate)}</strong>
              <span>扫描覆盖率</span>
            </div>
          </div>
          <div className="skill-intel-legend">
            <div><i className="is-completed" />完成 {formatPercent(summary.completionRate)}</div>
            <div><i className="is-failed" />失败 {formatPercent(summary.failureRate)}</div>
            <div><i className="is-skipped" />跳过 {formatPercent(summary.skipRate)}</div>
          </div>
        </div>
      </div>

      <div className="skill-intel-kpi-grid">
        <div className="skill-intel-kpi-card">
          <div className="skill-intel-kpi-icon"><Database size={18} strokeWidth={1.8} /></div>
          <span className="skill-summary-label">Skill 总量</span>
          <strong>{formatCompactCount(summary.totalSkills)}</strong>
          <span className="skill-metric-hint">数据库当前样本池</span>
        </div>
        <div className="skill-intel-kpi-card">
          <div className="skill-intel-kpi-icon"><BarChart3 size={18} strokeWidth={1.8} /></div>
          <span className="skill-summary-label">已写入扫描结果</span>
          <strong>{formatCompactCount(scannedSkills)}</strong>
          <span className="skill-metric-hint">最近批次结果总数</span>
        </div>
        <div className="skill-intel-kpi-card is-alert">
          <div className="skill-intel-kpi-icon"><AlertCircle size={18} strokeWidth={1.8} /></div>
          <span className="skill-summary-label">失败压力</span>
          <strong>{formatCompactCount(latestBatch?.failedSkills)}</strong>
          <span className="skill-metric-hint">需重试或归因的失败项</span>
        </div>
        <div className="skill-intel-kpi-card is-warm">
          <div className="skill-intel-kpi-icon"><GitBranch size={18} strokeWidth={1.8} /></div>
          <span className="skill-summary-label">跳过样本</span>
          <strong>{formatCompactCount(latestBatch?.skippedSkills)}</strong>
          <span className="skill-metric-hint">多为无效仓库或缺少 SKILL.md</span>
        </div>
      </div>

      <div className="skill-intel-grid">
        <div className="skill-upload-list skill-intel-panel">
          <div className="skill-card-head">
            <div>
              <div className="skill-card-title">安全与待确定结构</div>
              <div className="skill-card-desc">按最近批次的落库结果观察 safe / dangerous / unknown 的分层情况。</div>
            </div>
          </div>
          <div className="skill-intel-stack">
            {riskDistribution.length ? riskDistribution.map((item) => (
              <div key={item.riskLabel} className={`skill-intel-stack-row is-${item.riskLabel}`}>
                <div className="skill-intel-stack-head">
                  <span>{item.riskLabel}</span>
                  <strong>{formatCompactCount(item.total)}</strong>
                </div>
                <div className="skill-intel-bar-track">
                  <div className="skill-intel-bar-fill" style={{ width: `${Math.max(item.percent, 1)}%` }} />
                </div>
                <div className="skill-intel-stack-meta">{formatPercent(item.percent)}</div>
              </div>
            )) : (
              <div className="skill-inline-empty">最近批次暂无风险标签分布可展示。</div>
            )}
          </div>
        </div>

        <div className="skill-upload-list skill-intel-panel">
          <div className="skill-card-head">
            <div>
              <div className="skill-card-title">待确定原因</div>
              <div className="skill-card-desc">对失败项按常见原因归并，方便决定先修重试策略还是做数据清洗。</div>
            </div>
          </div>
          <div className="skill-intel-cluster-list">
            {unknownClusters.length ? unknownClusters.map((item) => (
              <div key={item.reason} className="skill-intel-cluster-item">
                <div>
                  <div className="skill-intel-cluster-title">{getUnknownReasonLabel(item.reason)}</div>
                  <div className="skill-card-desc">占待确定项 {formatPercent(item.percent)}</div>
                </div>
                <strong>{formatCompactCount(item.total)}</strong>
              </div>
            )) : (
              <div className="skill-inline-empty">最近批次没有失败项聚类数据。</div>
            )}
          </div>
        </div>
      </div>

      <div className="skill-upload-list skill-intel-panel">
        <div className="skill-card-head">
          <div>
            <div className="skill-card-title">扫描执行概览</div>
            <div className="skill-card-desc">展示最近 6 个扫描批次的完成、失败与跳过结构，便于快速感知执行质量变化。</div>
          </div>
        </div>
        <div className="skill-intel-batch-list">
          {[latestBatch].filter(Boolean).map((batch) => {
            const total = batch.completedSkills + batch.failedSkills + batch.skippedSkills;
            const completedWidth = total ? (batch.completedSkills / total) * 100 : 0;
            const failedWidth = total ? (batch.failedSkills / total) * 100 : 0;
            const skippedWidth = total ? (batch.skippedSkills / total) * 100 : 0;

            return (
              <div key={batch.id} className="skill-intel-batch-row">
                <div className="skill-intel-batch-meta">
                  <div className="skill-intel-batch-id">Batch #{batch.id}</div>
                  <div className="skill-card-desc">
                    {formatScanTime(batch.startedAt)} {batch.completedAt ? `→ ${formatScanTime(batch.completedAt)}` : "→ 进行中"}
                  </div>
                </div>
                <div className="skill-intel-batch-bar">
                  <span className="is-completed" style={{ width: `${completedWidth}%` }} />
                  <span className="is-failed" style={{ width: `${failedWidth}%` }} />
                  <span className="is-skipped" style={{ width: `${skippedWidth}%` }} />
                </div>
                <div className="skill-intel-batch-facts">
                  <span><ShieldCheck size={14} strokeWidth={1.8} /> {formatCompactCount(batch.completedSkills)}</span>
                  <span><AlertCircle size={14} strokeWidth={1.8} /> {formatCompactCount(batch.failedSkills)}</span>
                  <span><Sparkles size={14} strokeWidth={1.8} /> {formatCompactCount(batch.skippedSkills)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SkillIntelligencePanelV2() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const cacheKey = "clawguard.skill.intelligence.overview";

    try {
      const cachedRaw = window.sessionStorage.getItem(cacheKey);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        if (cached && typeof cached === "object") {
          setOverview(cached);
          setLoading(false);
        }
      }
    } catch {
      // Ignore stale cache payloads.
    }

    async function loadOverview() {
      try {
        const data = await getSkillIntelligenceOverview();
        if (cancelled) return;
        setOverview(data);
        setLoading(false);
        try {
          window.sessionStorage.setItem(cacheKey, JSON.stringify(data));
        } catch {
          // Ignore browser storage failures.
        }
      } catch {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadOverview();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="skill-intel-shell skill-intel-shell--compact">
        <div className="skill-intel-skeleton skill-intel-skeleton--hero" />
        <div className="skill-intel-kpi-grid">
          {Array.from({ length: 4 }).map((_, index) => <div key={index} className="skill-intel-skeleton skill-intel-skeleton--card" />)}
        </div>
        <div className="skill-intel-grid">
          <div className="skill-intel-skeleton skill-intel-skeleton--panel" />
          <div className="skill-intel-skeleton skill-intel-skeleton--panel" />
        </div>
      </div>
    );
  }

  const summary = overview?.summary || {};
  const latestBatch = overview?.latestBatch || null;
  const riskDistribution = Array.isArray(overview?.riskDistribution) ? overview.riskDistribution : [];
  const reviewRows = Array.isArray(overview?.reviewRows) ? overview.reviewRows : [];
  const unknownClusters = Array.isArray(overview?.unknownClusters)
    ? overview.unknownClusters.filter((item) => Number(item.total || 0) > 0)
    : [];
  const scannedSkills = Number(summary.scannedSkills || 0);
  const scannedRepos = Number(summary.scannedRepos || 0);
  const successRate = Number(summary.successRate || 0);
  const failureRate = Number(summary.failureRate || 0);
  const skipRate = Number(summary.skipRate || 0);
  const safeSlice = riskDistribution.find((item) => item.riskLabel === "safe");
  const unknownSlice = riskDistribution.find((item) => item.riskLabel === "unknown");
  const reviewSlice = riskDistribution.find((item) => item.riskLabel === "dangerous");
  const ringStyle = {
    background: `conic-gradient(#0f766e 0% ${Number(safeSlice?.percent || 0)}%, #dc2626 ${Number(safeSlice?.percent || 0)}% ${Number(safeSlice?.percent || 0) + Number(reviewSlice?.percent || 0)}%, #d97706 ${Number(safeSlice?.percent || 0) + Number(reviewSlice?.percent || 0)}% 100%)`,
  };

  return (
    <section className="skill-intel-shell skill-intel-shell--compact">
      <div className="skill-intel-hero skill-intel-hero--clean">
        <div className="skill-intel-hero-copy">
          <span className="skill-intel-badge">基础情报 / 最近批次</span>
          <h3 className="skill-intel-title">Skill 扫描基线</h3>
          <p className="skill-intel-desc">聚焦数据库中的批量扫描基线，快速判断样本池覆盖、批次成功率、失败压力和近期执行质量。</p>
          <div className="skill-intel-meta">
            <span>最近批次 #{latestBatch?.id ?? "--"}</span>
            <span>更新时间 {formatScanTime(latestBatch?.updatedAt)}</span>
            <span>仓库覆盖 {formatCompactCount(scannedRepos)} / {formatCompactCount(summary.totalRepos)}</span>
          </div>
        </div>

        <div className="skill-intel-ring-card skill-intel-ring-card--clean">
          <div className="skill-intel-ring" style={ringStyle}>
            <div className="skill-intel-ring-inner">
              <strong>{formatPercent(safeSlice?.percent)}</strong>
              <span>安全 Skill 占比</span>
            </div>
          </div>
          <div className="skill-intel-legend">
            <div><i className="is-completed" />安全 {formatPercent(safeSlice?.percent)}</div>
            <div><i className="is-failed" />待复核 {formatPercent(reviewSlice?.percent)}</div>
            <div><i className="is-skipped" />待确定 {formatPercent(unknownSlice?.percent)}</div>
          </div>
        </div>
      </div>

      <div className="skill-intel-kpi-grid">
        <div className="skill-intel-kpi-card skill-intel-kpi-card--clean">
          <div className="skill-intel-kpi-icon"><Database size={18} strokeWidth={1.8} /></div>
          <span className="skill-summary-label">Skill 总量</span>
          <strong>{formatCompactCount(summary.totalSkills)}</strong>
          <span className="skill-metric-hint">数据库当前样本池</span>
        </div>
        <div className="skill-intel-kpi-card skill-intel-kpi-card--clean">
          <div className="skill-intel-kpi-icon"><BarChart3 size={18} strokeWidth={1.8} /></div>
          <span className="skill-summary-label">安全 Skill 比例</span>
          <strong>{formatPercent(safeSlice?.percent)}</strong>
          <span className="skill-metric-hint">{formatCompactCount(safeSlice?.total)} 个已归为 safe</span>
        </div>
        <div className="skill-intel-kpi-card skill-intel-kpi-card--danger">
          <div className="skill-intel-kpi-icon"><AlertCircle size={18} strokeWidth={1.8} /></div>
          <span className="skill-summary-label">待确定比例</span>
          <strong>{formatPercent(unknownSlice?.percent)}</strong>
          <span className="skill-metric-hint">{formatCompactCount(unknownSlice?.total)} 个仍待确认</span>
        </div>
        <div className="skill-intel-kpi-card skill-intel-kpi-card--warm">
          <div className="skill-intel-kpi-icon"><GitBranch size={18} strokeWidth={1.8} /></div>
          <span className="skill-summary-label">待复核比例</span>
          <strong>{formatPercent(reviewSlice?.percent)}</strong>
          <span className="skill-metric-hint">{formatCompactCount(reviewSlice?.total)} 个进入危险或复核队列</span>
        </div>
      </div>

      <div className="skill-intel-grid">
        <div className="skill-upload-list skill-intel-panel">
          <div className="skill-card-head">
            <div>
              <div className="skill-card-title">安全与待确定结构</div>
              <div className="skill-card-desc">优先看 safe 与 unknown 的比例，再结合待复核队列判断需要人工介入的密度。</div>
            </div>
          </div>
          <div className="skill-intel-stack">
            {riskDistribution.length ? riskDistribution.map((item) => (
              <div key={item.riskLabel} className={`skill-intel-stack-row is-${item.riskLabel}`}>
                <div className="skill-intel-stack-head">
                  <span>{item.riskLabel === "safe" ? "低风险 / safe" : item.riskLabel === "dangerous" ? "待复核 / dangerous" : "未定 / unknown"}</span>
                  <strong>{formatCompactCount(item.total)}</strong>
                </div>
                <div className="skill-intel-bar-track">
                  <div className="skill-intel-bar-fill" style={{ width: `${Math.max(Number(item.percent || 0), 1)}%` }} />
                </div>
                <div className="skill-intel-stack-meta">{formatPercent(item.percent)}</div>
              </div>
            )) : (
              <div className="skill-inline-empty">后台同步中，风险标签会自动补齐。</div>
            )}
          </div>
        </div>

        <div className="skill-upload-list skill-intel-panel">
          <div className="skill-card-head">
            <div>
              <div className="skill-card-title">待确定原因</div>
              <div className="skill-card-desc">待确定并不等于危险，更多是当前证据不足。这里展示最常见的待确定来源。</div>
            </div>
          </div>
          <div className="skill-intel-cluster-list">
            {unknownClusters.length ? unknownClusters.map((item) => (
              <div key={item.reason} className="skill-intel-cluster-item">
                <div>
                  <div className="skill-intel-cluster-title">{getUnknownReasonLabel(item.reason)}</div>
                  <div className="skill-card-desc">占待确定项 {formatPercent(item.percent)}</div>
                </div>
                <strong>{formatCompactCount(item.total)}</strong>
              </div>
            )) : (
              <div className="skill-inline-empty">当前待确定项较少，暂无需要单独强调的原因。</div>
            )}
          </div>
        </div>
      </div>

      <div className="skill-upload-list skill-intel-panel">
        <div className="skill-card-head">
          <div>
            <div className="skill-card-title">扫描执行概览</div>
            <div className="skill-card-desc">仅保留一个轻量图层观察扫描执行状态，避免喧宾夺主。</div>
          </div>
        </div>
        <div className="skill-intel-batch-list">
          {[latestBatch].filter(Boolean).map((batch) => {
            const total = batch.completedSkills + batch.failedSkills + batch.skippedSkills;
            const completedWidth = total ? (batch.completedSkills / total) * 100 : 0;
            const failedWidth = total ? (batch.failedSkills / total) * 100 : 0;
            const skippedWidth = total ? (batch.skippedSkills / total) * 100 : 0;

            return (
              <div key={batch.id} className="skill-intel-batch-row">
                <div className="skill-intel-batch-meta">
                  <div className="skill-intel-batch-id">Batch #{batch.id}</div>
                  <div className="skill-card-desc">
                    {formatScanTime(batch.startedAt)} {batch.completedAt ? `-> ${formatScanTime(batch.completedAt)}` : "-> 进行中"}
                  </div>
                </div>
                <div className="skill-intel-batch-bar">
                  <span className="is-completed" style={{ width: `${completedWidth}%` }} />
                  <span className="is-failed" style={{ width: `${failedWidth}%` }} />
                  <span className="is-skipped" style={{ width: `${skippedWidth}%` }} />
                </div>
                <div className="skill-intel-batch-facts">
                  <span><ShieldCheck size={14} strokeWidth={1.8} /> 成功 {formatCompactCount(batch.completedSkills)}</span>
                  <span><AlertCircle size={14} strokeWidth={1.8} /> 失败 {formatCompactCount(batch.failedSkills)}</span>
                  <span><Sparkles size={14} strokeWidth={1.8} /> 跳过 {formatCompactCount(batch.skippedSkills)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SkillIntelligencePanelV3() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const cacheKey = "clawguard.skill.intelligence.overview.v3";

    async function loadOverview() {
      try {
        const cachedRaw = window.sessionStorage.getItem(cacheKey);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          if (!cancelled && cached && typeof cached === "object") {
            setOverview(cached);
            setLoading(false);
          }
        }
      } catch {
        // Ignore stale cache payloads.
      }

      try {
        const data = await getSkillIntelligenceOverview();
        if (cancelled) return;
        setOverview(data);
        setLoading(false);
        try {
          window.sessionStorage.setItem(cacheKey, JSON.stringify(data));
        } catch {
          // Ignore browser storage failures.
        }
      } catch {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadOverview();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="skill-intel-shell skill-intel-shell--compact">
        <div className="skill-intel-skeleton skill-intel-skeleton--hero" />
        <div className="skill-intel-kpi-grid">
          {Array.from({ length: 4 }).map((_, index) => <div key={index} className="skill-intel-skeleton skill-intel-skeleton--card" />)}
        </div>
        <div className="skill-intel-grid">
          <div className="skill-intel-skeleton skill-intel-skeleton--panel" />
          <div className="skill-intel-skeleton skill-intel-skeleton--panel" />
        </div>
        <div className="skill-intel-skeleton skill-intel-skeleton--table" />
      </div>
    );
  }

  const summary = overview?.summary || {};
  const latestBatch = overview?.latestBatch || null;
  const riskDistribution = Array.isArray(overview?.riskDistribution) ? overview.riskDistribution : [];
  const unknownClusters = Array.isArray(overview?.unknownClusters)
    ? overview.unknownClusters.filter((item) => Number(item.total || 0) > 0)
    : [];
  const reviewRows = Array.isArray(overview?.reviewRows) ? overview.reviewRows : [];
  const safeSlice = riskDistribution.find((item) => item.riskLabel === "safe");
  const reviewSlice = riskDistribution.find((item) => item.riskLabel === "dangerous");
  const unknownSlice = riskDistribution.find((item) => item.riskLabel === "unknown");
  const safePercent = Number(safeSlice?.percent || 0);
  const reviewPercent = Number(reviewSlice?.percent || 0);
  const unknownPercent = Number(unknownSlice?.percent || 0);
  const ringStyle = {
    background: `conic-gradient(#0f766e 0% ${safePercent}%, #dc2626 ${safePercent}% ${safePercent + reviewPercent}%, #d97706 ${safePercent + reviewPercent}% 100%)`,
  };

  return (
    <section className="skill-intel-shell skill-intel-shell--compact">
      <div className="skill-intel-hero skill-intel-hero--clean">
        <div className="skill-intel-hero-copy">
          <span className="skill-intel-badge">基础情报 / 最近批次</span>
          <h3 className="skill-intel-title">Skill 安全结构</h3>
          <p className="skill-intel-desc">重点看安全 Skill、待复核 Skill 和待确定 Skill 的占比，再结合待确定原因与待复核清单做人工判断。</p>
          <div className="skill-intel-meta">
            <span>最近批次 #{latestBatch?.id ?? "--"}</span>
            <span>更新时间 {formatScanTime(latestBatch?.updatedAt)}</span>
            <span>已覆盖仓库 {formatCompactCount(summary.scannedRepos)} / {formatCompactCount(summary.totalRepos)}</span>
          </div>
        </div>

        <div className="skill-intel-ring-card skill-intel-ring-card--clean">
          <div className="skill-intel-ring" style={ringStyle}>
            <div className="skill-intel-ring-inner">
              <strong>{formatPercent(safePercent)}</strong>
              <span>安全 Skill 占比</span>
            </div>
          </div>
          <div className="skill-intel-legend">
            <div><i className="is-completed" />安全 {formatPercent(safePercent)}</div>
            <div><i className="is-failed" />待复核 {formatPercent(reviewPercent)}</div>
            <div><i className="is-skipped" />待确定 {formatPercent(unknownPercent)}</div>
          </div>
        </div>
      </div>

      <div className="skill-intel-kpi-grid">
        <div className="skill-intel-kpi-card skill-intel-kpi-card--clean">
          <div className="skill-intel-kpi-icon"><Database size={18} strokeWidth={1.8} /></div>
          <span className="skill-summary-label">Skill 总量</span>
          <strong>{formatCompactCount(summary.totalSkills)}</strong>
          <span className="skill-metric-hint">数据库当前样本池</span>
        </div>
        <div className="skill-intel-kpi-card skill-intel-kpi-card--clean">
          <div className="skill-intel-kpi-icon"><ShieldCheck size={18} strokeWidth={1.8} /></div>
          <span className="skill-summary-label">安全 Skill 比例</span>
          <strong>{formatPercent(safePercent)}</strong>
          <span className="skill-metric-hint">{formatCompactCount(safeSlice?.total)} 个已归为 safe</span>
        </div>
        <div className="skill-intel-kpi-card skill-intel-kpi-card--danger">
          <div className="skill-intel-kpi-icon"><AlertCircle size={18} strokeWidth={1.8} /></div>
          <span className="skill-summary-label">待复核比例</span>
          <strong>{formatPercent(reviewPercent)}</strong>
          <span className="skill-metric-hint">{formatCompactCount(reviewSlice?.total)} 个进入待复核队列</span>
        </div>
        <div className="skill-intel-kpi-card skill-intel-kpi-card--warm">
          <div className="skill-intel-kpi-icon"><Sparkles size={18} strokeWidth={1.8} /></div>
          <span className="skill-summary-label">待确定比例</span>
          <strong>{formatPercent(unknownPercent)}</strong>
          <span className="skill-metric-hint">{formatCompactCount(unknownSlice?.total)} 个仍待确认</span>
        </div>
      </div>

      <div className="skill-intel-grid">
        <div className="skill-upload-list skill-intel-panel">
          <div className="skill-card-head">
            <div>
              <div className="skill-card-title">安全与待确定结构</div>
              <div className="skill-card-desc">优先看 safe、待复核、待确定三类的结构分布，判断人工介入密度。</div>
            </div>
          </div>
          <div className="skill-intel-stack">
            {riskDistribution.map((item) => (
              <div key={item.riskLabel} className={`skill-intel-stack-row is-${item.riskLabel}`}>
                <div className="skill-intel-stack-head">
                  <span>{item.riskLabel === "safe" ? "安全 Skill / safe" : item.riskLabel === "dangerous" ? "待复核 / dangerous" : "待确定 / unknown"}</span>
                  <strong>{formatCompactCount(item.total)}</strong>
                </div>
                <div className="skill-intel-bar-track">
                  <div className="skill-intel-bar-fill" style={{ width: `${Math.max(Number(item.percent || 0), 1)}%` }} />
                </div>
                <div className="skill-intel-stack-meta">{formatPercent(item.percent)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="skill-upload-list skill-intel-panel">
          <div className="skill-card-head">
            <div>
              <div className="skill-card-title">待确定原因</div>
              <div className="skill-card-desc">待确定并不等于危险，更多是当前证据不足。这里展示最常见的待确定来源。</div>
            </div>
          </div>
          <div className="skill-intel-cluster-list">
            {unknownClusters.length ? unknownClusters.map((item) => (
              <div key={item.reason} className="skill-intel-cluster-item">
                <div>
                  <div className="skill-intel-cluster-title">{getUnknownReasonLabel(item.reason)}</div>
                  <div className="skill-card-desc">占待确定项 {formatPercent(item.percent)}</div>
                </div>
                <strong>{formatCompactCount(item.total)}</strong>
              </div>
            )) : (
              <div className="skill-inline-empty">当前待确定项较少，暂无需要单独强调的原因。</div>
            )}
          </div>
        </div>
      </div>

      <div className="skill-upload-list skill-intel-panel">
        <div className="skill-card-head">
          <div>
            <div className="skill-card-title">待复核 Skill</div>
            <div className="skill-card-desc">展示当前最需要人工复核的 Skill，表格样式与其他界面保持一致。</div>
          </div>
        </div>
        <div className="risk-table-wrap risk-table-wrap-strong">
          <table className="risk-table">
            <thead>
              <tr>
                <th>Skill</th>
                <th>作者 / 仓库</th>
                <th>级别</th>
                <th>发现数</th>
                <th>判定依据</th>
                <th>扫描时间</th>
              </tr>
            </thead>
            <tbody>
              {reviewRows.map((item) => (
                <tr key={`${item.id}-${item.repositoryUrl}`}>
                  <td>
                    <div className="risk-table-title">{item.name || "-"}</div>
                  </td>
                  <td>
                    <div className="risk-table-sub">{item.author || "-"}</div>
                    <div className="risk-table-sub is-mono">{item.repositoryUrl || "-"}</div>
                  </td>
                  <td>
                    <div className="risk-table-badge-row">
                      <SeverityBadge severity={item.maxSeverity} />
                    </div>
                  </td>
                  <td>{formatCompactCount(item.findingCount)}</td>
                  <td>
                    <div className="risk-table-sub">{item.riskSourceText || "-"}</div>
                  </td>
                  <td>{formatScanTime(item.scannedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!reviewRows.length ? <div className="skill-inline-empty">当前没有需要额外展示的待复核 Skill。</div> : null}
        </div>
      </div>
    </section>
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
        <SkillIntelligencePanelV3 />
      ) : (
        <SkillPlaceholder title="文件沙箱分析" desc="用于承接 Skill 文件的静态分析、行为观察与投毒链路回放，辅助识别高风险样本。" icon={Box} />
      )}
    </div>
  );
}

