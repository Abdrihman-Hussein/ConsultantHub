import Button from '../ui/Button'
import Reveal from '../ui/Reveal'
import CreamBand from './CreamBand'
import FeaturedConsultant from './FeaturedConsultant'
import type { Consultant } from '../../types'

interface HeroProps {
  /** The consultant currently occupying the band. */
  consultant: Consultant
  /** Advance the rotation. Wired to the manual control in `Home`. */
  onNext: () => void
  /** Zero-based index of `consultant` within the rotation order. */
  position: number
  /** How many consultants are in the rotation. */
  total: number
}

/**
 * The opening band.
 *
 * Deliberately holds two things only: the promise, and one person who makes
 * the promise credible. The `aria-live` region announces each rotation without
 * moving focus, and the dots expose the same navigation without the interval —
 * so a keyboard or reduced-motion user reaches every consultant either way.
 *
 * The band is cream, not ink: the page opens on light and keeps a single dark
 * surface — the footer — at the end of it. That means every colour here is one
 * the rest of the page already uses on cream, and the accent on the second
 * headline line is `accent-600`, which measures 5.08:1 on this ground.
 * `accent-on-ink` would have been the ink-band choice and is unreadable here.
 */
export default function Hero({ consultant, onNext, position, total }: HeroProps) {
  return (
    <CreamBand className="border-b border-line">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <Reveal>
            <p className="eyebrow text-accent-600">Independent expertise</p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-5 font-display text-display-2xl text-ink-950">
              Find your person.
              <br />
              <span className="text-accent-600">Move forward.</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
              Good advice changes things. Find a consultant who understands where you
              are, read what they actually know, and book a clear next step.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button to="/consultants" variant="primary" size="lg">
                Explore consultants
              </Button>
              <Button to="/become-a-consultant" variant="outline" size="lg">
                For consultants
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} distance={24}>
          {/*
            Everything below changes as the rotation advances. `aria-live`
            announces it; `aria-atomic` means the whole card is read as one
            update rather than three disconnected fragments.
          */}
          <div aria-live="polite" aria-atomic="true">
            <FeaturedConsultant consultant={consultant} />
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2" role="group" aria-label="Featured consultant">
              {Array.from({ length: total }, (_, index) => (
                <span
                  key={index}
                  aria-current={index === position}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === position ? 'w-6 bg-accent-600' : 'w-1.5 bg-line-strong'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={onNext}
              className="text-xs font-medium text-muted underline-offset-4 transition-colors hover:text-body hover:underline"
            >
              Next consultant
              <span className="sr-only">
                {` (${position + 1} of ${total} featured)`}
              </span>
            </button>
          </div>
        </Reveal>
      </div>
    </CreamBand>
  )
}
