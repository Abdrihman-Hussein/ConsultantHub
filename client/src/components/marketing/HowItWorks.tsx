import { Link } from 'react-router-dom'
import Container from '../ui/Container'

const steps = [
  {
    number: '01',
    title: 'Search by specialty',
    body: 'Filter verified consultants by expertise, rating, and rate so you only see people who fit.',
  },
  {
    number: '02',
    title: 'Review the profile',
    body: 'Read real experience, session counts, and the services they offer before you commit.',
  },
  {
    number: '03',
    title: 'Pick a time and book',
    body: 'Choose a service and an open slot. No email threads, no back-and-forth scheduling.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-line bg-surface-subtle">
      <Container className="py-20 lg:py-28">
        <p className="eyebrow mb-3">How it works</p>
        <h2 className="max-w-2xl font-display text-display-lg text-ink-950">
          Three steps from searching to booked.
        </h2>

        <ol className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.number} className="border-t border-line pt-6">
              <span className="font-display text-2xl text-subtle">{step.number}</span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink-950">
                {step.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>

        <p className="mt-12 text-sm text-muted">
          Ready to get started?{' '}
          <Link to="/consultants" className="font-medium text-ink-950 underline underline-offset-4">
            Browse consultants
          </Link>
          .
        </p>
      </Container>
    </section>
  )
}
