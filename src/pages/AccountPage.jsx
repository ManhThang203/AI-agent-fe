import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useSettingsStore } from '../store/settingsStore'
import { useChatThreadsStore } from '../store/chatThreadsStore'

export default function AccountPage() {
  const { t } = useTranslation('account')
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const locale = useSettingsStore((s) => s.locale)
  const setLocale = useSettingsStore((s) => s.setLocale)
  const navigate = useNavigate()

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="text-xl font-semibold text-text">{t('title')}</h1>
      {user && (
        <div className="rounded-lg border border-border bg-surface p-4 text-sm">
          <p className="font-medium text-text">{user.username}</p>
          <p className="text-text-muted">{user.email}</p>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <span className="text-sm text-text-muted">{t('language')}</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setLocale('vi')}
            className={`rounded-lg border px-3 py-2 text-sm ${
              locale === 'vi'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-surface text-text'
            }`}
          >
            {t('vi')}
          </button>
          <button
            type="button"
            onClick={() => setLocale('en')}
            className={`rounded-lg border px-3 py-2 text-sm ${
              locale === 'en'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-surface text-text'
            }`}
          >
            {t('en')}
          </button>
        </div>
      </div>
      <p className="text-xs text-text-muted">{t('agentNote')}</p>
      <button
        type="button"
        onClick={() => {
          useChatThreadsStore.getState().reset()
          logout()
          navigate('/login', { replace: true })
        }}
        className="rounded-lg border border-danger py-3 text-sm font-medium text-danger"
      >
        {t('logout')}
      </button>
    </div>
  )
}
