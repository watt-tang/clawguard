import "dotenv/config";
import { parseArgs } from "node:util";
import { createInviteCode } from "../services/inviteService.mjs";
import { prisma } from "../lib/prisma.mjs";

async function main() {
  const { values } = parseArgs({
    options: {
      code: { type: "string" },
      maxUses: { type: "string", default: "1" },
      expiresAt: { type: "string" },
      note: { type: "string" },
      createdBy: { type: "string" },
    },
  });

  const invite = await createInviteCode({
    code: values.code,
    maxUses: Number(values.maxUses),
    expiresAt: values.expiresAt,
    note: values.note,
    createdBy: values.createdBy,
  });

  console.log(JSON.stringify(invite, null, 2));
}

main()
  .catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
