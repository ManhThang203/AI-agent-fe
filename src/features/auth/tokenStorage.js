const KEY_ACCESS = "ai_agent_access_token";
const KEY_REFRESH = "ai_agent_refresh_token";

export function getAccessToken() {
  return localStorage.getItem(KEY_ACCESS);
}

export function getRefreshToken() {
  return localStorage.getItem(KEY_REFRESH);
}

/**
 * @param {{ access_token: string, refresh_token: string }} tokens
 */
export function setTokens(tokens) {
  localStorage.setItem(KEY_ACCESS, tokens.access_token);
  localStorage.setItem(KEY_REFRESH, tokens.refresh_token);
}

export function clearTokens() {
  localStorage.removeItem(KEY_ACCESS);
  localStorage.removeItem(KEY_REFRESH);
}
