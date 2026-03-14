import { useState, useCallback } from 'react';

const SESSION_KEY = 'cg_auth';

function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * 认证状态 hook
 * 使用 sessionStorage 持久化，页面关闭后清除
 * @returns {{ isLoggedIn, user, login, logout }}
 */
export function useAuth() {
  const [session, setSession] = useState(() => loadSession());

  const login = useCallback((username, password) => {
    // 当前为 mock 验证：非空即可通过
    if (!username.trim() || !password.trim()) {
      return { ok: false, message: '用户名和密码不能为空' };
    }
    const user = { username: username.trim() };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    setSession(user);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  return {
    isLoggedIn: session !== null,
    user: session,
    login,
    logout,
  };
}
