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

  const chip = (active: boolean) =>
    `transition-all duration-200 ease-out ${
      active
        ? 'border-accent-500 bg-accent-500 text-white shadow-glow'
        : 'border-line-strong text-muted hover:border-accent-400 hover:text-body'
    }`

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="border-b border-line bg-accent-50/50 px-6 py-5">
        <h2 className="text-lg font-semibold tracking-tight text-ink-950">Book a session</h2>
        <p className="mt-1 text-xs text-muted">Pick a service, a date and a time.</p>
      </div>

      <div className="space-y-6 p-6">
        <div>
          <label htmlFor="booking-service" className="mb-2 block text-sm font-medium text-body">
            Service
          </label>
          <div className="relative">
            <select
              id="booking-service"
              value={serviceId}
              onChange={(event) => updateSelection(() => setServiceId(event.target.value))}
              className="w-full cursor-pointer appearance-none rounded-xl border border-line-strong bg-surface px-4 py-2.5 pr-10 text-sm transition-all duration-200 hover:border-ink-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
            >
              {services.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name} — {formatPrice(candidate)} · {candidate.duration} min
                </option>
              ))}
            </select>
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
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
                className={`rounded-full border px-3.5 py-2 text-sm ${chip(date === candidate)}`}
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
                className={`rounded-xl border px-3 py-2 text-sm ${chip(time === candidate)}`}
              >
                {candidate}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-line pt-5">
          <div>
            <span className="text-xl font-semibold tracking-tight text-ink-950">
              {service ? formatPrice(service) : '—'}
            </span>
            {service && <span className="text-sm text-subtle"> · {service.duration} min</span>}
          </div>
          {service?.isFree && <Badge tone="accent">Intro call</Badge>}
        </div>

        <Button onClick={handleConfirm} disabled={!service || !time} className="w-full">
          Confirm booking
        </Button>

        {/* Reserve height so the confirmation does not shift the panel. */}
        <div
          aria-live="polite"
          className={`transition-all duration-300 ease-out ${
            confirmed ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {confirmed && service && time && (
            <div className="flex items-start gap-2 rounded-xl bg-accent-50 px-3.5 py-3 text-sm text-accent-800">
              <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" fill="currentColor">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm3.3 4.8L7.4 9.7 4.9 7.2 3.8 8.3l2.6 2.6 5-5-1.1-1.1z" />
              </svg>
              <span>
                Requested {service.name} on {date} at {time}. You&apos;ll get a confirmation shortly.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
