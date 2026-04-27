import { prisma } from "../lib/prisma.mjs";
import {
  getBearerTokenFromRequest,
  hashPassword,
  normalizePhone,
  normalizeUsername,
  sanitizeUser,
  signAuthToken,
  validatePassword,
  validatePhone,
  validateUsername,
  verifyAuthToken,
  verifyPassword,
} from "../lib/auth.mjs";
import { assertInviteAvailable } from "./inviteService.mjs";

function normalizeInviteCode(code) {
  return String(code ?? "").trim().toUpperCase();
}

export async function registerUser({ username, password, phone, inviteCode }) {
  const normalizedUsername = normalizeUsername(username);
  const normalizedPhone = normalizePhone(phone);
  const normalizedInviteCode = normalizeInviteCode(inviteCode);
  const normalizedPassword = String(password ?? "");

  if (!normalizedUsername || !normalizedPassword) {
    throw new Error("用户名和密码不能为空。");
  }
  if (!normalizedPhone) {
    throw new Error("手机号不能为空。");
  }
  if (!normalizedInviteCode) {
    throw new Error("邀请码不能为空。");
  }

  validateUsername(normalizedUsername);
  validatePassword(normalizedPassword);
  validatePhone(normalizedPhone);

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { username: normalizedUsername },
        { phone: normalizedPhone },
      ],
    },
  });

  if (existingUser?.username === normalizedUsername) {
    throw new Error("该用户名已存在。");
  }
  if (existingUser?.phone === normalizedPhone) {
    throw new Error("该手机号已被注册。");
  }

  const passwordHash = hashPassword(normalizedPassword);

  const created = await prisma.$transaction(async (tx) => {
    const invite = await tx.inviteCode.findUnique({
      where: { code: normalizedInviteCode },
    });
    assertInviteAvailable(invite);

    const user = await tx.user.create({
      data: {
        username: normalizedUsername,
        passwordHash,
        phone: normalizedPhone,
        role: "user",
        status: "active",
      },
    });

    await tx.inviteCode.update({
      where: { id: invite.id },
      data: {
        usedCount: {
          increment: 1,
        },
      },
    });

    await tx.inviteUsage.create({
      data: {
        inviteCodeId: invite.id,
        userId: user.id,
      },
    });

    return user;
  });

  const user = sanitizeUser(created);
  const token = signAuthToken(user);
  return { user, token };
}

export async function loginUser({ username, password }) {
  const normalizedUsername = normalizeUsername(username);
  const normalizedPassword = String(password ?? "");

  if (!normalizedUsername || !normalizedPassword) {
    throw new Error("用户名和密码不能为空。");
  }

  const user = await prisma.user.findUnique({
    where: { username: normalizedUsername },
  });

  if (!user || !verifyPassword(normalizedPassword, user.passwordHash)) {
    throw new Error("账号或密码错误。");
  }
  if (user.status !== "active") {
    throw new Error("当前账号已被禁用。");
  }

  const safeUser = sanitizeUser(user);
  const token = signAuthToken(safeUser);
  return { user: safeUser, token };
}

export async function getCurrentUserFromToken(token) {
  const payload = verifyAuthToken(token);
  const user = await prisma.user.findUnique({
    where: { id: Number(payload.sub) },
  });

  if (!user || user.status !== "active") {
    throw new Error("当前登录已失效。");
  }

  return sanitizeUser(user);
}

export async function getCurrentUserFromRequest(req) {
  const token = getBearerTokenFromRequest(req);
  if (!token) return null;

  try {
    return await getCurrentUserFromToken(token);
  } catch {
    return null;
  }
}
