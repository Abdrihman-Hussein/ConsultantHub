import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { emailIsValid } from '../lib/format'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Field'
import AuthShell from '../components/marketing/AuthShell'

interface LocationState {
  from?: string
}

export default function Login() {
  const { login, isPersistent } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({})
  const [submitting, setSubmitting] = useState(false)

  const redirectTo = (location.state as LocationState | null)?.from ?? '/client/dashboard'

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const next: typeof errors = {}
    if (!emailIsValid(email)) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Enter your password.'

    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    const error = await login({ email, password })
    setSubmitting(false)

    if (error) {
      setErrors({ form: error })
      return
    }
    navigate(redirectTo, { replace: true })
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to manage your bookings."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-ink-950 underline underline-offset-4">
            Create one
          </Link>
        </>
      }
    >
      {/*
        Demo credentials are surfaced because there is no real backend here. A
        production build would remove this entirely.
      */}
      <div className="mb-6 rounded-xl border border-accent-200 bg-accent-50/60 p-4">
        <p className="text-xs font-medium text-accent-800">Demo account</p>
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
          Fill demo credentials
        </button>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <p role="alert" className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
            {errors.form}
          </p>
        )}

        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          required
        />

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Log in'}
        </Button>

        {!isPersistent && (
          <p className="text-xs leading-relaxed text-subtle">
            Storage is unavailable in this browser, so your session lasts only until you reload.
          </p>
        )}
      </form>
    </AuthShell>
  )
}
