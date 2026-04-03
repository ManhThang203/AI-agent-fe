import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion.js";

/**
 * @typedef {object} ThinkingStep
 * @property {string} key
 * @property {string} id
 * @property {number} step
 * @property {string} action
 * @property {string} thinking - toàn bộ nội dung
 * @property {boolean} archived - bước cũ (mờ, đẩy lên)
 * @property {number} revealed - số ký tự đã “gõ”
 */

export function useThinkingTimeline() {
  const reducedMotion = usePrefersReducedMotion();
  const [steps, setSteps] = useState(/** @type {ThinkingStep[]} */ ([]));
  const [exiting, setExiting] = useState(false);
  const stepsRef = useRef(steps);
  const exitTimerRef = useRef(0);

  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  /** @param {{ immediate?: boolean }} [options] */
  const clear = useCallback((options = {}) => {
    const { immediate = false } = options;
    if (exitTimerRef.current) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = 0;
    }
    if (immediate) {
      setExiting(false);
      setSteps([]);
      return;
    }
    if (stepsRef.current.length === 0) {
      setExiting(false);
      return;
    }
    setExiting(true);
    exitTimerRef.current = window.setTimeout(() => {
      setSteps([]);
      setExiting(false);
      exitTimerRef.current = 0;
    }, 220);
  }, []);

  const pushThinking = useCallback(
    (payload) => {
      if (exitTimerRef.current) {
        window.clearTimeout(exitTimerRef.current);
        exitTimerRef.current = 0;
      }
      setExiting(false);
      setSteps((prev) => {
        const archived = prev.map((s) => ({
          ...s,
          archived: true,
          revealed: s.thinking.length,
        }));
        const full = String(payload.thinking ?? "");
        const revealed = reducedMotion ? full.length : 0;
        return [
          ...archived,
          {
            key: String(payload.id),
            id: String(payload.id),
            step: Number(payload.step),
            action: String(payload.action ?? ""),
            thinking: full,
            archived: false,
            revealed,
          },
        ];
      });
    },
    [reducedMotion],
  );

  const tail = steps[steps.length - 1];
  const tailKey = tail?.key;
  const needsTyping =
    !reducedMotion &&
    Boolean(
      tail &&
        !tail.archived &&
        tail.revealed < tail.thinking.length,
    );

  useEffect(() => {
    if (!needsTyping || !tailKey) return undefined;
    const key = tailKey;
    const tickMs = 16;
    const id = window.setInterval(() => {
      setSteps((prev) => {
        const i = prev.findIndex((s) => s.key === key);
        if (i === -1) return prev;
        const s = prev[i];
        if (s.archived || s.revealed >= s.thinking.length) return prev;
        const burst = 2;
        const next = Math.min(s.thinking.length, s.revealed + burst);
        const copy = [...prev];
        copy[i] = { ...s, revealed: next };
        return copy;
      });
    }, tickMs);
    return () => window.clearInterval(id);
  }, [needsTyping, tailKey, reducedMotion]);

  return { steps, pushThinking, clear, exiting };
}
