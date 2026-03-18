import { useCallback, useState } from "react";
import { AUTH_CONFIG } from "../config.js";

const SESSION_KEY = "cg_auth";
const USERS_KEY = "cg_users";

const ADMIN_ACCOUNT = {
  username: "tan",
  password: "123456",
  phone: "",
  role: "admin",
};

function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.username || !parsed?.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

function normalizeUsername(username) {
  return String(username ?? "").trim().toLowerCase();
}

function normalizePhone(phone) {
  return String(phone ?? "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/-/g, "");
}

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [ADMIN_ACCOUNT];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [ADMIN_ACCOUNT];

    const normalized = parsed
      .filter((item) => item?.username && item?.password)
      .map((item) => ({
        username: normalizeUsername(item.username),
        password: String(item.password),
        phone: normalizePhone(item.phone),
        role: item.role === "admin" ? "admin" : "user",
      }));

    const hasAdmin = normalized.some((item) => item.username === ADMIN_ACCOUNT.username);
    return hasAdmin ? normalized : [ADMIN_ACCOUNT, ...normalized];
  } catch {
    return [ADMIN_ACCOUNT];
  }
}

function persistUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * 认证状态 hook
 * 使用 sessionStorage 持久化，页面关闭后清除
 * @returns {{
 * isLoggedIn: boolean,
 * user: {username: string, role: string} | null,
 * login: Function,
 * register: Function,
 * logout: Function
 * }}
 */
export function useAuth() {
  const [session, setSession] = useState(() => loadSession());
  const [users, setUsers] = useState(() => loadUsers());

  const login = useCallback((username, password) => {
    const normalizedUsername = normalizeUsername(username);
    const normalizedPassword = String(password ?? "").trim();

    if (!normalizedUsername || !normalizedPassword) {
      return { ok: false, message: "用户名和密码不能为空" };
    }

    const matchedUser = users.find(
      (item) => item.username === normalizedUsername && item.password === normalizedPassword
    );
    if (!matchedUser) {
      return { ok: false, message: "账号或密码错误" };
    }

    const user = { username: matchedUser.username, role: matchedUser.role };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    setSession(user);
    return { ok: true, user };
  }, [users]);

  const register = useCallback((username, password, phone, inviteCode) => {
    const normalizedUsername = normalizeUsername(username);
    const normalizedPassword = String(password ?? "").trim();
    const normalizedPhone = normalizePhone(phone).replace(/^\+?86/, "");
    const normalizedInviteCode = String(inviteCode ?? "").trim();
    const expectedInviteCode = String(AUTH_CONFIG.REGISTER_INVITE_CODE ?? "").trim();

    if (!normalizedUsername || !normalizedPassword) {
      return { ok: false, message: "用户名和密码不能为空" };
    }
    if (!normalizedPhone) {
      return { ok: false, message: "手机号不能为空" };
    }
    if (!normalizedInviteCode) {
      return { ok: false, message: "邀请码不能为空" };
    }
    if (!expectedInviteCode) {
      return { ok: false, message: "系统未配置邀请码，暂不可注册" };
    }
    if (normalizedInviteCode !== expectedInviteCode) {
      return { ok: false, message: "邀请码错误" };
    }
    if (!/^[a-z0-9_]{3,20}$/.test(normalizedUsername)) {
      return { ok: false, message: "用户名需为 3-20 位小写字母、数字或下划线" };
    }
    if (normalizedPassword.length < 6) {
      return { ok: false, message: "密码长度至少 6 位" };
    }
    if (!/^1\d{10}$/.test(normalizedPhone)) {
      return { ok: false, message: "手机号格式不正确，请输入 11 位手机号" };
    }
    if (users.some((item) => item.username === normalizedUsername)) {
      return { ok: false, message: "该用户名已存在" };
    }
    if (users.some((item) => item.phone && item.phone === normalizedPhone)) {
      return { ok: false, message: "该手机号已被注册" };
    }

    const nextUser = {
      username: normalizedUsername,
      password: normalizedPassword,
      phone: normalizedPhone,
      role: "user",
    };
    const nextUsers = [...users, nextUser];
    persistUsers(nextUsers);
    setUsers(nextUsers);

    const user = { username: nextUser.username, role: nextUser.role };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    setSession(user);
    return { ok: true, user };
  }, [users]);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  return {
    isLoggedIn: session !== null,
    user: session,
    login,
    register,
    logout,
  };
}
