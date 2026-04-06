import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import LandingPage from '../pages/LandingPage'

export default function RootRedirect() {
  const token = useAuthStore((s) => s.access_token)
  if (token) return <Navigate to="/chat" replace />
  return <LandingPage />
}
