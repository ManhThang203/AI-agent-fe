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
