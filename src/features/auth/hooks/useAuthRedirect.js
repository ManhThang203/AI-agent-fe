import { useAuthStore } from '../../../store/authStore'

export function useAuthRedirect() {
  return useAuthStore((state) => Boolean(state.access_token))
}
