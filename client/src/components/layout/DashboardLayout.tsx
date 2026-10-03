import { Link, NavLink, Outlet } from 'react-router-dom'
import Container from '../ui/Container'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import { users } from '../../data/users'

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

export default function DashboardLayout() {
  const currentUser = users[0]

  return (
    <div className="flex min-h-screen bg-surface-subtle">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-surface px-4 py-6 lg:flex">
        <Link to="/" className="flex items-center gap-2.5 px-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-ink-950 text-xs font-semibold text-white">
            C
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-ink-950">
            ConsultantHub
          </span>
        </Link>

        <nav className="mt-8 flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-ink-100 font-medium text-ink-950'
                    : 'text-muted hover:bg-ink-50 hover:text-body'
                }`
              }
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                className="h-[18px] w-[18px]"
              >
                {item.icon}
              </svg>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-line pt-4">
          <div className="flex items-center gap-3 px-2">
            <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-body">{currentUser.name}</p>
              <p className="truncate text-xs text-muted">{currentUser.email}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-line/70 bg-surface-subtle/80 backdrop-blur-md lg:hidden">
          <Container className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-ink-950 text-xs font-semibold text-white">
                C
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-ink-950">
                ConsultantHub
              </span>
            </Link>
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-full px-3 py-2 text-xs font-medium transition-colors ${
                      isActive ? 'bg-ink-100 text-ink-950' : 'text-muted hover:bg-ink-100'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </Container>
        </header>

        <main className="flex-1">
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
