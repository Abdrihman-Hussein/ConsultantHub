import { formatDateShort, formatPrice } from '../../../lib/format'
import { useTranslation } from '../../../i18n/LanguageContext'
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
  const { t } = useTranslation()

  // Labels are dictionary keys and values are pre-rendered, so a translated
  // label can reorder around a value it does not itself own — the consultant
  // name and the service name are both seeded content.
  const rows: { label: string; value: string }[] = [
    { label: t('confirm.consultant'), value: consultantName },
    { label: t('confirm.service'), value: service.name },
    { label: t('confirm.when'), value: `${formatDateShort(date)} · ${time} – ${endTime}` },
    {
      label: t('confirm.format'),
      value: t(meetingType === 'video' ? 'meeting.video' : 'meeting.in_person'),
    },
    {
      label: t('confirm.price'),
      value: service.isFree ? t('common.free') : formatPrice(service.price),
    },
  ]

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="border-b border-line bg-accent-50/50 px-6 py-5">
        <h2 className="text-lg font-semibold tracking-tight text-ink-950">
          {t('confirm.title')}
        </h2>
      </div>

      <dl className="space-y-3 p-6 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-6">
            <dt className="text-muted">{row.label}</dt>
            <dd className="text-right font-medium text-body">{row.value}</dd>
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
          {t('confirm.back')}
        </Button>
        <Button className="flex-1" onClick={onConfirm}>
          {t('confirm.confirm')}
        </Button>
      </div>
    </div>
  );
}