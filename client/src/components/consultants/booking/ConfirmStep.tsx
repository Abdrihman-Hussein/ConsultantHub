import { formatDateShort, formatPrice } from '../../../lib/format'
import type { MeetingType, Service } from '../../../types'
import Button from '../../ui/Button'

interface ConfirmStepProps {
  consultantName: string;
  service: Service;
  date: string;
  time: string;
  endTime: string;
  meetingType: MeetingType;
  error: string | null;
  onBack: () => void;
  onConfirm: () => void;
}

export default function ConfirmStep({
  consultantName,
  service,
  date,
  time,
  endTime,
  meetingType,
  error,
  onBack,
  onConfirm,
}: ConfirmStepProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="border-b border-line bg-accent-50/50 px-6 py-5">
        <h2 className="text-lg font-semibold tracking-tight text-ink-950">Confirm booking</h2>
      </div>

      <dl className="space-y-3 p-6 text-sm">
        {[
          ['Consultant', consultantName],
          ['Service', service.name],
          ['When', `${formatDateShort(date)} · ${time} – ${endTime}`],
          ['Format', meetingType === 'video' ? 'Video call' : 'In person'],
          ['Price', service.isFree ? 'Free' : formatPrice(service.price)],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-6">
            <dt className="text-muted">{label}</dt>
            <dd className="text-right font-medium text-body">{value}</dd>
          </div>
        ))}
      </dl>

      {error && (
        <p role="alert" className="mx-6 mb-4 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex gap-3 px-6 pb-6">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button className="flex-1" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </div>
  );
}
