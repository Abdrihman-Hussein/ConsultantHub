import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { scorePassword } from '../lib/crypto'
import { emailIsValid } from '../lib/format'
import { useTranslation } from '../i18n/LanguageContext'
import type { MessageKey } from '../i18n/strings'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Field'
import AuthShell from '../components/marketing/AuthShell'

const strengthColors = ['bg-ink-200', 'bg-danger', 'bg-gold-400', 'bg-accent-400', 'bg-accent-600']

export default function Register() {
  const { register, users } = useApp()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Record<string, MessageKey>>({})
  const [submitting, setSubmitting] = useState(false)

  const strength = useMemo(() => scorePassword(password), [password])

  const emailInUse = useMemo(
    () => users.some((user) => user.email === email.trim().toLowerCase()) && email.includes('@'),
    [users, email],
  )

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const next: Record<string, MessageKey> = {}
    if (name.trim().length < 2) next.name = 'register.error_name'
    if (!emailIsValid(email)) next.email = 'register.error_email'
    else if (emailInUse) next.email = 'register.error_email_exists'
    if (password.length < 8) next.password = 'register.error_password_short'
    if (confirm !== password) next.confirm = 'register.error_confirm'

    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    const error = await register({ name, email, password })
    setSubmitting(false)

    if (error) {
      // From `lib/auth` — already a key, see that module.
      setErrors({ form: error.key })
      return
    }
    navigate('/client/dashboard', { replace: true })
  }

  return (
    <AuthShell
      title={t('register.title')}
      subtitle={t('register.subtitle')}
      footer={
        <>
          {t('register.already')}{' '}
          <Link to="/login" className="font-medium text-ink-950 underline underline-offset-4">
            {t('common.log_in')}
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <p role="alert" className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
            {t(errors.form)}
          </p>
        )}

        <Input
          label={t('register.label_name')}
          name="name"
          autoComplete="name"
          placeholder="Jane Cooper"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={errors.name ? t(errors.name) : undefined}
          required
        />

        <div>
          <Input
            label={t('common.email')}
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={
              errors.email
                ? t(errors.email)
                : emailInUse
                  ? t('register.error_email_exists')
                  : undefined
            }
            hint={
              !errors.email && !emailInUse ? t('register.hint_email') : undefined
            }
            required
          />
        </div>

        <div>
          <Input
            label={t('common.password')}
            type="password"
            name="new-password"
            autoComplete="new-password"
            placeholder={t('register.placeholder_password')}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={errors.password ? t(errors.password) : undefined}
            required
          />

          {/* Strength meter: four bars plus a label, hidden until typing starts. */}
          {password.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex flex-1 gap-1" aria-hidden="true">
                {[0, 1, 2, 3].map((index) => (
                  <span
                    key={index}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      index < strength.score
                        ? strengthColors[strength.score]
                        : 'bg-ink-200'
                    }`}
                  />
                ))}
              </div>
              <span className="w-16 text-right text-xs text-muted">
                {t(strength.labelKey)}
              </span>
            </div>
          )}
        </div>

        <Input
          label={t('register.label_confirm')}
          type="password"
          name="confirm-password"
          autoComplete="new-password"
          placeholder={t('register.placeholder_confirm')}
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          error={errors.confirm ? t(errors.confirm) : undefined}
          required
        />

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? t('register.submitting') : t('register.submit')}
        </Button>

        <p className="text-xs leading-relaxed text-subtle">
          {t('register.note')}
        </p>
      </form>
    </AuthShell>
  )
}