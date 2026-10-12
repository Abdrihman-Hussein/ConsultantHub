import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import Container from '../ui/Container'

import Button from '../ui/Button'
import InkBand from '../marketing/InkBand'
import LanguageToggle from '../ui/LanguageToggle'
import { useAuth } from '@clerk/react'
import { useCurrentUser } from '../../lib/useCurrentUser'
import { useTranslation } from '../../i18n/LanguageContext'
import type { MessageKey } from '../../i18n/strings'

const navItems: { to: string; labelKey: MessageKey; icon: ReactNode }[] = [
  {
    to: '/client/dashboard',
    labelKey: 'dash.nav_overview',
    icon: (
      <path d="M3 10.5 10 4l7 6.5M5 9.5V16h10V9.5" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    to: '/client/appointments',
    labelKey: 'dash.nav_appointments',
    icon: (
      <>
        <rect x="3.5" y="5" width="13" height="11.5" rx="2" />
        <path d="M3.5 8.5h13M7 3.5V6M13 3.5V6" strokeLinecap="round" />
      </>
    ),
  },
  {
    to: '/consultants',
    labelKey: 'dash.nav_find',
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
        Lataliye
      </span>
    </Link>
  )
}

function NavIcon({ children }: { children: ReactNode }) {
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
  const user = useCurrentUser()
  const { signOut } = useAuth()
  const { pathname } = useLocation()
  const { t } = useTranslation()

  const firstName = user?.name.split(' ')[0] ?? ''

  // Derived from the route rather than looked up in a `Record`, so an
  // unrecognised path still gets a real title rather than a generic fallback.
  const isAppointments = pathname === '/client/appointments'

  // Only greets by name when there is one: an account with no name set would
  // otherwise read "Welcome back, " with nothing after it.
  const title = isAppointments
    ? t('dash.nav_appointments')
    : firstName
      ? t('dash.title_welcome', { name: firstName })
      : t('common.dashboard')
  const subtitle = isAppointments
    ? t('dash.sub_appointments')
    : t('dash.sub_dashboard')

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
                  {t(item.labelKey)}
                </>
              )}
            </NavLink>
          ))}

          {/* At the foot of the sidebar rather than beside the links: it changes
              the whole page, not where you are within it. */}
          <div className="mt-6 border-t border-line pt-4">
            <LanguageToggle />
          </div>
        </nav>
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
                  {t(item.labelKey)}
                </NavLink>
              ))}
              {/* Reachable here as well as in the sidebar: below `lg` the
                  sidebar is not rendered, so the footer copy alone would leave
                  these two routes with no way to switch language. */}
              <LanguageToggle className="ml-1" />
            </nav>
          </Container>
        </header>

        {/* Slightly tighter than the old `py-10 lg:py-12`. This band is the page
            header, and `/client/appointments` continues it immediately with its
            status tabs — at the previous scale the two pads stacked into ~88px
            of unbroken ink before any content appeared. */}
        <InkBand as="header" flush className="py-8 lg:py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="eyebrow text-accent-on-ink">{t('dash.eyebrow')}</p>
              <h1 className="mt-3 font-display text-display-lg text-on-ink">{title}</h1>
              {subtitle && (
                <p className="mt-2 text-base text-on-ink-muted">{subtitle}</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-4">
              {user ? (
                <>
                  {/* The name and the sign-out control, on ink. Clerk's
                      UserButton is a popover anchored to an avatar and is
                      styled for a light surface, so it is deliberately not
                      used here: this band is ink, and the popover would have
                      to fight it. `signOut` comes from Clerk rather than from
                      any local session. The email line is gone with the local
                      account record — the account is Clerk's now — and the
                      name line is conditional for the same reason as in the
                      navbar. */}
                  {user.name && (
                    <p className="truncate text-sm font-medium text-on-ink">{user.name}</p>
                  )}
                  <Button type="button" variant="onInkOutline" size="sm" onClick={() => void signOut()}>
                    {t('common.log_out')}
                  </Button>
                </>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <Button to="/login" variant="onInk" size="sm">
                    {t('common.log_in')}
                  </Button>
                  <Button to="/register" variant="onInkOutline" size="sm">
                    {t('common.create_account')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </InkBand>

        <main key={pathname} className="flex-1 animate-fade-in">
          <Outlet />
        </main>

        <div className="border-t border-line bg-surface px-5 py-6 lg:hidden">
          <Button to="/consultants" variant="dark" className="w-full">
            {t('common.book_consultant')}
          </Button>
        </div>
      </div>
    </div>
  )
}
