import "dotenv/config";
import { triggerSecurityResearchRefresh } from "../services/securityResearchService.mjs";
import { prisma } from "../lib/prisma.mjs";

async function main() {
  const result = await triggerSecurityResearchRefresh("manual-script");
  console.log(`[security-research] refreshed snapshot ${result.snapshotKey} (${result.snapshotId}) at ${result.createdAt}`);
}

main()
  .catch((error) => {
    console.error(`[security-research] refresh failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
