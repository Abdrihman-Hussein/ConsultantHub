import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { consultants, specializations } from '../data'
import { featuredOrder, nextIndex, rowConsultants } from '../lib/featured'
import { countLabelLocalized } from '../lib/format'
import { identityCheckSentence, verifiedCount } from '../lib/trust'
import { useTranslation } from '../i18n/LanguageContext'
import type { MessageKey } from '../i18n/strings'
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

/**
 * The three reasons to book here.
 *
 * Titles and bodies are dictionary keys rather than finished sentences. The
 * first body embeds `identityCheckSentence`, which is generated from the
 * directory: this used to assert that every consultant had been verified, which
 * is false of the seed — two of the six are not — and then, once that was
 * fixed, swapped the quantified falsehood for an equally unbacked one: that
 * every consultant had been "through our review process". No field on a
 * Consultant records a review, so directory membership says nothing about one.
 * Only the measurable claim survives — how many of the listed have completed an
 * identity check — and because it is derived rather than written, it cannot
 * drift from the data it describes in any language.
 */
const GUARANTEES: { titleKey: MessageKey; bodyKey: MessageKey }[] = [
  { titleKey: 'home.guarantee.identity_title', bodyKey: 'home.guarantee.identity_body' },
  { titleKey: 'home.guarantee.free_title', bodyKey: 'home.guarantee.free_body' },
  { titleKey: 'home.guarantee.scheduling_title', bodyKey: 'home.guarantee.scheduling_body' },
]

/**
 * Labels for the closing band's figures. The values are computed, not listed.
 *
 * There is no average rating here any more. It was the mean of six seeded
 * numbers that no review in the app supported, so the band fell back from
 * claiming four-and-a-half stars to claiming an average of all of them. The
 * figure in its place — how many consultants are listed — is counted from the
 * directory and cannot overstate it.
 */
const PROOF_LABELS: MessageKey[] = [
  'home.proof.listed',
  'home.proof.sessions_delivered',
  'home.proof.identity_checked',
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
  const { t } = useTranslation()
  const order = useMemo(() => featuredOrder(consultants), [])
  const { position, next, pause, resume } = useFeaturedRotation(order.length)
  const current = order[position]

  // The row must not show whoever is in the hero right now, or the page reads
  // as a mistake rather than a rotation.
  const featured = useMemo(() => rowConsultants(order, current.id, 3), [order, current])

  // Derived from the directory so no figure on the page can overstate it.
  const proof = [
    {
      value: consultants.length,
      decimals: 0,
      labelKey: PROOF_LABELS[0],
    },
    {
      value: consultants.reduce((sum, c) => sum + c.sessions, 0),
      suffix: '+',
      decimals: 0,
      labelKey: PROOF_LABELS[1],
    },
    {
      value: verifiedCount(consultants),
      decimals: 0,
      labelKey: PROOF_LABELS[2],
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
            title={t('home.top.title')}
            description={t('home.top.description')}
            action={
              <Button to="/consultants" variant="outline">
                {t('common.view_all')}
              </Button>
            }
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
            title={t('home.specialties.title')}
            action={
              <Button to="/consultants" variant="outline">
                {t('home.specialties.all')}
              </Button>
            }
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
                  <span>
                    {countLabelLocalized(
                      specialty.count,
                      t,
                      'terms.consultant',
                      'terms.consultants',
                    )}
                  </span>
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

      {/* Why book here — asymmetric bento with real imagery, not a third ruled list. */}
      <section className="border-t border-line bg-surface-muted">
        <Container className="py-20 lg:py-28">
          <Reveal>
            <h2 className="max-w-2xl font-display text-display-lg text-ink-950">
              {t('home.why.title')}
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <article className="relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-2xl border border-line bg-ink-950 p-8 text-on-ink">
                {/*
                  Real photograph, not a placeholder: members of the Somali
                  business community in Minnesota at a diaspora engagement,
                  October 2015 (AMISOM Public Information, via Wikimedia
                  Commons). Licensed CC0 1.0 — public domain, verified by
                  FlickreviewR — so it ships in the repo rather than hotlinked.
                  Served from /public/images for the same reason the fonts are
                  self-hosted: no third-party round trip on first paint.
                */}
                <img
                  src="/images/somali-business-community.jpg"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-40"
                />
                <div className="relative">
                  <h3 className="text-xl font-semibold tracking-tight">
                    {t(GUARANTEES[0].titleKey)}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-on-ink-muted">
                    {t(GUARANTEES[0].bodyKey, { sentence: identityCheckSentence(consultants, t) })}
                  </p>
                </div>
              </article>
            </Reveal>

            <div className="grid gap-6">
              {[1, 2].map((i) => (
                <Reveal key={GUARANTEES[i].titleKey} delay={i * 90} className="h-full">
                  <article className="flex h-full flex-col rounded-2xl border border-line bg-surface p-7">
                    <h3 className="text-lg font-semibold tracking-tight text-ink-950">
                      {t(GUARANTEES[i].titleKey)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {t(GUARANTEES[i].bodyKey)}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
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
              {t('home.cta.title')}
            </h2>
          </Reveal>

          <Reveal delay={90}>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
              {t('home.cta.body')}
            </p>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button to="/consultants" variant="primary" size="lg">
                {t('home.cta.hire')}
              </Button>
              <Button to="/become-a-consultant" variant="outline" size="lg">
                {t('home.cta.become')}
              </Button>
            </div>
          </Reveal>

          {/* Every figure computed from the directory — nothing literal. */}
          <Reveal delay={230}>
            <dl className="mx-auto mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-line-strong pt-8">
              {proof.map((stat) => (
                <div key={stat.labelKey}>
                  <dd className="font-display text-2xl text-ink-950">
                    <CountUp
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </dd>
                  <dt className="mt-1 text-xs leading-snug text-muted">
                    {t(stat.labelKey)}
                  </dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </CreamBand>
    </>
  )
}
