import { useEffect, useRef } from 'react'
import Pusher from 'pusher-js'
import { useAuthStore } from '../store/authStore'
import { useChatStore } from '../store/chatStore'
import { getAgentChannelName, isPrivateChannel } from '../lib/pusherChannel'

const EVENT_THINKING = 'agent:thinking'
const EVENT_THINKING_CLEAR = 'agent:thinking_clear'
const EVENT_MESSAGE = 'agent:message_created'

function createPusher(accessToken) {
  const key = import.meta.env.VITE_PUSHER_KEY
  if (!key) return null

  const host = import.meta.env.VITE_PUSHER_HOST
  const port = import.meta.env.VITE_PUSHER_PORT
  const useTLS =
    String(import.meta.env.VITE_PUSHER_USE_TLS ?? 'true') !== 'false'
  const baseURL = import.meta.env.VITE_API_BASE_URL || ''

  /** @type {import('pusher-js').Options} */
  const opts = {
    cluster: import.meta.env.VITE_PUSHER_CLUSTER || 'mt1',
    forceTLS: true,
  }

  if (host) {
    opts.wsHost = host
    opts.wsPort = Number(port || (useTLS ? 443 : 80))
    opts.wssPort = Number(port || 443)
    opts.forceTLS = useTLS
    opts.enabledTransports = ['ws', 'wss']
    opts.cluster = ''
  }

  if (isPrivateChannel()) {
    opts.authEndpoint = `${baseURL}/api/realtime/pusher-auth`
    opts.auth = {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  }

  return new Pusher(key, opts)
}

/**
 * @param {object} p
 * @param {string | number | bigint | null} p.userId
 * @param {(row: object) => void} [p.onAssistantMessage]
 */
export function usePusherAgent({ userId, onAssistantMessage }) {
  const clearThinking = useChatStore((s) => s.clearThinking)
  const setThinking = useChatStore((s) => s.setThinking)
  const setRealtimeWarn = useChatStore((s) => s.setRealtimeWarn)
  const accessToken = useAuthStore((s) => s.access_token)
  const onMsgRef = useRef(onAssistantMessage)

  useEffect(() => {
    onMsgRef.current = onAssistantMessage
  }, [onAssistantMessage])

  useEffect(() => {
    if (!userId || !accessToken) return

    const key = import.meta.env.VITE_PUSHER_KEY
    if (!key) {
      setRealtimeWarn(false)
      return undefined
    }

    const pusher = createPusher(accessToken)
    if (!pusher) return undefined

    const channelName = getAgentChannelName(userId)
    const channel = pusher.subscribe(channelName)

    let timer = setTimeout(() => {
      setRealtimeWarn(true)
    }, 5000)

    const clearWarnTimer = () => {
      clearTimeout(timer)
      timer = null
    }

    channel.bind('pusher:subscription_succeeded', () => {
      clearWarnTimer()
      setRealtimeWarn(false)
    })

    channel.bind(EVENT_THINKING, (payload) => {
      setThinking({
        id: payload.id,
        step: payload.step,
        action: payload.action,
        text: payload.thinking,
      })
    })

    channel.bind(EVENT_THINKING_CLEAR, () => {
      clearThinking()
    })

    channel.bind(EVENT_MESSAGE, (payload) => {
      clearThinking()
      onMsgRef.current?.({
        id: String(payload.id),
        role: payload.role,
        content: payload.content,
        createdAt: payload.createdAt,
        threadId: payload.threadId,
      })
    })

    channel.bind('pusher:subscription_error', () => {
      clearWarnTimer()
      setRealtimeWarn(true)
    })

    return () => {
      if (timer) clearTimeout(timer)
      pusher.unsubscribe(channelName)
      pusher.disconnect()
    }
  }, [userId, accessToken, clearThinking, setThinking, setRealtimeWarn])
}
