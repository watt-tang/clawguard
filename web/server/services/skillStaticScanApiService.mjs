import crypto from "node:crypto";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(__dirname, "..", "..");
const REPO_ROOT = path.resolve(WEB_ROOT, "..");
const WORK_ROOT = process.env.SKILL_SCAN_WORK_ROOT || path.resolve(REPO_ROOT, "runtime-cache", "skill-static-api");
const REPO_CACHE_ROOT = process.env.SKILL_SCAN_CACHE_DIR || path.resolve(REPO_ROOT, "runtime-cache", "skill-static-repos");
const SCANNER2_SCRIPT = path.resolve(REPO_ROOT, "scanners", "scanner2", "unified_cli.py");
const PYTHON_CANDIDATES = ["python3"];
const MAX_UPLOAD_BYTES = Number(process.env.SKILL_SCAN_MAX_UPLOAD_BYTES || 80 * 1024 * 1024);
const scanResultStore = new Map();

function nowIso() {
  return new Date().toISOString();
}

async function ensureDir(dirPath) {
  await fsp.mkdir(dirPath, { recursive: true });
}

function sanitizeRelativePath(value, fallback = "file") {
  const parts = String(value || fallback)
    .replace(/\\/g, "/")
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => part !== "." && part !== "..");
  return parts.length ? parts.join(path.sep) : fallback;
}

function runProcess(command, args, options = {}) {
  const { cwd = REPO_ROOT, env = process.env, timeoutMs = 300000, input = null } = options;
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env,
      stdio: [input == null ? "ignore" : "pipe", "pipe", "pipe"],
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (timedOut) {
        reject(new Error(`Process timed out after ${timeoutMs}ms`));
        return;
      }
      if (code !== 0) {
        reject(new Error(stderr.trim() || stdout.trim() || `Process exited with code ${code}`));
        return;
      }
      resolve({ stdout, stderr });
    });

    if (input != null) {
      child.stdin.end(input);
    }
  });
}

async function runPython(args, options = {}) {
  let lastError = null;
  for (const python of PYTHON_CANDIDATES) {
    try {
      return await runProcess(python, args, {
        ...options,
        env: {
          ...process.env,
          PYTHONIOENCODING: "utf-8",
          PYTHONUTF8: "1",
          ...(options.env || {}),
        },
      });
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("No usable Python runtime found.");
}

async function extractZip(zipPath, targetDir) {
  await ensureDir(targetDir);
  const script = String.raw`
import os, sys, zipfile
zip_path, target_dir = sys.argv[1], sys.argv[2]
target_root = os.path.realpath(target_dir)
with zipfile.ZipFile(zip_path, "r") as zf:
    for member in zf.infolist():
        destination = os.path.realpath(os.path.join(target_root, member.filename))
        if destination != target_root and not destination.startswith(target_root + os.sep):
            raise SystemExit(f"Zip Slip detected: {member.filename}")
    zf.extractall(target_root)
`;
  await runPython(["-c", script, zipPath, targetDir], { timeoutMs: 180000 });
}

async function findSkillRoots(rootDir) {
  const roots = [];
  async function walk(currentDir) {
    let entries = [];
    try {
      entries = await fsp.readdir(currentDir, { withFileTypes: true });
    } catch {
      return;
    }
    if (entries.some((entry) => entry.isFile() && entry.name === "SKILL.md")) {
      roots.push(currentDir);
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if ([".git", "node_modules", "__pycache__"].includes(entry.name)) continue;
      await walk(path.join(currentDir, entry.name));
    }
  }
  await walk(rootDir);
  roots.sort((left, right) => left.split(path.sep).length - right.split(path.sep).length || left.localeCompare(right));
  return roots;
}

async function chooseScanTarget(rootDir) {
  const roots = await findSkillRoots(rootDir);
  return roots[0] || rootDir;
}

async function prepareUploadTarget(files, requestDir) {
  if (!Array.isArray(files) || !files.length) {
    throw new Error("No upload files to scan.");
  }

  const inputDir = path.join(requestDir, "input");
  const extractedDir = path.join(requestDir, "extracted");
  await ensureDir(inputDir);
  await ensureDir(extractedDir);

  let totalBytes = 0;
  const zipPaths = [];
  for (const [index, file] of files.entries()) {
    const name = sanitizeRelativePath(file?.relativePath || file?.name, `file-${index + 1}`);
    const contentBase64 = String(file?.contentBase64 || "");
    if (!contentBase64) continue;
    const buffer = Buffer.from(contentBase64, "base64");
    totalBytes += buffer.length;
    if (totalBytes > MAX_UPLOAD_BYTES) {
      throw new Error("Upload payload is too large for static scanning.");
    }
    const destination = path.join(inputDir, name);
    await ensureDir(path.dirname(destination));
    await fsp.writeFile(destination, buffer);
    if (name.toLowerCase().endsWith(".zip")) {
      zipPaths.push(destination);
    }
  }

  if (zipPaths.length) {
    for (const zipPath of zipPaths) {
      const zipName = path.basename(zipPath).replace(/\.zip$/i, "") || "archive";
      await extractZip(zipPath, path.join(extractedDir, zipName));
    }
    return chooseScanTarget(extractedDir);
  }
  return chooseScanTarget(inputDir);
}

function repoCacheName(repositoryUrl) {
  const digest = crypto.createHash("sha1").update(repositoryUrl).digest("hex").slice(0, 12);
  let label = "repo";
  try {
    const url = new URL(repositoryUrl);
    label = path.basename(url.pathname).replace(/\.git$/i, "") || "repo";
  } catch {
    // keep fallback
  }
  return `${digest}-${label.replace(/[^a-zA-Z0-9._-]+/g, "-")}`;
}

async function prepareRepositoryTarget(repositoryUrl) {
  const cleanUrl = String(repositoryUrl || "").trim();
  if (!cleanUrl) {
    throw new Error("Repository URL is required.");
  }
  await ensureDir(REPO_CACHE_ROOT);
  const cacheDir = path.join(REPO_CACHE_ROOT, repoCacheName(cleanUrl));
  if (!fs.existsSync(path.join(cacheDir, ".git"))) {
    await fsp.rm(cacheDir, { recursive: true, force: true });
    await runProcess("git", ["clone", "--depth", "1", "--single-branch", cleanUrl, cacheDir], {
      cwd: REPO_CACHE_ROOT,
      timeoutMs: 420000,
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    });
  }
  return chooseScanTarget(cacheDir);
}

async function prepareSlugTarget(slug, requestDir, versionValue = "") {
  const cleanSlug = String(slug || "").trim();
  if (!cleanSlug) {
    throw new Error("Skill slug is required.");
  }
  const version = String(versionValue || "").trim();
  const url = new URL("https://clawhub.ai/api/v1/download");
  url.searchParams.set("slug", cleanSlug);
  if (version) url.searchParams.set("version", version);

  const response = await fetch(url, { headers: { "User-Agent": "clawguard-static-scan/1.0" } });
  if (!response.ok) {
    throw new Error(`Failed to download skill package (${response.status}).`);
  }
  const zipPath = path.join(requestDir, `${cleanSlug.replace(/[^a-zA-Z0-9._-]+/g, "-") || "skill"}.zip`);
  await fsp.writeFile(zipPath, Buffer.from(await response.arrayBuffer()));
  const extractedDir = path.join(requestDir, "slug-extracted");
  await extractZip(zipPath, extractedDir);
  return chooseScanTarget(extractedDir);
}

function normalizeScanOptions(payload = {}) {
  const authState = payload.authState === "authenticated" ? "authenticated" : "guest";
  const timeoutMs = Number(payload.timeoutMs || 300000);
  return {
    authState,
    timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? Math.min(timeoutMs, 900000) : 300000,
    deepseekApiKey: String(payload.deepseekApiKey || "").trim(),
    deepseekModel: String(payload.deepseekModel || "deepseek-ai/DeepSeek-V3").trim(),
    deepseekBaseUrl: String(payload.deepseekBaseUrl || "https://api.siliconflow.cn/v1").trim(),
    language: String(payload.language || "zh").trim() || "zh",
  };
}

async function runUnifiedScanner(targetPath, options) {
  const args = [
    SCANNER2_SCRIPT,
    targetPath,
    "--auth-state", options.authState,
    "--language", options.language,
    "--timeout-ms", String(options.timeoutMs),
    "--enable-scanner", "scanner1",
    "--enable-scanner", "scanner2",
  ];
  if (options.deepseekApiKey) {
    args.push("--deepseek-api-key", options.deepseekApiKey);
    args.push("--deepseek-model", options.deepseekModel);
    args.push("--deepseek-base-url", options.deepseekBaseUrl);
  }

  const started = Date.now();
  const { stdout } = await runPython(args, { cwd: REPO_ROOT, timeoutMs: options.timeoutMs + 30000 });
  let report = null;
  try {
    report = JSON.parse(stdout);
  } catch {
    throw new Error("Scanner returned non-JSON output.");
  }
  report.duration_ms = Number(report.duration_ms || Date.now() - started);
  report.scanned_at = report.scanned_at || nowIso();
  return report;
}

export async function runSkillStaticScan(payload = {}) {
  if (!fs.existsSync(SCANNER2_SCRIPT)) {
    throw new Error("Static scanner runtime is missing /app/scanners. Please rebuild the app image.");
  }

  await ensureDir(WORK_ROOT);
  const requestId = crypto.randomUUID();
  const requestDir = path.join(WORK_ROOT, requestId);
  await ensureDir(requestDir);
  const options = normalizeScanOptions(payload);

  try {
    let targetPath = "";
    if (Array.isArray(payload.files) && payload.files.length) {
      targetPath = await prepareUploadTarget(payload.files, requestDir);
    } else if (payload.repositoryUrl) {
      targetPath = await prepareRepositoryTarget(payload.repositoryUrl);
    } else if (payload.slug) {
      targetPath = await prepareSlugTarget(payload.slug, requestDir, payload.version);
    } else {
      throw new Error("Provide files, repositoryUrl, or slug for static scanning.");
    }

    const report = await runUnifiedScanner(targetPath, options);
    const scanId = requestId;
    scanResultStore.set(scanId, {
      status: "completed",
      report,
      detectionReport: null,
      completedAt: nowIso(),
    });
    return {
      ok: true,
      pending: false,
      scanId,
      stage: "completed",
      report,
      detectionReport: null,
    };
  } catch (error) {
    scanResultStore.set(requestId, {
      status: "failed",
      report: null,
      detectionReport: null,
      message: error.message || "Static scan failed.",
      completedAt: nowIso(),
    });
    throw error;
  } finally {
    setTimeout(() => {
      fsp.rm(requestDir, { recursive: true, force: true }).catch(() => {});
    }, 30_000).unref?.();
  }
}

export function getSkillStaticScanStatus(scanId) {
  const result = scanResultStore.get(String(scanId || ""));
  if (!result) {
    return null;
  }
  return result;
}
