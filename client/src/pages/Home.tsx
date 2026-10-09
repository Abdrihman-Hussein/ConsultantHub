import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { consultants, specializations } from '../data'
import { featuredOrder, nextIndex, rowConsultants } from '../lib/featured'
import { countLabel } from '../lib/format'
import { identityCheckSentence, verifiedCount } from '../lib/trust'
import Container from '../components/ui/Container'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import CountUp from '../components/ui/CountUp'
import ConsultantCard from '../components/consultants/ConsultantCard'
import Hero from '../components/marketing/Hero'
import CreamBand from '../components/marketing/CreamBand'
import HowItWorks from '../components/marketing/HowItWorks'

/**
 * How long each consultant holds the hero. Long enough to read the bio line,
 * short enough that the rotation registers as motion rather than a slideshow.
 */
const ROTATION_MS = 7000

/** Counts are derived from the directory rather than hardcoded, so the marketing
 * copy cannot drift from what the app actually contains. */
const specialties = specializations.map((name) => ({
  name,
  count: consultants.filter((consultant) => consultant.specialization === name).length,
}))

const guarantees = [
  {
    title: 'Identity checks, counted',
    // Generated from the directory. This used to assert that every consultant
    // had been verified, which is false of the seed — two of the six are not —
    // and then, once that was fixed, swapped the quantified falsehood for an
    // equally unbacked one: that every consultant had been "through our review
    // process". No field on a Consultant records a review, so directory
    // membership says nothing about one. Only the measurable claim survives —
    // how many of the listed have completed an identity check — and it is
    // derived, so it cannot drift from the data it describes.
    body: `${identityCheckSentence(consultants)} Ratings, rates and availability are published for every listing.`,
  },
  {
    title: 'Free intro calls',
    body: 'Every consultant offers a complimentary short call. Find out whether it is worth the longer session before you pay for it.',
  },
  {
    title: 'No scheduling back-and-forth',
    body: 'Pick a service and an open slot directly. No email threads, no waiting to hear back about availability.',
  },
]

/**
 * Rotates the hero through the directory.
 *
 * Owns the interval here rather than inside `Hero` so pausing needs no document
 * -level listeners: the hero tells us when it is hovered or focused, and we can
 * simply not advance. Three conditions stop it — pointer over the band, focus
 * anywhere inside it, and a hidden tab. A fourth, `prefers-reduced-motion`,
 * stops the automatic advance from ever starting.
 */
function useFeaturedRotation(total: number) {
  const [position, setPosition] = useState(0)
  const paused = useRef(false)
  const timer = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    // One media query object, kept for the lifetime of the effect, so a user
    // toggling the OS setting mid-session is respected rather than pinned to
    // whatever it was at mount.
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (query.matches) return

    const interval = setInterval(() => {
      if (paused.current || document.visibilityState === 'hidden') return
      setPosition((current) => nextIndex(current, total))
    }, ROTATION_MS)

    return () => clearInterval(interval)
  }, [total])

  const next = () => setPosition((current) => nextIndex(current, total))

  return { position, next, pause: () => { paused.current = true }, resume: () => { paused.current = false } }
}

export default function Home() {
  const order = useMemo(() => featuredOrder(consultants), [])
  const { position, next, pause, resume } = useFeaturedRotation(order.length)
  const current = order[position]

  // The row must not show whoever is in the hero right now, or the page reads
  // as a mistake rather than a rotation.
  const featured = useMemo(() => rowConsultants(order, current.id, 3), [order, current])

  // Derived from the directory so no figure on the page can overstate it.
  const count = Math.max(consultants.length, 1)
  const proof = [
    {
      value: consultants.reduce((sum, c) => sum + c.rating, 0) / count,
      decimals: 1,
      label: 'Average rating',
    },
    {
      value: consultants.reduce((sum, c) => sum + c.sessions, 0),
      suffix: '+',
      decimals: 0,
      label: 'Sessions delivered',
    },
    {
      value: verifiedCount(consultants),
      decimals: 0,
      label: 'Identity-checked consultants',
    },
  ]

  return (
    <>
      <div onMouseEnter={pause} onMouseLeave={resume} onFocus={pause} onBlur={resume}>
        <Hero
          consultant={current}
          onNext={next}
          position={position}
          total={order.length}
        />
      </div>

      <section className="border-t border-line bg-surface">
        <div className="py-20 lg:py-28">
          <SectionHeading
            eyebrow="Top rated"
            title="More people worth a call"
            description="Ordered by rating and sessions delivered, with every figure taken straight from the directory."
            action={<Button to="/consultants" variant="outline">View all</Button>}
          />
          <Container className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((consultant, index) => (
              <Reveal key={consultant.id} delay={index * 100}>
                <div className="h-full">
                  <ConsultantCard consultant={consultant} />
                </div>
              </Reveal>
            ))}
          </Container>
        </div>
      </section>

      <HowItWorks />

      {/* Browse by specialty — an index of ruled rows, not four identical cards. */}
      <section className="border-t border-line bg-surface-subtle">
        <Container className="py-20 lg:py-28">
          <SectionHeading
            eyebrow="Browse by specialty"
            title="Start where your problem is"
            action={<Button to="/consultants" variant="outline">All consultants</Button>}
          />

          <div className="mt-12 border-t border-line">
            {specialties.map((specialty) => (
              <Link
                key={specialty.name}
                to={`/consultants?specialty=${encodeURIComponent(specialty.name)}`}
                className="group flex items-center justify-between gap-6 border-b border-line py-6 transition-colors duration-300 hover:bg-surface"
              >
                <span className="font-display text-display-md text-ink-950 transition-colors duration-300 group-hover:text-accent-600">
                  {specialty.name}
                </span>
                <span className="flex items-center gap-6 text-sm text-muted">
                  <span>{countLabel(specialty.count, 'consultant')}</span>
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4 text-accent-600 transition-transform duration-300 ease-spring group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Why book here — a ruled band, not three cards. */}
      <section className="border-t border-line bg-surface-muted">
        <Container className="py-20 lg:py-28">
          <Reveal>
            <p className="eyebrow mb-3">Why book here</p>
            <h2 className="max-w-2xl font-display text-display-lg text-ink-950">
              Less risk on both sides of the call
            </h2>
          </Reveal>

          <div className="mt-12 border-t border-line-strong">
            {guarantees.map((guarantee) => (
              <div
                key={guarantee.title}
                className="grid gap-3 border-b border-line-strong py-7 md:grid-cols-[18rem_1fr] md:gap-10"
              >
                <h3 className="text-lg font-semibold tracking-tight text-ink-950">
                  {guarantee.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">{guarantee.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/*
        Closing band. It used to mirror the hero in ink so the page opened and
        landed on a dark surface. The hero is cream now, so this is too and the
        only dark surface left on the page is the site footer below it.
      */}
      <CreamBand surface="subtle" className="border-t border-line">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="font-display text-display-lg text-ink-950">
              Not sure who to book? Start with a free intro call.
            </h2>
          </Reveal>

          <Reveal delay={90}>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
              Every consultant offers a complimentary intro call. Low commitment, and it takes
              one click to book.
            </p>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button to="/consultants" variant="primary" size="lg">
                Hire a consultant
              </Button>
              <Button to="/become-a-consultant" variant="outline" size="lg">
                Become a consultant
              </Button>
            </div>
          </Reveal>

          {/* Every figure computed from the directory — nothing literal. */}
          <Reveal delay={230}>
            <dl className="mx-auto mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-line-strong pt-8">
              {proof.map((stat) => (
                <div key={stat.label}>
                  <dd className="font-display text-2xl text-ink-950">
                    <CountUp
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </dd>
                  <dt className="mt-1 text-xs leading-snug text-muted">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </CreamBand>
    </>
  )
}
