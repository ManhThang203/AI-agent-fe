import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const LEGACY_THREAD_ID = 'default'

function newId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `t-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function deriveThreadTitle(messages) {
  const first = messages.find((m) => m.role === 'user')
  if (!first?.content) return ''
  const s = first.content.trim().replace(/\s+/g, ' ')
  return s.length > 48 ? `${s.slice(0, 45)}…` : s
}

export const useChatThreadsStore = create(
  persist(
    (set, get) => ({
      threads: [],
      activeThreadId: null,

      ensureActiveThread: () => {
        const { threads, activeThreadId } = get()
        if (threads.length === 0) {
          const id = newId()
          set({
            threads: [
              { id, title: '', messages: [], updatedAt: Date.now() },
            ],
            activeThreadId: id,
          })
          return id
        }
        if (!activeThreadId || !threads.some((t) => t.id === activeThreadId)) {
          const id = threads[0].id
          set({ activeThreadId: id })
          return id
        }
        return activeThreadId
      },

      newThread: () => {
        const id = newId()
        set((state) => ({
          threads: [
            { id, title: '', messages: [], updatedAt: Date.now() },
            ...state.threads,
          ],
          activeThreadId: id,
        }))
        return id
      },

      setActiveThread: (id) => set({ activeThreadId: id }),

      renameThread: (threadId, title) => {
        const trimmed = title.trim()
        set((state) => ({
          threads: state.threads.map((th) =>
            th.id === threadId
              ? { ...th, title: trimmed, updatedAt: Date.now() }
              : th,
          ),
        }))
      },

      removeThread: (threadId) => {
        set((state) => {
          const threads = state.threads.filter((t) => t.id !== threadId)
          if (state.activeThreadId !== threadId) {
            return { threads }
          }
          if (threads.length > 0) {
            return { threads, activeThreadId: threads[0].id }
          }
          const id = newId()
          return {
            threads: [{ id, title: '', messages: [], updatedAt: Date.now() }],
            activeThreadId: id,
          }
        })
      },

      replaceThreadMessages: (threadId, messages) => {
        set((state) => ({
          threads: state.threads.map((th) => {
            if (th.id !== threadId) return th
            return {
              ...th,
              messages,
              title: th.title || deriveThreadTitle(messages),
              updatedAt: Date.now(),
            }
          }),
        }))
      },

      patchActiveMessages: (updater) => {
        set((state) => {
          const tid = state.activeThreadId
          if (!tid) return state
          return {
            threads: state.threads.map((th) => {
              if (th.id !== tid) return th
              const messages = updater(th.messages)
              return {
                ...th,
                messages,
                title: th.title || deriveThreadTitle(messages),
                updatedAt: Date.now(),
              }
            }),
          }
        })
      },

      patchThreadMessages: (threadId, updater) => {
        set((state) => ({
          threads: state.threads.map((th) => {
            if (th.id !== threadId) return th
            const messages = updater(th.messages)
            return {
              ...th,
              messages,
              title: th.title || deriveThreadTitle(messages),
              updatedAt: Date.now(),
            }
          }),
        }))
      },

      updateMessageFeedback: (threadId, messageId, feedback) => {
        set((state) => ({
          threads: state.threads.map((th) => {
            if (th.id !== threadId) return th
            return {
              ...th,
              messages: th.messages.map((m) =>
                m.id === messageId ? { ...m, feedback } : m,
              ),
              updatedAt: Date.now(),
            }
          }),
        }))
      },

      reset: () => {
        try {
          localStorage.removeItem('chat-threads-storage')
        } catch {
          /* ignore */
        }
        set({ threads: [], activeThreadId: null })
      },
    }),
    {
      name: 'chat-threads-storage',
      version: 2,
      migrate: (persistedState, fromVersion) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return { threads: [], activeThreadId: null }
        }
        const s = persistedState
        const threadsRaw = s.threads
        if (
          fromVersion < 2 &&
          Array.isArray(threadsRaw) &&
          threadsRaw.length > 0
        ) {
          const hasDefault = threadsRaw.some((t) => t?.id === LEGACY_THREAD_ID)
          if (!hasDefault) {
            const oldFirstId = threadsRaw[0].id
            const threads = threadsRaw.map((t, i) =>
              i === 0 ? { ...t, id: LEGACY_THREAD_ID } : t,
            )
            let activeThreadId = s.activeThreadId
            if (activeThreadId === oldFirstId) activeThreadId = LEGACY_THREAD_ID
            return { threads, activeThreadId }
          }
        }
        return {
          threads: Array.isArray(threadsRaw) ? threadsRaw : [],
          activeThreadId: s.activeThreadId ?? null,
        }
      },
      partialize: (state) => ({
        threads: state.threads,
        activeThreadId: state.activeThreadId,
      }),
    },
  ),
)

export { newId }
