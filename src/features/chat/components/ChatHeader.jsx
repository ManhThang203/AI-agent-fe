import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '../../../store/settingsStore'
import { IconMenu } from '../../../components/grok/GrokIcons'
import ChatUserMenu from '../../../components/chat/ChatUserMenu'

export default function ChatHeader({ onOpenSidebar }) {
  const { t } = useTranslation('chat')
  const { t: commonT } = useTranslation('common')
  const isLight = useSettingsStore((state) => state.theme === 'light')

  const headerSurface = isLight ? 'bg-zinc-50/95' : 'bg-[#0a0a0a]/95'
  const headerBorder = isLight ? 'border-zinc-200' : 'border-white/6'
  const buttonClassName = isLight
    ? 'text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
  const titleClassName = isLight ? 'text-zinc-900' : 'text-zinc-100'

  return (
    <header
      className={`sticky top-0 z-20 flex shrink-0 items-center justify-between gap-3 border-b px-3 py-3 backdrop-blur-sm ${headerBorder} ${headerSurface}`}
    >
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          className={`rounded-lg p-2 transition md:hidden ${buttonClassName}`}
          onClick={onOpenSidebar}
          aria-label={t('openSidebar')}
        >
          <IconMenu className="h-5 w-5" />
        </button>
        <h1 className={`truncate text-[15px] font-semibold tracking-tight ${titleClassName}`}>
          {commonT('appName')}
        </h1>
      </div>
      <ChatUserMenu variant="header" />
    </header>
  )
}
