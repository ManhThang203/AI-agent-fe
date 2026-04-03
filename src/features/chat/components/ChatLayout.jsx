/** @param {{ children: import('react').ReactNode, user?: { email: string } | null, onLogout?: () => void }} props */
export function ChatLayout({ children, user, onLogout }) {
  return (
    <div className="flex min-h-svh flex-col bg-zinc-950 text-zinc-100">
      <header className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3">
        <span className="text-sm font-medium tracking-tight">AI Agent</span>
        {user && onLogout ? (
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="max-w-[200px] truncate">{user.email}</span>
            <button
              type="button"
              onClick={onLogout}
              className="rounded border border-zinc-700 px-2 py-1 text-zinc-300 hover:border-zinc-500 hover:text-white"
            >
              Đăng xuất
            </button>
          </div>
        ) : null}
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 p-4">
        {children}
      </main>
    </div>
  );
}
