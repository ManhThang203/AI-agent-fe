import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '../../../store/settingsStore'
import { IconBrain, IconMic, IconSend } from '../../../components/grok/GrokIcons'

export default function ChatComposer({
  input,
  composerRef,
  listening,
  sending,
  showThinkingInChat,
  onSubmit,
  onComposerInput,
  onComposerKeyDown,
  onComposerPaste,
  onToggleThinking,
  onVoiceInput,
  canSend,
}) {
  const { t } = useTranslation('chat')
  const { t: commonT } = useTranslation('common')
  const isLight = useSettingsStore((state) => state.theme === 'light')

  const composerDock = isLight
    ? 'border-zinc-200 bg-zinc-50/96'
    : 'border-white/6 bg-[#0a0a0a]/96'
  const composerWrap = isLight
    ? 'border-zinc-200 bg-white/80 focus-within:border-zinc-300'
    : 'border-white/8 bg-zinc-900/50 focus-within:border-white/12'
  const iconButtonClassName = isLight
    ? 'text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800'
    : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
  const inputClassName = isLight
    ? 'text-zinc-900 placeholder:text-zinc-400'
    : 'text-zinc-100 placeholder:text-zinc-600'
  const sendButtonClassName = isLight
    ? 'bg-zinc-900 text-zinc-50 hover:bg-zinc-800'
    : 'bg-zinc-100 text-zinc-900 hover:bg-white'
  const placeholderClassName = isLight ? 'text-zinc-400' : 'text-zinc-600'

  return (
    <form
      onSubmit={onSubmit}
      className={`sticky bottom-0 z-20 shrink-0 space-y-2 border-t pb-2 pt-2 backdrop-blur-sm ${composerDock}`}
      aria-label={t('composerLabel')}
    >
      <div
        className={`flex items-end gap-2 rounded-2xl border px-3 py-2 shadow-sm backdrop-blur-sm ${composerWrap}`}
      >
        <button
          type="button"
          className={`mb-1 shrink-0 rounded-lg p-2 transition ${iconButtonClassName} ${
            listening ? 'text-red-500' : ''
          }`}
          aria-label={t('voiceInput')}
          aria-pressed={listening}
          onClick={onVoiceInput}
        >
          <IconMic className="h-5 w-5" />
        </button>
        <button
          type="button"
          className={`mb-1 shrink-0 rounded-lg p-2 transition ${iconButtonClassName} ${
            showThinkingInChat ? 'text-sky-500' : ''
          }`}
          aria-label={t('toggleThinking')}
          aria-pressed={showThinkingInChat}
          onClick={onToggleThinking}
        >
          <IconBrain className="h-5 w-5" />
        </button>
        <div className="relative min-h-[44px] flex-1">
          {!input.trim() && (
            <span
              className={`pointer-events-none absolute left-0 top-2.5 text-[15px] ${placeholderClassName}`}
              aria-hidden
            >
              {t('placeholder')}
            </span>
          )}
          <div
            ref={composerRef}
            id="chat-input"
            role="textbox"
            aria-multiline="true"
            aria-label={t('placeholder')}
            contentEditable
            suppressContentEditableWarning
            className={`relative z-10 max-h-36 min-h-[44px] overflow-y-auto whitespace-pre-wrap wrap-break-word py-2.5 text-[15px] outline-none focus:ring-0 ${inputClassName}`}
            onInput={onComposerInput}
            onKeyDown={onComposerKeyDown}
            onPaste={onComposerPaste}
          />
        </div>
        <button
          type="submit"
          disabled={sending || !canSend}
          className={`mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition disabled:opacity-35 ${sendButtonClassName}`}
          aria-label={commonT('send')}
        >
          <IconSend className="h-5 w-5" />
        </button>
      </div>
    </form>
  )
}
