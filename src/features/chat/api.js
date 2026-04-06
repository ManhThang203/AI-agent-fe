import { fetchFormData, fetchJson } from "@/lib/http.js";

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

/**
 * STT — multipart một file; field `audio` (BE: multer any).
 * @param {Blob} blob
 * @param {string} [filename]
 * @returns {Promise<{ text: string }>}
 */
export function transcribeAudio(blob, filename = "speech.webm") {
  const fd = new FormData();
  fd.append("audio", blob, filename);
  return fetchFormData("/api/agentTranscribe/transcribe", fd);
}
