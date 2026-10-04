import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Field'
import AuthShell from '../components/marketing/AuthShell'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    // Client-side validation only — no backend in the MVP (see README roadmap).
    const next: typeof errors = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address.'
    if (password.length < 8) next.password = 'Password must be at least 8 characters.'

    setErrors(next)
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
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <Input
          label="Email"
          type="email"
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
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              className="h-4 w-4 cursor-pointer rounded border-line-strong accent-accent-500"
            />
            Remember me
          </label>
          <a
            href="/#"
            className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-ink-950"
          >
            Forgot password?
          </a>
        </div>

        <Button type="submit" className="w-full">
          Log in
        </Button>
      </form>
    </AuthShell>
  )
}
