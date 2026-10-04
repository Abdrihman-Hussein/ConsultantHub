import { Link } from 'react-router-dom'
import { consultants } from '../data/consultants'
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

const specialties = [
  { name: 'Marketing', count: 128 },
  { name: 'Engineering', count: 96 },
  { name: 'Finance', count: 74 },
  { name: 'Law', count: 51 },
]

const testimonials = [
  {
    quote:
      'We replaced four weeks of email back-and-forth with one booking. The consultant was excellent and the process was almost absurdly simple.',
    name: 'Priya Raman',
    role: 'COO, Northwind Labs',
  },
  {
    quote:
      'I found a finance advisor who actually understood our stage. The filter for rate and rating meant I only ever looked at people who fit.',
    name: 'Daniel Okonkwo',
    role: 'Founder, Brightside',
  },
  {
    quote:
      'As a consultant I get bookings without chasing anyone. My calendar fills and I spend my time on the actual work.',
    name: 'Elena Rodríguez',
    role: 'Corporate Counsel',
  },
]

export default function Home() {
  const featured = consultants.slice(0, 3)

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
        primaryAction={<Button to="/consultants" size="lg">Browse consultants</Button>}
        secondaryAction={
          <Button to="/register" variant="outline" size="lg">
            Become a consultant
          </Button>
        }
        aside={<AvailabilityPanel />}
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
            <p className="eyebrow mb-3">In their words</p>
            <h2 className="max-w-2xl font-display text-display-lg text-ink-950">
              What clients and consultants say
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Reveal key={testimonial.name} delay={index * 100}>
                <figure className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-card transition-shadow duration-300 hover:shadow-lift">
                  <Rating value={5} size="sm" compact />
                  <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-body">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 border-t border-line pt-5">
                    <p className="text-sm font-medium text-ink-950">{testimonial.name}</p>
                    <p className="mt-0.5 text-xs text-muted">{testimonial.role}</p>
                  </figcaption>
                </figure>
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
              Every consultant offers a complimentary 15-minute intro call. Low commitment, and it
              takes one click to book.
            </p>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button to="/consultants" size="lg">Browse consultants</Button>
              <Button to="/register" variant="outline" size="lg">Create an account</Button>
            </div>
          </Reveal>

          <Reveal delay={230}>
            <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
              <Rating value={4.9} reviewCount={128} />
              <span className="hidden h-4 w-px bg-line sm:block" />
              <span>
                <CountUp value={1160} suffix="+" /> sessions booked
              </span>
              <span className="hidden h-4 w-px bg-line sm:block" />
              <span>Average reply time under 3 hours</span>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}
