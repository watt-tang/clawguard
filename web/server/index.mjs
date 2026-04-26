import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import express from "express";
import { fileURLToPath } from "node:url";
import {
  getChinaDistribution,
  getExposureList,
  getExposureStats,
  getExposureTrend,
  getVersionTrend,
  getWorldDistribution,
} from "./services/exposureService.mjs";
import {
  getOpenclawRiskIssues,
  getOpenclawRiskOverview,
  initializeOpenclawRiskScheduler,
  triggerOpenclawRiskRefresh,
} from "./services/openclawRiskService.mjs";
import {
  getSecurityResearchOverview,
  getSecurityResearchPapers,
  initializeSecurityResearchScheduler,
  triggerSecurityResearchRefresh,
} from "./services/securityResearchService.mjs";
import { getSkillIntelligenceOverview } from "./services/skillIntelligenceService.mjs";
import { searchSkills } from "./services/skillSearchService.mjs";
import {
  getSkillStaticScanStatus,
  runSkillStaticScan,
} from "./services/skillStaticScanApiService.mjs";
import {
  SandboxBusyError,
  getDynamicSandboxCapacity,
  runSkillDynamicSandbox,
} from "./services/skillDynamicSandboxService.mjs";
import { prisma } from "./lib/prisma.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");
const indexHtmlPath = path.join(distDir, "index.html");
const hasBuiltFrontend = fs.existsSync(indexHtmlPath);

const app = express();
const port = Number(process.env.API_PORT || 8787);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: process.env.API_JSON_LIMIT || "75mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, now: new Date().toISOString() });
});

app.get("/api/exposure/stats", async (req, res) => {
  try {
    const data = await getExposureStats(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch stats." });
  }
});

app.get("/api/exposure/world-distribution", async (req, res) => {
  try {
    const data = await getWorldDistribution(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch world distribution." });
  }
});

app.get("/api/exposure/china-distribution", async (req, res) => {
  try {
    const data = await getChinaDistribution(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch china distribution." });
  }
});

app.get("/api/exposure/trend", async (req, res) => {
  try {
    const data = await getExposureTrend(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch trend." });
  }
});

app.get("/api/exposure/version-trend", async (req, res) => {
  try {
    const data = await getVersionTrend(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch version trend." });
  }
});

app.get("/api/exposure/list", async (req, res) => {
  try {
    const data = await getExposureList(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch exposure list." });
  }
});

app.get("/api/openclaw-risk/overview", async (req, res) => {
  try {
    const data = await getOpenclawRiskOverview(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch OpenClaw risk overview." });
  }
});

app.get("/api/openclaw-risk/issues", async (req, res) => {
  try {
    const data = await getOpenclawRiskIssues(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch OpenClaw risk issues." });
  }
});

app.post("/api/openclaw-risk/refresh", async (_req, res) => {
  try {
    const data = await triggerOpenclawRiskRefresh("manual-api");
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to refresh OpenClaw risk data." });
  }
});

app.get("/api/security-research/overview", async (req, res) => {
  try {
    const data = await getSecurityResearchOverview(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch security research overview." });
  }
});

app.get("/api/security-research/papers", async (req, res) => {
  try {
    const data = await getSecurityResearchPapers(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch security research papers." });
  }
});

app.get("/api/skill/intelligence/overview", async (req, res) => {
  try {
    const data = await getSkillIntelligenceOverview(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch skill intelligence overview." });
  }
});

app.get("/api/skill/search", async (req, res) => {
  try {
    const data = await searchSkills(req.query.q, { limit: req.query.limit });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to search skills." });
  }
});

app.post("/api/skill/scan", async (req, res) => {
  try {
    const data = await runSkillStaticScan(req.body || {});
    res.json(data);
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error?.message || "静态扫描执行失败。",
    });
  }
});

app.get("/api/skill/scan/status", (req, res) => {
  const scanId = String(req.query?.scanId || "").trim();
  const data = getSkillStaticScanStatus(scanId);
  if (!data) {
    res.status(404).json({ ok: false, message: "Scan result not found." });
    return;
  }

  res.json({ ok: true, ...data });
});

app.get("/api/skill/dynamic-sandbox/capacity", (_req, res) => {
  res.json({ ok: true, capacity: getDynamicSandboxCapacity() });
});

app.post("/api/skill/dynamic-sandbox", async (req, res) => {
  const authState = String(req.get("x-clawguard-auth") || req.body?.authState || "").trim();
  if (authState !== "authenticated") {
    res.status(401).json({ ok: false, code: "LOGIN_REQUIRED", message: "请先登录后再使用动态沙箱检测。" });
    return;
  }

  try {
    const data = await runSkillDynamicSandbox(req.body);
    res.json({
      ...data,
      capacity: getDynamicSandboxCapacity(),
      warning: "恢复出来的链条只是可能的攻击路径，风险等级仅供参考。",
    });
  } catch (error) {
    if (error instanceof SandboxBusyError || error?.statusCode === 429) {
      res.status(429).json({
        ok: false,
        code: "SANDBOX_BUSY",
        message: error.message || "动态沙箱繁忙，请稍后再试。",
        capacity: getDynamicSandboxCapacity(),
      });
      return;
    }

    res.status(500).json({
      ok: false,
      code: error?.code || "SANDBOX_FAILED",
      message: error?.message || "动态沙箱执行失败。",
      capacity: getDynamicSandboxCapacity(),
    });
  }
});

app.post("/api/security-research/refresh", async (_req, res) => {
  try {
    const data = await triggerSecurityResearchRefresh("manual-api");
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to refresh security research data." });
  }
});

if (hasBuiltFrontend) {
  app.use(express.static(distDir));

  app.get("/{*path}", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      next();
      return;
    }

    res.sendFile(indexHtmlPath);
  });
}

app.listen(port, () => {
  console.log(
    `[exposure-api] listening on http://127.0.0.1:${port}${hasBuiltFrontend ? " with built frontend" : ""}`
  );
});

// disabled on server/local sync: initializeOpenclawRiskScheduler();
// disabled on server/local sync: initializeSecurityResearchScheduler();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
