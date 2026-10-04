import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Field'
import AuthShell from '../components/marketing/AuthShell'

type Role = 'client' | 'consultant'

const roles: { value: Role; label: string; detail: string }[] = [
  { value: 'client', label: 'Hire a consultant', detail: 'Browse and book sessions' },
  { value: 'consultant', label: 'Offer consultations', detail: 'List your services' },
]

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('client')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    // Client-side validation only — no backend in the MVP (see README roadmap).
    const next: Record<string, string> = {}
    if (name.trim().length < 2) next.name = 'Enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address.'
    if (password.length < 8) next.password = 'Use at least 8 characters.'

    setErrors(next)
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free to join. Takes under a minute."
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
        <fieldset>
          <legend className="mb-2.5 text-sm font-medium text-body">I want to</legend>
          <div className="grid gap-2.5">
            {roles.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all duration-200 ease-out ${
                  role === option.value
                    ? 'border-accent-500 bg-accent-50/60 shadow-glow'
                    : 'border-line-strong hover:border-accent-300 hover:bg-accent-50/30'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={role === option.value}
                  onChange={() => setRole(option.value)}
                  className="mt-0.5 h-4 w-4 cursor-pointer accent-accent-500"
                />
                <span>
                  <span className="block text-sm font-medium text-ink-950">{option.label}</span>
                  <span className="mt-0.5 block text-xs text-muted">{option.detail}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <Input
          label="Full name"
          autoComplete="name"
          placeholder="Jane Cooper"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={errors.name}
          required
        />
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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          hint={!errors.password ? 'Use 8 or more characters.' : undefined}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          minLength={8}
          required
        />

        <Button type="submit" className="w-full">
          Create account
        </Button>

        <p className="text-xs leading-relaxed text-subtle">
          By creating an account you agree to our{' '}
          <a href="/#" className="underline underline-offset-4 hover:text-muted">
            terms of service
          </a>{' '}
          and{' '}
          <a href="/#" className="underline underline-offset-4 hover:text-muted">
            privacy policy
          </a>
          .
        </p>
      </form>
    </AuthShell>
  )
}
