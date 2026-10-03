import { useMemo, useState } from 'react'
import { appointments as seedAppointments } from '../../data/appointments'
import type { Appointment } from '../../types'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import AppointmentCard from '../../components/appointments/AppointmentCard'
import { users } from '../../data/users'

const today = new Date().toISOString().slice(0, 10)

function isUpcoming(appointment: Appointment) {
  return (
    appointment.date >= today &&
    appointment.status !== 'COMPLETED' &&
    appointment.status !== 'CANCELLED'
  )
}

export default function ClientDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>(seedAppointments)
  const currentUser = users[0]

  const { upcoming, past } = useMemo(
    () => ({
      upcoming: appointments
        .filter(isUpcoming)
        .sort((a, b) => a.date.localeCompare(b.date)),
      past: appointments
        .filter((appointment) => !isUpcoming(appointment))
        .sort((a, b) => b.date.localeCompare(a.date)),
    }),
    [appointments],
  )

  const cancel = (id: string) =>
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id ? { ...appointment, status: 'CANCELLED' } : appointment,
      ),
    )

  const totalSpent = past
    .filter((appointment) => appointment.status === 'COMPLETED')
    .reduce((sum, appointment) => {
      const [startHour] = appointment.startTime.split(':').map(Number)
      const [endHour] = appointment.endTime.split(':').map(Number)
      return sum + (endHour - startHour) * 95
    }, 0)

  const stats = [
    { label: 'Upcoming sessions', value: String(upcoming.length) },
    { label: 'Completed', value: String(past.filter((a) => a.status === 'COMPLETED').length) },
    { label: 'Cancelled', value: String(past.filter((a) => a.status === 'CANCELLED').length) },
    { label: 'Total invested', value: `$${totalSpent.toLocaleString()}` },
  ]

  return (
    <Container className="py-10 lg:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-3">Client portal</p>
          <h1 className="font-display text-display-lg text-ink-950">
            Welcome back, {currentUser.name}
          </h1>
          <p className="mt-3 text-base text-muted">
            Track your sessions and manage upcoming bookings.
          </p>
        </div>
        <Button to="/consultants" variant="dark">
          Book a new consultant
        </Button>
      </div>

      <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface px-5 py-5">
            <dt className="text-xs text-subtle">{stat.label}</dt>
            <dd className="mt-1.5 text-2xl font-semibold tracking-tight text-ink-950">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <section className="mt-14">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight text-ink-950">Upcoming</h2>
          <span className="text-sm text-muted">{upcoming.length} scheduled</span>
        </div>

        {upcoming.length === 0 ? (
          <Card className="mt-5 p-10 text-center">
            <p className="text-sm text-muted">You have no upcoming sessions.</p>
            <Button to="/consultants" size="sm" className="mt-5">
              Find a consultant
            </Button>
          </Card>
        ) : (
          <div className="mt-5 space-y-4">
            {upcoming.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} onCancel={cancel} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-14">
        <h2 className="text-lg font-semibold tracking-tight text-ink-950">History</h2>
        {past.length === 0 ? (
          <Card className="mt-5 p-10 text-center">
            <p className="text-sm text-muted">Past sessions will appear here.</p>
          </Card>
        ) : (
          <div className="mt-5 space-y-4">
            {past.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}
      </section>
    </Container>
  )
}
