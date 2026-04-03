import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/features/auth/tokenStorage.js";

/**
 * Base URL API (Express). Ví dụ: http://localhost:8000 — không có slash cuối.
 * @returns {string}
 */
export function getApiBaseUrl() {
  return String(import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
}

/**
 * @param {string} path - Bắt đầu bằng /, ví dụ /api/auth/login
 * @returns {string}
 */
export function apiUrl(path) {
  const base = getApiBaseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number} status
   * @param {unknown} [payload]
   */
  constructor(message, status, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

/**
 * @returns {Promise<string|null>} access_token mới hoặc null
 */
async function tryRefreshAccessToken() {
  const rt = getRefreshToken();
  if (!rt) {
    clearTokens();
    return null;
  }
  const res = await fetch(apiUrl("/api/auth/refresh"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: rt }),
  });
  const text = await res.text();
  /** @type {{ success?: boolean, data?: { access_token?: string, refresh_token?: string } }} */
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    clearTokens();
    return null;
  }
  if (!res.ok || !data.success || !data.data?.access_token) {
    clearTokens();
    return null;
  }
  setTokens(data.data);
  return data.data.access_token;
}

/**
 * JSON API: `{ success, data }` / `{ success: false, message }`.
 * @param {string} path
 * @param {object} [options]
 * @param {string} [options.method]
 * @param {object} [options.json] - body JSON
 * @param {string|null|undefined} [options.token] - Bearer cố định; undefined = dùng token đã lưu
 * @param {boolean} [options.auth] - false: không gắn Bearer, không thử refresh
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<unknown>}
 */
export async function fetchJson(path, options = {}) {
  const {
    method = "GET",
    json: jsonBody,
    token: tokenOption,
    auth = true,
    signal,
  } = options;

  let bearer =
    auth === false
      ? null
      : tokenOption !== undefined && tokenOption !== null
        ? tokenOption
        : getAccessToken();

  const requestOnce = async (access) => {
    const headers = { Accept: "application/json" };
    if (access) headers.Authorization = `Bearer ${access}`;
    /** @type {RequestInit} */
    const init = { method, headers, signal };
    if (jsonBody !== undefined && method !== "GET" && method !== "HEAD") {
      headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(jsonBody);
    }
    const res = await fetch(apiUrl(path), init);
    const text = await res.text();
    /** @type {{ success?: boolean, data?: unknown, message?: string }} */
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new ApiError(text || "Phản hồi không phải JSON", res.status);
    }
    if (!res.ok || data.success === false) {
      const msg = data.message || res.statusText || "Lỗi mạng";
      throw new ApiError(msg, res.status, data);
    }
    return data.data;
  };

  try {
    return await requestOnce(bearer || null);
  } catch (e) {
    if (
      e instanceof ApiError &&
      e.status === 401 &&
      auth !== false &&
      bearer
    ) {
      const nextAccess = await tryRefreshAccessToken();
      if (nextAccess) return await requestOnce(nextAccess);
    }
    throw e;
  }
}
