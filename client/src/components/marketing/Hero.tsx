import type { ReactNode } from 'react'
import Container from '../ui/Container'

interface HeroProps {
  eyebrow: string
  title: ReactNode
  description: string
  primaryAction: ReactNode
  secondaryAction?: ReactNode
  aside?: ReactNode
}

export default function Hero({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  aside,
}: HeroProps) {
  return (
    <section className="border-b border-line bg-surface">
      <Container className="grid items-center gap-14 py-20 lg:grid-cols-[1.15fr_1fr] lg:py-28">
        <div className="animate-fade-up">
          <p className="eyebrow mb-5">{eyebrow}</p>
          <h1 className="font-display text-display-xl text-ink-950">{title}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{description}</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            {primaryAction}
            {secondaryAction}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted">
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 20 20" className="h-4 w-4 text-accent-500" fill="currentColor">
                <path d="M10 1.5l2.2 4.7 5.1.6-3.8 3.5 1 5.1L10 12.8l-4.5 2.6 1-5.1L2.7 6.8l5.1-.6L10 1.5z" />
              </svg>
              4.9 average rating
            </span>
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 20 20" className="h-4 w-4 text-accent-500" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="10" cy="7" r="3" />
                <path d="M4 16.5c.6-2.9 2.9-4.5 6-4.5s5.4 1.6 6 4.5" strokeLinecap="round" />
              </svg>
              1,160+ sessions booked
            </span>
          </div>
        </div>

        {aside && <div className="animate-fade-up">{aside}</div>}
      </Container>
    </section>
  )
}
