import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute() {
  const token = useAuthStore((s) => s.access_token)
  if (!token) return <Navigate to="/login" replace />
  return <Outlet />
}
