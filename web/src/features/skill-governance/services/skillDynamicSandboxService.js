import { getAuthHeaders } from "../../../lib/authSession.js";

const DYNAMIC_SANDBOX_ENDPOINT = "/api/skill/dynamic-sandbox";
const DYNAMIC_SANDBOX_CAPACITY_ENDPOINT = "/api/skill/dynamic-sandbox/capacity";

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result || "");
      const commaIndex = value.indexOf(",");
      resolve(commaIndex >= 0 ? value.slice(commaIndex + 1) : value);
    };
    reader.onerror = () => {
      reject(new Error(`Failed to read file: ${file?.name || "unknown"}`));
    };
    reader.readAsDataURL(file);
  });
}

export async function getDynamicSandboxCapacity() {
  const response = await fetch(DYNAMIC_SANDBOX_CAPACITY_ENDPOINT);
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.ok) {
    throw new Error(data?.message || "动态沙箱容量状态获取失败。");
  }
  return data.capacity || { active: 0, limit: 30, available: 30 };
}

export async function runDynamicSandboxScan({ uploadRecords = [], sourceUrl = "", inputPayload = {}, options = {} } = {}) {
  const files = await Promise.all(
    uploadRecords.map(async (record, index) => {
      const file = record?.file;
      if (!(file instanceof File)) {
        throw new Error(`Upload item #${index + 1} is missing original file object.`);
      }

      return {
        name: record.name || file.name,
        relativePath: record.path || file.webkitRelativePath || file.name,
        contentBase64: await toBase64(file),
      };
    }),
  );

  const response = await fetch(DYNAMIC_SANDBOX_ENDPOINT, {
    method: "POST",
    headers: getAuthHeaders({
      "Content-Type": "application/json",
      "X-ClawGuard-Auth": options.authState === "authenticated" ? "authenticated" : "guest",
    }),
    body: JSON.stringify({
      files,
      sourceUrl: String(sourceUrl || "").trim(),
      inputPayload,
      timeoutSeconds: Number(options.timeoutSeconds || 600),
      networkPolicy: options.networkPolicy === "disabled" ? "disabled" : "default",
      analysisMode: options.analysisMode || "rule_plus_epg",
      authState: options.authState === "authenticated" ? "authenticated" : "guest",
      llmConfig: options.llmConfig || {},
    }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.ok) {
    const error = new Error(data?.message || "动态沙箱检测失败。");
    error.code = data?.code || "SANDBOX_FAILED";
    error.capacity = data?.capacity || null;
    throw error;
  }

  return data;
}
