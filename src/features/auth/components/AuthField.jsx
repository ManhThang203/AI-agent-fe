export default function AuthField({ label, error, children }) {
  return (
    <label className="flex flex-col gap-1.5 text-left text-sm">
      <span className="text-zinc-400">{label}</span>
      {children}
      {error && <span className="text-sm text-red-400">{error}</span>}
    </label>
  )
}
