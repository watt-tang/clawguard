const UNKNOWN_OPERATOR = "未知运营商";

const EXACT_OPERATOR_BY_ASN = new Map([
  ["AS4134", "中国电信"],
  ["AS4809", "中国电信"],
  ["AS4812", "中国电信"],
  ["AS4538", "中国教育网"],
  ["AS4539", "中国教育网"],
  ["AS4837", "中国联通"],
  ["AS9929", "中国联通"],
  ["AS10099", "中国联通"],
  ["AS17621", "中国联通"],
  ["AS17622", "中国联通"],
  ["AS9808", "中国移动"],
  ["AS56040", "中国移动"],
  ["AS56041", "中国移动"],
  ["AS56046", "中国移动"],
  ["AS24400", "中国移动"],
  ["AS56048", "中国广电"],
  ["AS24423", "中国铁通"],
  ["AS37963", "阿里云"],
  ["AS45102", "阿里云"],
  ["AS132203", "腾讯云"],
  ["AS45090", "腾讯云"],
  ["AS55990", "华为云"],
  ["AS55960", "百度智能云"],
  ["AS45062", "金山云"],
  ["AS16509", "Amazon Web Services"],
  ["AS14618", "Amazon Web Services"],
  ["AS13335", "Cloudflare"],
  ["AS15169", "Google Cloud"],
  ["AS8075", "Microsoft Azure"],
  ["AS20001", "Microsoft Azure"],
  ["AS14061", "DigitalOcean"],
  ["AS24940", "Hetzner"],
  ["AS16276", "OVHcloud"],
  ["AS20473", "Choopa / Vultr"],
  ["AS63949", "Linode / Akamai"],
  ["AS31898", "Oracle Cloud"],
]);

const ORG_RULES = [
  { operator: "中国电信", keywords: ["chinatelecom", "china telecom", "chinanet", "中国电信"] },
  { operator: "中国联通", keywords: ["china unicom", "china169", "cucc", "cncgroup", "中国联通", "联通宽带"] },
  { operator: "中国移动", keywords: ["china mobile", "cmnet", "中国移动", "铁通", "chinamobile"] },
  { operator: "中国广电", keywords: ["china broadnet", "中国广电", "广电网络"] },
  { operator: "中国教育网", keywords: ["cernet", "中国教育和科研计算机网", "中国教育网"] },
  { operator: "阿里云", keywords: ["alibaba", "aliyun", "阿里云"] },
  { operator: "腾讯云", keywords: ["tencent", "tencent cloud", "腾讯云"] },
  { operator: "华为云", keywords: ["huawei cloud", "huaweicloud", "华为云"] },
  { operator: "百度智能云", keywords: ["baidu", "百度智能云", "百度云"] },
  { operator: "金山云", keywords: ["kingsoft cloud", "ksyun", "金山云"] },
  { operator: "Amazon Web Services", keywords: ["amazon", "aws", "amazon technologies"] },
  { operator: "Cloudflare", keywords: ["cloudflare"] },
  { operator: "Google Cloud", keywords: ["google", "google cloud"] },
  { operator: "Microsoft Azure", keywords: ["microsoft", "azure"] },
  { operator: "Oracle Cloud", keywords: ["oracle"] },
  { operator: "DigitalOcean", keywords: ["digitalocean"] },
  { operator: "Hetzner", keywords: ["hetzner"] },
  { operator: "OVHcloud", keywords: ["ovh"] },
  { operator: "Choopa / Vultr", keywords: ["choopa", "vultr"] },
  { operator: "Linode / Akamai", keywords: ["linode", "akamai"] },
];

export function normalizeAsn(asn) {
  const value = String(asn || "").trim().toUpperCase();
  if (!value) return "AS0";
  return value.startsWith("AS") ? value : `AS${value}`;
}

function normalizeOrg(org) {
  return String(org || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[()]+/g, " ")
    .trim();
}

function normalizeOrgForMatch(org) {
  return normalizeOrg(org).toLowerCase();
}

export function resolveOperator(asn, org) {
  const normalizedAsn = normalizeAsn(asn);
  const matchedByAsn = EXACT_OPERATOR_BY_ASN.get(normalizedAsn);
  if (matchedByAsn) return matchedByAsn;

  const normalizedOrg = normalizeOrg(org);
  const normalizedOrgText = normalizeOrgForMatch(org);

  for (const rule of ORG_RULES) {
    if (rule.keywords.some((keyword) => normalizedOrgText.includes(keyword))) {
      return rule.operator;
    }
  }

  if (normalizedOrg && normalizedOrg.toLowerCase() !== "unknown isp") {
    return normalizedOrg;
  }

  return UNKNOWN_OPERATOR;
}

export function buildAsnProfile(asnNumber, org) {
  const asn =
    typeof asnNumber === "number" && Number.isFinite(asnNumber) ? `AS${asnNumber}` : normalizeAsn(asnNumber || "AS0");
  const isp = normalizeOrg(org) || "Unknown ISP";
  const operator = resolveOperator(asn, isp);

  return { asn, isp, operator };
}
