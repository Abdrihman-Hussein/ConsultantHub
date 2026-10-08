import { formatDateShort } from '../../../lib/format'

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
  return (
    <>
      <div>
        <span className="mb-2 block text-sm font-medium text-body">Date</span>
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
          <span className="text-sm font-medium text-body">Available times</span>
          {bookedCount > 0 && (
            <span className="text-xs text-muted">{bookedCount} booked</span>
          )}
        </div>

        {slots.length === 0 ? (
          <p className="rounded-xl bg-surface-muted px-4 py-3 text-sm text-muted">
            No free times on this date. Try another day.
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
