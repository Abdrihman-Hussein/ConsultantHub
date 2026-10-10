import { formatDateShort } from '../../../lib/format'
import { useTranslation } from '../../../i18n/LanguageContext'

interface SlotStepProps {
  days: string[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  slots: string[];
  bookedCount: number;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

export default function SlotStep({
  days,
  selectedDate,
  onSelectDate,
  slots,
  bookedCount,
  selectedTime,
  onSelectTime,
}: SlotStepProps) {
  const { t } = useTranslation()

  return (
    <>
      <div>
        <span className="mb-2 block text-sm font-medium text-body">{t('booking.date')}</span>
        <div className="flex flex-wrap gap-2">
          {days.map((candidate) => (
            <button
              key={candidate}
              type="button"
              onClick={() => onSelectDate(candidate)}
              aria-pressed={selectedDate === candidate}
              className={`rounded-full border px-3.5 py-2 text-sm transition-all duration-200 ease-out ${
                selectedDate === candidate
                  ? 'border-accent-500 bg-accent-500 text-white shadow-glow'
                  : 'border-line-strong text-muted hover:border-accent-400 hover:text-body'
              }`}
            >
              {formatDateShort(candidate)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-medium text-body">{t('booking.available_times')}</span>
          {bookedCount > 0 && (
            <span className="text-xs text-muted">
              {t('booking.booked_count', { count: bookedCount })}
            </span>
          )}
        </div>

        {slots.length === 0 ? (
          <p className="rounded-xl bg-surface-muted px-4 py-3 text-sm text-muted">
            {t('booking.no_slots')}
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {slots.map((candidate) => (
              <button
                key={candidate}
                type="button"
                onClick={() => onSelectTime(candidate)}
                aria-pressed={selectedTime === candidate}
                className={`rounded-xl border px-3 py-2 text-sm transition-all duration-200 ease-out ${
                  selectedTime === candidate
                    ? 'border-accent-500 bg-accent-500 text-white shadow-glow'
                    : 'border-line-strong text-muted hover:border-accent-400 hover:text-body'
                }`}
              >
                {candidate}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
