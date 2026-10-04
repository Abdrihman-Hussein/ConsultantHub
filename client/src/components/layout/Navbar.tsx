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
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const currentUser = users[0]

  // Close the mobile sheet whenever the route changes.
  useEffect(() => setOpen(false), [pathname])

  // The navbar gains a solid background and shadow once content sits behind it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ease-smooth ${
        scrolled
          ? 'border-b border-line bg-surface/85 shadow-sm backdrop-blur-lg'
          : 'border-b border-transparent bg-surface-subtle/60 backdrop-blur-sm'
      }`}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-accent-500 text-xs font-semibold text-white transition-transform duration-300 ease-spring group-hover:scale-110">
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
                    `relative rounded-full px-3.5 py-2 text-sm transition-colors ${
                      isActive
                        ? 'font-medium text-accent-600'
                        : 'text-muted hover:bg-ink-100 hover:text-body'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {/* Underline that scales in for the active route. */}
                      <span
                        className={`absolute inset-x-3 -bottom-0.5 h-px origin-left bg-accent-500 transition-transform duration-300 ease-out ${
                          isActive ? 'scale-x-100' : 'scale-x-0'
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button to="/login" variant="ghost" size="sm">
              Log in
            </Button>
            <Link
              to="/client/dashboard"
              className="flex items-center gap-2 rounded-full p-0.5 pl-1 transition-colors hover:bg-ink-100"
            >
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
            <svg
              viewBox="0 0 20 20"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {open ? (
                <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {/* Height animates so the sheet pushes content rather than snapping. */}
      <div
        className={`overflow-hidden border-line bg-surface transition-all duration-400 ease-out md:hidden ${
          open ? 'max-h-80 border-t opacity-100' : 'max-h-0 border-t-0 opacity-0'
        }`}
      >
        <Container className="space-y-1 py-4">
          {navLinks.map((link) => (
            <a
              key={link.to}
              href={link.to}
              className="block rounded-xl px-3 py-2.5 text-sm text-body transition-colors hover:bg-accent-50"
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
    </header>
  )
}
