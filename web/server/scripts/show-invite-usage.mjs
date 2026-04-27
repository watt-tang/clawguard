import "dotenv/config";
import { parseArgs } from "node:util";
import { prisma } from "../lib/prisma.mjs";
import { getInviteUsageByCode } from "../services/inviteService.mjs";

async function main() {
  const { values } = parseArgs({
    options: {
      code: { type: "string" },
    },
  });

  if (!values.code) {
    throw new Error("请通过 --code 指定邀请码。");
  }

  const usage = await getInviteUsageByCode(values.code);
  console.log(JSON.stringify(usage, null, 2));
}

main()
  .catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
