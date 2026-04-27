import crypto from "node:crypto";

const TOKEN_TTL_SECONDS = Number(process.env.AUTH_TOKEN_TTL_SECONDS || 60 * 60 * 24 * 7);
const TOKEN_SECRET = String(
  process.env.AUTH_TOKEN_SECRET || process.env.JWT_SECRET || "clawguard-dev-secret"
).trim();

function base64UrlEncode(value) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value) {
  return Buffer.from(String(value || ""), "base64url").toString("utf8");
}

function signPayload(payload) {
  return crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest("base64url");
}

export function normalizeUsername(username) {
  return String(username ?? "").trim().toLowerCase();
}

export function normalizePhone(phone) {
  return String(phone ?? "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .replace(/^\+?86/, "");
}

export function validateUsername(username) {
  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    throw new Error("用户名需为 3-20 位小写字母、数字或下划线。");
  }
}

export function validatePassword(password) {
  if (String(password || "").length < 6) {
    throw new Error("密码长度至少 6 位。");
  }
}

export function validatePhone(phone) {
  if (!/^1\d{10}$/.test(phone)) {
    throw new Error("手机号格式不正确，请输入 11 位手机号。");
  }
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password, passwordHash) {
  const [salt, expected] = String(passwordHash || "").split(":");
  if (!salt || !expected) return false;

  const actual = crypto.scryptSync(String(password), salt, 64);
  const expectedBuffer = Buffer.from(expected, "hex");
  if (actual.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(actual, expectedBuffer);
}

export function signAuthToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: user.id,
    username: user.username,
    role: user.role,
    exp: now + TOKEN_TTL_SECONDS,
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyAuthToken(token) {
  const [encodedPayload, signature] = String(token || "").split(".");
  if (!encodedPayload || !signature) {
    throw new Error("Invalid auth token.");
  }

  const expectedSignature = signPayload(encodedPayload);
  const signatureBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");
  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    throw new Error("Invalid auth token signature.");
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload));
  if (!payload?.sub || !payload?.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Auth token expired.");
  }

  return payload;
}

export function getBearerTokenFromRequest(req) {
  const header = String(req.get("authorization") || "").trim();
  if (!header.startsWith("Bearer ")) return "";
  return header.slice("Bearer ".length).trim();
}

export function sanitizeUser(user) {
  return {
    id: user.id,
    username: user.username,
    phone: user.phone,
    role: user.role === "admin" ? "admin" : "user",
    status: user.status,
    defaultApiKey: user.role === "admin" ? String(process.env.VITE_ADMIN_DEFAULT_API_KEY || "").trim() : "",
  };
}
