/** Tên sự kiện & kênh khớp backend `src/utils/agentRealtime.js` (AI-agent-api). */

export const AGENT_EVENTS = Object.freeze({
  THINKING: "agent:thinking",
  THINKING_CLEAR: "agent:thinking_clear",
  MESSAGE_CREATED: "agent:message_created",
});

/**
 * Prefix mặc định giống `AGENT_SOCKET_CHANNEL_PREFIX` trên BE (vd. agent-user).
 * @returns {string}
 */
export function getAgentChannelPrefix() {
  return (
    import.meta.env.VITE_AGENT_CHANNEL_PREFIX || "agent-user"
  ).replace(/\/$/, "");
}

/**
 * Kênh private/public: `{prefix}-{userId}` (vd. agent-user-12).
 * @param {string|number|undefined} userId
 */
export function getAgentChannelName(userId) {
  return `${getAgentChannelPrefix()}-${String(userId)}`;
}
