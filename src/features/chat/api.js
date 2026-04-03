import { fetchJson } from "@/lib/http.js";

/**
 * @param {number} [limit]
 * @returns {Promise<{ id: string, userId: string, role: string, thinking: boolean, content: string, createdAt: string }[]>}
 */
export function getMessages(limit = 20) {
  const q = new URLSearchParams({ limit: String(limit) });
  return fetchJson(`/api/agentMessages/messages?${q}`, { method: "GET" });
}

/**
 * @param {string} input
 * @returns {Promise<{ id: string, userId: string, role: string, thinking: boolean, content: string, createdAt: string }>}
 */
export function postChat(input) {
  return fetchJson("/api/agentMessages/chat", {
    method: "POST",
    json: { input },
  });
}
