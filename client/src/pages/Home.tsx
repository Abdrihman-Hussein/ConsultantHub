import { Link } from 'react-router-dom'
import { consultants } from '../data/consultants'
import Container from '../components/ui/Container'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'
import ConsultantCard from '../components/consultants/ConsultantCard'
import Hero from '../components/marketing/Hero'
import HowItWorks from '../components/marketing/HowItWorks'
import Rating from '../components/ui/Rating'

const specialties = [
  { name: 'Marketing', count: 128 },
  { name: 'Engineering', count: 96 },
  { name: 'Finance', count: 74 },
  { name: 'Law', count: 51 },
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
        aside={
          <div className="rounded-2xl border border-line bg-surface-subtle p-6 shadow-card">
            <p className="eyebrow mb-5">Available this week</p>
            <ul className="space-y-4">
              {consultants.slice(0, 3).map((consultant) => (
                <li key={consultant.id} className="flex items-center gap-3.5">
                  <Avatar src={consultant.avatar} name={consultant.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-950">{consultant.name}</p>
                    <p className="truncate text-xs text-muted">{consultant.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-ink-950">${consultant.hourlyRate}</p>
                    <p className="text-xs text-subtle">{consultant.responseTime} response</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              to="/consultants"
              className="mt-6 flex items-center justify-between rounded-xl bg-ink-950 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-ink-800"
            >
              See all consultants
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        }
      />

      <section className="border-t border-line bg-surface-subtle">
        <Container className="py-16">
          <p className="eyebrow mb-6">Browse by specialty</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {specialties.map((specialty) => (
              <Link
                key={specialty.name}
                to={`/consultants?specialty=${encodeURIComponent(specialty.name)}`}
                className="group rounded-2xl border border-line bg-surface p-6 shadow-card transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:shadow-lift"
              >
                <p className="font-display text-display-md text-ink-950">{specialty.name}</p>
                <p className="mt-2 text-sm text-muted">{specialty.count} consultants</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-950">
                  Explore
                  <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
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
            {featured.map((consultant) => (
              <ConsultantCard key={consultant.id} consultant={consultant} />
            ))}
          </Container>
        </div>
      </section>

      <HowItWorks />

      <section id="pricing" className="scroll-mt-20 border-t border-line bg-surface">
        <Container className="py-20 text-center lg:py-28">
          <h2 className="mx-auto max-w-2xl font-display text-display-lg text-ink-950">
            Not sure who to book? Start with a free intro call.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
            Every consultant offers a complimentary 15-minute intro call. Low commitment, and it
            takes one click to book.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button to="/consultants" size="lg">Browse consultants</Button>
            <Button to="/register" variant="outline" size="lg">Create an account</Button>
          </div>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
            <Rating value={4.9} reviewCount={128} />
            <span className="hidden h-4 w-px bg-line sm:block" />
            <span>Average reply time under 3 hours</span>
          </div>
        </Container>
      </section>
    </>
  )
}
