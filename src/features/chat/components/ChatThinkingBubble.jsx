import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '../../../store/settingsStore'

export default function ChatThinkingBubble({ sending, thinking }) {
  const { t } = useTranslation('chat')
  const isLight = useSettingsStore((state) => state.theme === 'light')
  const boxClassName = isLight
    ? 'border-zinc-200 bg-zinc-100 text-zinc-600'
    : 'border-white/8 bg-zinc-900/60 text-zinc-400'
  const bubbleText = thinking?.text || (sending ? t('preparingReply') : t('thinking'))

  return (
    <div
      role="status"
      aria-live="polite"
      className={`mr-8 max-w-[90%] self-start rounded-xl border px-4 py-3 text-sm sm:mr-12 ${boxClassName}`}
    >
      {bubbleText}
    </div>
  )
}
