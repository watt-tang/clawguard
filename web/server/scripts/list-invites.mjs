import "dotenv/config";
import { listInviteCodes } from "../services/inviteService.mjs";
import { prisma } from "../lib/prisma.mjs";

async function main() {
  const invites = await listInviteCodes();
  console.log(JSON.stringify(invites, null, 2));
}

main()
  .catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
