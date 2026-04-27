const TOKEN_KEY = "cg_auth_token";
const USER_KEY = "cg_auth_user";

export function getStoredAuthToken() {
  try {
    return String(window.sessionStorage.getItem(TOKEN_KEY) || "");
  } catch {
    return "";
  }
}

export function getStoredAuthUser() {
  try {
    const raw = window.sessionStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function storeAuthSession({ token, user }) {
  window.sessionStorage.setItem(TOKEN_KEY, String(token || ""));
  window.sessionStorage.setItem(USER_KEY, JSON.stringify(user || null));
}

export function clearAuthSession() {
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(USER_KEY);
}

export function getAuthHeaders(extraHeaders = {}) {
  const token = getStoredAuthToken();
  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
