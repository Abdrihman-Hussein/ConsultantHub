import Container from '../components/ui/Container'
import Reveal from '../components/ui/Reveal'
import OfferServicesCard from '../components/consultants/OfferServicesCard'

/*
 * The standalone "offer my services" flow.
 *
 * Registration is a single path for everyone, so this page deliberately sits
 * outside it: someone can hire consultants for years and only later decide to
 * offer their own services, from wherever they already are.
 */

const steps = [
  {
    title: 'One account, either way',
    body: 'Sign up the same way as anyone else. There is no consultant-only sign-up to fill in first.',
  },
  {
    title: 'Switch when it suits you',
    body: 'Turn on your consultant profile in one click. Nothing you have booked as a client is affected.',
  },
  {
    title: 'Stay in control of availability',
    body: 'Set the hours you are free, the services you offer, and your rates — clients only see the slots you publish.',
  },
]

export default function BecomeConsultant() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <Container className="py-16 lg:py-20">
          <Reveal>
            <p className="eyebrow mb-4">For consultants</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="max-w-3xl font-display text-display-lg text-ink-950">
              Keep your client account. Add a consultant one.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Registration on ConsultantHub is the same for everyone — nobody is asked up front
              whether they plan to hire or to be hired. Offering your services is a separate switch
              you can flip whenever you want, without starting over.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-surface-subtle">
        <Container className="py-14 lg:py-16">
          <Reveal>
            <OfferServicesCard />
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={100 + index * 90}>
                <div className="h-full rounded-2xl border border-line bg-surface p-6 shadow-card">
                  <span className="font-display text-2xl text-accent-500">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h2 className="mt-4 text-base font-semibold tracking-tight text-ink-950">
                    {step.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}