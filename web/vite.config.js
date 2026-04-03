import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UNIFIED_SCANNER_SCRIPT_PATH = path.resolve(__dirname, "../scanners/scanner2/unified_cli.py");
const REPO_VENV_PYTHON_WINDOWS = path.resolve(__dirname, "../.venv-skill-scan/Scripts/python.exe");
const REPO_VENV_PYTHON_POSIX = path.resolve(__dirname, "../.venv-skill-scan/bin/python");
const TEMP_PREFIX = "clawguard-skill-scan-";
const MAX_REQUEST_SIZE_BYTES = 50 * 1024 * 1024;
const STATIC_SCANNER_IDS = ["scanner1", "scanner2"];
const DEEP_ANALYSIS_SCANNER_IDS = ["scanner1", "scanner2", "scanner5"];
const DEEP_SCAN_JOB_TTL_MS = 2 * 60 * 60 * 1000;
const deepScanJobs = new Map();
const PYTHON_CANDIDATES = [
  [REPO_VENV_PYTHON_WINDOWS, []],
  [REPO_VENV_PYTHON_POSIX, []],
  ["py", ["-3"]],
  ["python3", []],
  ["python", []],
];
const ZIP_EXTRACT_INLINE_PY = `
import os
import pathlib
import sys
import zipfile

root = pathlib.Path(sys.argv[1]).resolve()
zip_files = [p for p in root.rglob("*") if p.is_file() and p.suffix.lower() == ".zip"]

for zip_path in zip_files:
    target = zip_path.parent / (zip_path.stem + "_unzipped")
    suffix = 1
    while target.exists():
        suffix += 1
        target = zip_path.parent / f"{zip_path.stem}_unzipped_{suffix}"
    target.mkdir(parents=True, exist_ok=False)

    with zipfile.ZipFile(zip_path, "r") as zf:
        target_resolved = target.resolve()
        for member in zf.infolist():
            member_path = (target / pathlib.Path(member.filename)).resolve()
            if not str(member_path).startswith(str(target_resolved) + os.sep) and member_path != target_resolved:
                raise RuntimeError(
                    f"Zip Slip detected: '{member.filename}' escapes extraction target '{target_resolved}'."
                )
        zf.extractall(target)
`;
const CLAWHUB_DOWNLOAD_INLINE_PY = `
import os
import pathlib
import sys
import urllib.request
import zipfile

CLAWHUB_API_BASE = "https://clawhub.ai/api/v1"
tmp_dir = pathlib.Path(sys.argv[1]).resolve()
slug = sys.argv[2].strip()
version = sys.argv[3].strip() or None

if not slug:
    raise SystemExit("Skill slug is required.")

safe_slug = slug.replace("/", "_").replace("\\\\", "_")
download_url = f"{CLAWHUB_API_BASE}/download?slug={slug}"
if version:
    download_url += f"&version={version}"

zip_path = tmp_dir / f"{safe_slug}.zip"
request = urllib.request.Request(download_url, headers={"User-Agent": "clawguard-unified-scan/1.0"})
with urllib.request.urlopen(request, timeout=120) as response:
    zip_path.write_bytes(response.read())

extract_dir = tmp_dir / "downloaded_skill"
extract_dir.mkdir(parents=True, exist_ok=True)

with zipfile.ZipFile(zip_path, "r") as zf:
    extract_root = extract_dir.resolve()
    for member in zf.infolist():
        member_path = (extract_dir / pathlib.Path(member.filename)).resolve()
        if not str(member_path).startswith(str(extract_root) + os.sep) and member_path != extract_root:
            raise RuntimeError(
                f"Zip Slip detected: '{member.filename}' escapes extraction target '{extract_root}'."
            )
    zf.extractall(extract_dir)

matches = [path.parent for path in extract_dir.rglob("SKILL.md")]
if len(matches) == 1:
    print(matches[0])
    raise SystemExit(0)

entries = list(extract_dir.iterdir()) if extract_dir.exists() else []
directories = [entry for entry in entries if entry.is_dir()]
files = [entry for entry in entries if entry.is_file()]

if not files and len(directories) == 1:
    print(directories[0])
else:
    print(extract_dir)
`;

function normalizeRepositoryUrl(repositoryUrl) {
  const value = String(repositoryUrl || "").trim();
  if (!value) {
    throw new Error("Repository URL is required.");
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(value);
  } catch {
    throw new Error("Repository URL is not a valid URL.");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error(`Unsupported repository URL protocol: ${parsedUrl.protocol}`);
  }

  return parsedUrl.toString();
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > MAX_REQUEST_SIZE_BYTES) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });

    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });

    req.on("error", (error) => reject(error));
  });
}

function normalizeRelativePath(relativePath, fallbackName) {
  const source = String(relativePath || fallbackName || "unknown.bin")
    .replace(/\\/g, "/")
    .replace(/^[a-zA-Z]:/, "");

  const parts = source.split("/").filter((segment) => segment && segment !== "." && segment !== "..");
  if (!parts.length) {
    return fallbackName || "unknown.bin";
  }
  return parts.join(path.sep);
}

function ensureInsideRoot(rootDir, targetPath) {
  const normalizedRoot = path.resolve(rootDir);
  const normalizedTarget = path.resolve(targetPath);
  return normalizedTarget === normalizedRoot || normalizedTarget.startsWith(`${normalizedRoot}${path.sep}`);
}

function materializeUploadedFiles(files) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), TEMP_PREFIX));

  for (const item of files) {
    const safeRelativePath = normalizeRelativePath(item?.relativePath, item?.name);
    const destination = path.resolve(tempDir, safeRelativePath);

    if (!ensureInsideRoot(tempDir, destination)) {
      throw new Error(`Invalid file path: ${item?.relativePath || item?.name || "<unknown>"}`);
    }

    const base64 = String(item?.contentBase64 || "");
    const content = Buffer.from(base64, "base64");

    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, content);
  }

  return tempDir;
}

function findSkillRoot(tempDir) {
  const matches = [];
  const queue = [tempDir];

  while (queue.length) {
    const current = queue.shift();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        queue.push(fullPath);
        continue;
      }
      if (entry.isFile() && entry.name === "SKILL.md") {
        matches.push(current);
      }
    }
  }

  if (matches.length === 1) {
    return matches[0];
  }

  const rootEntries = fs.readdirSync(tempDir, { withFileTypes: true });
  const rootDirs = rootEntries.filter((entry) => entry.isDirectory());
  const rootFiles = rootEntries.filter((entry) => entry.isFile());

  if (!rootFiles.length && rootDirs.length === 1) {
    return path.join(tempDir, rootDirs[0].name);
  }

  return tempDir;
}

function spawnAndCapture(command, args, cwd = __dirname) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      reject(new Error(`Failed to start '${command}': ${error.message}`));
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }
      const message = stderr.trim() || `Scanner exited with code ${code}.`;
      reject(new Error(message));
    });
  });
}

async function runPythonCommand(args, options = {}) {
  let lastError = null;
  const { cwd = __dirname } = options;

  for (const [python, prefixArgs] of PYTHON_CANDIDATES) {
    try {
      return await spawnAndCapture(python, [...prefixArgs, ...args], cwd);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Cannot run Python command. Please check Python runtime.");
}

async function extractZipFiles(tempDir) {
  await runPythonCommand(["-c", ZIP_EXTRACT_INLINE_PY, tempDir]);
}

async function prepareSlugSkillRoot(slug, version = "") {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), TEMP_PREFIX));
  try {
    const result = await runPythonCommand(["-c", CLAWHUB_DOWNLOAD_INLINE_PY, tempDir, slug, version || ""]);
    const skillRoot = String(result.stdout || "").trim();

    if (!skillRoot || !fs.existsSync(skillRoot)) {
      throw new Error("Failed to locate downloaded skill directory.");
    }

    return { tempDir, skillRoot };
  } catch (error) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    if (error instanceof Error) {
      throw new Error(`Failed to download skill by slug: ${error.message}`);
    }
    throw error;
  }
}

async function prepareRepositorySkillRoot(repositoryUrl) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), TEMP_PREFIX));
  const normalizedUrl = normalizeRepositoryUrl(repositoryUrl);
  const targetDir = path.join(tempDir, "repository");

  try {
    await spawnAndCapture(
      "git",
      ["-c", "core.longpaths=true", "clone", "--depth", "1", normalizedUrl, targetDir],
      __dirname,
    );

    if (!fs.existsSync(targetDir)) {
      throw new Error("Repository clone target was not created.");
    }

    return { tempDir, skillRoot: findSkillRoot(targetDir) };
  } catch (error) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    if (error instanceof Error) {
      throw new Error(`Failed to clone repository: ${error.message}`);
    }
    throw error;
  }
}

function buildUnifiedScannerArgs(targetPath, options = {}) {
  const authState = options.authState === "authenticated" ? "authenticated" : "guest";
  const args = [UNIFIED_SCANNER_SCRIPT_PATH, targetPath, "--auth-state", authState];

  if (typeof options.deepseekApiKey === "string" && options.deepseekApiKey.trim()) {
    args.push("--deepseek-api-key", options.deepseekApiKey.trim());
  }
  if (typeof options.deepseekModel === "string" && options.deepseekModel.trim()) {
    args.push("--deepseek-model", options.deepseekModel.trim());
  }
  if (typeof options.deepseekBaseUrl === "string" && options.deepseekBaseUrl.trim()) {
    args.push("--deepseek-base-url", options.deepseekBaseUrl.trim());
  }
  if (typeof options.language === "string" && options.language.trim()) {
    args.push("--language", options.language.trim());
  }
  if (Number.isFinite(options.timeoutMs) && options.timeoutMs > 0) {
    args.push("--timeout-ms", String(options.timeoutMs));
  }
  if (Array.isArray(options.enableScanners)) {
    for (const scannerId of options.enableScanners) {
      if (typeof scannerId === "string" && scannerId.trim()) {
        args.push("--enable-scanner", scannerId.trim());
      }
    }
  }
  if (Array.isArray(options.disableScanners)) {
    for (const scannerId of options.disableScanners) {
      if (typeof scannerId === "string" && scannerId.trim()) {
        args.push("--disable-scanner", scannerId.trim());
      }
    }
  }

  return args;
}

async function runUnifiedScanner(scanOptions) {
  try {
    const scanArgs = buildUnifiedScannerArgs(scanOptions.targetPath, scanOptions);
    return await runPythonCommand(scanArgs, {
      cwd: path.dirname(UNIFIED_SCANNER_SCRIPT_PATH),
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to run scanner: ${error.message}`);
    }
    throw error;
  }
}

async function prepareUploadedSkillRoot(files) {
  const tempDir = materializeUploadedFiles(files);
  try {
    await extractZipFiles(tempDir);
  } catch (error) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    if (error instanceof Error) {
      throw new Error(`Failed to extract zip archive: ${error.message}`);
    }
    throw error;
  }

  return { tempDir, skillRoot: findSkillRoot(tempDir) };
}

function parseScannerStdout(result) {
  try {
    return JSON.parse(result.stdout);
  } catch {
    throw new Error(`Scanner did not return valid JSON. ${result.stderr.trim()}`);
  }
}

function getRequestUrl(req) {
  return new URL(req.originalUrl || req.url || "/", "http://localhost");
}

function pruneDeepScanJobs() {
  const now = Date.now();
  for (const [scanId, job] of deepScanJobs.entries()) {
    if ((job.status === "completed" || job.status === "failed") && now - job.updatedAt > DEEP_SCAN_JOB_TTL_MS) {
      deepScanJobs.delete(scanId);
    }
  }
}

function buildDetectionReport(report, options = {}) {
  const summary = report?.summary || {};
  const targetName = path.basename(String(report?.target_path || "skill-scan")) || "skill-scan";
  const timestamp = new Date().toISOString();
  const safeTimestamp = timestamp.replace(/[.:]/g, "-");
  const fileName = `${targetName}-detection-report-${safeTimestamp}.md`;
  const findings = Array.isArray(report?.findings) ? report.findings : [];
  const severityRank = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1, INFO: 0, UNKNOWN: -1 };

  const byCategory = new Map();
  const byFile = new Map();
  for (const item of findings) {
    const category = String(item?.category || "未分类");
    const severity = String(item?.severity || "UNKNOWN").toUpperCase();
    const filePath = String(item?.file_path || "");

    const categoryItem = byCategory.get(category) || { count: 0, maxSeverity: "UNKNOWN" };
    categoryItem.count += 1;
    if ((severityRank[severity] ?? -1) > (severityRank[categoryItem.maxSeverity] ?? -1)) {
      categoryItem.maxSeverity = severity;
    }
    byCategory.set(category, categoryItem);

    if (filePath) {
      byFile.set(filePath, (byFile.get(filePath) || 0) + 1);
    }
  }

  const topCategories = Array.from(byCategory.entries())
    .sort((a, b) => {
      const severityDiff = (severityRank[b[1].maxSeverity] ?? -1) - (severityRank[a[1].maxSeverity] ?? -1);
      if (severityDiff !== 0) return severityDiff;
      return b[1].count - a[1].count;
    })
    .slice(0, 6);

  const hotFiles = Array.from(byFile.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const overall = String(summary.overall_conclusion || "unknown");
  const stageAdvice = overall === "block"
    ? "建议立即阻断上线，先完成高危修复与复测。"
    : overall === "manual_review_required"
      ? "建议进入人工复核流程，逐项确认可利用性与影响范围。"
      : overall === "review_recommended"
        ? "建议按风险类别分批整改，优先处理可触发链路。"
        : "建议保持持续监控并纳入上线前抽检。";

  const lines = [
    "# Skill 检测报告（深度分析）",
    "",
    `- 生成时间：${timestamp}`,
    `- 任务编号：${options.scanId || "n/a"}`,
    `- 检测目标：${report?.target_path || "unknown"}`,
    `- 结论级别：${summary.max_severity || "UNKNOWN"} / ${overall}`,
    "",
    "## 一、结论解读",
    "",
    stageAdvice,
    "",
    "## 二、风险簇画像（按类别聚合）",
    "",
  ];

  if (topCategories.length) {
    topCategories.forEach(([category, meta], index) => {
      lines.push(`${index + 1}. ${category}`);
      lines.push(`   - 规模：${meta.count} 条`);
      lines.push(`   - 最高级别：${meta.maxSeverity}`);
      lines.push("   - 治理建议：为该类别建立专项修复清单，按“入口点 -> 传播路径 -> 落地危害”顺序闭环。");
    });
  } else {
    lines.push("- 暂未形成明显风险簇。");
  }

  lines.push("", "## 三、重点文件关注清单", "");
  if (hotFiles.length) {
    hotFiles.forEach(([filePath, count], index) => {
      lines.push(`${index + 1}. \`${filePath}\`（关联 ${count} 条风险）`);
    });
  } else {
    lines.push("- 当前未识别到需要重点关注的文件。");
  }

  lines.push(
    "",
    "## 四、整改行动建议（可直接执行）",
    "",
    "1. 先处理高风险入口：优先修复可触发外部输入、命令执行、动态加载、远程调用的代码点。",
    "2. 建立二次验证门槛：修复后至少执行一次静态复扫 + 关键路径人工复核，避免“修复回退”。",
    "3. 把修复转成规则：将本次问题抽象为团队规范（代码模板、review checklist、CI 规则）。",
    "4. 供应链最小权限：限制第三方依赖、脚本和外链访问范围，收敛运行时权限。",
    "5. 输出审计证据：保留修复提交、复测结果和报告快照，便于追溯与合规审计。",
    "",
    "## 五、上线前安全门禁清单",
    "",
    "- [ ] 高危项已清零或明确接受风险（含审批记录）",
    "- [ ] 核心文件已完成双人复核",
    "- [ ] 依赖与外链已完成来源可信性确认",
    "- [ ] 已设置发布后回滚与告警策略",
    "",
    "## 六、持续监控建议",
    "",
    "- 每次版本发布执行自动复扫并保留差异报告。",
    "- 对高风险文件建立变更告警（路径级监控）。",
    "- 对外部能力调用建立调用频次与异常行为监控。",
  );

  return {
    fileName,
    generatedAt: timestamp,
    format: "markdown",
    content: lines.join("\n"),
  };
}

function startDeepScanJob({ scanId, tempDir, targetPath, scanOptions }) {
  const existing = deepScanJobs.get(scanId);
  if (!existing) {
    return;
  }

  deepScanJobs.set(scanId, {
    ...existing,
    status: "running",
    updatedAt: Date.now(),
    message: "Deep scan is running.",
  });

  (async () => {
    try {
      const result = await runUnifiedScanner({
        ...scanOptions,
        targetPath,
      });
      const report = parseScannerStdout(result);
      const detectionReport = buildDetectionReport(report, { scanId });
      const current = deepScanJobs.get(scanId);
      if (!current) {
        return;
      }
      deepScanJobs.set(scanId, {
        ...current,
        status: "completed",
        updatedAt: Date.now(),
        report,
        detectionReport,
        message: "Deep scan completed.",
      });
    } catch (error) {
      const current = deepScanJobs.get(scanId);
      if (!current) {
        return;
      }
      deepScanJobs.set(scanId, {
        ...current,
        status: "failed",
        updatedAt: Date.now(),
        message: error instanceof Error ? error.message : "Deep scan failed.",
      });
    } finally {
      if (tempDir) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    }
  })();
}

function skillScanApiPlugin() {
  return {
    name: "skill-scan-api",
    configureServer(server) {
      server.middlewares.use("/api/skill/scan", async (req, res, next) => {
        const requestUrl = getRequestUrl(req);
        pruneDeepScanJobs();

        if (req.method === "GET" && requestUrl.pathname.endsWith("/status")) {
          const scanId = String(requestUrl.searchParams.get("scanId") || "").trim();
          if (!scanId) {
            sendJson(res, 400, { ok: false, message: "scanId is required." });
            return;
          }

          const job = deepScanJobs.get(scanId);
          if (!job) {
            sendJson(res, 404, { ok: false, message: "Scan job not found or expired." });
            return;
          }

          sendJson(res, 200, {
            ok: true,
            status: job.status,
            message: job.message,
            report: job.status === "completed" ? job.report : null,
            detectionReport: job.status === "completed" ? job.detectionReport : null,
          });
          return;
        }

        if (req.method !== "POST") {
          next();
          return;
        }

        if (!fs.existsSync(UNIFIED_SCANNER_SCRIPT_PATH)) {
          sendJson(res, 500, {
            ok: false,
            message: `Scanner script not found: ${UNIFIED_SCANNER_SCRIPT_PATH}`,
          });
          return;
        }

        let tempDir = null;
        try {
          const body = await readJsonBody(req);
          const slug = typeof body.slug === "string" ? body.slug.trim() : "";
          const repositoryUrl = typeof body.repositoryUrl === "string" ? body.repositoryUrl.trim() : "";
          const version = typeof body.version === "string" ? body.version.trim() : "";
          const files = Array.isArray(body.files) ? body.files : [];
          const authState = body.authState === "authenticated" ? "authenticated" : "guest";
          const scanOptions = {
            authState,
            deepseekApiKey: typeof body.deepseekApiKey === "string" ? body.deepseekApiKey : "",
            deepseekModel: typeof body.deepseekModel === "string" ? body.deepseekModel : "",
            deepseekBaseUrl: typeof body.deepseekBaseUrl === "string" ? body.deepseekBaseUrl : "",
            language: typeof body.language === "string" ? body.language : "zh",
            timeoutMs: Number(body.timeoutMs),
            enableScanners: Array.isArray(body.enableScanners) ? body.enableScanners : [],
            disableScanners: Array.isArray(body.disableScanners) ? body.disableScanners : [],
          };

          if (!slug && !repositoryUrl && !files.length) {
            sendJson(res, 400, {
              ok: false,
              message: "Request must include either 'slug', 'repositoryUrl', or non-empty 'files'.",
            });
            return;
          }

          let targetPath = "";
          if (slug) {
            const prepared = await prepareSlugSkillRoot(slug, version);
            tempDir = prepared.tempDir;
            targetPath = prepared.skillRoot;
          } else if (repositoryUrl) {
            const prepared = await prepareRepositorySkillRoot(repositoryUrl);
            tempDir = prepared.tempDir;
            targetPath = prepared.skillRoot;
          } else {
            const prepared = await prepareUploadedSkillRoot(files);
            tempDir = prepared.tempDir;
            targetPath = prepared.skillRoot;
          }

          const staticResult = await runUnifiedScanner({
            ...scanOptions,
            authState: "guest",
            deepseekApiKey: "",
            enableScanners: STATIC_SCANNER_IDS,
            disableScanners: [],
            targetPath,
          });
          const staticReport = parseScannerStdout(staticResult);

          const canRunDeepScan = authState === "authenticated" && Boolean(String(scanOptions.deepseekApiKey || "").trim());
          if (!canRunDeepScan) {
            sendJson(res, 200, {
              ok: true,
              stage: "static",
              pending: false,
              report: staticReport,
              message: authState === "authenticated"
                ? "Static report is ready. Provide API key to run deep AI analysis."
                : "Static report is ready.",
            });
            return;
          }

          const scanId = randomUUID();
          deepScanJobs.set(scanId, {
            scanId,
            status: "queued",
            message: "Deep scan queued.",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            report: null,
            detectionReport: null,
          });

          startDeepScanJob({
            scanId,
            tempDir,
            targetPath,
            scanOptions: {
              ...scanOptions,
              authState: "authenticated",
              enableScanners: DEEP_ANALYSIS_SCANNER_IDS,
              disableScanners: [],
            },
          });
          tempDir = null;

          sendJson(res, 200, {
            ok: true,
            stage: "static",
            pending: true,
            scanId,
            report: staticReport,
            message: "Static report is ready. Deep AI analysis is running in background.",
          });
        } catch (error) {
          sendJson(res, 500, {
            ok: false,
            message: error instanceof Error ? error.message : "Skill scan failed.",
          });
        } finally {
          if (tempDir) {
            fs.rmSync(tempDir, { recursive: true, force: true });
          }
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), skillScanApiPlugin()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api/exposure": {
        target: process.env.EXPOSURE_API_PROXY || "http://127.0.0.1:8787",
        changeOrigin: true,
      },
      "/api/openclaw-risk": {
        target: process.env.EXPOSURE_API_PROXY || "http://127.0.0.1:8787",
        changeOrigin: true,
      },
      "/api/security-research": {
        target: process.env.EXPOSURE_API_PROXY || "http://127.0.0.1:8787",
        changeOrigin: true,
      },
      "/api/skill/search": {
        target: process.env.EXPOSURE_API_PROXY || "http://127.0.0.1:8787",
        changeOrigin: true,
      },
      "/api/skill/intelligence": {
        target: process.env.EXPOSURE_API_PROXY || "http://127.0.0.1:8787",
        changeOrigin: true,
      },
      "/api/health": {
        target: process.env.EXPOSURE_API_PROXY || "http://127.0.0.1:8787",
        changeOrigin: true,
      },
    },
  },
});
