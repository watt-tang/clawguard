import "dotenv/config";
import { prisma } from "../lib/prisma.mjs";
import { triggerOpenclawRiskRefresh } from "../services/openclawRiskService.mjs";

try {
  const result = await triggerOpenclawRiskRefresh("manual-script");
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(`[openclaw-risk] refresh failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
