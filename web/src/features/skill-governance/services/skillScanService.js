const SKILL_SCAN_ENDPOINT = "/api/skill/scan";

function normalizeScanOptions(options = {}) {
  const authState = options.authState === "authenticated" ? "authenticated" : "guest";
  const deepseekApiKey = String(options.deepseekApiKey || "").trim();
  const deepseekModel = String(options.deepseekModel || "").trim();
  const deepseekBaseUrl = String(options.deepseekBaseUrl || "").trim();
  const language = String(options.language || "").trim();
  const timeoutMs = Number(options.timeoutMs);

  return {
    authState,
    ...(deepseekApiKey ? { deepseekApiKey } : {}),
    ...(deepseekModel ? { deepseekModel } : {}),
    ...(deepseekBaseUrl ? { deepseekBaseUrl } : {}),
    ...(language ? { language } : {}),
    ...(Number.isFinite(timeoutMs) && timeoutMs > 0 ? { timeoutMs } : {}),
  };
}

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

async function requestScan(payload) {
  const response = await fetch(SKILL_SCAN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    throw new Error("Scanner API returned invalid response.");
  }

  if (!response.ok || !data?.ok) {
    throw new Error(data?.message || "Skill scan request failed.");
  }

  return data.report;
}

export async function scanSkillFiles(uploadRecords, options = {}) {
  if (!Array.isArray(uploadRecords) || !uploadRecords.length) {
    throw new Error("No upload files to scan.");
  }

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

  return requestScan({
    files,
    ...normalizeScanOptions(options),
  });
}

export async function scanSkillBySlug(slug, version = "", options = {}) {
  const cleanSlug = String(slug || "").trim();
  const cleanVersion = String(version || "").trim();

  if (!cleanSlug) {
    throw new Error("Skill slug is required.");
  }

  return requestScan({
    slug: cleanSlug,
    ...(cleanVersion ? { version: cleanVersion } : {}),
    ...normalizeScanOptions(options),
  });
}
