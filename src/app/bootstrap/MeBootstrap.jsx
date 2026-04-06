import { useEffect } from 'react'
import { meRequest } from '../../api/authApi'
import { useAuthStore } from '../../store/authStore'

export default function MeBootstrap() {
  const accessToken = useAuthStore((state) => state.access_token)
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    if (!accessToken || user) return

    meRequest()
      .then(setUser)
      .catch(() => {})
  }, [accessToken, user, setUser])

  return null
}
