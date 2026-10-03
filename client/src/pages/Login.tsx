import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { Input } from '../components/ui/Field'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="flex flex-1 items-center justify-center px-5 py-16 sm:px-8">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="font-display text-display-md text-ink-950">Welcome back</h1>
          <p className="mt-2 text-sm text-muted">Log in to manage your bookings.</p>
        </div>

        <Card className="mt-8 p-8">
          <form
            className="space-y-5"
            onSubmit={(event) => {
              // No backend in the MVP — see docs. Wire this to auth in v2.
              event.preventDefault()
            }}
          >
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
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-line-strong accent-accent-500"
                />
                Remember me
              </label>
              <a href="/#" className="text-sm text-muted underline underline-offset-4 hover:text-ink-950">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full">
              Log in
            </Button>
          </form>

          <p className="mt-6 border-t border-line pt-6 text-center text-sm text-muted">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-ink-950 underline underline-offset-4">
              Create one
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
