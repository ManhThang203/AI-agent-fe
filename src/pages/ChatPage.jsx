import { useEffect, useRef } from 'react'
import { useSettingsStore } from '../store/settingsStore'
import { useChatController } from '../features/chat/hooks/useChatController'
import ChatHeader from '../features/chat/components/ChatHeader'
import ChatComposer from '../features/chat/components/ChatComposer'
import ChatMessageList from '../features/chat/components/ChatMessageList'
import ChatSidebar from '../components/chat/ChatSidebar'

export default function ChatPage() {
  const isLight = useSettingsStore((state) => state.theme === 'light')
  const {
    thinking,
    showThinkingInChat,
    toggleShowThinkingInChat,
    mobileSidebar,
    setMobileSidebar,
    sendError,
    sending,
    messages,
    loading,
    input,
    composerRef,
    listening,
    send,
    onComposerInput,
    onComposerPaste,
    onComposerKeyDown,
    startOrToggleVoiceInput,
    onFeedbackChange,
  } = useChatController()
  const scrollRef = useRef(null)

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return
    element.scrollTop = element.scrollHeight
  }, [messages, thinking, loading, sending])

  const rootClassName = isLight
    ? 'bg-zinc-50 text-zinc-900'
    : 'bg-[#0a0a0a] text-zinc-100'
  const showThinkingBubble = sending || (showThinkingInChat && thinking)
  const canSend =
    (composerRef.current?.textContent || '').replace(/\u00a0/g, ' ').trim().length >
    0

  return (
    <div
      className={`relative isolate -mx-3 -mt-3 flex h-full min-h-0 flex-1 overflow-hidden overscroll-none md:flex-row md:items-stretch ${rootClassName}`}
    >
      <ChatSidebar
        mobileOpen={mobileSidebar}
        onCloseMobile={() => setMobileSidebar(false)}
      />

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <ChatHeader onOpenSidebar={() => setMobileSidebar(true)} />

        <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden px-3 pt-2">
          <ChatMessageList
            scrollRef={scrollRef}
            loading={loading}
            messages={messages}
            sending={sending}
            thinking={thinking}
            showThinkingBubble={showThinkingBubble}
            onFeedbackChange={onFeedbackChange}
          />

          {sendError && (
            <p className="shrink-0 pb-2 text-sm text-red-500" role="alert">
              {sendError}
            </p>
          )}

          <ChatComposer
            input={input}
            composerRef={composerRef}
            listening={listening}
            sending={sending}
            showThinkingInChat={showThinkingInChat}
            onSubmit={send}
            onComposerInput={onComposerInput}
            onComposerKeyDown={onComposerKeyDown}
            onComposerPaste={onComposerPaste}
            onToggleThinking={toggleShowThinkingInChat}
            onVoiceInput={startOrToggleVoiceInput}
            canSend={canSend}
          />
        </div>
      </div>
    </div>
  )
}
