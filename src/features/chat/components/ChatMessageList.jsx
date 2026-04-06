import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '../../../store/settingsStore'
import ChatMessageItem from './ChatMessageItem'
import ChatThinkingBubble from './ChatThinkingBubble'

export default function ChatMessageList({
  scrollRef,
  loading,
  messages,
  sending,
  thinking,
  showThinkingBubble,
  onFeedbackChange,
}) {
  const { t } = useTranslation('chat')
  const { t: commonT } = useTranslation('common')
  const isLight = useSettingsStore((state) => state.theme === 'light')

  const loadingClassName = isLight ? 'text-zinc-500' : 'text-zinc-500'
  const welcomeClassName = isLight ? 'text-zinc-900' : 'text-zinc-100'
  const subtitleClassName = isLight ? 'text-zinc-600' : 'text-zinc-500'
  const markdownClassName = isLight
    ? 'text-[15px] leading-relaxed text-zinc-800 [&_p]:my-2 [&_a]:text-sky-600 [&_a]:underline [&_pre]:max-h-52 [&_pre]:overflow-auto [&_pre]:rounded-lg [&_pre]:bg-zinc-100 [&_pre]:p-3 [&_pre]:text-sm [&_code]:rounded [&_code]:bg-zinc-200 [&_code]:px-1.5 [&_code]:text-sm [&_ul]:my-2 [&_ol]:my-2'
    : 'text-[15px] leading-relaxed text-zinc-200 [&_p]:my-2 [&_a]:text-sky-400 [&_a]:underline [&_pre]:max-h-52 [&_pre]:overflow-auto [&_pre]:rounded-lg [&_pre]:bg-zinc-900 [&_pre]:p-3 [&_pre]:text-sm [&_code]:rounded [&_code]:bg-zinc-800 [&_code]:px-1.5 [&_code]:text-sm [&_ul]:my-2 [&_ol]:my-2'

  return (
    <div className="min-h-0 flex-1 overflow-hidden">
      <div
        ref={scrollRef}
        className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto overflow-x-hidden overscroll-contain pb-4 pr-1"
      >
        {loading && (
          <p className={`py-8 text-center text-sm ${loadingClassName}`}>
            {commonT('loading')}
          </p>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-16 text-center">
            <h2 className={`text-2xl font-normal sm:text-3xl ${welcomeClassName}`}>
              {t('welcomeHeadline')}
            </h2>
            <p className={`max-w-md text-sm ${subtitleClassName}`}>{t('empty')}</p>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            assistantMarkdownClassName={markdownClassName}
            onFeedbackChange={onFeedbackChange}
          />
        ))}

        {showThinkingBubble && <ChatThinkingBubble sending={sending} thinking={thinking} />}
      </div>
    </div>
  )
}
