import { formatDateShort } from '../../../lib/format'
import { useTranslation } from '../../../i18n/LanguageContext'
import type { Service } from '../../../types'
import Button from '../../ui/Button'

interface DoneStepProps {
  consultantName: string;
  service: Service;
  date: string;
  time: string;
  endTime: string;
  isPersistent: boolean;
  onBookAnother: () => void;
}

export default function DoneStep({
  consultantName,
  service,
  date,
  time,
  endTime,
  isPersistent,
  onBookAnother,
}: DoneStepProps) {
  const { t } = useTranslation()

  return (
    <div className="rounded-2xl border border-accent-200 bg-accent-50/60 p-6 text-center shadow-card">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent-500 text-white">
        <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4.5 10.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h2 className="mt-4 font-display text-display-md text-ink-950">{t('done.title')}</h2>
      {/* One sentence with every part as a parameter: the service name and the
          consultant name are seeded content, and Somali orders them differently
          from English, so neither is spliced in by hand. */}
      <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted">
        {t('done.body', {
          service: service.name,
          name: consultantName,
          date: formatDateShort(date),
          time,
          endTime,
        })}
      </p>

      <div className="mt-6 flex flex-col gap-2">
        <Button to="/client/appointments" className="w-full">
          {t('done.view_appointments')}
        </Button>
        <Button variant="ghost" size="sm" onClick={onBookAnother}>
          {t('done.another')}
        </Button>
      </div>

      {!isPersistent && (
        <p className="mt-4 text-xs text-subtle">
          {t('done.no_storage')}
        </p>
      )}
    </div>
  );
}