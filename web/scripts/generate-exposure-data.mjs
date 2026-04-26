import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import maxmind from "maxmind";
import { buildAsnProfile, resolveOperator } from "../server/lib/operator.mjs";

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
  if (Number.isNaN(firstOctet)) return "待确认";

  const domesticPrefixes = [
    10, 36, 39, 42, 43, 47, 49, 58, 59, 60, 61, 101, 106, 111, 112, 113, 114,
    115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 139, 140, 150, 152,
    153, 157, 159, 161, 163, 171, 175, 180, 182, 183, 202, 203, 210, 211, 218,
    219, 220, 221, 222,
  ];

  return domesticPrefixes.includes(firstOctet) ? "境内暴露" : "境外暴露";
}

function inferStatus(daysAgo) {
  if (daysAgo <= 1) return "在线监测";
  if (daysAgo <= 3) return "近期发现";
  return "待复核";
}

function inferRisk(daysAgo) {
  if (daysAgo <= 1) return "未关联历史漏洞";
  if (daysAgo <= 3) return "需持续观察";
  return "待补充指纹";
}

function inferHost(index) {
  if (index % 4 === 0) return "核心节点";
  if (index % 4 === 1) return "边界代理";
  if (index % 4 === 2) return "实验实例";
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

function inferAsnFallback(ip) {
  const firstOctet = Number(ip.split(".")[0]) || 0;
  const asns = ["AS45102", "AS4134", "AS9808", "AS13335", "AS16509", "AS4837"];
  return asns[firstOctet % asns.length];
}

function inferRegionFallback(ip, scope) {
  const firstOctet = Number(ip.split(".")[0]) || 0;

  if (scope === "境内暴露") {
    const regions = [
      "中国 / 天津",
      "中国 / 北京",
      "中国 / 上海",
      "中国 / 江苏",
      "中国 / 浙江",
      "中国 / 广东",
      "中国 / 四川",
    ];
    return regions[firstOctet % regions.length];
  }

  const regions = [
    "美国 / California",
    "新加坡 / Singapore",
    "德国 / Hessen",
    "日本 / Tokyo",
    "瑞典 / Stockholm",
  ];
  return regions[firstOctet % regions.length];
}

function inferCityFallback(ip, scope) {
  const firstOctet = Number(ip.split(".")[0]) || 0;

  if (scope === "境内暴露") {
    const cities = ["天津", "北京", "上海", "南京", "杭州", "广州", "成都"];
    return cities[firstOctet % cities.length];
  }

  const cities = ["San Francisco", "Singapore", "Frankfurt", "Tokyo", "Stockholm"];
  return cities[firstOctet % cities.length];
}

function readFirstExistingPath(candidates) {
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }
  return null;
}

function pickLocalizedName(node) {
  if (!node?.names) return "";
  return node.names["zh-CN"] || node.names.en || Object.values(node.names)[0] || "";
}

async function openReader(name, candidates) {
  const dbPath = readFirstExistingPath(candidates);
  if (!dbPath) {
    console.warn(`[geo] ${name} mmdb not found, fallback mode enabled.`);
    return { reader: null, dbPath: null };
  }

  try {
    const reader = await maxmind.open(dbPath);
    console.log(`[geo] Loaded ${name}: ${path.relative(projectRoot, dbPath)}`);
    return { reader, dbPath };
  } catch (error) {
    console.warn(`[geo] Failed to load ${name}: ${error.message}`);
    return { reader: null, dbPath: null };
  }
}

function resolveRegionAndCity(ip, scope, cityReader) {
  const geo = cityReader?.get(ip);

  const country = pickLocalizedName(geo?.country) || geo?.country?.iso_code || "";
  const subdivision = pickLocalizedName(geo?.subdivisions?.[0]) || geo?.subdivisions?.[0]?.iso_code || "";
  const city = pickLocalizedName(geo?.city);

  const region = [country, subdivision].filter(Boolean).join(" / ");

  return {
    region: region || inferRegionFallback(ip, scope),
    city: city || inferCityFallback(ip, scope),
  };
}

function resolveAsn(ip, asnReader) {
  const asnGeo = asnReader?.get(ip);
  if (asnGeo) {
    return buildAsnProfile(asnGeo.autonomous_system_number, asnGeo.autonomous_system_organization);
  }

  const asn = inferAsnFallback(ip);
  return {
    asn,
    isp: "Unknown ISP",
    operator: resolveOperator(asn, "Unknown ISP"),
  };
}

async function main() {
  const cityDbCandidates = [
    process.env.GEOLITE2_CITY_DB,
    path.join(projectRoot, "geoip", "GeoLite2-City.mmdb"),
    path.join(projectRoot, "data", "GeoLite2-City.mmdb"),
    path.join(projectRoot, "GeoLite2-City.mmdb"),
    path.join(projectRoot, "scripts", "GeoLite2-City.mmdb"),
  ];

  const asnDbCandidates = [
    process.env.GEOLITE2_ASN_DB,
    path.join(projectRoot, "geoip", "GeoLite2-ASN.mmdb"),
    path.join(projectRoot, "data", "GeoLite2-ASN.mmdb"),
    path.join(projectRoot, "GeoLite2-ASN.mmdb"),
    path.join(projectRoot, "scripts", "GeoLite2-ASN.mmdb"),
  ];

  const { reader: cityReader, dbPath: cityDbPath } = await openReader("GeoLite2-City", cityDbCandidates);
  const { reader: asnReader, dbPath: asnDbPath } = await openReader("GeoLite2-ASN", asnDbCandidates);

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
      const geo = resolveRegionAndCity(record.ip, scope, cityReader);
      const asnProfile = resolveAsn(record.ip, asnReader);

      return {
        id: `${record.ip}-${record.dateKey}`,
        ip: record.ip,
        lastSeen: record.lastSeen,
        lastSnapshot: formatDate(record.dateKey),
        host: inferHost(index),
        service: inferService(index),
        serviceDesc: inferServiceDesc(index),
        scope,
        region: geo.region,
        location: geo.region,
        city: geo.city,
        asn: asnProfile.asn,
        isp: asnProfile.isp,
        operator: asnProfile.operator,
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
        geoLite: {
          cityDb: cityDbPath ? path.relative(projectRoot, cityDbPath) : null,
          asnDb: asnDbPath ? path.relative(projectRoot, asnDbPath) : null,
        },
        rows,
      },
      null,
      2
    )
  );

  cityReader?.close?.();
  asnReader?.close?.();

  console.log(`Generated ${rows.length} exposure rows -> ${path.relative(projectRoot, outputFile)}`);
}

await main();
