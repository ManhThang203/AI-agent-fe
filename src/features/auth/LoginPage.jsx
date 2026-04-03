import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth.js";

export function LoginPage() {
  const { user, login, bootstrapping } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();

  if (bootstrapping) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-zinc-950 text-zinc-400">
        Đang tải…
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      await login(email.trim(), password);
      navigate("/", { replace: true });
    } catch (err) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String(err.message)
          : "Đăng nhập thất bại";
      setError(msg);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-zinc-950 px-4 text-zinc-100">
      <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl">
        <h1 className="mb-1 text-lg font-semibold tracking-tight">Đăng nhập</h1>
        <p className="mb-6 text-sm text-zinc-500">AI Agent — cùng tài khoản backend</p>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-left text-sm">
            <span className="text-zinc-400">Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none focus:border-violet-500"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-left text-sm">
            <span className="text-zinc-400">Mật khẩu</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none focus:border-violet-500"
            />
          </label>
          {error ? (
            <p className="text-left text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
          >
            {pending ? "Đang đăng nhập…" : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
