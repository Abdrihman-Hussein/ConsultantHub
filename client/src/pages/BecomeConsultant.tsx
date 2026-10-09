import Container from '../components/ui/Container'
import Reveal from '../components/ui/Reveal'
import OfferServicesCard from '../components/consultants/OfferServicesCard'
import { useTranslation } from '../i18n/LanguageContext'
import type { MessageKey } from '../i18n/strings'

/*
 * The standalone "offer my services" flow.
 *
 * Registration is a single path for everyone, so this page deliberately sits
 * outside it: someone can hire consultants for years and only later decide to
 * offer their own services, from wherever they already are.
 */

const steps: { titleKey: MessageKey; bodyKey: MessageKey }[] = [
  { titleKey: 'become.step1_title', bodyKey: 'become.step1_body' },
  { titleKey: 'become.step2_title', bodyKey: 'become.step2_body' },
  { titleKey: 'become.step3_title', bodyKey: 'become.step3_body' },
]

export default function BecomeConsultant() {
  const { t } = useTranslation()

  return (
    <>
      <section className="border-b border-line bg-surface">
        <Container className="py-16 lg:py-20">
          <Reveal>
            <p className="eyebrow mb-4">{t('home.hero.for_consultants')}</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="max-w-3xl font-display text-display-lg text-ink-950">
              {t('become.title')}
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              {t('become.body')}
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
              <Reveal key={step.titleKey} delay={100 + index * 90}>
                <div className="h-full rounded-2xl border border-line bg-surface p-6 shadow-card">
                  <span className="font-display text-2xl text-accent-500">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h2 className="mt-4 text-base font-semibold tracking-tight text-ink-950">
                    {t(step.titleKey)}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{t(step.bodyKey)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}