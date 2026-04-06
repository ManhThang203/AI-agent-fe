/**
 * @param {{
 *   messages: null | { id: string, role: string, content: string, createdAt: string }[],
 *   error: string | null,
 *   onRetry?: () => void
 * }} props
 */
export function MessageList({ messages, error, onRetry }) {
  if (error) {
    return (
      <div
        className="flex flex-1 flex-col items-start justify-center gap-3 text-left text-sm text-red-400"
        role="alert"
      >
        <p>{error}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded border border-red-500/50 px-3 py-1.5 text-red-300 hover:bg-red-950/50"
          >
            Thử lại
          </button>
        ) : null}
      </div>
    );
  }

  if (messages === null) {
    return (
      <div className="flex flex-1 items-center text-sm text-zinc-500">
        Đang tải tin nhắn…
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col gap-3 text-left text-sm text-zinc-500">
        <p>Chưa có tin nhắn. Gửi một câu để bắt đầu.</p>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto text-left text-sm"
      aria-live="polite"
    >
      <ul className="flex flex-col gap-3 pr-1">
        {messages.map((m) => (
          <li
            key={String(m.id)}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-br-md bg-violet-600 px-3 py-2 text-white"
                  : "max-w-[85%] rounded-2xl rounded-bl-md border border-zinc-700 bg-zinc-900/80 px-3 py-2 text-zinc-200"
              }
            >
              <p className="whitespace-pre-wrap break-words">{m.content}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
