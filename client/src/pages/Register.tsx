import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { Input } from '../components/ui/Field'

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

  return (
    <div className="flex flex-1 items-center justify-center px-5 py-16 sm:px-8">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="font-display text-display-md text-ink-950">Create your account</h1>
          <p className="mt-2 text-sm text-muted">Free to join. Takes under a minute.</p>
        </div>

        <Card className="mt-8 p-8">
          <form
            className="space-y-5"
            onSubmit={(event) => {
              // No backend in the MVP — see docs. Wire this to auth in v2.
              event.preventDefault()
            }}
          >
            <fieldset>
              <legend className="mb-2.5 text-sm font-medium text-body">I want to</legend>
              <div className="grid gap-3">
                {roles.map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                      role === option.value
                        ? 'border-ink-950 bg-ink-50'
                        : 'border-line-strong hover:border-ink-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={role === option.value}
                      onChange={() => setRole(option.value)}
                      className="mt-1 h-4 w-4 accent-ink-950"
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
              required
            />
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              hint="Use 8 or more characters."
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />

            <Button type="submit" className="w-full">
              Create account
            </Button>

            <p className="text-xs leading-relaxed text-subtle">
              By creating an account you agree to our{' '}
              <a href="/#" className="underline underline-offset-4">
                terms of service
              </a>{' '}
              and{' '}
              <a href="/#" className="underline underline-offset-4">
                privacy policy
              </a>
              .
            </p>
          </form>

          <p className="mt-6 border-t border-line pt-6 text-center text-sm text-muted">
            Already registered?{' '}
            <Link to="/login" className="font-medium text-ink-950 underline underline-offset-4">
              Log in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
