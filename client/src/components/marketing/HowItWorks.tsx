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
        <Reveal>
          <p className="eyebrow mb-3">{t('how.eyebrow')}</p>
          <h2 className="max-w-2xl font-display text-display-lg text-ink-950">
            {t('how.title')}
          </h2>
        </Reveal>

        <ol className="mt-14 border-t border-line">
          {steps.map((step, index) => (
            <Reveal as="li" key={step.number} delay={index * 80}>
              <div className="group grid gap-2 border-b border-line py-8 md:grid-cols-[6rem_16rem_1fr] md:items-baseline md:gap-10">
                <span className="font-display text-2xl text-subtle transition-colors duration-300 group-hover:text-accent-500">
                  {step.number}
                </span>
                <h3 className="text-lg font-semibold tracking-tight text-ink-950">
                  {t(step.titleKey)}
                </h3>
                <p className="text-sm leading-relaxed text-muted">{t(step.bodyKey)}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={200}>
          <p className="mt-12 text-sm text-muted">
            {t('how.ready')}{' '}
            <Link
              to="/consultants"
              className="group inline-flex items-center font-medium text-ink-950"
            >
              <span className="bg-gradient-to-r from-accent-500 to-accent-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-accent-600 group-hover:to-accent-700">
                {t('how.browse')}
              </span>
              <span className="ml-1 inline-block transition-transform duration-300 ease-spring group-hover:translate-x-1">
                →
              </span>
            </Link>
          </p>
        </Reveal>
      </Container>
    </section>
  )
}