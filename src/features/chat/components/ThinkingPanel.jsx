/**
 * Hiển thị tối thiểu luồng thinking từ Pusher (typing animation ở task sau).
 * @param {{
 *   steps: { key: string, id: string, step: number, action: string, thinking: string }[]
 * }} props
 */
export function ThinkingPanel({ steps }) {
  if (!steps?.length) return null;

  return (
    <div
      className="shrink-0 rounded-lg border border-violet-500/25 bg-zinc-900/90 px-3 py-2 text-left font-mono text-xs text-zinc-400 shadow-lg shadow-black/20"
      aria-live="polite"
      aria-label="Trạng thái suy nghĩ của agent"
    >
      <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-violet-400/90">
        Đang xử lý
      </div>
      <ul className="max-h-40 space-y-2 overflow-y-auto pr-1">
        {steps.map((s) => (
          <li key={s.key}>
            <span className="text-violet-300/90">{s.action}</span>
            <span className="text-zinc-600"> · bước {s.step}</span>
            <p className="mt-0.5 whitespace-pre-wrap break-words text-zinc-300">
              {s.thinking}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
