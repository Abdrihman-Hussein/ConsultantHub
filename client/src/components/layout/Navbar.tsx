import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { UserButton } from '@clerk/react'
import Button from '../ui/Button'
import Container from '../ui/Container'
import BrandMark from '../ui/BrandMark'
import LanguageToggle from '../ui/LanguageToggle'
import { useCurrentUser } from '../../lib/useCurrentUser'
import { useTranslation } from '../../i18n/LanguageContext'
import type { MessageKey } from '../../i18n/strings'

const navLinks: { to: string; labelKey: MessageKey }[] = [
  { to: '/consultants', labelKey: 'nav.browse' },
  { to: '/client/dashboard', labelKey: 'common.dashboard' },
  { to: '/#how-it-works', labelKey: 'nav.how_it_works' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const user = useCurrentUser()
  const { t } = useTranslation()

  // Only shown when there is a name to show: an account with no name set would
  // otherwise greet nobody with "Hi, ". The avatar is still rendered, so the
  // account remains reachable.
  const firstName = user?.name.split(' ')[0] ?? ''

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
          <Link to="/" className="group flex items-center" aria-label="Lataliye home">
            <span className="transition-transform duration-300 ease-spring group-hover:scale-[1.03]">
              <BrandMark />
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
                  {t(link.labelKey)}
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
                      {t(link.labelKey)}
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
            {/* Sits with the auth controls rather than in the nav: it changes the
                whole page, not where you are, so it belongs beside the other
                page-level settings. */}
            <LanguageToggle />
            {user ? (
              <>
                {/* The greeting stays; the avatar and the logout button do
                    not. Clerk's <UserButton /> is the avatar, and its menu is
                    where signing out lives — rendering our own beside it would
                    give the same person two ways to do one thing. */}
                {firstName && (
                  <span className="hidden text-sm text-muted lg:inline">
                    {t('common.hi')}{' '}
                    <span className="font-medium text-body">{firstName}</span>
                  </span>
                )}
                {/* No appearance prop: the palette is set once on ClerkProvider,
                    so this button and the sign-in form cannot drift apart. */}
                <UserButton />
              </>
            ) : (
              <>
                <Button to="/login" variant="ghost" size="sm">
                  {t('common.log_in')}
                </Button>
                <Button to="/register" size="sm">
                  {t('common.get_started')}
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-label={t('nav.toggle_navigation')}
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
              {t(link.labelKey)}
            </a>
          ))}
          {/* In the sheet the toggle has its own row: it is not a navigation
              link, and putting it in the link list would say it is one. */}
          <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
            <LanguageToggle />
            <span className="text-xs text-subtle">{t('lang.label')}</span>
          </div>
          <div className="flex items-center gap-3 pt-1">
            {user ? (
              <>
                <Button to="/client/dashboard" variant="outline" size="sm" className="flex-1">
                  {t('common.dashboard')}
                </Button>
                {/* Signing out lives in Clerk's menu here too, for the same
                    reason as in the desktop bar. */}
                <UserButton />
              </>
            ) : (
              <>
                <Button to="/login" variant="outline" size="sm" className="flex-1">
                  {t('common.log_in')}
                </Button>
                <Button to="/register" size="sm" className="flex-1">
                  {t('common.get_started')}
                </Button>
              </>
            )}
          </div>
        </Container>
      </div>
    </header>
  )
}