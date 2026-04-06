import { Outlet, useLocation } from 'react-router-dom'
import { useChatStore } from '../store/chatStore'
import { useSettingsStore } from '../store/settingsStore'
import { useTranslation } from 'react-i18next'

export default function AppShell() {
  const realtimeWarn = useChatStore((s) => s.realtimeWarn)
  const setRealtimeWarn = useChatStore((s) => s.setRealtimeWarn)
  const theme = useSettingsStore((s) => s.theme)
  const { t } = useTranslation('common')
  const { pathname } = useLocation()
  const onChat = pathname === '/chat'
  const isLight = theme === 'light'

  const shellBg =
    onChat && !isLight
      ? 'bg-[#0a0a0a]'
      : onChat && isLight
        ? 'bg-zinc-50'
        : 'bg-background'
  const shellLayout = onChat
    ? `flex h-dvh flex-col overflow-hidden ${shellBg}`
    : `flex min-h-dvh flex-col ${shellBg}`

  return (
    <div className={shellLayout}>
      {realtimeWarn && (
        <div
          role="status"
          className={
            onChat && !isLight
              ? 'flex items-center justify-between gap-2 border-b border-white/8 bg-zinc-900/90 px-3 py-2 text-sm text-zinc-200'
              : onChat && isLight
                ? 'flex items-center justify-between gap-2 border-b border-zinc-200 bg-white/90 px-3 py-2 text-sm text-zinc-800'
                : 'flex items-center justify-between gap-2 border-b border-border bg-surface px-3 py-2 text-sm text-text'
          }
        >
          <span>{t('realtimeWarn')}</span>
          <button
            type="button"
            onClick={() => setRealtimeWarn(false)}
            className={
              onChat && !isLight
                ? 'shrink-0 rounded-lg border border-white/10 px-2 py-1 text-zinc-300 hover:bg-zinc-800'
                : onChat && isLight
                  ? 'shrink-0 rounded-lg border border-zinc-300 px-2 py-1 text-zinc-700 hover:bg-zinc-100'
                  : 'shrink-0 rounded border border-border px-2 py-1 text-text-muted hover:bg-background'
            }
          >
            {t('close')}
          </button>
        </div>
      )}
      <main
        className={
          onChat
            ? 'flex min-h-0 flex-1 flex-col overflow-hidden px-3 pt-3'
            : 'flex min-h-0 flex-1 flex-col px-3 pt-3'
        }
      >
        <Outlet />
      </main>
    </div>
  )
}
