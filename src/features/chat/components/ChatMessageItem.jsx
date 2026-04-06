import ReactMarkdown from 'react-markdown'
import { useSettingsStore } from '../../../store/settingsStore'
import MessageActions from '../../../components/chat/MessageActions'

export default function ChatMessageItem({
  message,
  assistantMarkdownClassName,
  onFeedbackChange,
}) {
  const isLight = useSettingsStore((state) => state.theme === 'light')
  const userBubble = isLight ? 'bg-zinc-200 text-zinc-900' : 'bg-zinc-800 text-zinc-100'
  const userText = isLight ? 'text-zinc-900' : 'text-zinc-100'

  return (
    <div
      className={
        message.role === 'user'
          ? 'group ml-8 max-w-[90%] self-end sm:ml-16'
          : 'group mr-8 max-w-[90%] self-start sm:mr-12'
      }
    >
      <div
        className={
          message.role === 'user'
            ? `rounded-2xl px-4 py-2.5 ${userBubble}`
            : 'px-1 py-1'
        }
      >
        {message.role === 'assistant' ? (
          <div className={assistantMarkdownClassName}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ) : (
          <p className={`whitespace-pre-wrap text-[15px] leading-relaxed ${userText}`}>
            {message.content}
          </p>
        )}
      </div>
      {!String(message.id).startsWith('local-') && (
        <MessageActions
          messageId={message.id}
          role={message.role}
          content={message.content}
          feedback={message.feedback}
          onFeedbackChange={onFeedbackChange}
        />
      )}
    </div>
  )
}
