import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useChatThreadsStore } from '../../store/chatThreadsStore'
import { useClickOutside } from '../../shared/hooks/useClickOutside'
import UserMenuPanel, {
  getUserInitials,
} from '../../features/chat/components/UserMenuPanel'

/**
 * @param {'sidebar' | 'header'} props.variant
 */
export default function ChatUserMenu({ variant = 'sidebar' }) {
  const { t } = useTranslation('chat')
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const locale = useSettingsStore((s) => s.locale)
  const setLocale = useSettingsStore((s) => s.setLocale)
  const theme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const isLight = theme === 'light'

  useClickOutside(rootRef, () => setOpen(false), open)

  if (!user) return null

  const size =
    variant === 'header'
      ? 'h-9 w-9 text-xs'
      : 'h-10 w-10 text-sm'

  const avatarRing = isLight
    ? 'ring-2 ring-zinc-300/80 hover:ring-zinc-400'
    : 'ring-2 ring-white/10 hover:ring-white/20'
  const avatarBg = isLight
    ? 'bg-gradient-to-br from-zinc-400 to-zinc-600 text-white'
    : 'bg-gradient-to-br from-zinc-600 to-zinc-800 text-zinc-100'

  const onLogout = () => {
    setOpen(false)
    useChatThreadsStore.getState().reset()
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className={`flex ${size} shrink-0 items-center justify-center rounded-full font-semibold transition ${avatarBg} ${avatarRing}`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t('userMenu.open')}
        onClick={() => setOpen((v) => !v)}
      >
        {getUserInitials(user.username)}
      </button>

      {open && (
        <UserMenuPanel
          variant={variant}
          user={user}
          locale={locale}
          theme={theme}
          t={t}
          onSetLocale={setLocale}
          onSetTheme={setTheme}
          onLogout={onLogout}
        />
      )}
    </div>
  )
}
