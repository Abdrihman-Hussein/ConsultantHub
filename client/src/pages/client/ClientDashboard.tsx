import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { consultants } from '../../data'
import { formatDate, relativeDay, todayISO, formatPrice } from '../../lib/format'
import type { Appointment } from '../../types'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Reveal from '../../components/ui/Reveal'
import EmptyState from '../../components/ui/EmptyState'
import OfferServicesCard from '../../components/consultants/OfferServicesCard'

function isUpcoming(appointment: Appointment) {
  return (
    appointment.date >= todayISO() &&
    appointment.status !== 'COMPLETED' &&
    appointment.status !== 'CANCELLED'
  )
}

export default function ClientDashboard() {
  const { session, myAppointments, cancelAppointment } = useApp()
  const [cancelling, setCancelling] = useState<string | null>(null)

  const { upcoming, past, spend } = useMemo(() => {
    const sorted = [...myAppointments]
    const up = sorted
      .filter(isUpcoming)
      .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
    const down = sorted
      .filter((appointment) => !isUpcoming(appointment))
      .sort((a, b) => (b.date + b.startTime).localeCompare(a.date + a.startTime))

    // Spend uses the price snapshotted at booking, so it matches what was charged.
    const total = sorted
      .filter((appointment) => appointment.status === 'COMPLETED')
      .reduce((sum, appointment) => sum + appointment.price, 0)

    return { upcoming: up, past: down, spend: total }
  }, [myAppointments])

  const confirmCancel = (id: string) => {
    if (cancelling !== id) {
      setCancelling(id)
      return
    }
    cancelAppointment(id)
    setCancelling(null)
  }

  const nextUp = upcoming[0]

  if (!session) {
    return (
      <Container className="py-16 lg:py-24">
        <Reveal>
          <EmptyState
            title="Log in to see your dashboard"
            body="Your bookings, messages, and history live here once you sign in."
            icon="user"
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Button to="/login">Log in</Button>
                <Button to="/register" variant="outline">
                  Create an account
                </Button>
              </div>
            }
          />
        </Reveal>
      </Container>
    )
  }

  const stats = [
    { label: 'Upcoming', value: String(upcoming.length) },
    { label: 'Completed', value: String(past.filter((a) => a.status === 'COMPLETED').length) },
    { label: 'Cancelled', value: String(past.filter((a) => a.status === 'CANCELLED').length) },
    { label: 'Total spent', value: formatPrice(spend) },
  ]

  return (
    <Container className="py-10 lg:py-14">
      <div className="flex justify-end">
        <Reveal>
          <Button to="/consultants" variant="dark" size="sm">
            Book a new consultant
          </Button>
        </Reveal>
      </div>

      {nextUp && (
        <Reveal className="mt-8">
          <div className="overflow-hidden rounded-3xl border border-accent-300 bg-accent-50/70 p-6 shadow-card sm:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="eyebrow text-accent-600">Next session</p>
                  <Badge tone="accent">{relativeDay(nextUp.date)}</Badge>
                </div>
                <p className="mt-3 font-display text-display-md text-ink-950">
                  {nextUp.serviceName}
                </p>
                <p className="mt-1 text-base text-body">with {nextUp.consultantName}</p>
                <p className="mt-3 text-sm text-muted">
                  {formatDate(nextUp.date)} · {nextUp.startTime} – {nextUp.endTime} ·{' '}
                  <span className="capitalize">{nextUp.meetingType.replace('-', ' ')}</span>
                </p>
              </div>
              <Button to="/client/appointments" variant="primary" className="shrink-0">
                Manage booking
              </Button>
            </div>
          </div>
        </Reveal>
      )}

      <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 70}>
            <div className="h-full bg-surface px-5 py-5">
              <dt className="text-xs text-subtle">{stat.label}</dt>
              <dd className="mt-1.5 text-2xl font-semibold tracking-tight text-ink-950">
                {stat.value}
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>

      <section className="mt-14">
        <Reveal>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-lg font-semibold tracking-tight text-ink-950">Upcoming</h2>
            {upcoming.length > 0 && (
              <Link
                to="/client/appointments"
                className="text-sm text-muted transition-colors hover:text-ink-950"
              >
                View all
              </Link>
            )}
          </div>
        </Reveal>

        {upcoming.length === 0 ? (
          <Reveal delay={80}>
            <div className="mt-5">
              <EmptyState
                title="Nothing booked yet"
                body="Browse the directory and book an intro call — every consultant offers a free one."
                icon="calendar"
                action={<Button to="/consultants">Find a consultant</Button>}
              />
            </div>
          </Reveal>
        ) : (
          <div className="mt-5 space-y-4">
            {upcoming.map((appointment, index) => (
              <Reveal key={appointment.id} delay={index * 80}>
                <AppointmentRow
                  appointment={appointment}
                  cancelling={cancelling === appointment.id}
                  onCancel={() => confirmCancel(appointment.id)}
                />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="mt-14">
        <Reveal>
          <h2 className="text-lg font-semibold tracking-tight text-ink-950">History</h2>
        </Reveal>
        {past.length === 0 ? (
          <Reveal delay={80}>
            <div className="mt-5">
              <EmptyState title="No past sessions" body="Completed and cancelled bookings appear here." icon="clock" />
            </div>
          </Reveal>
        ) : (
          <div className="mt-5 space-y-4">
            {past.map((appointment, index) => (
              <Reveal key={appointment.id} delay={index * 60}>
                <AppointmentRow appointment={appointment} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Sits after everything else on purpose: booking is the job of this page,
          offering services is a separate door rather than a competing action. */}
      <Reveal delay={80}>
        <OfferServicesCard className="mt-14" />
      </Reveal>
    </Container>
  )
}

interface RowProps {
  appointment: Appointment
  cancelling?: boolean
  onCancel?: () => void
}

function AppointmentRow({ appointment, cancelling, onCancel }: RowProps) {
  const statusTone =
    appointment.status === 'CONFIRMED'
      ? 'accent'
      : appointment.status === 'PENDING'
        ? 'gold'
        : appointment.status === 'CANCELLED'
          ? 'danger'
          : 'muted'

  const consultant = consultants.find((c) => c.id === appointment.consultantId)
  const canCancel = appointment.status === 'CONFIRMED' || appointment.status === 'PENDING'

  return (
    <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-ink-950">{appointment.serviceName}</p>
          <Badge tone={statusTone}>{appointment.status.toLowerCase()}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted">
          with{' '}
          {consultant ? (
            <Link
              to={`/consultants/${consultant.id}`}
              className="text-body underline underline-offset-2 hover:text-accent-600 truncate block"
            >
              {consultant.name}
            </Link>
          ) : (
            appointment.consultantName
          )}
        </p>
        <p className="mt-1.5 text-sm text-muted">
          {formatDate(appointment.date)} · {appointment.startTime} – {appointment.endTime}
        </p>
      </div>

      {canCancel && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className={`shrink-0 self-start rounded-full border px-4 py-2 text-sm transition-all duration-200 sm:self-center ${
            cancelling
              ? 'border-danger bg-danger text-white'
              : 'border-line-strong text-muted hover:border-danger hover:text-danger'
          }`}
        >
          {cancelling ? 'Tap again to confirm' : 'Cancel'}
        </button>
      )}
    </Card>
  )
}
