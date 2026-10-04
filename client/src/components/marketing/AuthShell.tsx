import type { ReactNode } from 'react'
import Reveal from '../ui/Reveal'

interface AuthShellProps {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

/**
 * Shared frame for the sign-in and registration pages: a centred card with a
 * decorative terracotta wash behind it.
 */
export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-16 sm:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-accent-100/40 blur-3xl"
      />

      <div className="relative w-full max-w-md">
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
  )
}
