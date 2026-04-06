import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";

/**
 * @typedef {{ key: string, id: string, step: number, action: string, thinking: string, archived?: boolean, revealed: number }} ThinkingStep
 */

/**
 * @param {{
 *   steps: ThinkingStep[],
 *   exiting?: boolean
 * }} props
 */
export function ThinkingPanel({ steps, exiting = false }) {
  const listRef = useRef(/** @type {HTMLUListElement | null} */ (null));
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [steps, exiting]);

  if (steps.length === 0 && !exiting) return null;

  return (
    <div
      className={[
        "shrink-0 overflow-hidden rounded-lg border border-violet-500/25 bg-zinc-900/95 shadow-lg shadow-black/30 transition-all duration-200 ease-out",
        exiting ? "pointer-events-none scale-[0.98] opacity-30" : "opacity-100",
      ].join(" ")}
      aria-live="polite"
      aria-label="Trạng thái suy nghĩ của agent"
    >
      <div className="border-b border-violet-500/15 px-3 py-1.5">
        <div className="text-[10px] font-medium uppercase tracking-wider text-violet-400/90">
          Đang suy nghĩ
        </div>
      </div>
      <ul
        ref={listRef}
        className="max-h-44 space-y-3 overflow-y-auto scroll-smooth px-3 py-2.5 pr-2 font-mono text-xs"
      >
        {steps.map((s) => {
          const visible = s.thinking.slice(0, s.revealed);
          const typing =
            !s.archived && s.revealed < s.thinking.length && !reducedMotion;
          return (
            <li
              key={s.key}
              className={[
                "origin-top transition-all duration-300 ease-out",
                s.archived
                  ? "-translate-y-1 scale-[0.96] opacity-40"
                  : "translate-y-0 opacity-100",
              ].join(" ")}
            >
              <div className={s.archived ? "text-[11px] leading-snug" : ""}>
                <span className="text-violet-300/90">{s.action}</span>
                <span className="text-zinc-600"> · bước {s.step}</span>
              </div>
              <p className="mt-1 whitespace-pre-wrap break-words text-zinc-200">
                {visible}
                {typing ? (
                  <span
                    className="ml-1 inline-block h-3 w-px animate-pulse bg-violet-400 align-middle"
                    aria-hidden
                  />
                ) : null}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
