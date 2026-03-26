import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
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

function skillScanApiPlugin() {
  return {
    name: "skill-scan-api",
    configureServer(server) {
      server.middlewares.use("/api/skill/scan", async (req, res, next) => {
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

          if (!slug && !files.length) {
            sendJson(res, 400, {
              ok: false,
              message: "Request must include either 'slug' or non-empty 'files'.",
            });
            return;
          }

          let targetPath = "";
          if (slug) {
            const prepared = await prepareSlugSkillRoot(slug, version);
            tempDir = prepared.tempDir;
            targetPath = prepared.skillRoot;
          } else {
            const prepared = await prepareUploadedSkillRoot(files);
            tempDir = prepared.tempDir;
            targetPath = prepared.skillRoot;
          }

          const result = await runUnifiedScanner({
            ...scanOptions,
            targetPath,
          });
          let report = null;
          try {
            report = JSON.parse(result.stdout);
          } catch {
            throw new Error(`Scanner did not return valid JSON. ${result.stderr.trim()}`);
          }

          sendJson(res, 200, {
            ok: true,
            report,
            stderr: result.stderr.trim() || undefined,
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
    },
  },
});
