import { create } from 'zustand'

/** Realtime thinking + banner; message list stays in ChatPage or can move here later */
export const useChatStore = create((set) => ({
  thinking: null,
  realtimeWarn: false,
  setThinking: (thinking) => set({ thinking }),
  clearThinking: () => set({ thinking: null }),
  setRealtimeWarn: (realtimeWarn) => set({ realtimeWarn }),
}))
