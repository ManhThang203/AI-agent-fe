import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md'

export function getUserInitials(username) {
  const trimmed = (username || '?').trim()
  if (!trimmed) return '?'

  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase().slice(0, 2)
  }

  return trimmed.slice(0, 2).toUpperCase()
}

export default function UserMenuPanel({
  variant,
  user,
  locale,
  theme,
  t,
  onSetLocale,
  onSetTheme,
  onLogout,
}) {
  const isLight = theme === 'light'
  const panel = isLight
    ? 'border border-zinc-200 bg-white shadow-xl'
    : 'border border-zinc-800 bg-zinc-900 shadow-xl'
  const rowBorder = isLight ? 'border-zinc-200' : 'border-zinc-800'
  const text = isLight ? 'text-zinc-900' : 'text-zinc-100'
  const muted = isLight ? 'text-zinc-500' : 'text-zinc-500'
  const itemHover = isLight ? 'hover:bg-zinc-100' : 'hover:bg-zinc-800'
  const langActive = isLight ? 'bg-zinc-200 text-zinc-900' : 'bg-zinc-700 text-white'
  const langIdle = isLight
    ? 'text-zinc-600 hover:bg-zinc-100'
    : 'text-zinc-400 hover:bg-zinc-800'
  const themeButtonBase =
    'flex h-10 w-10 items-center justify-center rounded-lg border transition'
  const themeButtonLight =
    theme === 'light'
      ? isLight
        ? 'border-sky-500 bg-sky-50 text-sky-700'
        : 'border-sky-500 bg-sky-950/40 text-sky-300'
      : isLight
        ? 'border-zinc-200 bg-zinc-50 text-zinc-600'
        : 'border-zinc-700 bg-zinc-800/80 text-zinc-400'
  const themeButtonDark =
    theme === 'dark'
      ? isLight
        ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
        : 'border-indigo-400 bg-zinc-800 text-indigo-200'
      : isLight
        ? 'border-zinc-200 bg-zinc-50 text-zinc-600'
        : 'border-zinc-700 bg-zinc-800/80 text-zinc-400'

  return (
    <div
      role="menu"
      className={
        variant === 'header'
          ? `absolute right-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-xl py-1 ${panel}`
          : `absolute bottom-full left-0 z-50 mb-1 w-56 overflow-hidden rounded-xl py-1 ${panel}`
      }
      onMouseDown={(event) => event.stopPropagation()}
    >
      <div className={`border-b px-3 py-2 ${rowBorder}`}>
        <p className={`truncate text-sm font-medium ${text}`}>{user.username}</p>
        <p className={`truncate text-xs ${muted}`}>{user.email}</p>
      </div>

      <div className={`border-b px-3 py-2 ${rowBorder}`}>
        <p className={`mb-2 text-xs font-medium ${muted}`}>
          {t('userMenu.appearance')}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            role="menuitem"
            className={`${themeButtonBase} ${themeButtonLight}`}
            aria-label={t('userMenu.themeLight')}
            aria-pressed={theme === 'light'}
            onClick={() => onSetTheme('light')}
          >
            <MdOutlineLightMode className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            role="menuitem"
            className={`${themeButtonBase} ${themeButtonDark}`}
            aria-label={t('userMenu.themeDark')}
            aria-pressed={theme === 'dark'}
            onClick={() => onSetTheme('dark')}
          >
            <MdOutlineDarkMode className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      <div className={`border-t px-3 py-2 ${rowBorder}`}>
        <p className={`mb-1 text-xs ${muted}`}>{t('userMenu.language')}</p>
        <div className="flex gap-2">
          <button
            type="button"
            className={`rounded-lg px-2 py-1 text-xs font-medium ${
              locale === 'vi' ? langActive : langIdle
            }`}
            onClick={() => onSetLocale('vi')}
          >
            {t('userMenu.langVi')}
          </button>
          <button
            type="button"
            className={`rounded-lg px-2 py-1 text-xs font-medium ${
              locale === 'en' ? langActive : langIdle
            }`}
            onClick={() => onSetLocale('en')}
          >
            {t('userMenu.langEn')}
          </button>
        </div>
      </div>

      <button
        type="button"
        role="menuitem"
        className={`w-full border-t px-3 py-2 text-left text-sm text-red-500 ${itemHover} ${rowBorder}`}
        onClick={onLogout}
      >
        {t('userMenu.logout')}
      </button>
    </div>
  )
}
