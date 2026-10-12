import { Link } from 'react-router-dom'
import Container from '../ui/Container'
import Reveal from '../ui/Reveal'
import { useTranslation } from '../../i18n/LanguageContext'
import type { MessageKey } from '../../i18n/strings'

const steps: { number: string; titleKey: MessageKey; bodyKey: MessageKey }[] = [
  {
    number: '01',
    titleKey: 'how.step1.title',
    bodyKey: 'how.step1.body',
  },
  {
    number: '02',
    titleKey: 'how.step2.title',
    bodyKey: 'how.step2.body',
  },
  {
    number: '03',
    titleKey: 'how.step3.title',
    bodyKey: 'how.step3.body',
  },
]

export default function HowItWorks() {
  const { t } = useTranslation()

  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-line bg-surface-subtle">
      <Container className="py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Reveal>
              <p className="eyebrow mb-3">{t('how.eyebrow')}</p>
              <h2 className="max-w-md font-display text-display-lg text-ink-950">
                {t('how.title')}
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-muted">
                {t('how.ready')}{' '}
                <Link
                  to="/consultants"
                  className="group inline-flex items-center font-medium text-accent-600 underline-offset-4 transition-colors hover:text-accent-700 hover:underline"
                >
                  {t('how.browse')}
                  <span className="ml-1 inline-block transition-transform duration-300 ease-spring group-hover:translate-x-1" aria-hidden="true">
                    →
                  </span>
                </Link>
              </p>
            </Reveal>
          </div>

          <ol className="space-y-5">
            {steps.map((step, index) => (
              <Reveal as="li" key={step.number} delay={index * 80}>
                <div className="group rounded-2xl border border-line bg-surface p-7 transition-colors duration-300 hover:border-line-strong sm:p-8">
                  <span className="font-display text-4xl font-bold text-ink-200 transition-colors duration-300 group-hover:text-accent-500">
                    {step.number}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink-950">
                    {t(step.titleKey)}
                  </h3>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">{t(step.bodyKey)}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}