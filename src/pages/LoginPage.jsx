import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { loginRequest, meRequest } from '../api/authApi'
import { useAuthStore } from '../store/authStore'
import AuthCard from '../features/auth/components/AuthCard'
import AuthField from '../features/auth/components/AuthField'
import { useAuthRedirect } from '../features/auth/hooks/useAuthRedirect'
import { loginSchema } from '../features/auth/schemas/authSchemas'
import {
  getApiErrorMessage,
  mapApiFieldErrors,
} from '../features/auth/utils/mapApiFieldErrors'

export default function LoginPage() {
  const { t } = useTranslation('auth')
  const { t: tc } = useTranslation('common')
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const setUser = useAuthStore((s) => s.setUser)
  const shouldRedirect = useAuthRedirect()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema(t)),
    defaultValues: { email: '', password: '' },
  })

  if (shouldRedirect) return <Navigate to="/chat" replace />

  const onSubmit = async (values) => {
    try {
      const tokens = await loginRequest(values.email, values.password)
      setSession(tokens)
      const me = await meRequest()
      setUser(me)
      navigate('/chat', { replace: true })
    } catch (e) {
      const msg = getApiErrorMessage(e, tc('error'))
      mapApiFieldErrors(e.response?.data?.errors, ['email', 'password'], setError)
      setError('root', { message: msg })
    }
  }

  const inputClassName =
    'rounded-xl border border-white/10 bg-zinc-950/80 px-3 py-2.5 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20'

  return (
    <AuthCard
      appName={tc('appName')}
      title={t('loginTitle')}
      footer={
        <p className="mt-8 text-center text-sm text-zinc-500">
          <Link
            to="/register"
            className="font-medium text-sky-400 underline-offset-4 hover:text-sky-300 hover:underline"
          >
            {t('noAccount')}
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {errors.root && (
          <p className="text-sm text-red-400" role="alert">
            {errors.root.message}
          </p>
        )}
        <AuthField label={t('email')} error={errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            className={inputClassName}
            {...register('email')}
          />
        </AuthField>
        <AuthField label={t('password')} error={errors.password?.message}>
          <input
            type="password"
            autoComplete="current-password"
            className={inputClassName}
            {...register('password')}
          />
        </AuthField>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 rounded-xl bg-zinc-100 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-white disabled:opacity-50"
        >
          {t('submitLogin')}
        </button>
      </form>
    </AuthCard>
  )
}
