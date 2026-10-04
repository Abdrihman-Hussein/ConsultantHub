import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import Container from '../ui/Container'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import { useApp } from '../../context/AppContext'

const navItems = [
  {
    to: '/client/dashboard',
    label: 'Overview',
    icon: (
      <path d="M3 10.5 10 4l7 6.5M5 9.5V16h10V9.5" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    to: '/client/appointments',
    label: 'Appointments',
    icon: (
      <>
        <rect x="3.5" y="5" width="13" height="11.5" rx="2" />
        <path d="M3.5 8.5h13M7 3.5V6M13 3.5V6" strokeLinecap="round" />
      </>
    ),
  },
  {
    to: '/consultants',
    label: 'Find consultants',
    icon: (
      <>
        <circle cx="9" cy="8" r="4" />
        <path d="M3.5 16c.7-3 2.8-4.5 5.5-4.5s4.8 1.5 5.5 4.5" strokeLinecap="round" />
      </>
    ),
  },
]

function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-accent-500 text-xs font-semibold text-white transition-transform duration-300 ease-spring group-hover:scale-110">
        C
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-ink-950">
        ConsultantHub
      </span>
    </Link>
  )
}

function NavIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className="h-[18px] w-[18px] shrink-0"
    >
      {children}
    </svg>
  )
}

export default function DashboardLayout() {
  const { session, logout } = useApp()
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen bg-surface-subtle">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-surface px-4 py-6 lg:flex">
        <div className="px-2">
          <Logo />
        </div>

        <nav className="mt-8 flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ease-out ${
                  isActive
                    ? 'bg-accent-50 font-medium text-accent-700'
                    : 'text-muted hover:bg-ink-100/60 hover:text-body'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Accent bar that slides in for the active section. */}
                  <span
                    className={`absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent-500 transition-all duration-300 ease-out ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <NavIcon>{item.icon}</NavIcon>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-line pt-4">
          {session ? (
            <>
              <div className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-ink-100/60">
                <Avatar name={session.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-body">{session.name}</p>
                  <p className="truncate text-xs text-muted">{session.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="mt-1 w-full rounded-xl px-2 py-1.5 text-left text-sm text-muted transition-colors hover:bg-ink-100/60 hover:text-danger"
              >
                Log out
              </button>
            </>
          ) : (
            <div className="px-2">
              <Button to="/login" variant="outline" size="sm" className="w-full">
                Log in
              </Button>
            </div>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-line/70 bg-surface-subtle/85 backdrop-blur-md lg:hidden">
          <Container className="flex h-16 items-center justify-between gap-4">
            <Logo />
            <nav className="flex items-center gap-1">
              {navItems.slice(0, 2).map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-full px-3 py-2 text-xs font-medium transition-colors ${
                      isActive ? 'bg-accent-50 text-accent-700' : 'text-muted hover:bg-ink-100'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </Container>
        </header>

        <main key={pathname} className="flex-1 animate-fade-in">
          <Outlet />
        </main>

        <div className="border-t border-line bg-surface px-5 py-6 lg:hidden">
          <Button to="/consultants" variant="dark" className="w-full">
            Book a new consultant
          </Button>
        </div>
      </div>
    </div>
  )
}
