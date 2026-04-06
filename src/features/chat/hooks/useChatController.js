import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { chatRequest } from '../../../api/agentMessagesApi'
import { usePusherAgent } from '../../../hooks/usePusherAgent'
import { LANDING_PROMPT_KEY } from '../../../landing/constants'
import { useAuthStore } from '../../../store/authStore'
import { useChatStore } from '../../../store/chatStore'
import { useChatThreadsStore } from '../../../store/chatThreadsStore'
import { useSettingsStore } from '../../../store/settingsStore'
import { appendAssistantMessage, mergeAfterChatSend } from '../utils/messageMerge'
import { normalizeRow } from '../utils/messageMappers'
import { useChatComposer } from './useChatComposer'
import { useThreadMessages } from './useThreadMessages'
import { useVoiceComposer } from './useVoiceComposer'

export function useChatController() {
  const { t } = useTranslation('chat')
  const user = useAuthStore((state) => state.user)
  const thinking = useChatStore((state) => state.thinking)
  const theme = useSettingsStore((state) => state.theme)
  const showThinkingInChat = useSettingsStore(
    (state) => state.showThinkingInChat,
  )
  const toggleShowThinkingInChat = useSettingsStore(
    (state) => state.toggleShowThinkingInChat,
  )
  const activeThreadId = useChatThreadsStore((state) => state.activeThreadId)
  const ensureActiveThread = useChatThreadsStore(
    (state) => state.ensureActiveThread,
  )
  const patchActiveMessages = useChatThreadsStore(
    (state) => state.patchActiveMessages,
  )
  const patchThreadMessages = useChatThreadsStore(
    (state) => state.patchThreadMessages,
  )
  const updateMessageFeedback = useChatThreadsStore(
    (state) => state.updateMessageFeedback,
  )
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const [sendError, setSendError] = useState(null)
  const [sending, setSending] = useState(false)

  const {
    input,
    composerRef,
    getComposerText,
    setComposerText,
    onComposerInput,
    onComposerPaste,
  } = useChatComposer()

  const {
    messages,
    loading,
    refreshThreadMessages,
    invalidateThreadLoad,
  } = useThreadMessages(activeThreadId)

  const onAssistantMessage = useCallback(
    (row) => {
      const appendMessage = (prev) =>
        appendAssistantMessage(prev, normalizeRow(row))

      if (row.threadId) {
        patchThreadMessages(row.threadId, appendMessage)
      } else {
        patchActiveMessages(appendMessage)
      }
    },
    [patchActiveMessages, patchThreadMessages],
  )

  usePusherAgent({
    userId: user?.id,
    onAssistantMessage,
  })

  useEffect(() => {
    const pending = sessionStorage.getItem(LANDING_PROMPT_KEY)
    if (!pending) return

    setComposerText(pending)
    sessionStorage.removeItem(LANDING_PROMPT_KEY)
  }, [setComposerText])

  useEffect(() => {
    const store = useChatThreadsStore
    if (store.persist.hasHydrated()) {
      store.getState().ensureActiveThread()
    }

    const unsubscribe = store.persist.onFinishHydration(() => {
      store.getState().ensureActiveThread()
    })

    return unsubscribe
  }, [])

  const { listening, startOrToggleVoiceInput } = useVoiceComposer({
    setComposerText: (nextValue) => {
      const resolvedValue =
        typeof nextValue === 'function'
          ? nextValue(getComposerText())
          : nextValue
      setComposerText(resolvedValue)
    },
    unsupportedMessage: t('voiceNotSupported'),
  })

  const send = useCallback(
    async (event) => {
      event?.preventDefault?.()

      const text = getComposerText()
      if (!text || sending) return

      const threadId = activeThreadId ?? ensureActiveThread()
      if (!threadId) return

      setSendError(null)
      setSending(true)
      invalidateThreadLoad(threadId)

      const tempId = `local-${Date.now()}`
      const optimisticMessage = {
        id: tempId,
        role: 'user',
        content: text,
        feedback: null,
      }

      patchThreadMessages(threadId, (prev) => [...prev, optimisticMessage])
      setComposerText('')

      try {
        const data = await chatRequest({ input: text, threadId })
        patchThreadMessages(threadId, (prev) =>
          mergeAfterChatSend(prev, tempId, data, optimisticMessage),
        )

        try {
          await refreshThreadMessages(threadId, { silent: true })
        } catch {
          /* keep merged messages */
        }
      } catch (error) {
        patchThreadMessages(threadId, (prev) =>
          prev.filter((message) => message.id !== tempId),
        )
        setSendError(error.message || t('sendError'))
      } finally {
        setSending(false)
      }
    },
    [
      activeThreadId,
      ensureActiveThread,
      getComposerText,
      invalidateThreadLoad,
      patchThreadMessages,
      refreshThreadMessages,
      sending,
      setComposerText,
      t,
    ],
  )

  const onComposerKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        void send(event)
      }
    },
    [send],
  )

  const onFeedbackChange = useCallback(
    (messageId, feedback) => {
      if (!activeThreadId) return
      updateMessageFeedback(activeThreadId, messageId, feedback)
    },
    [activeThreadId, updateMessageFeedback],
  )

  return {
    theme,
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
  }
}
