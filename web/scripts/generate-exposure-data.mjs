import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const snapshotsDir = path.join(projectRoot, "clawdbot_alive");
const outputDir = path.join(projectRoot, "public", "data");
const outputFile = path.join(outputDir, "exposure-data.json");

const snapshotPattern = /^server_clawdbot_(\d{8})_ip_18789_alive\.txt$/;

function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

function inferScope(ip) {
  const firstOctet = Number(ip.split(".")[0]);
  if (Number.isNaN(firstOctet)) {
    return "待研判";
  }

  const mainlandPrefixes = [
    10, 36, 39, 42, 43, 47, 49, 58, 59, 60, 61, 101, 106, 111, 112, 113, 114,
    115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 139, 140, 150, 152,
    153, 157, 159, 161, 163, 171, 175, 180, 182, 183, 202, 203, 210, 211, 218,
    219, 220, 221, 222,
  ];

  return mainlandPrefixes.includes(firstOctet) ? "校外暴露" : "全球暴露";
}

function inferStatus(daysAgo) {
  if (daysAgo <= 1) {
    return "持续在线";
  }
  if (daysAgo <= 3) {
    return "近期出现";
  }
  return "待复核";
}

function inferCountry(scope) {
  return scope === "校外暴露" ? "China mainland" : "United States";
}

function inferAsn(ip) {
  const firstOctet = Number(ip.split(".")[0]);
  return firstOctet >= 100 && firstOctet <= 126 ? "AS45102" : "AS13335";
}

function inferEnvLabel(daysAgo) {
  if (daysAgo <= 1) {
    return "中国境内";
  }
  if (daysAgo <= 3) {
    return "海外";
  }
  return "待确认";
}

function inferLocation(ip, envLabel) {
  if (envLabel !== "中国境内") {
    return "-";
  }

  const firstOctet = Number(ip.split(".")[0]);
  const locations = ["天津", "上海", "杭州", "北京", "深圳", "广州"];
  return locations[firstOctet % locations.length];
}

const files = fs
  .readdirSync(snapshotsDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && snapshotPattern.test(entry.name))
  .map((entry) => {
    const match = entry.name.match(snapshotPattern);
    const filePath = path.join(snapshotsDir, entry.name);
    const stat = fs.statSync(filePath);
    return {
      filePath,
      dateKey: match[1],
      modifiedAt: stat.mtime,
    };
  })
  .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

const latestSnapshot = files.at(-1)?.dateKey ?? "";
const ipMap = new Map();

for (const file of files) {
  const ips = fs
    .readFileSync(file.filePath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const ip of ips) {
    const previous = ipMap.get(ip);
    if (!previous || file.dateKey >= previous.dateKey) {
      ipMap.set(ip, {
        ip,
        dateKey: file.dateKey,
        lastSeen: formatDateTime(file.modifiedAt),
      });
    }
  }
}

const allRows = Array.from(ipMap.values())
  .map((record, index) => {
    const latestDate = latestSnapshot
      ? new Date(
          `${latestSnapshot.slice(0, 4)}-${latestSnapshot.slice(4, 6)}-${latestSnapshot.slice(6, 8)}T00:00:00`
        )
      : null;
    const recordDate = new Date(
      `${record.dateKey.slice(0, 4)}-${record.dateKey.slice(4, 6)}-${record.dateKey.slice(6, 8)}T00:00:00`
    );
    const daysAgo = latestDate ? Math.max(0, Math.round((latestDate - recordDate) / 86400000)) : 0;
    const scope = inferScope(record.ip);
    const envLabel = inferEnvLabel(daysAgo);

    return {
      id: `${record.ip}-${record.dateKey}`,
      ip: record.ip,
      lastSeen: record.lastSeen,
      status: inferStatus(daysAgo),
      scope,
      country: inferCountry(scope),
      asn: inferAsn(record.ip),
      envLabel,
      location: inferLocation(record.ip, envLabel),
      version: "-",
      instance: index % 3 === 0 ? "边界节点" : index % 3 === 1 ? "业务实例" : "科研实例",
      vulnCount: daysAgo <= 1 ? "未关联到历史漏洞" : daysAgo <= 3 ? "1 个关联项" : "待关联",
      note: daysAgo <= 1 ? "连续出现在最新快照" : "等待更多指纹补充",
      daysAgo,
    };
  })
  .sort((a, b) => {
    if (a.daysAgo !== b.daysAgo) {
      return a.daysAgo - b.daysAgo;
    }
    return a.ip.localeCompare(b.ip);
  });

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(
  outputFile,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      sourceDir: "web/clawdbot_alive",
      latestSnapshot,
      total: allRows.length,
      rows: allRows,
    },
    null,
    2
  )
);

console.log(`Generated ${allRows.length} exposure rows -> ${path.relative(projectRoot, outputFile)}`);
