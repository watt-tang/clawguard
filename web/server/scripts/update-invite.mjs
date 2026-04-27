import "dotenv/config";
import { parseArgs } from "node:util";
import { prisma } from "../lib/prisma.mjs";
import { updateInviteCode } from "../services/inviteService.mjs";

async function main() {
  const { values } = parseArgs({
    options: {
      code: { type: "string" },
      maxUses: { type: "string" },
      expiresAt: { type: "string" },
      note: { type: "string" },
      status: { type: "string" },
    },
  });

  if (!values.code) {
    throw new Error("请通过 --code 指定邀请码。");
  }

  const invite = await updateInviteCode(values.code, {
    maxUses: values.maxUses,
    expiresAt: values.expiresAt,
    note: values.note,
    status: values.status,
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
