/** Danh sách tin nhắn — implement ở task auth-api / chat. */
export function MessageList() {
  return (
    <div
      className="flex flex-1 flex-col gap-3 text-left text-sm text-zinc-400"
      aria-live="polite"
    >
      <p>Chưa có tin nhắn.</p>
    </div>
  );
}
