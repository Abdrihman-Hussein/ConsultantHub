import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Button from '../ui/Button'
import Container from '../ui/Container'
import Avatar from '../ui/Avatar'
import { users } from '../../data/users'

const navLinks = [
  { to: '/consultants', label: 'Browse' },
  { to: '/client/dashboard', label: 'Dashboard' },
  { to: '/#how-it-works', label: 'How it works' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const currentUser = users[0]

  // Close the mobile sheet whenever the route changes.
  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-surface-subtle/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-ink-950 text-xs font-semibold text-white">
              C
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-ink-950">
              ConsultantHub
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) =>
              link.to.includes('#') ? (
                <a
                  key={link.to}
                  href={link.to}
                  className="rounded-full px-3.5 py-2 text-sm text-muted transition-colors hover:bg-ink-100 hover:text-body"
                >
                  {link.label}
                </a>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-full px-3.5 py-2 text-sm transition-colors ${
                      isActive
                        ? 'bg-ink-100 font-medium text-ink-950'
                        : 'text-muted hover:bg-ink-100 hover:text-body'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button to="/login" variant="ghost" size="sm">
              Log in
            </Button>
            <Link to="/client/dashboard" className="flex items-center gap-2 pl-1">
              <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
              <span className="hidden text-sm font-medium text-body lg:inline">
                {currentUser.name}
              </span>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-label="Toggle navigation"
            className="grid h-9 w-9 place-items-center rounded-full text-body transition-colors hover:bg-ink-100 md:hidden"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              {open ? (
                <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-line bg-surface md:hidden">
          <Container className="space-y-1 py-4">
            {navLinks.map((link) => (
              <a
                key={link.to}
                href={link.to}
                className="block rounded-xl px-3 py-2.5 text-sm text-body hover:bg-ink-100"
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-3 pt-3">
              <Button to="/login" variant="outline" size="sm" className="flex-1">
                Log in
              </Button>
              <Button to="/register" size="sm" className="flex-1">
                Get started
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  )
}
