import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../..");
const defaultProvloomRoot = path.resolve(projectRoot, "../provloom");
const defaultWorkRoot = "/root/clawguard/runtime-cache/skill-dynamic";

const MAX_CONCURRENT = normalizePositiveInt(process.env.SKILL_DYNAMIC_CONCURRENCY_LIMIT, 30, {
  min: 1,
  max: 200,
});

let activeRuns = 0;

export class SandboxBusyError extends Error {
  constructor(limit = MAX_CONCURRENT) {
    super(`动态沙箱当前已达到 ${limit} 个并发上限，请稍后再试。`);
    this.name = "SandboxBusyError";
    this.statusCode = 429;
    this.code = "SANDBOX_BUSY";
  }
}

export function getDynamicSandboxCapacity() {
  return {
    active: activeRuns,
    limit: MAX_CONCURRENT,
    available: Math.max(0, MAX_CONCURRENT - activeRuns),
  };
}

export async function runSkillDynamicSandbox(payload = {}) {
  if (activeRuns >= MAX_CONCURRENT) {
    throw new SandboxBusyError(MAX_CONCURRENT);
  }

  activeRuns += 1;
  try {
    const request = normalizeRequest(payload);
    const workRoot = String(process.env.SKILL_DYNAMIC_WORK_ROOT || defaultWorkRoot).trim();
    const provloomRoot = String(process.env.PROVLOOM_ROOT || defaultProvloomRoot).trim();
    const scriptPath = path.resolve(projectRoot, "server/scripts/run-provloom-dynamic.py");
    await fs.mkdir(workRoot, { recursive: true });
    await fs.mkdir(path.join(workRoot, "tmp"), { recursive: true });

    const requestPath = path.join(workRoot, `request-${Date.now()}-${Math.random().toString(36).slice(2)}.json`);
    await fs.writeFile(
      requestPath,
      JSON.stringify({ ...request, workRoot, provloomRoot }, null, 2),
      "utf8",
    );

    try {
      const { stdout, stderr } = await execFileAsync("python3", [scriptPath, requestPath], {
        cwd: provloomRoot,
        timeout: (request.timeoutSeconds + 90) * 1000,
        maxBuffer: 80 * 1024 * 1024,
        env: {
          ...process.env,
          PYTHONPATH: provloomRoot,
          TMPDIR: path.join(workRoot, "tmp"),
        },
      });
      return parseBridgeResponse(stdout, stderr);
    } catch (error) {
      const parsed = parseBridgeResponse(error.stdout || "", error.stderr || "", false);
      if (parsed) {
        return parsed;
      }
      const message = String(error.stderr || error.message || "动态沙箱执行失败。").trim();
      throw new Error(message);
    } finally {
      fs.rm(requestPath, { force: true }).catch(() => {});
    }
  } finally {
    activeRuns = Math.max(0, activeRuns - 1);
  }
}

function normalizeRequest(payload = {}) {
  const files = Array.isArray(payload.files) ? payload.files.map(normalizeFilePayload).filter(Boolean) : [];
  const sourceUrl = String(payload.sourceUrl || payload.url || "").trim();
  const inputPayload = normalizeInputPayload(payload.inputPayload);
  const timeoutSeconds = normalizePositiveInt(payload.timeoutSeconds, 600, { min: 1, max: 600 });
  const networkPolicy = payload.networkPolicy === "disabled" ? "disabled" : "default";
  const analysisMode = ["rule_only", "rule_plus_epg"].includes(payload.analysisMode)
    ? payload.analysisMode
    : "rule_plus_epg";
  const llmConfig = normalizeLlmConfig(payload.llmConfig || {});

  if (!files.length && !sourceUrl) {
    throw new Error("请上传 ZIP/SKILL.md，或填写可下载的 URL。");
  }

  return {
    files,
    sourceUrl,
    inputPayload,
    timeoutSeconds,
    networkPolicy,
    analysisMode,
    llmConfig,
  };
}

function normalizeFilePayload(file = {}) {
  const name = String(file.name || "").trim();
  const contentBase64 = String(file.contentBase64 || "").trim();
  if (!name || !contentBase64) return null;
  return {
    name,
    relativePath: String(file.relativePath || file.path || name).trim() || name,
    contentBase64,
  };
}

function normalizeInputPayload(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const normalized = { ...value };
    const prompt = String(normalized.prompt || "").trim();
    if (prompt === "请对这个 Skill 执行一次安全观察") {
      normalized.prompt = defaultDynamicExecutionPrompt();
    }
    return normalized;
  }
  return { prompt: defaultDynamicExecutionPrompt() };
}

function normalizeLlmConfig(config = {}) {
  const enabled = config.enabled !== false;
  const provider = String(config.provider || "siliconflow").trim();
  const baseUrl = String(config.baseUrl || config.base_url || "https://api.siliconflow.cn/v1").trim();
  const apiKey = String(config.apiKey || config.api_key || "").trim();
  const model = String(config.model || "deepseek-ai/DeepSeek-V3").trim();
  return {
    enabled,
    provider,
    base_url: baseUrl,
    ...(apiKey ? { api_key: apiKey } : {}),
    model,
  };
}

function defaultDynamicExecutionPrompt() {
  return "请按 SKILL.md 的主要说明实际执行这个 Skill 的首要工作流。若文档要求注册、初始化、创建账号、申请 token 或调用外部 API，请在沙箱内执行对应第一步；不要只做安全观察或文档审计。";
}

function parseBridgeResponse(stdout, stderr, throwOnEmpty = true) {
  const clean = String(stdout || "").trim();
  if (!clean) {
    if (throwOnEmpty) throw new Error(String(stderr || "动态沙箱没有返回结果。").trim());
    return null;
  }

  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start < 0 || end < start) {
    if (throwOnEmpty) throw new Error(clean);
    return null;
  }

  const data = JSON.parse(clean.slice(start, end + 1));
  if (!data.ok) {
    const error = new Error(data.message || "动态沙箱执行失败。");
    error.code = data.code || "SANDBOX_FAILED";
    throw error;
  }
  return data;
}

function normalizePositiveInt(value, fallback, { min = 1, max = Number.MAX_SAFE_INTEGER } = {}) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(num)));
}
