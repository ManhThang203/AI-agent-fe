import { useTranslation } from 'react-i18next'
import {
  IconCopy,
  IconThumbDown,
  IconThumbUp,
  IconVolume,
} from '../grok/GrokIcons'
import { patchMessageFeedbackRequest } from '../../api/agentMessagesApi'
import { useSettingsStore } from '../../store/settingsStore'

function stripMarkdownForSpeech(s) {
  return s
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s?/gm, '')
    .replace(/^\s*[-*]\s?/gm, '')
    .trim()
}

export default function MessageActions({
  messageId,
  role,
  content,
  feedback,
  onFeedbackChange,
}) {
  const { t } = useTranslation('chat')
  const isLight = useSettingsStore((s) => s.theme === 'light')
  const btn =
    isLight
      ? 'text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
      : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200'
  const border = isLight ? 'border-zinc-200' : 'border-white/6'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content)
    } catch {
      /* ignore */
    }
  }

  const speak = () => {
    if (!window.speechSynthesis) return
    const text =
      role === 'assistant' ? stripMarkdownForSpeech(content) : content
    if (!text) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = document.documentElement.lang || 'vi-VN'
    window.speechSynthesis.speak(u)
  }

  const setFeedback = async (next) => {
    const resolved =
      next === 'up' && feedback === 'up'
        ? null
        : next === 'down' && feedback === 'down'
          ? null
          : next
    try {
      await patchMessageFeedbackRequest(messageId, resolved)
      onFeedbackChange?.(messageId, resolved)
    } catch {
      /* ignore */
    }
  }

  if (role === 'user') {
    return (
      <div className="mt-1 flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
        <button
          type="button"
          className={`rounded-md p-1.5 ${btn}`}
          aria-label={t('copyMessage')}
          onClick={() => void copy()}
        >
          <IconCopy className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div
      className={`mt-2 flex flex-wrap items-center gap-0.5 border-t pt-2 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100 ${border}`}
    >
      <button
        type="button"
        className={`rounded-md p-1.5 ${btn}`}
        aria-label={t('copyMessage')}
        onClick={() => void copy()}
      >
        <IconCopy className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={`rounded-md p-1.5 ${btn}`}
        aria-label={t('readAloud')}
        onClick={speak}
      >
        <IconVolume className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={`rounded-md p-1.5 ${
          feedback === 'up'
            ? isLight
              ? 'text-sky-600 hover:bg-zinc-200'
              : 'text-sky-400 hover:bg-zinc-800'
            : btn
        }`}
        aria-label={t('feedbackUp')}
        aria-pressed={feedback === 'up'}
        onClick={() => void setFeedback('up')}
      >
        <IconThumbUp className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={`rounded-md p-1.5 ${
          feedback === 'down'
            ? isLight
              ? 'text-amber-600 hover:bg-zinc-200'
              : 'text-amber-400 hover:bg-zinc-800'
            : btn
        }`}
        aria-label={t('feedbackDown')}
        aria-pressed={feedback === 'down'}
        onClick={() => void setFeedback('down')}
      >
        <IconThumbDown className="h-4 w-4" />
      </button>
    </div>
  )
}
