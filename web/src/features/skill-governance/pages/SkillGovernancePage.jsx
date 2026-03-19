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
  {
    id: "zip",
    title: "Skill 压缩包",
    desc: "支持 .zip 包整体上传，适合直接导入完整 Skill 工程。",
    icon: FileArchive,
    accept: ".zip",
    multiple: true,
  },
  {
    id: "manifest",
    title: "SKILL.md / 清单文件",
    desc: "支持上传 SKILL.md、README、JSON、YAML 等文本配置文件。",
    icon: FileCode2,
    accept: ".md,.txt,.json,.yaml,.yml",
    multiple: true,
  },
  {
    id: "folder",
    title: "目录上传",
    desc: "支持按目录整体导入 Skill 工程，便于批量扫描。",
    icon: FolderOpen,
    accept: "",
    multiple: true,
    directory: true,
  },
];

const SEVERITY_ORDER = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const SEVERITY_LABELS = {
  CRITICAL: "严重",
  HIGH: "高危",
  MEDIUM: "中危",
  LOW: "低危",
};
const SEVERITY_RANK = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};
const RESULT_TONES = {
  CRITICAL: {
    tone: "critical",
    badge: "立即处置",
    title: "检测到严重风险信号",
    desc: "建议先隔离样本，再优先复核命中文件、命中规则与命中内容，避免继续传播或安装。",
    Icon: ShieldAlert,
  },
  HIGH: {
    tone: "high",
    badge: "优先复核",
    title: "存在高危可疑行为",
    desc: "已发现高风险模式，适合先聚焦命中次数最多的文件和类别，缩短人工排查路径。",
    Icon: AlertCircle,
  },
  MEDIUM: {
    tone: "medium",
    badge: "建议核验",
    title: "发现需确认的中风险项",
    desc: "当前更像是可疑指令或外部依赖提示，建议结合上下文继续确认是否真实构成威胁。",
    Icon: FileSearch,
  },
  LOW: {
    tone: "low",
    badge: "留意观察",
    title: "存在低风险提示项",
    desc: "当前以信息提示为主，建议继续人工抽查说明文档、安装脚本和外链来源。",
    Icon: FileSearch,
  },
  CLEAN: {
    tone: "clean",
    badge: "通过初筛",
    title: "未发现命中规则",
    desc: "本轮扫描未命中风险规则，但仍建议对关键脚本、外链和依赖来源做人工复核。",
    Icon: Sparkles,
  },
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

function getResultTone(findingsCount, severitySummary) {
  if (!findingsCount) return RESULT_TONES.CLEAN;
  const topSeverity = getTopSeverity(severitySummary);
  return RESULT_TONES[topSeverity] || RESULT_TONES.LOW;
}

function getCategoryHighlights(findings) {
  const grouped = new Map();

  findings.forEach((item) => {
    const key = item.category || "未分类";
    const current = grouped.get(key);
    const severity = SEVERITY_ORDER.includes(item.severity) ? item.severity : "LOW";

    if (current) {
      current.count += 1;
      if (SEVERITY_RANK[severity] < SEVERITY_RANK[current.severity]) {
        current.severity = severity;
      }
      return;
    }

    grouped.set(key, {
      category: key,
      count: 1,
      severity,
    });
  });

  return Array.from(grouped.values())
    .sort((left, right) => {
      const severityDiff = SEVERITY_RANK[left.severity] - SEVERITY_RANK[right.severity];
      if (severityDiff !== 0) return severityDiff;
      return right.count - left.count;
    })
    .slice(0, 4);
}

function buildRecommendations({ findingsCount, topSeverity, affectedFileCount, scanSource }) {
  if (!findingsCount) {
    return [
      "当前没有命中规则，但仍建议抽查关键脚本与外部链接。",
      "可优先检查安装命令、依赖下载和权限申请说明是否合理。",
      scanSource === "slug" ? "如来自远程 slug，建议补充一次本地解压复核。" : "如样本后续更新，建议重新扫描最新版本。",
    ];
  }

  if (topSeverity === "CRITICAL" || topSeverity === "HIGH") {
    return [
      `优先隔离涉及的 ${affectedFileCount || 0} 个文件路径，避免继续分发或执行。`,
      "先人工复核命中说明与命中文本，确认是否属于真实执行链或敏感资源访问。",
      scanSource === "slug" ? "若为远程拉取样本，建议同步确认来源仓库和下载链路是否可信。" : "若为上传样本，建议保留原始包与扫描报告作为追溯依据。",
    ];
  }

  return [
    "先聚焦中低风险类别中命中次数最多的几项，确认是否只是正常说明文案。",
    "复核外链、安装命令和权限相关描述，判断是否存在误报或上下文依赖。",
    "如需继续收敛范围，可结合文件路径和行号做人工快速抽查。",
  ];
}

function SeverityBadge({ severity }) {
  const level = SEVERITY_ORDER.includes(severity) ? severity : "LOW";
  const className = `skill-severity-badge is-${level.toLowerCase()}`;
  return <span className={className}>{SEVERITY_LABELS[level] || level}</span>;
}

function SkillDetectWorkspace() {
  const [uploads, setUploads] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dragging, setDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSource, setScanSource] = useState("");
  const [scanError, setScanError] = useState("");
  const [scanReport, setScanReport] = useState(null);

  const zipInputRef = useRef(null);
  const manifestInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const multiInputRef = useRef(null);

  const totalSize = useMemo(() => uploads.reduce((sum, item) => sum + item.size, 0), [uploads]);
  const severitySummary = scanReport?.summary?.by_severity || {};
  const findings = Array.isArray(scanReport?.findings) ? scanReport.findings : [];
  const visibleFindings = findings.slice(0, 200);
  const hasFindingOverflow = findings.length > visibleFindings.length;
  const findingsCount = scanReport?.summary?.total_findings ?? 0;
  const scannedFilesCount = scanReport?.summary?.total_files_scanned ?? 0;
  const topSeverity = getTopSeverity(severitySummary);
  const resultTone = getResultTone(findingsCount, severitySummary);
  const affectedFileCount = useMemo(
    () => new Set(findings.map((item) => item.file).filter(Boolean)).size,
    [findings],
  );
  const categoryHighlights = useMemo(() => getCategoryHighlights(findings), [findings]);
  const categoryCount = categoryHighlights.length
    ? new Set(findings.map((item) => item.category || "未分类")).size
    : 0;
  const recommendations = buildRecommendations({
    findingsCount,
    topSeverity,
    affectedFileCount,
    scanSource,
  });
  const sourceBadgeText = scanReport ? (scanSource === "slug" ? "来源：slug 扫描" : "来源：上传样本") : "";
  const reportMetaItems = scanReport
    ? [
        { label: "Skill 名称", value: scanReport?.scan_metadata?.skill_name || "--" },
        { label: "扫描时间", value: formatScanTime(scanReport?.scan_metadata?.scanned_at) },
        { label: "结果来源", value: scanReport?.scan_metadata?.source || "--" },
      ]
    : [];
  const primaryMetrics = scanReport
    ? [
        { label: "总发现", value: findingsCount, hint: "命中规则" },
        { label: "影响文件", value: affectedFileCount, hint: "涉及路径" },
        { label: "风险类别", value: categoryCount, hint: "聚合维度" },
        { label: "扫描文件", value: scannedFilesCount, hint: "已分析文件" },
      ]
    : [];
  const ToneIcon = resultTone.Icon;

  function appendUploads(fileList, sourceId) {
    if (!fileList?.length) return;
    setUploads((current) => [...makeUploadRecords(fileList, sourceId), ...current]);
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
      const report = await scanSkillFiles(uploads);
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
      const report = await scanSkillBySlug(slug);
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
              支持 `.zip`、`SKILL.md`、JSON/YAML 配置、批量文件及目录导入，扫描后会展示风险等级与命中规则。
            </div>
            <div className="skill-dropzone-actions">
              <button
                className="oc-primary-btn"
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  multiInputRef.current?.click();
                }}
              >
                选择文件
              </button>
              <button
                className="oc-ghost-btn"
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  folderInputRef.current?.click();
                }}
              >
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
              const ref =
                option.id === "zip" ? zipInputRef : option.id === "manifest" ? manifestInputRef : folderInputRef;

              return (
                <button
                  key={option.id}
                  type="button"
                  className="skill-source-card"
                  onClick={() => ref.current?.click()}
                >
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
              <div className="skill-card-title">Skill 库扫描入口</div>
              <div className="skill-card-desc">
                输入 Skill slug，调用 `scanner` 扫描脚本完成远程拉取与安全检查。
              </div>
            </div>
            <span className="oc-badge oc-badge-online">已接后端</span>
          </div>

          <div className="skill-search-bar">
            <div className="skill-search-input-wrap">
              <Search size={16} className="skill-search-input-icon" />
              <input
                className="oc-input skill-query-input"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="请输入 Skill slug"
              />
            </div>
            <button className="oc-primary-btn" type="button" onClick={handleScanBySlug} disabled={isScanning}>
              {isScanning && scanSource === "slug" ? "扫描中..." : "按 slug 扫描"}
            </button>
          </div>

          <div className="skill-search-state">
            <FileSearch size={18} strokeWidth={1.8} />
            <span>{searchText ? `当前 slug：${searchText}` : "可在此输入 Skill slug 直接触发扫描。"}</span>
          </div>

          <div className="skill-search-tips">
            <div className="skill-tip-chip">支持本地上传扫描</div>
            <div className="skill-tip-chip">支持 slug 拉取扫描</div>
            <div className="skill-tip-chip">返回结构化 JSON 报告</div>
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
            <span>当前还没有待扫描样本，上传文件后即可触发安全扫描。</span>
          </div>
        )}
      </div>

      <div className="skill-upload-list skill-result-panel">
        <div className="skill-card-head skill-card-head--result">
          <div>
            <div className="skill-card-title">扫描结果</div>
            <div className="skill-card-desc">展示 `scanner/scripts/scan_skill.py` 返回的结构化结果。</div>
          </div>
          {scanReport ? <span className="oc-badge oc-badge-review">{sourceBadgeText}</span> : null}
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
            <span>尚未执行扫描。可上传样本后点击“扫描已上传样本”，或输入 slug 直接扫描。</span>
          </div>
        ) : null}

        {scanReport ? (
          <>
            <section className={`skill-result-hero is-${resultTone.tone}`}>
              <div className="skill-result-hero-main">
                <div className={`skill-result-hero-icon is-${resultTone.tone}`}>
                  <ToneIcon size={22} strokeWidth={1.9} />
                </div>
                <div className="skill-result-hero-copy">
                  <span className={`skill-result-hero-badge is-${resultTone.tone}`}>{resultTone.badge}</span>
                  <h3 className="skill-result-hero-title">{resultTone.title}</h3>
                  <p className="skill-result-hero-desc">{resultTone.desc}</p>
                  <div className="skill-result-meta">
                    {reportMetaItems.map((item) => (
                      <span key={item.label}>
                        {item.label}：{item.value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="skill-result-hero-side">
                <div className="skill-result-hero-stat">
                  <span className="skill-result-hero-stat-label">首要级别</span>
                  <strong>{topSeverity ? SEVERITY_LABELS[topSeverity] : "无命中"}</strong>
                </div>
                <div className="skill-result-hero-stat">
                  <span className="skill-result-hero-stat-label">优先核查</span>
                  <strong>{categoryHighlights[0]?.category || "人工复核"}</strong>
                </div>
              </div>
            </section>

            <div className="skill-result-summary-grid">
              {primaryMetrics.map((metric) => (
                <div key={metric.label} className="skill-metric-card">
                  <span className="skill-summary-label">{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <span className="skill-metric-hint">{metric.hint}</span>
                </div>
              ))}
            </div>

            <div className="skill-severity-strip">
              {SEVERITY_ORDER.map((severity) => (
                <div key={severity} className={`skill-severity-card is-${severity.toLowerCase()}`}>
                  <div className="skill-severity-card-top">
                    <SeverityBadge severity={severity} />
                    <span className="skill-severity-count">{severitySummary[severity] ?? 0}</span>
                  </div>
                  <div className="skill-severity-card-foot">规则命中</div>
                </div>
              ))}
            </div>

            <div className="skill-result-insight-grid">
              <div className="skill-insight-card">
                <div className="skill-insight-head">
                  <div className="skill-insight-icon">
                    <ShieldAlert size={18} strokeWidth={1.8} />
                  </div>
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
                  <div className="skill-insight-icon">
                    <FileSearch size={18} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div className="skill-card-title">处置建议</div>
                    <div className="skill-card-desc">根据本次风险分布给出下一步建议，方便快速继续排查。</div>
                  </div>
                </div>

                <div className="skill-recommend-list">
                  {recommendations.map((item) => (
                    <div key={item} className="skill-recommend-item">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {visibleFindings.length ? (
              <div className="skill-table-shell">
                <div className="skill-table-toolbar">
                  <div>
                    <div className="skill-card-title">命中明细</div>
                    <div className="skill-card-desc">保留结构化表格，便于继续按文件、行号和命中文本做人工判断。</div>
                  </div>
                  <div className="skill-table-toolbar-note">当前展示 {visibleFindings.length} 条结果</div>
                </div>

                <div className="skill-finding-table-wrap">
                  <table className="skill-finding-table">
                    <thead>
                      <tr>
                        <th>级别</th>
                        <th>类别</th>
                        <th>说明</th>
                        <th>文件</th>
                        <th>行号</th>
                        <th>命中文本</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleFindings.map((item, index) => (
                        <tr key={`${item.file || "unknown"}-${item.line || 0}-${index}`}>
                          <td>
                            <SeverityBadge severity={item.severity} />
                          </td>
                          <td>{item.category || "--"}</td>
                          <td>{item.message || "--"}</td>
                          <td className="is-mono">{item.file || "--"}</td>
                          <td>{item.line ?? "--"}</td>
                          <td className="is-mono">{item.matched_text || "--"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="skill-empty-state skill-clean-state">
                <Sparkles size={20} strokeWidth={1.8} />
                <span>本次扫描未发现命中的风险规则。</span>
              </div>
            )}

            {hasFindingOverflow ? (
              <div className="skill-result-footnote">发现项较多，当前仅展示前 200 条，请结合后端日志查看完整结果。</div>
            ) : null}
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

export default function SkillGovernancePage() {
  const [activeTab, setActiveTab] = useState("skill-detect");

  return (
    <div className="oc-page skill-page">
      <section className="oc-page-header skill-page-header">
        <div className="oc-page-header-main">
          <div className="oc-page-tag">Skill 生态后门投毒治理</div>
          <h2 className="oc-page-title">Skill 扫描中心</h2>
          <p className="oc-page-desc">
            面向 Skill 包、SKILL.md 清单与目录样本的统一扫描入口，支持拖拽上传、批量接收和 slug 直扫，帮助安全团队快速识别风险。
          </p>
        </div>
      </section>

      <div className="skill-tabs" role="tablist" aria-label="Skill 工作台标签">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`skill-tab${activeTab === tab.id ? " is-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.label}</span>
            {tab.badge ? <span className="skill-tab-badge">{tab.badge}</span> : null}
          </button>
        ))}
      </div>

      {activeTab === "skill-detect" ? (
        <SkillDetectWorkspace />
      ) : activeTab === "intelligence" ? (
        <SkillPlaceholder
          title="基础情报面板"
          desc="用于聚合 Skill 来源、信誉、家族关联与传播画像等情报信息，支撑研判和溯源。"
          icon={Sparkles}
        />
      ) : (
        <SkillPlaceholder
          title="文件沙箱分析"
          desc="用于承接 Skill 文件的静态分析、行为观察与投毒链路回放，辅助识别高风险样本。"
          icon={Box}
        />
      )}
    </div>
  );
}
