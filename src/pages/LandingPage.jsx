import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LANDING_PROMPT_KEY } from '../landing/constants'
import { IconPaperclip, IconSend } from '../components/grok/GrokIcons'

export default function LandingPage() {
  const { t } = useTranslation('landing')
  const { t: tc } = useTranslation('common')
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    const text = q.trim()
    if (text) sessionStorage.setItem(LANDING_PROMPT_KEY, text)
    navigate('/login')
  }

  return (
    <div className="relative min-h-dvh bg-[#0a0a0a] text-zinc-100">
      <header className="flex items-center justify-between border-b border-white/6 px-4 py-4 sm:px-8">
        <span className="text-sm font-semibold tracking-tight text-zinc-100">
          {tc('appName')}
        </span>
        <nav className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/login"
            className="text-sm text-zinc-400 transition hover:text-zinc-100"
          >
            {t('login')}
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-white"
          >
            {t('signup')}
          </Link>
        </nav>
      </header>

      <main className="flex min-h-[calc(100dvh-4.5rem)] flex-col items-center justify-center px-4 pb-24 pt-12 sm:pb-32">
        <h1 className="mb-3 max-w-2xl text-center text-3xl font-normal tracking-tight text-zinc-50 sm:text-4xl">
          {t('heroTitle')}
        </h1>
        <p className="mb-12 max-w-md text-center text-sm text-zinc-500">
          {t('heroSubtitle')}
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-auto w-full max-w-2xl"
          aria-label={t('formAria')}
        >
          <div className="flex items-end gap-2 rounded-2xl border border-white/8 bg-zinc-900/50 px-3 py-2 backdrop-blur-sm focus-within:border-white/12">
            <IconPaperclip className="mb-2.5 h-5 w-5 shrink-0 text-zinc-500" aria-hidden />
            <label className="sr-only" htmlFor="landing-q">
              {t('placeholder')}
            </label>
            <textarea
              id="landing-q"
              rows={2}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('placeholder')}
              className="max-h-32 min-h-[48px] flex-1 resize-y bg-transparent py-2.5 text-[15px] text-zinc-100 placeholder:text-zinc-600 outline-none focus:ring-0"
            />
            <button
              type="submit"
              className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-900 transition hover:bg-white"
              aria-label={tc('send')}
            >
              <IconSend className="h-5 w-5" />
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
