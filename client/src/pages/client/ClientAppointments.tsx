import { useMemo, useState } from 'react'
import { appointments as seedAppointments } from '../../data/appointments'
import type { Appointment, AppointmentStatus } from '../../types'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import AppointmentCard from '../../components/appointments/AppointmentCard'

type Tab = 'ALL' | AppointmentStatus

const tabs: { value: Tab; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

export default function ClientAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(seedAppointments)
  const [tab, setTab] = useState<Tab>('ALL')

  const visible = useMemo(
    () =>
      appointments
        .filter((appointment) => tab === 'ALL' || appointment.status === tab)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [appointments, tab],
  )

  const cancel = (id: string) =>
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id ? { ...appointment, status: 'CANCELLED' } : appointment,
      ),
    )

  return (
    <Container className="py-10 lg:py-14">
      <p className="eyebrow mb-3">Client portal</p>
      <h1 className="font-display text-display-lg text-ink-950">Appointments</h1>
      <p className="mt-3 text-base text-muted">
        Every session you&apos;ve booked, in one place.
      </p>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-line pb-5">
        {tabs.map((option) => {
          const count =
            option.value === 'ALL'
              ? appointments.length
              : appointments.filter((appointment) => appointment.status === option.value).length

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setTab(option.value)}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                tab === option.value
                  ? 'bg-ink-950 text-white'
                  : 'border border-line-strong text-muted hover:border-ink-950 hover:text-body'
              }`}
            >
              {option.label}
              <span className={tab === option.value ? 'ml-1.5 text-white/60' : 'ml-1.5 text-subtle'}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {visible.length === 0 ? (
        <Card className="mt-8 p-12 text-center">
          <p className="text-sm text-muted">Nothing here.</p>
          <Button to="/consultants" size="sm" className="mt-5">
            Book a session
          </Button>
        </Card>
      ) : (
        <div className="mt-8 space-y-4">
          {visible.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} onCancel={cancel} />
          ))}
        </div>
      )}
    </Container>
  )
}
