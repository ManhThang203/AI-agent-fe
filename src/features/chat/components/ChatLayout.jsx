export function ChatLayout({ children }) {
  return (
    <div className="flex min-h-svh flex-col bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-4 py-3 text-sm font-medium tracking-tight">
        AI Agent
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col p-4">
        {children}
      </main>
    </div>
  );
}
