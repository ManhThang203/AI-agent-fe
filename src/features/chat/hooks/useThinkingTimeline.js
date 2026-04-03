import { useState, useCallback } from "react";

/**
 * Hàng đợi các bước thinking + typing — implement đầy đủ ở task thinking-ui.
 */
export function useThinkingTimeline() {
  const [steps, setSteps] = useState(
    /** @type {{ id: string, step: number, text: string, archived?: boolean }[]} */ ([]),
  );

  const reset = useCallback(() => {
    setSteps([]);
  }, []);

  return { steps, setSteps, reset };
}
