import { Link } from 'react-router-dom'
import { consultants, specializations } from '../data'
import Container from '../components/ui/Container'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import CountUp from '../components/ui/CountUp'
import ConsultantCard from '../components/consultants/ConsultantCard'
import Hero from '../components/marketing/Hero'
import HowItWorks from '../components/marketing/HowItWorks'
import AvailabilityPanel from '../components/marketing/AvailabilityPanel'
import Rating from '../components/ui/Rating'

/*
 * Counts are derived from the directory rather than hardcoded, so the marketing
 * copy cannot drift from what the app actually contains.
 */
const specialties = specializations.map((name) => ({
  name,
  count: consultants.filter((consultant) => consultant.specialization === name).length,
}))

const guarantees = [
  {
    title: 'Identity-checked consultants',
    body: 'Every consultant has been verified before appearing in the directory, so you are not guessing who you are booking.',
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

export default function Home() {
  const featured = consultants.slice(0, 3);
  const count = Math.max(consultants.length, 1);

  // Derived from the directory so the hero cannot overstate what exists.
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
      value: consultants.filter((c) => c.verified).length,
      decimals: 0,
      label: 'Verified consultants',
    },
  ];

  return (
    <>
      <Hero
        eyebrow="Verified consultants, instantly bookable"
        title={
          <>
            Find the right
            <br />
            consultant.
          </>
        }
        description="Browse vetted specialists by expertise, review their experience and rates, then book a session directly. No email threads, no scheduling friction."
        primaryAction={<Button to="/consultants" size="lg">Hire a consultant</Button>}
        secondaryAction={
          <Button to="/become-a-consultant" variant="outline" size="lg">
            Become a consultant
          </Button>
        }
        aside={<AvailabilityPanel />}
        proof={proof}
      />

      <section className="border-t border-line bg-surface-subtle">
        <Container className="py-16">
          <Reveal>
            <p className="eyebrow mb-6">Browse by specialty</p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {specialties.map((specialty, index) => (
              <Reveal key={specialty.name} delay={index * 80}>
                <Link
                  to={`/consultants?specialty=${encodeURIComponent(specialty.name)}`}
                  className="group block h-full rounded-2xl border border-line bg-surface p-6 shadow-card transition-all duration-400 ease-out hover:-translate-y-1 hover:border-accent-300 hover:shadow-lift"
                >
                  <p className="font-display text-display-md text-ink-950 transition-colors duration-300 group-hover:text-accent-600">
                    {specialty.name}
                  </p>
                  <p className="mt-2 text-sm text-muted">{specialty.count} consultants</p>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-950">
                    Explore
                    <svg
                      viewBox="0 0 20 20"
                      className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="py-20 lg:py-28">
          <SectionHeading
            eyebrow="Top rated"
            title="Consultants clients book again"
            description="Every consultant on ConsultantHub is identity-verified and reviewed by the people they've worked with."
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

      <section className="border-t border-line bg-surface-subtle">
        <Container className="py-20 lg:py-28">
          <Reveal>
            <p className="eyebrow mb-3">Why book here</p>
            <h2 className="max-w-2xl font-display text-display-lg text-ink-950">
              Less risk on both sides of the call
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {guarantees.map((guarantee, index) => (
              <Reveal key={guarantee.title} delay={index * 100}>
                <div className="group h-full rounded-2xl border border-line bg-surface p-6 shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent-300 hover:shadow-lift">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-accent-50 text-accent-600 transition-transform duration-300 ease-spring group-hover:scale-110">
                    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4.5 10.5l3.5 3.5 7.5-8" />
                    </svg>
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink-950">
                    {guarantee.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">{guarantee.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <HowItWorks />

      <section id="pricing" className="scroll-mt-20 border-t border-line bg-surface">
        <Container className="py-20 text-center lg:py-28">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-display-lg text-ink-950">
              Not sure who to book? Start with a free intro call.
            </h2>
          </Reveal>

          <Reveal delay={90}>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
              Every consultant offers a complimentary intro call. Low commitment, and it takes one
              click to book.
            </p>
          </Reveal>

          <Reveal delay={160}>
            {/* Two independent doors: hire someone, or offer your own services.
                Neither one is gated behind picking a role at sign-up. */}
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button to="/consultants" size="lg">
                Hire a consultant
              </Button>
              <Button to="/become-a-consultant" variant="outline" size="lg">
                Become a consultant
              </Button>
            </div>
          </Reveal>

          {/* Derived from the directory, so these figures cannot overstate it. */}
          <Reveal delay={230}>
            <dl className="mx-auto mt-14 grid max-w-xl grid-cols-3 gap-6">
              <div>
                <dd className="font-display text-2xl text-ink-950">
                  <CountUp value={consultants.length} />
                </dd>
                <dt className="mt-1 text-xs text-muted">Consultants listed</dt>
              </div>
              <div>
                <dd className="font-display text-2xl text-ink-950">
                  <CountUp
                    value={
                      consultants.reduce((sum, c) => sum + c.sessions, 0) /
                      Math.max(consultants.length, 1)
                    }
                    decimals={0}
                  />
                </dd>
                <dt className="mt-1 text-xs text-muted">Avg sessions each</dt>
              </div>
              <div>
                <dd className="font-display text-2xl text-ink-950">
                  <CountUp
                    value={
                      consultants.reduce((sum, c) => sum + c.rating, 0) /
                      Math.max(consultants.length, 1)
                    }
                    decimals={1}
                  />
                </dd>
                <dt className="mt-1 text-xs text-muted">Avg rating</dt>
              </div>
            </dl>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
