import "dotenv/config";
import cors from "cors";
import express from "express";
import {
  getChinaDistribution,
  getExposureList,
  getExposureStats,
  getExposureTrend,
  getVersionTrend,
  getWorldDistribution,
} from "./services/exposureService.mjs";
import { prisma } from "./lib/prisma.mjs";

const app = express();
const port = Number(process.env.API_PORT || 8787);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "5mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, now: new Date().toISOString() });
});

app.get("/api/exposure/stats", async (_req, res) => {
  try {
    const data = await getExposureStats();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch stats." });
  }
});

app.get("/api/exposure/world-distribution", async (_req, res) => {
  try {
    const data = await getWorldDistribution();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch world distribution." });
  }
});

app.get("/api/exposure/china-distribution", async (_req, res) => {
  try {
    const data = await getChinaDistribution();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch china distribution." });
  }
});

app.get("/api/exposure/trend", async (_req, res) => {
  try {
    const data = await getExposureTrend();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch trend." });
  }
});

app.get("/api/exposure/version-trend", async (_req, res) => {
  try {
    const data = await getVersionTrend();
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

app.listen(port, () => {
  console.log(`[exposure-api] listening on http://127.0.0.1:${port}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
