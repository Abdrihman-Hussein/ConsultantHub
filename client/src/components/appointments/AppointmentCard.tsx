import Card from '../ui/Card'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import type { Appointment, AppointmentStatus } from '../../types'

const statusTone: Record<AppointmentStatus, 'accent' | 'gold' | 'muted' | 'danger'> = {
  CONFIRMED: 'accent',
  PENDING: 'gold',
  COMPLETED: 'muted',
  CANCELLED: 'danger',
}

function formatDate(iso: string) {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

interface AppointmentCardProps {
  appointment: Appointment
  onCancel?: (id: string) => void
}

export default function AppointmentCard({ appointment, onCancel }: AppointmentCardProps) {
  const canCancel = appointment.status === 'PENDING' || appointment.status === 'CONFIRMED'

  return (
    <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
      <Avatar
        src={appointment.consultantAvatar || undefined}
        name={appointment.consultantName}
        size="lg"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium tracking-tight text-ink-950">{appointment.consultantName}</h3>
          <Badge tone={statusTone[appointment.status]}>{appointment.status.toLowerCase()}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted">{appointment.serviceName}</p>
        <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
          <span className="text-body">{formatDate(appointment.date)}</span>
          <span className="text-subtle" aria-hidden="true">
            ·
          </span>
          <span>
            {appointment.startTime} – {appointment.endTime}
          </span>
          <span className="text-subtle" aria-hidden="true">
            ·
          </span>
          <span className="capitalize">{appointment.meetingType.replace('-', ' ')}</span>
          {appointment.location && (
            <>
              <span className="text-subtle" aria-hidden="true">
                ·
              </span>
              <span>{appointment.location}</span>
            </>
          )}
        </p>
      </div>

      {canCancel && (
        <button
          type="button"
          onClick={() => onCancel?.(appointment.id)}
          className="shrink-0 self-start rounded-full border border-line-strong px-4 py-2 text-sm text-muted transition-colors hover:border-danger hover:text-danger sm:self-center"
        >
          Cancel
        </button>
      )}
    </Card>
  )
}
