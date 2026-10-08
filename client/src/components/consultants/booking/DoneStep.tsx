import { formatDateShort } from '../../../lib/format'
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
  return (
    <div className="rounded-2xl border border-accent-200 bg-accent-50/60 p-6 text-center shadow-card">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent-500 text-white">
        <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4.5 10.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h2 className="mt-4 font-display text-display-md text-ink-950">You&apos;re booked</h2>
      <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted">
        {service.name} with {consultantName} on {formatDateShort(date)} at {time} (
        {endTime}).
      </p>

      <div className="mt-6 flex flex-col gap-2">
        <Button to="/client/appointments" className="w-full">
          View my appointments
        </Button>
        <Button variant="ghost" size="sm" onClick={onBookAnother}>
          Book another session
        </Button>
      </div>

      {!isPersistent && (
        <p className="mt-4 text-xs text-subtle">
          Storage is unavailable, so this booking will not survive a reload.
        </p>
      )}
    </div>
  );
}
