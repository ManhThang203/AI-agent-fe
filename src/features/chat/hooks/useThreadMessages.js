import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { listMessagesRequest } from '../../../api/agentMessagesApi'
import { useChatThreadsStore } from '../../../store/chatThreadsStore'
import { normalizeRow } from '../utils/messageMappers'

export function useThreadMessages(activeThreadId) {
  const threads = useChatThreadsStore((state) => state.threads)
  const replaceThreadMessages = useChatThreadsStore(
    (state) => state.replaceThreadMessages,
  )
  const threadListGenRef = useRef(new Map())
  const [loading, setLoading] = useState(true)

  const messages = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId)?.messages ?? [],
    [threads, activeThreadId],
  )

  const invalidateThreadLoad = useCallback((threadId) => {
    const generationMap = threadListGenRef.current
    const nextGeneration = (generationMap.get(threadId) || 0) + 1
    generationMap.set(threadId, nextGeneration)
    return nextGeneration
  }, [])

  const getThreadLoadGeneration = useCallback(
    (threadId) => threadListGenRef.current.get(threadId) || 0,
    [],
  )

  const refreshThreadMessages = useCallback(
    async (threadId, { silent = false } = {}) => {
      if (!threadId) return
      const myGeneration = invalidateThreadLoad(threadId)
      if (!silent) setLoading(true)

      try {
        const rows = await listMessagesRequest(50, threadId)
        if (getThreadLoadGeneration(threadId) !== myGeneration) return
        replaceThreadMessages(threadId, (rows || []).map(normalizeRow))
      } catch {
        if (getThreadLoadGeneration(threadId) !== myGeneration) return
      } finally {
        if (!silent) setLoading(false)
      }
    },
    [getThreadLoadGeneration, invalidateThreadLoad, replaceThreadMessages],
  )

  useEffect(() => {
    if (!activeThreadId) return undefined
    let cancelled = false

    const run = async () => {
      setLoading(true)
      const myGeneration = invalidateThreadLoad(activeThreadId)

      try {
        const rows = await listMessagesRequest(50, activeThreadId)
        if (cancelled) return
        if (getThreadLoadGeneration(activeThreadId) !== myGeneration) return
        replaceThreadMessages(activeThreadId, (rows || []).map(normalizeRow))
      } catch {
        if (cancelled) return
        if (getThreadLoadGeneration(activeThreadId) !== myGeneration) return
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [
    activeThreadId,
    getThreadLoadGeneration,
    invalidateThreadLoad,
    replaceThreadMessages,
  ])

  return {
    messages,
    loading,
    refreshThreadMessages,
    invalidateThreadLoad,
    replaceThreadMessages,
  }
}
