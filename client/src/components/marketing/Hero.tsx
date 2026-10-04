import type { ReactNode } from 'react'
import Container from '../ui/Container'
import Reveal from '../ui/Reveal'
import CountUp from '../ui/CountUp'

interface ProofPoint {
  value: number
  suffix?: string
  label: string
  decimals?: number
}

interface HeroProps {
  eyebrow: string
  title: ReactNode
  description: string
  primaryAction: ReactNode
  secondaryAction?: ReactNode
  aside?: ReactNode
  /**
   * Figures shown under the hero. Passed in rather than hardcoded so they can be
   * derived from the directory instead of invented.
   */
  proof?: ProofPoint[]
}

export default function Hero({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  aside,
  proof = [],
}: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface">
      {/* Soft ambient wash — terracotta tint bleeding in from the top right. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-40 h-[32rem] w-[32rem] rounded-full bg-accent-100/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 animate-blob bg-gold-300/20 blur-3xl"
      />

      <Container className="relative grid items-center gap-14 py-20 lg:grid-cols-[1.15fr_1fr] lg:py-28">
        <div>
          <Reveal>
            <p className="eyebrow mb-5">{eyebrow}</p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="font-display text-display-xl text-ink-950">{title}</h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{description}</p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              {primaryAction}
              {secondaryAction}
            </div>
          </Reveal>

          {proof.length > 0 && (
            <Reveal delay={320}>
              <dl
                className={`mt-12 grid gap-6 border-t border-line pt-8 ${
                  proof.length === 3 ? 'max-w-lg grid-cols-3' : 'grid-cols-2'
                }`}
              >
                {proof.map((stat) => (
                  <div key={stat.label}>
                    <dd className="font-display text-2xl text-ink-950">
                      <CountUp
                        value={stat.value}
                        suffix={stat.suffix}
                        decimals={stat.decimals ?? 0}
                      />
                    </dd>
                    <dt className="mt-1 text-xs leading-snug text-muted">{stat.label}</dt>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
        </div>

        {aside && (
          <Reveal delay={200} distance={24}>
            {aside}
          </Reveal>
        )}
      </Container>
    </section>
  )
}
