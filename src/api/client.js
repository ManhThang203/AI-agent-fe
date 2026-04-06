import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import { rawHttp } from './http'

const baseURL = import.meta.env.VITE_API_BASE_URL || ''

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().access_token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config
    const status = error.response?.status
    const url = original?.url || ''
    if (
      status !== 401 ||
      original._retry ||
      url.includes('/api/auth/refresh') ||
      url.includes('/auth/refresh')
    ) {
      return Promise.reject(error)
    }
    original._retry = true
    const refresh_token = useAuthStore.getState().refresh_token
    if (!refresh_token) {
      useAuthStore.getState().logout()
      return Promise.reject(error)
    }
    try {
      const { data: body } = await rawHttp.post('/api/auth/refresh', {
        refresh_token,
      })
      if (!body.success) throw new Error(body.message || 'refresh failed')
      const tokens = body.data
      useAuthStore.getState().setSession(tokens)
      original.headers.Authorization = `Bearer ${tokens.access_token}`
      return api(original)
    } catch {
      useAuthStore.getState().logout()
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.startsWith('/login')
      ) {
        window.location.assign('/login')
      }
      return Promise.reject(error)
    }
  },
)

export function unwrap(res) {
  const body = res.data
  if (!body.success) throw new Error(body.message || 'Request failed')
  return body.data
}
