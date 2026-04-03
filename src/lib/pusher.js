/**
 * Cấu hình client Pusher-js từ env (khớp BE Soketi / Pusher).
 * Tuỳ chỉnh thêm ở task tích hợp realtime.
 * @returns {Record<string, unknown>}
 */
export function getPusherOptions() {
  const port = Number(import.meta.env.VITE_PUSHER_PORT);
  return {
    cluster: import.meta.env.VITE_PUSHER_CLUSTER || "mt1",
    wsHost: import.meta.env.VITE_PUSHER_HOST || undefined,
    wsPort: Number.isFinite(port) ? port : undefined,
    wssPort: Number.isFinite(port) ? port : undefined,
    forceTLS: import.meta.env.VITE_PUSHER_TLS !== "false",
    enabledTransports: ["ws", "wss"],
    disableStats: true,
  };
}

export function getPusherKey() {
  return import.meta.env.VITE_PUSHER_KEY ?? "";
}
