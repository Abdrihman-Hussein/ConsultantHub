import type { ReactNode } from 'react'
import { consultants } from '../../data'
import { identityCheckSentence } from '../../lib/trust'
import { useTranslation } from '../../i18n/LanguageContext'
import Button from '../ui/Button'
import Reveal from '../ui/Reveal'
import InkBand from './InkBand'

interface AuthShellProps {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

/**
 * Shared frame for the sign-in and registration pages.
 *
 * Two surfaces, one rule: the form panel stays on cream so the inputs keep
 * their familiar high-contrast treatment, and only the accompanying aside
 * goes dark. This is the last page permitted to use ink.
 */
export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  const { t } = useTranslation()

  return (
    <div className="relative flex min-h-full items-center overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-0 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-accent-100/40 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-shell lg:grid-cols-[1.05fr_0.95fr]">
        {/* Cream form panel — the inputs never sit on ink. */}
        <div className="flex items-center px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto w-full max-w-md">
            <Reveal>
              <div className="text-center">
                <h1 className="font-display text-display-md text-ink-950">{title}</h1>
                <p className="mt-2 text-sm text-muted">{subtitle}</p>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <div className="mt-8 rounded-2xl border border-line bg-surface p-8 shadow-lift">
                {children}
                <div className="mt-6 border-t border-line pt-6 text-center text-sm text-muted">
                  {footer}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <InkBand as="aside" className="flex items-center">
          <Reveal delay={140}>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-accent-on-ink text-sm font-semibold text-ink-950">
                C
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-on-ink">
                Lataliye
              </span>
            </div>

            <p className="mt-6 font-display text-2xl leading-snug text-on-ink">
              {identityCheckSentence(consultants, t)}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-on-ink-muted">
              {t('aside.find_person')}
            </p>

            <div className="mt-8">
              <Button to="/become-a-consultant" variant="onInkOutline">
                {t('footer.become_consultant')}
              </Button>
            </div>
          </Reveal>
        </InkBand>
      </div>
    </div>
  )
}
