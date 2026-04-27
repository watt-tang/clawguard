import { useCallback, useEffect, useState } from "react";
import {
  clearAuthSession,
  getStoredAuthToken,
  getStoredAuthUser,
  storeAuthSession,
} from "../lib/authSession.js";

async function parseResponse(response) {
  return response.json().catch(() => null);
}

async function requestAuth(endpoint, payload = undefined, token = "") {
  const response = await fetch(endpoint, {
    method: payload === undefined ? "GET" : "POST",
    headers: {
      ...(payload === undefined ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
  });

  const data = await parseResponse(response);
  if (!response.ok || !data?.ok) {
    throw new Error(data?.message || "认证请求失败。");
  }
  return data;
}

export function useAuth() {
  const [session, setSession] = useState(() => getStoredAuthUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const token = getStoredAuthToken();

    if (!token) {
      setIsLoading(false);
      return () => {
        active = false;
      };
    }

    requestAuth("/api/auth/me", undefined, token)
      .then((data) => {
        if (!active) return;
        storeAuthSession({ token, user: data.user });
        setSession(data.user);
      })
      .catch(() => {
        if (!active) return;
        clearAuthSession();
        setSession(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      const data = await requestAuth("/api/auth/login", { username, password });
      storeAuthSession({ token: data.token, user: data.user });
      setSession(data.user);
      return { ok: true, user: data.user };
    } catch (error) {
      return { ok: false, message: error.message || "登录失败。" };
    }
  }, []);

  const register = useCallback(async (username, password, phone, inviteCode) => {
    try {
      const data = await requestAuth("/api/auth/register", { username, password, phone, inviteCode });
      storeAuthSession({ token: data.token, user: data.user });
      setSession(data.user);
      return { ok: true, user: data.user };
    } catch (error) {
      return { ok: false, message: error.message || "注册失败。" };
    }
  }, []);

  const logout = useCallback(async () => {
    const token = getStoredAuthToken();
    try {
      if (token) {
        await requestAuth("/api/auth/logout", {}, token);
      }
    } catch {
      // Ignore transport errors and clear local state anyway.
    } finally {
      clearAuthSession();
      setSession(null);
    }

    return { ok: true };
  }, []);

  return {
    isLoggedIn: session !== null,
    isLoading,
    user: session,
    login,
    register,
    logout,
  };
}
