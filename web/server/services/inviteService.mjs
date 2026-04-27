import crypto from "node:crypto";
import { prisma } from "../lib/prisma.mjs";

function normalizeInviteCode(code) {
  return String(code ?? "").trim().toUpperCase();
}

function normalizeStatus(status) {
  return status === "disabled" ? "disabled" : "active";
}

function parseOptionalDate(value) {
  if (value === undefined || value === null || value === "") return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("expiresAt 不是合法日期。");
  }
  return date;
}

function assertInviteCode(code) {
  if (!code) {
    throw new Error("邀请码不能为空。");
  }
  if (!/^[A-Z0-9_-]{4,128}$/.test(code)) {
    throw new Error("邀请码只能包含大写字母、数字、下划线或中划线，长度 4-128。");
  }
}

function assertMaxUses(maxUses) {
  if (!Number.isInteger(maxUses) || maxUses <= 0) {
    throw new Error("maxUses 必须是大于 0 的整数。");
  }
}

export function generateInviteCode(length = 12) {
  const raw = crypto.randomBytes(Math.max(8, length))
    .toString("base64")
    .replace(/[^A-Z0-9]/gi, "")
    .toUpperCase();
  return `CG-${raw.slice(0, Math.max(8, length))}`;
}

export async function createInviteCode({
  code,
  maxUses = 1,
  expiresAt = null,
  note = "",
  createdBy = "",
} = {}) {
  const normalizedCode = normalizeInviteCode(code || generateInviteCode());
  assertInviteCode(normalizedCode);
  const cleanMaxUses = Number(maxUses);
  assertMaxUses(cleanMaxUses);
  const expiryDate = parseOptionalDate(expiresAt);

  return prisma.inviteCode.create({
    data: {
      code: normalizedCode,
      maxUses: cleanMaxUses,
      expiresAt: expiryDate,
      note: String(note || "").trim() || null,
      createdBy: String(createdBy || "").trim() || null,
    },
  });
}

export async function listInviteCodes() {
  return prisma.inviteCode.findMany({
    orderBy: [{ createdAt: "desc" }],
  });
}

export async function getInviteCodeByCode(code) {
  const normalizedCode = normalizeInviteCode(code);
  if (!normalizedCode) return null;
  return prisma.inviteCode.findUnique({
    where: { code: normalizedCode },
  });
}

export async function updateInviteCode(code, updates = {}) {
  const normalizedCode = normalizeInviteCode(code);
  if (!normalizedCode) {
    throw new Error("邀请码不能为空。");
  }

  const data = {};
  if (updates.maxUses !== undefined) {
    const nextMaxUses = Number(updates.maxUses);
    assertMaxUses(nextMaxUses);
    data.maxUses = nextMaxUses;
  }
  if (updates.expiresAt !== undefined) {
    data.expiresAt = parseOptionalDate(updates.expiresAt);
  }
  if (updates.note !== undefined) {
    data.note = String(updates.note || "").trim() || null;
  }
  if (updates.status !== undefined) {
    data.status = normalizeStatus(updates.status);
  }

  return prisma.inviteCode.update({
    where: { code: normalizedCode },
    data,
  });
}

export async function disableInviteCode(code) {
  return updateInviteCode(code, { status: "disabled" });
}

export function assertInviteAvailable(inviteCode) {
  if (!inviteCode) {
    throw new Error("邀请码不存在。");
  }
  if (inviteCode.status !== "active") {
    throw new Error("邀请码已被禁用。");
  }
  if (inviteCode.expiresAt && new Date(inviteCode.expiresAt).getTime() < Date.now()) {
    throw new Error("邀请码已过期。");
  }
  if (inviteCode.usedCount >= inviteCode.maxUses) {
    throw new Error("邀请码使用次数已达上限。");
  }
}

export async function getInviteUsageByCode(code) {
  const normalizedCode = normalizeInviteCode(code);
  if (!normalizedCode) {
    throw new Error("邀请码不能为空。");
  }

  const invite = await prisma.inviteCode.findUnique({
    where: { code: normalizedCode },
    include: {
      usages: {
        orderBy: { usedAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              phone: true,
              role: true,
              status: true,
            },
          },
        },
      },
    },
  });

  if (!invite) {
    throw new Error("邀请码不存在。");
  }

  return invite;
}
