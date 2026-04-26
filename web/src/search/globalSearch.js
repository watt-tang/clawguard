import { PAGE_IDS } from "../config.js";
import { fetchStats } from "../features/openclaw-exposure/services/dataService.js";
import { CLAW_PRODUCTS } from "../features/openclaw-governance/pages/OpenclawGovernancePage.jsx";
import { fetchOpenclawRiskIssues, fetchOpenclawRiskOverview } from "../features/openclaw-risk/services/dataService.js";
import { fetchSecurityResearchOverview, fetchSecurityResearchPapers } from "../features/security-research/services/dataService.js";
import { getSkillIntelligenceOverview } from "../features/skill-governance/services/skillIntelligenceService.js";
import { searchSkills } from "../features/skill-governance/services/skillSearchService.js";

const SEARCH_LIMIT = 12;

const PAGE_META = {
  [PAGE_IDS.HOME]: { label: "平台首页", category: "页面" },
  "openclaw-governance": { label: "Claw 系列产品安全总览", category: "治理" },
  "openclaw-risk": { label: "OpenClaw 风险漏洞追踪", category: "漏洞" },
  [PAGE_IDS.OPENCLAW_EXPOSURE]: { label: "Claw 系列公网暴露监测", category: "暴露" },
  "skill-governance": { label: "Skill 生态后门投毒治理", category: "Skill" },
  "openclaw-deploy": { label: "学术安全前沿", category: "研究" },
};

let cachedStaticEntries = null;
let cachedDynamicEntries = null;
let cachedDynamicPromise = null;

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function toSearchBlob(parts) {
  return normalizeText(parts.filter(Boolean).join(" "));
}

function makeEntry({
  id,
  title,
  subtitle = "",
  pageId,
  section = "",
  keywords = [],
  intent = "",
}) {
  return {
    id,
    title,
    subtitle,
    pageId,
    section,
    intent,
    keywords,
    haystack: toSearchBlob([title, subtitle, section, intent, ...keywords]),
  };
}

function scoreEntry(entry, query) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return 0;

  let score = 0;
  const title = normalizeText(entry.title);
  const subtitle = normalizeText(entry.subtitle);
  const keywordText = normalizeText(entry.keywords.join(" "));
  const haystack = entry.haystack;

  if (title === normalizedQuery) score += 160;
  if (title.startsWith(normalizedQuery)) score += 120;
  if (title.includes(normalizedQuery)) score += 80;
  if (keywordText.includes(normalizedQuery)) score += 44;
  if (subtitle.includes(normalizedQuery)) score += 28;
  if (haystack.includes(normalizedQuery)) score += 12;

  return score;
}

function createModuleEntries(modules) {
  return modules.map((module) =>
    makeEntry({
      id: `module-${module.pageId}`,
      title: module.label,
      subtitle: module.description,
      pageId: module.pageId,
      section: "模块导航",
      keywords: [module.status, PAGE_META[module.pageId]?.category || ""],
      intent: `进入 ${module.label}`,
    }),
  );
}

function createGovernanceEntries() {
  return CLAW_PRODUCTS.map((product) =>
    makeEntry({
      id: `governance-${product.name}`,
      title: product.name,
      subtitle: product.highlights || product.interfaceSummary || "Claw 产品治理信息",
      pageId: "openclaw-governance",
      section: "Claw 产品",
      keywords: [
        product.risk,
        product.auth,
        product.port,
        product.fingerprint,
        product.interfaceSummary,
        ...(Array.isArray(product.interfaces) ? product.interfaces : []),
      ],
      intent: "查看该产品的接口暴露与风险评估",
    }),
  );
}

function createExposureEntries(stats) {
  if (!stats) return [];

  return [
    makeEntry({
      id: "exposure-current",
      title: "Claw 系列当前暴露规模",
      subtitle: `当前暴露 ${stats.currentExposed || 0}，高风险 ${stats.highRiskCount || 0}`,
      pageId: PAGE_IDS.OPENCLAW_EXPOSURE,
      section: "公网暴露监测",
      keywords: ["OpenClaw", "GoClaw", "IronClaw", "PicoClaw", "TinyClaw", "ZeroClaw", "暴露", "高风险", "国家覆盖", stats.countryCoverage],
      intent: "查看全球分布、趋势和明细",
    }),
    makeEntry({
      id: "exposure-country",
      title: "国家与地区覆盖",
      subtitle: `覆盖 ${stats.countryCoverage || "-"} 个国家或地区`,
      pageId: PAGE_IDS.OPENCLAW_EXPOSURE,
      section: "公网暴露监测",
      keywords: ["国家覆盖", "全球分布", "地图"],
      intent: "查看国家和地区的暴露分布",
    }),
  ];
}

function createRiskEntries(overview, issues) {
  const summaryEntries = overview
    ? [
      makeEntry({
        id: "risk-summary",
        title: "OpenClaw 漏洞概览",
        subtitle: `漏洞总量 ${overview?.totals?.issueCount ?? 0}，待修复 ${overview?.fixProgress?.unfixed ?? 0}`,
        pageId: "openclaw-risk",
        section: "漏洞总览",
        keywords: ["critical", "high", "medium", "low", "fix progress"],
        intent: "查看漏洞等级、来源和修复进度",
      }),
    ]
    : [];

  const issueEntries = Array.isArray(issues?.rows)
    ? issues.rows.map((item) =>
      makeEntry({
        id: `risk-${item.id || item.cveId || item.title}`,
        title: item.cveId || item.title || "漏洞条目",
        subtitle: item.title || item.summary || item.description || "漏洞详情",
        pageId: "openclaw-risk",
        section: "漏洞条目",
        keywords: [item.severity, item.source, item.fixStatus, item.affectedVersion, item.productName],
        intent: "跳转到漏洞追踪页查看详情",
      }))
    : [];

  return [...summaryEntries, ...issueEntries];
}

function createResearchEntries(overview, papers) {
  const summaryEntries = overview
    ? [
      makeEntry({
        id: "research-summary",
        title: "安全研究前沿概览",
        subtitle: `论文总量 ${overview?.totals?.totalPapers ?? 0}，最近同步 ${overview?.sourceMeta?.lastSyncedAt || "-"}`,
        pageId: "openclaw-deploy",
        section: "研究概览",
        keywords: overview?.sourceMeta?.keywords || [],
        intent: "查看最新论文、关键词和来源质量",
      }),
    ]
    : [];

  const paperEntries = Array.isArray(papers?.rows)
    ? papers.rows.map((paper) =>
      makeEntry({
        id: `paper-${paper.id || paper.title}`,
        title: paper.title || "研究论文",
        subtitle: paper.abstractOrSummary || paper.venue || "论文摘要",
        pageId: "openclaw-deploy",
        section: "研究论文",
        keywords: [paper.venue, paper.projectScope, paper.sourceType, ...(paper.keywords || [])],
        intent: "跳转到研究页查看论文详情",
      }))
    : [];

  return [...summaryEntries, ...paperEntries];
}

function createSkillEntries(overview, queriedSkills, query) {
  const summaryEntries = overview
    ? [
      makeEntry({
        id: "skill-summary",
        title: "Skill 风险基线",
        subtitle: `Skill 总量 ${overview?.summary?.totalSkills ?? 0}，危险样本 ${overview?.reviewPagination?.total ?? 0}`,
        pageId: "skill-governance",
        section: "Skill 情报",
        keywords: ["safe", "dangerous", "unknown"],
        intent: "查看风险分布、待确认原因和危险 Skill 列表",
      }),
    ]
    : [];

  const reviewEntries = Array.isArray(overview?.reviewRows)
    ? overview.reviewRows.map((item) =>
      makeEntry({
        id: `skill-review-${item.id || item.repositoryUrl || item.name}`,
        title: item.name || item.slug || "危险 Skill",
        subtitle: item.repositoryUrl || item.summary || "Skill 风险条目",
        pageId: "skill-governance",
        section: "危险 Skill",
        keywords: [item.slug, item.riskLabel, item.repositoryUrl],
        intent: "跳转到 Skill 治理页查看条目",
      }))
    : [];

  const searchedEntries = Array.isArray(queriedSkills?.items)
    ? queriedSkills.items.map((item) =>
      makeEntry({
        id: `skill-search-${item.id || item.slug || item.name}`,
        title: item.name || item.slug || "Skill 搜索结果",
        subtitle: item.repositoryUrl || item.description || "Skill 数据库记录",
        pageId: "skill-governance",
        section: "Skill 数据库",
        keywords: [item.slug, item.riskLevel, item.repositoryUrl, query],
        intent: "跳转到 Skill 治理页继续查看或复扫",
      }))
    : [];

  return [...summaryEntries, ...reviewEntries, ...searchedEntries];
}

async function loadDynamicEntries(query) {
  if (cachedDynamicEntries) {
    const skillSearchResult = await searchSkills(query, 6).catch(() => ({ items: [] }));
    return [...cachedDynamicEntries, ...createSkillEntries(null, skillSearchResult, query)];
  }

  if (!cachedDynamicPromise) {
    cachedDynamicPromise = Promise.allSettled([
      fetchStats(),
      fetchOpenclawRiskOverview(),
      fetchOpenclawRiskIssues({ page: 1, page_size: 80 }),
      fetchSecurityResearchOverview(),
      fetchSecurityResearchPapers({ page: 1, page_size: 60, sort: "relevance_desc" }),
      getSkillIntelligenceOverview({ page: 1, page_size: 20 }),
    ]).then((results) => {
      const [
        statsResult,
        riskOverviewResult,
        riskIssuesResult,
        researchOverviewResult,
        researchPapersResult,
        skillOverviewResult,
      ] = results;

      cachedDynamicEntries = [
        ...createExposureEntries(statsResult.status === "fulfilled" ? statsResult.value : null),
        ...createRiskEntries(
          riskOverviewResult.status === "fulfilled" ? riskOverviewResult.value : null,
          riskIssuesResult.status === "fulfilled" ? riskIssuesResult.value : null,
        ),
        ...createResearchEntries(
          researchOverviewResult.status === "fulfilled" ? researchOverviewResult.value : null,
          researchPapersResult.status === "fulfilled" ? researchPapersResult.value : null,
        ),
        ...createSkillEntries(skillOverviewResult.status === "fulfilled" ? skillOverviewResult.value : null, null, ""),
      ];

      return cachedDynamicEntries;
    });
  }

  const baseEntries = await cachedDynamicPromise;
  const skillSearchResult = await searchSkills(query, 6).catch(() => ({ items: [] }));
  return [...baseEntries, ...createSkillEntries(null, skillSearchResult, query)];
}

export async function searchAppContent(query, modules) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return [];

  if (!cachedStaticEntries) {
    cachedStaticEntries = [...createModuleEntries(modules), ...createGovernanceEntries()];
  }

  const dynamicEntries = await loadDynamicEntries(normalizedQuery);

  return [...cachedStaticEntries, ...dynamicEntries]
    .map((entry) => ({ ...entry, score: scoreEntry(entry, normalizedQuery) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, SEARCH_LIMIT);
}

export function getPageMeta(pageId) {
  return PAGE_META[pageId] || { label: pageId, category: "页面" };
}
