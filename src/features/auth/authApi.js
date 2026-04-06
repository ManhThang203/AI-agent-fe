import { fetchJson } from "@/lib/http.js";
import { setTokens } from "./tokenStorage.js";

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ access_token: string, refresh_token: string }>}
 */
export async function login(email, password) {
  const data = await fetchJson("/api/auth/login", {
    method: "POST",
    json: { email, password },
    auth: false,
  });
  setTokens(
    /** @type {{ access_token: string, refresh_token: string }} */ (data),
  );
  return /** @type {{ access_token: string, refresh_token: string }} */ (
    data
  );
}

/**
 * @returns {Promise<{ id: string|number|bigint, email: string, username: string }>}
 */
export async function fetchMe() {
  return fetchJson("/api/auth/me", { method: "GET" });
}
