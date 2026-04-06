export default function AuthCard({
  appName,
  title,
  children,
  footer,
}) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#0a0a0a] text-zinc-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 150, 255, 0.25), transparent)',
        }}
      />
      <div className="relative mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-12">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
            {appName}
          </p>
          <h1 className="mt-2 text-3xl font-normal tracking-tight text-zinc-50">
            {title}
          </h1>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 shadow-2xl backdrop-blur-md">
          {children}
        </div>

        {footer}
      </div>
    </div>
  )
}
