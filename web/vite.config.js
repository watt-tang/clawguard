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
const SCANNER_SCRIPT_PATH = path.resolve(__dirname, "../scanner/scripts/scan_skill.py");
const TEMP_PREFIX = "clawguard-skill-scan-";
const MAX_REQUEST_SIZE_BYTES = 50 * 1024 * 1024;
const PYTHON_CANDIDATES = [
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

function spawnAndCapture(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: path.dirname(SCANNER_SCRIPT_PATH),
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

async function runPythonCommand(args) {
  let lastError = null;

  for (const [python, prefixArgs] of PYTHON_CANDIDATES) {
    try {
      return await spawnAndCapture(python, [...prefixArgs, ...args]);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Cannot run Python command. Please check Python runtime.");
}

async function extractZipFiles(tempDir) {
  await runPythonCommand(["-c", ZIP_EXTRACT_INLINE_PY, tempDir]);
}

async function runScanner(scanArgs) {
  try {
    return await runPythonCommand([SCANNER_SCRIPT_PATH, ...scanArgs]);
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

        if (!fs.existsSync(SCANNER_SCRIPT_PATH)) {
          sendJson(res, 500, {
            ok: false,
            message: `Scanner script not found: ${SCANNER_SCRIPT_PATH}`,
          });
          return;
        }

        let tempDir = null;
        try {
          const body = await readJsonBody(req);
          const slug = typeof body.slug === "string" ? body.slug.trim() : "";
          const version = typeof body.version === "string" ? body.version.trim() : "";
          const files = Array.isArray(body.files) ? body.files : [];

          if (!slug && !files.length) {
            sendJson(res, 400, {
              ok: false,
              message: "Request must include either 'slug' or non-empty 'files'.",
            });
            return;
          }

          let scanArgs = [];
          if (slug) {
            scanArgs = ["--slug", slug];
            if (version) {
              scanArgs.push("--version", version);
            }
          } else {
            const prepared = await prepareUploadedSkillRoot(files);
            tempDir = prepared.tempDir;
            scanArgs = [prepared.skillRoot];
          }

          const result = await runScanner(scanArgs);
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
  },
});
