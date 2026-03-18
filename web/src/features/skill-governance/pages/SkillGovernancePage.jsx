import { useMemo, useRef, useState } from "react";
import {
  Box,
  FileArchive,
  FileCode2,
  FileSearch,
  FolderOpen,
  Search,
  ShieldAlert,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";

const TABS = [
  { id: "intelligence", label: "基础情报" },
  { id: "sandbox", label: "文件沙箱" },
  { id: "skill-detect", label: "Skill检测", badge: "NEW" },
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
    title: "Skill.md / 清单文件",
    desc: "支持单个或多个 Skill.md、README、JSON、YAML 文件。",
    icon: FileCode2,
    accept: ".md,.txt,.json,.yaml,.yml",
    multiple: true,
  },
  {
    id: "folder",
    title: "目录上传",
    desc: "支持按目录整体导入 Skill 工程，便于统一提交检测样本。",
    icon: FolderOpen,
    accept: "",
    multiple: true,
    directory: true,
  },
];

function formatBytes(value) {
  if (!value && value !== 0) return "--";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(2)} MB`;
}

function inferType(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".zip")) return "压缩包";
  if (name.endsWith(".md")) return "Skill.md";
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
    updatedAt: new Date().toLocaleString("zh-CN", { hour12: false }),
  }));
}

function SkillDetectWorkspace() {
  const [uploads, setUploads] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dragging, setDragging] = useState(false);

  const zipInputRef = useRef(null);
  const manifestInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const multiInputRef = useRef(null);

  const totalSize = useMemo(() => uploads.reduce((sum, item) => sum + item.size, 0), [uploads]);

  function appendUploads(fileList, sourceId) {
    if (!fileList?.length) return;
    setUploads((current) => [...makeUploadRecords(fileList, sourceId), ...current]);
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
            <div className="skill-dropzone-title">点击或拖拽上传待检 Skill 样本</div>
            <div className="skill-dropzone-desc">支持 `.zip`、`Skill.md`、JSON/YAML 配置、批量文件及目录导入，满足单个 Skill 与多样本集中检测场景。</div>
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
              <div className="skill-card-title">Skill 库检索入口</div>
              <div className="skill-card-desc">支持通过 Skill 名称、链接或 MD5 发起样本检索，便于快速定位目标 Skill 与关联记录。</div>
            </div>
            <span className="oc-badge oc-badge-review">待接后端</span>
          </div>

          <div className="skill-search-bar">
            <div className="skill-search-input-wrap">
              <Search size={16} className="skill-search-input-icon" />
              <input
                className="oc-input skill-query-input"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="请输入 Skill 名称 / 链接 / MD5"
              />
            </div>
            <button className="oc-primary-btn" type="button">
              搜索
            </button>
          </div>

          <div className="skill-search-state">
            <FileSearch size={18} strokeWidth={1.8} />
            <span>{searchText ? `当前检索条件：${searchText}` : "可在此输入 Skill 名称、样本链接或 MD5，快速发起目标检索。"}</span>
          </div>

          <div className="skill-search-tips">
            <div className="skill-tip-chip">支持模糊匹配</div>
            <div className="skill-tip-chip">支持 MD5 检索</div>
            <div className="skill-tip-chip">支持 URL 检索</div>
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
            <div className="skill-card-desc">展示当前会话中已接收的待检样本，便于统一查看、校验与整理。</div>
          </div>
          {uploads.length ? (
            <button className="oc-ghost-btn" type="button" onClick={() => setUploads([])}>
              清空列表
            </button>
          ) : null}
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
            <span>当前还没有待检样本，上传 Skill 文件、压缩包或目录后会在这里统一展示。</span>
          </div>
        )}
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
          <h2 className="oc-page-title">Skill 检测中心</h2>
          <p className="oc-page-desc">
            面向 Skill 包、Skill.md 清单与目录样本的统一检测入口，支持拖拽上传、批量接收与目标检索，
            便于围绕 Skill 生态开展样本收集、投毒排查与安全研判。
          </p>
        </div>

        <div className="oc-page-header-kpi">
          <div className="oc-kpi">
            <span className="oc-kpi-val">5</span>
            <span className="oc-kpi-label">上传入口类型</span>
          </div>
          <div className="oc-kpi">
            <span className="oc-kpi-val">.zip / .md</span>
            <span className="oc-kpi-label">核心样本格式</span>
          </div>
          <div className="oc-kpi">
            <span className="oc-kpi-val">UI Ready</span>
            <span className="oc-kpi-label">检测入口就绪</span>
          </div>
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
          desc="用于聚合 Skill 来源、信誉、家族关联与传播画像等情报信息，支撑样本研判与线索追踪。"
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
