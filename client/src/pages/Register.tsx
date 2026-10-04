import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { scorePassword } from '../lib/crypto'
import { emailIsValid } from '../lib/format'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Field'
import AuthShell from '../components/marketing/AuthShell'

const strengthColors = ['bg-ink-200', 'bg-danger', 'bg-gold-400', 'bg-accent-400', 'bg-accent-600']

export default function Register() {
  const { register, users } = useApp()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const strength = useMemo(() => scorePassword(password), [password])

  const emailInUse = useMemo(
    () => users.some((user) => user.email === email.trim().toLowerCase()) && email.includes('@'),
    [users, email],
  )

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const next: Record<string, string> = {}
    if (name.trim().length < 2) next.name = 'Enter your full name.'
    if (!emailIsValid(email)) next.email = 'Enter a valid email address.'
    else if (emailInUse) next.email = 'An account with that email already exists.'
    if (password.length < 8) next.password = 'Use at least 8 characters.'
    if (confirm !== password) next.confirm = 'Passwords do not match.'

    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    const error = await register({ name, email, password })
    setSubmitting(false)

    if (error) {
      setErrors({ form: error })
      return
    }
    navigate('/client/dashboard', { replace: true })
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="One account for everyone. Free to join, and it takes under a minute."
      footer={
        <>
          Already registered?{' '}
          <Link to="/login" className="font-medium text-ink-950 underline underline-offset-4">
            Log in
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <p role="alert" className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
            {errors.form}
          </p>
        )}

        <Input
          label="Full name"
          name="name"
          autoComplete="name"
          placeholder="Jane Cooper"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={errors.name}
          required
        />

        <div>
          <Input
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={errors.email ?? (emailInUse ? 'An account with that email already exists.' : undefined)}
            hint={!errors.email && !emailInUse ? 'We will only use this to sign you in.' : undefined}
            required
          />
        </div>

        <div>
          <Input
            label="Password"
            type="password"
            name="new-password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={errors.password}
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
              <span className="w-16 text-right text-xs text-muted">{strength.label}</span>
            </div>
          )}
        </div>

        <Input
          label="Confirm password"
          type="password"
          name="confirm-password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          error={errors.confirm}
          required
        />

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>

        <p className="text-xs leading-relaxed text-subtle">
          Everyone signs up the same way. If you also offer your own services, you can switch your
          account to a consultant profile at any time. Accounts are stored in this browser only —
          clearing site data removes them.
        </p>
      </form>
    </AuthShell>
  )
}
