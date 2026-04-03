import { useState } from "react";
import { postChat } from "../api.js";
import { MicButton } from "./MicButton.jsx";

/** @param {{ onMessageSent?: () => void | Promise<void> }} props */
export function Composer({ onMessageSent }) {
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(/** @type {string | null} */ (null));

  async function onSubmit(e) {
    e.preventDefault();
    const text = value.trim();
    if (!text || pending) return;
    setError(null);
    setPending(true);
    try {
      await postChat(text);
      setValue("");
      await onMessageSent?.();
    } catch (err) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String(err.message)
          : "Gửi tin thất bại";
      setError(msg);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-auto border-t border-zinc-800 pt-4">
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        {error ? (
          <p className="text-left text-sm text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex gap-2">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Nhập tin nhắn…"
            rows={3}
            disabled={pending}
            className="min-h-[5rem] flex-1 resize-y rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-violet-500 disabled:opacity-50"
          />
          <div className="flex shrink-0 flex-col justify-end gap-2">
            <MicButton />
            <button
              type="submit"
              disabled={pending || !value.trim()}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-40"
            >
              {pending ? "…" : "Gửi"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
