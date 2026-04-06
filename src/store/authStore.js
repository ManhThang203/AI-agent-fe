import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      access_token: null,
      refresh_token: null,
      user: null,
      setSession: (tokens) =>
        set({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        }),
      setUser: (user) => set({ user }),
      logout: () =>
        set({ access_token: null, refresh_token: null, user: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        access_token: state.access_token,
        refresh_token: state.refresh_token,
        user: state.user,
      }),
    },
  ),
)
