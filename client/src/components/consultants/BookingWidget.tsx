import { useMemo, useState } from 'react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import type { Service } from '../../types'

interface BookingWidgetProps {
  services: Service[]
  onConfirm?: (serviceId: string, date: string, time: string) => void
}

const dates = ['Mon 14', 'Tue 15', 'Wed 16', 'Thu 17', 'Fri 18']
const times = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00']

function formatPrice(service: Service) {
  return service.isFree ? 'Free' : `$${service.price}`
}

export default function BookingWidget({ services, onConfirm }: BookingWidgetProps) {
  const [serviceId, setServiceId] = useState(services[0]?.id ?? '')
  const [date, setDate] = useState(dates[0])
  const [time, setTime] = useState<string | null>(times[0])
  const [confirmed, setConfirmed] = useState(false)

  const service = useMemo(
    () => services.find((candidate) => candidate.id === serviceId),
    [services, serviceId],
  )

  // Any change to the selection invalidates a previous confirmation.
  const updateSelection = (next: () => void) => {
    next()
    setConfirmed(false)
  }

  const handleConfirm = () => {
    if (!service || !time) return
    setConfirmed(true)
    onConfirm?.(service.id, date, time)
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
      <h2 className="text-lg font-semibold tracking-tight text-ink-950">Book a session</h2>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="booking-service" className="mb-2 block text-sm font-medium text-body">
            Service
          </label>
          <select
            id="booking-service"
            value={serviceId}
            onChange={(event) => updateSelection(() => setServiceId(event.target.value))}
            className="w-full rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-sm focus:border-ink-950 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
          >
            {services.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name} — {formatPrice(candidate)} · {candidate.duration} min
              </option>
            ))}
          </select>
          {service && (
            <p className="mt-2 text-xs leading-relaxed text-muted">{service.description}</p>
          )}
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-body">Date</span>
          <div className="flex flex-wrap gap-2">
            {dates.map((candidate) => (
              <button
                key={candidate}
                type="button"
                onClick={() => updateSelection(() => setDate(candidate))}
                className={`rounded-full border px-3.5 py-2 text-sm transition-colors ${
                  date === candidate
                    ? 'border-ink-950 bg-ink-950 text-white'
                    : 'border-line-strong text-muted hover:border-ink-950 hover:text-body'
                }`}
              >
                {candidate}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-body">Available times</span>
          <div className="grid grid-cols-3 gap-2">
            {times.map((candidate) => (
              <button
                key={candidate}
                type="button"
                onClick={() => updateSelection(() => setTime(candidate))}
                className={`rounded-xl border px-3 py-2 text-sm transition-colors ${
                  time === candidate
                    ? 'border-accent-500 bg-accent-500 text-white'
                    : 'border-line-strong text-muted hover:border-ink-950 hover:text-body'
                }`}
              >
                {candidate}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
        <div>
          <span className="text-xl font-semibold tracking-tight text-ink-950">
            {service ? formatPrice(service) : '—'}
          </span>
          {service && <span className="text-sm text-subtle"> · {service.duration} min</span>}
        </div>
        {service?.isFree && <Badge tone="accent">Intro call</Badge>}
      </div>

      <Button onClick={handleConfirm} disabled={!service || !time} className="mt-5 w-full">
        Confirm booking
      </Button>

      {confirmed && service && time && (
        <p className="mt-3 text-center text-sm text-accent-600">
          Requested {service.name} on {date} at {time}. You&apos;ll get a confirmation shortly.
        </p>
      )}
    </div>
  )
}
