import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { emailIsValid } from '../lib/format'
import { useTranslation } from '../i18n/LanguageContext'
import type { MessageKey } from '../i18n/strings'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Field'
import AuthShell from '../components/marketing/AuthShell'

interface LocationState {
  from?: string
}

/**
 * Field errors are stored as dictionary keys, not sentences, so switching
 * language re-renders them. A message captured as text on submit would stay in
 * whatever language was active at that moment.
 */
type FieldErrorKey = 'login.error_email' | 'login.error_password'

export default function Login() {
  const { login, isPersistent } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{
    email?: FieldErrorKey;
    password?: FieldErrorKey;
    /** From `lib/auth`, which reports failures as keys too. */
    form?: MessageKey;
  }>({})
  const [submitting, setSubmitting] = useState(false)

  const redirectTo = (location.state as LocationState | null)?.from ?? '/client/dashboard'

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const next: typeof errors = {}
    if (!emailIsValid(email)) next.email = 'login.error_email'
    if (!password) next.password = 'login.error_password'

    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    const error = await login({ email, password })
    setSubmitting(false)

    if (error) {
      // From `lib/auth`, which returns a key rather than an English sentence.
      setErrors({ form: error.key })
      return
    }
    navigate(redirectTo, { replace: true })
  }

  return (
    <AuthShell
      title={t('login.title')}
      subtitle={t('login.subtitle')}
      footer={
        <>
          {t('login.no_account')}{' '}
          <Link to="/register" className="font-medium text-ink-950 underline underline-offset-4">
            {t('booking.create_one')}
          </Link>
        </>
      }
    >
      {/*
        Demo credentials are surfaced because there is no real backend here. A
        production build would remove this entirely.
      */}
      <div className="mb-6 rounded-xl border border-accent-200 bg-accent-50/60 p-4">
        <p className="text-xs font-medium text-accent-800">{t('login.demo_title')}</p>
        <p className="mt-1 font-mono text-xs text-accent-700">
          amina@example.com · consultant123
        </p>
        <button
          type="button"
          onClick={() => {
            setEmail('amina@example.com')
            setPassword('consultant123')
            setErrors({})
          }}
          className="mt-2.5 rounded-full border border-accent-300 px-3 py-1.5 text-xs font-medium text-accent-700 transition-colors hover:bg-accent-100"
        >
          {t('login.demo_fill')}
        </button>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <p role="alert" className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
            {t(errors.form)}
          </p>
        )}

        <Input
          label={t('common.email')}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email ? t(errors.email) : undefined}
          required
        />
        <Input
          label={t('common.password')}
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password ? t(errors.password) : undefined}
          required
        />

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? t('login.submitting') : t('login.submit')}
        </Button>

        {!isPersistent && (
          <p className="text-xs leading-relaxed text-subtle">
            {t('login.no_storage')}
          </p>
        )}
      </form>
    </AuthShell>
  )
}