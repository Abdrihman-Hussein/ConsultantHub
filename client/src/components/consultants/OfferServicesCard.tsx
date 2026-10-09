import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../i18n/LanguageContext'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

interface OfferServicesCardProps {
  className?: string
}

/**
 * The independent "offer my services" option.
 *
 * Signup never asks what someone wants to do here — one account covers both
 * sides. This switch is offered on its own, afterwards, so offering services is
 * a decision someone makes when it becomes relevant rather than a fork in the
 * door. It only ever adds the consultant role, so existing bookings survive it.
 */
export default function OfferServicesCard({ className = '' }: OfferServicesCardProps) {
  const { session, becomeConsultant } = useApp()
  const { t } = useTranslation()

  const isConsultant = session?.role === 'CONSULTANT'

  return (
    <section
      className={`rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-7 ${className}`}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="min-w-0">
          <p className="eyebrow">{t('offer.eyebrow')}</p>
          <h2 className="mt-2 font-display text-display-md text-ink-950">
            {t('offer.title')}
          </h2>
          <p className="mt-2.5 max-w-md text-sm leading-relaxed text-muted">
            {t('offer.body')}
          </p>
        </div>

        {isConsultant ? (
          // Enters from scale(.96) + opacity rather than appearing from nothing.
          <div className="animate-scale-in shrink-0 sm:max-w-[15rem]">
            <Badge tone="accent">
              <svg
                viewBox="0 0 20 20"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4.5 10.5l3.5 3.5 7.5-8" />
              </svg>
              {t('offer.on')}
            </Badge>
            <p className="mt-2.5 text-xs leading-relaxed text-muted">
              {t('offer.on_note')}
            </p>
          </div>
        ) : session ? (
          <div className="shrink-0 sm:max-w-[15rem]">
            <Button onClick={becomeConsultant}>{t('offer.button')}</Button>
            <p className="mt-2.5 text-xs leading-relaxed text-muted">
              {t('offer.button_note')}
            </p>
          </div>
        ) : (
          <div className="flex shrink-0 flex-col items-start gap-2.5 sm:max-w-[15rem]">
            <Button to="/login">{t('common.log_in')}</Button>
            <Button to="/register" variant="outline">
              {t('common.create_account')}
            </Button>
            <p className="text-xs leading-relaxed text-muted">
              {t('offer.guest_note')}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}