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

function formatBytes(value) {
  if (!value && value !== 0) return "--";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(2)} MB`;
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
              <div className="skill-card-desc">输入 Skill slug，调用 `scanner` 扫描脚本完成远程拉取与安全检查。</div>
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

      <div className="skill-upload-list">
        <div className="skill-card-head">
          <div>
            <div className="skill-card-title">扫描结果</div>
            <div className="skill-card-desc">展示 `scanner/scripts/scan_skill.py` 返回的结构化结果。</div>
          </div>
          {scanReport ? <span className="oc-badge oc-badge-review">{scanSource === "slug" ? "来源：slug" : "来源：上传样本"}</span> : null}
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
            <div className="skill-result-summary-grid">
              <div className="skill-summary-card">
                <span className="skill-summary-label">总发现</span>
                <strong>{scanReport?.summary?.total_findings ?? 0}</strong>
              </div>
              <div className="skill-summary-card">
                <span className="skill-summary-label">扫描文件数</span>
                <strong>{scanReport?.summary?.total_files_scanned ?? 0}</strong>
              </div>
              {SEVERITY_ORDER.map((severity) => (
                <div key={severity} className="skill-summary-card">
                  <span className="skill-summary-label">{SEVERITY_LABELS[severity]}</span>
                  <strong>{severitySummary[severity] ?? 0}</strong>
                </div>
              ))}
            </div>

            <div className="skill-result-meta">
              <span>Skill 名称：{scanReport?.scan_metadata?.skill_name || "--"}</span>
              <span>扫描时间：{scanReport?.scan_metadata?.scanned_at || "--"}</span>
              <span>来源：{scanReport?.scan_metadata?.source || "--"}</span>
            </div>

            {visibleFindings.length ? (
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
            ) : (
              <div className="skill-empty-state">
                <ShieldAlert size={20} strokeWidth={1.8} />
                <span>本次扫描未发现命中的风险规则。</span>
              </div>
            )}

            {hasFindingOverflow ? (
              <div className="skill-result-footnote">发现项较多，仅展示前 200 条，请在后端日志中查看完整结果。</div>
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
