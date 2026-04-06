import { getAgentChannelName, AGENT_EVENTS } from "@/lib/agentRealtime.js";
import { getPusherKey, getPusherOptions } from "@/lib/pusher.js";
import Pusher from "pusher-js";
import { useEffect, useRef } from "react";

/**
 * @typedef {object} ThinkingPayload
 * @property {string} id
 * @property {number} step
 * @property {string} action
 * @property {string} thinking
 * @property {string} [createdAt]
 * @property {string} [userId]
 */

/**
 * @typedef {object} ThinkingClearPayload
 * @property {number} step
 * @property {string} reason
 * @property {boolean} [clear]
 */

/**
 * @typedef {object} MessageCreatedPayload
 * @property {string} id
 * @property {string} role
 * @property {string} content
 * @property {string} [createdAt]
 */

/**
 * Subscribe Pusher/Soketi: kênh agent-user-{userId}.
 * Handler luôn gọi qua ref (tránh reconnect mỗi render).
 * @param {object} params
 * @param {string|undefined} params.userId
 * @param {(data: ThinkingPayload) => void} [params.onThinking]
 * @param {(data: ThinkingClearPayload) => void} [params.onThinkingClear]
 * @param {(data: MessageCreatedPayload) => void} [params.onMessageCreated]
 */
export function useAgentPusher({
  userId,
  onThinking,
  onThinkingClear,
  onMessageCreated,
}) {
  const handlersRef = useRef({
    onThinking,
    onThinkingClear,
    onMessageCreated,
  });

  useEffect(() => {
    handlersRef.current = {
      onThinking,
      onThinkingClear,
      onMessageCreated,
    };
  }, [onThinking, onThinkingClear, onMessageCreated]);

  useEffect(() => {
    const key = getPusherKey();
    if (!userId) return undefined;

    if (!key) {
      console.warn(
        "[agent-realtime] Thiếu VITE_PUSHER_KEY — không subscribe Pusher.",
      );
      return undefined;
    }

    const channelName = getAgentChannelName(userId);
    const pusher = new Pusher(key, getPusherOptions());
    const channel = pusher.subscribe(channelName);

    const onThink = (/** @type {ThinkingPayload} */ data) => {
      handlersRef.current.onThinking?.(data);
    };
    const onClear = (/** @type {ThinkingClearPayload} */ data) => {
      handlersRef.current.onThinkingClear?.(data);
    };
    const onMsg = (/** @type {MessageCreatedPayload} */ data) => {
      handlersRef.current.onMessageCreated?.(data);
    };

    channel.bind(AGENT_EVENTS.THINKING, onThink);
    channel.bind(AGENT_EVENTS.THINKING_CLEAR, onClear);
    channel.bind(AGENT_EVENTS.MESSAGE_CREATED, onMsg);

    channel.bind("pusher:subscription_error", (status) => {
      console.warn(
        "[agent-realtime] subscription_error",
        channelName,
        status,
      );
    });

    return () => {
      channel.unbind(AGENT_EVENTS.THINKING, onThink);
      channel.unbind(AGENT_EVENTS.THINKING_CLEAR, onClear);
      channel.unbind(AGENT_EVENTS.MESSAGE_CREATED, onMsg);
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [userId]);
}
