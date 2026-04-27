import "dotenv/config";
import { parseArgs } from "node:util";
import { prisma } from "../lib/prisma.mjs";
import {
  hashPassword,
  normalizePhone,
  normalizeUsername,
  validatePassword,
  validatePhone,
  validateUsername,
} from "../lib/auth.mjs";

async function main() {
  const { values } = parseArgs({
    options: {
      username: { type: "string", default: process.env.DEFAULT_ADMIN_USERNAME || "admin" },
      password: { type: "string", default: process.env.DEFAULT_ADMIN_PASSWORD || "" },
      phone: { type: "string", default: process.env.DEFAULT_ADMIN_PHONE || "13800000000" },
    },
  });

  const username = normalizeUsername(values.username);
  const password = String(values.password || "");
  const phone = normalizePhone(values.phone);

  if (!password) {
    throw new Error("请通过 --password 或 DEFAULT_ADMIN_PASSWORD 提供管理员密码。");
  }

  validateUsername(username);
  validatePassword(password);
  validatePhone(phone);

  const passwordHash = hashPassword(password);

  const admin = await prisma.user.upsert({
    where: { username },
    update: {
      passwordHash,
      phone,
      role: "admin",
      status: "active",
    },
    create: {
      username,
      passwordHash,
      phone,
      role: "admin",
      status: "active",
    },
  });

  console.log(JSON.stringify({
    id: admin.id,
    username: admin.username,
    phone: admin.phone,
    role: admin.role,
    status: admin.status,
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
