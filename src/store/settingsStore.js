import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from '../i18n/config'

export const useSettingsStore = create(
  persist(
    (set) => ({
      locale: 'vi',
      /** Giao diện trang account/login (chat luôn tối kiểu Grok). */
      theme: 'dark',
      /** Hiện khối thinking realtime trên trang chat. */
      showThinkingInChat: true,
      setLocale: (locale) => {
        set({ locale })
        void i18n.changeLanguage(locale)
      },
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setShowThinkingInChat: (showThinkingInChat) =>
        set({ showThinkingInChat }),
      toggleShowThinkingInChat: () =>
        set((s) => ({ showThinkingInChat: !s.showThinkingInChat })),
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        locale: state.locale,
        theme: state.theme,
        showThinkingInChat: state.showThinkingInChat,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...(persisted && typeof persisted === 'object' ? persisted : {}),
        theme: persisted?.theme ?? current.theme,
        showThinkingInChat:
          persisted?.showThinkingInChat ?? current.showThinkingInChat,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.locale) void i18n.changeLanguage(state.locale)
      },
    },
  ),
)
