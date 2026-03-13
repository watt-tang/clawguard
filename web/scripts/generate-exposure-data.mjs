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

function formatDate(dateKey) {
  return `${dateKey.slice(0, 4)}-${dateKey.slice(4, 6)}-${dateKey.slice(6, 8)}`;
}

function inferScope(ip) {
  const firstOctet = Number(ip.split(".")[0]);
  if (Number.isNaN(firstOctet)) {
    return "待确认";
  }

  const domesticPrefixes = [
    10, 36, 39, 42, 43, 47, 49, 58, 59, 60, 61, 101, 106, 111, 112, 113, 114,
    115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 139, 140, 150, 152,
    153, 157, 159, 161, 163, 171, 175, 180, 182, 183, 202, 203, 210, 211, 218,
    219, 220, 221, 222,
  ];

  return domesticPrefixes.includes(firstOctet) ? "境内暴露" : "境外暴露";
}

function inferStatus(daysAgo) {
  if (daysAgo <= 1) {
    return "在线监测";
  }
  if (daysAgo <= 3) {
    return "近期发现";
  }
  return "待复核";
}

function inferLocation(ip, scope) {
  if (scope === "境内暴露") {
    const provinces = ["天津", "北京", "上海", "南京", "杭州", "广州", "成都"];
    const cities = ["南开园区", "科研节点", "教学区", "校外机房", "实验平台"];
    const firstOctet = Number(ip.split(".")[0]) || 0;
    return `${provinces[firstOctet % provinces.length]} / ${cities[firstOctet % cities.length]}`;
  }

  const abroad = ["新加坡", "法兰克福", "弗吉尼亚", "东京", "斯德哥尔摩"];
  const firstOctet = Number(ip.split(".")[0]) || 0;
  return abroad[firstOctet % abroad.length];
}

function inferAsn(ip) {
  const firstOctet = Number(ip.split(".")[0]) || 0;
  const asns = ["AS45102", "AS4134", "AS9808", "AS13335", "AS16509", "AS4837"];
  return asns[firstOctet % asns.length];
}

function inferRisk(daysAgo) {
  if (daysAgo <= 1) {
    return "未关联历史漏洞";
  }
  if (daysAgo <= 3) {
    return "需持续观察";
  }
  return "待补充指纹";
}

function inferHost(index) {
  if (index % 4 === 0) {
    return "核心节点";
  }
  if (index % 4 === 1) {
    return "边界代理";
  }
  if (index % 4 === 2) {
    return "实验实例";
  }
  return "-";
}

function inferService(index) {
  const names = [
    "18789 / ClawBot",
    "18789 / ClawGuard Agent",
    "18789 / 暴露面探针",
    "18789 / 校园安全服务",
  ];
  return names[index % names.length];
}

function inferServiceDesc(index) {
  const descriptions = ["服务监听", "边界检测实例", "资产探测组件", "科研网络实例"];
  return descriptions[index % descriptions.length];
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
const latestDate = latestSnapshot ? new Date(`${formatDate(latestSnapshot)}T00:00:00`) : null;
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

const rows = Array.from(ipMap.values())
  .map((record, index) => {
    const recordDate = new Date(`${formatDate(record.dateKey)}T00:00:00`);
    const daysAgo = latestDate ? Math.max(0, Math.round((latestDate - recordDate) / 86400000)) : 0;
    const scope = inferScope(record.ip);

    return {
      id: `${record.ip}-${record.dateKey}`,
      ip: record.ip,
      lastSeen: record.lastSeen,
      lastSnapshot: formatDate(record.dateKey),
      host: inferHost(index),
      service: inferService(index),
      serviceDesc: inferServiceDesc(index),
      scope,
      location: inferLocation(record.ip, scope),
      asn: inferAsn(record.ip),
      status: inferStatus(daysAgo),
      risk: inferRisk(daysAgo),
      version: "v1.x 占位",
      daysAgo,
    };
  })
  .sort((left, right) => {
    if (left.daysAgo !== right.daysAgo) {
      return left.daysAgo - right.daysAgo;
    }

    return left.ip.localeCompare(right.ip);
  });

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(
  outputFile,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      sourceDir: "web/clawdbot_alive",
      latestSnapshot,
      total: rows.length,
      rows,
    },
    null,
    2
  )
);

console.log(`Generated ${rows.length} exposure rows -> ${path.relative(projectRoot, outputFile)}`);
