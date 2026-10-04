import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatDate, relativeDay, formatPrice } from '../../lib/format'
import type { AppointmentStatus } from '../../types'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Reveal from '../../components/ui/Reveal'
import EmptyState from '../../components/ui/EmptyState'

type Tab = 'ALL' | AppointmentStatus

const tabs: { value: Tab; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const statusTone = {
  CONFIRMED: 'accent',
  PENDING: 'gold',
  COMPLETED: 'muted',
  CANCELLED: 'danger',
} as const

export default function ClientAppointments() {
  const { session, myAppointments, cancelAppointment } = useApp()
  const [tab, setTab] = useState<Tab>('ALL')
  const [cancelling, setCancelling] = useState<string | null>(null)

  const counts = useMemo(() => {
    const base: Record<Tab, number> = {
      ALL: myAppointments.length,
      CONFIRMED: 0,
      PENDING: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    }
    for (const appointment of myAppointments) base[appointment.status] += 1
    return base
  }, [myAppointments])

  // Newest first within each tab, so history reads backwards chronologically.
  const visible = useMemo(
    () =>
      myAppointments
        .filter((appointment) => tab === 'ALL' || appointment.status === tab)
        .sort((a, b) => (b.date + b.startTime).localeCompare(a.date + a.startTime)),
    [myAppointments, tab],
  )

  const confirmCancel = (id: string) => {
    if (cancelling !== id) {
      setCancelling(id)
      return
    }
    cancelAppointment(id)
    setCancelling(null)
  }

  if (!session) {
    return (
      <Container className="py-16 lg:py-24">
        <Reveal>
          <EmptyState
            title="Log in to see your appointments"
            body="Your booking history lives here once you sign in."
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

  return (
    <Container className="py-10 lg:py-14">
      <Reveal>
        <p className="eyebrow mb-3">Client portal</p>
        <h1 className="font-display text-display-lg text-ink-950">Appointments</h1>
        <p className="mt-3 text-base text-muted">Every session you have booked.</p>
      </Reveal>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-line pb-5">
        {tabs.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setTab(option.value)}
            aria-pressed={tab === option.value}
            className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ease-out ${
              tab === option.value
                ? 'bg-accent-500 text-white shadow-glow'
                : 'border border-line-strong text-muted hover:border-accent-400 hover:text-body'
            }`}
          >
            {option.label}
            <span
              className={`ml-1.5 transition-colors ${
                tab === option.value ? 'text-white/70' : 'text-subtle'
              }`}
            >
              {counts[option.value]}
            </span>
          </button>
        ))}
      </div>

      <div key={tab} className="animate-fade-in">
        {visible.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title={tab === 'ALL' ? 'No appointments yet' : `Nothing ${tabs.find((t) => t.value === tab)?.label.toLowerCase()}`}
              body={
                tab === 'ALL'
                  ? 'Book an intro call to get started — every consultant offers a free one.'
                  : 'Try a different filter to see your other bookings.'
              }
              icon="calendar"
              action={<Button to="/consultants">Browse consultants</Button>}
            />
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {visible.map((appointment, index) => {
              const canCancel =
                appointment.status === 'CONFIRMED' || appointment.status === 'PENDING'

              return (
                <Reveal key={appointment.id} delay={index * 70}>
                  <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-ink-950">{appointment.serviceName}</p>
                        <Badge tone={statusTone[appointment.status]}>
                          {appointment.status.toLowerCase()}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted">{appointment.consultantName}</p>
                      <p className="mt-1.5 text-sm text-muted">
                        {formatDate(appointment.date)} · {appointment.startTime} –{' '}
                        {appointment.endTime} ·{' '}
                        <span className="capitalize">
                          {appointment.meetingType.replace('-', ' ')}
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-subtle">
                        {relativeDay(appointment.date)} ·{' '}
                        {appointment.price === 0 ? 'Free' : formatPrice(appointment.price)}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 self-start sm:self-center">
                      <Link
                        to={`/consultants/${appointment.consultantId}`}
                        className="rounded-full border border-line-strong px-4 py-2 text-sm text-body transition-all duration-200 hover:border-accent-500 hover:text-accent-600"
                      >
                        Profile
                      </Link>
                      {canCancel && (
                        <button
                          type="button"
                          onClick={() => confirmCancel(appointment.id)}
                          className={`rounded-full border px-4 py-2 text-sm transition-all duration-200 ${
                            cancelling === appointment.id
                              ? 'border-danger bg-danger text-white'
                              : 'border-line-strong text-muted hover:border-danger hover:text-danger'
                          }`}
                        >
                          {cancelling === appointment.id ? 'Confirm?' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </Card>
                </Reveal>
              )
            })}
          </div>
        )}
      </div>
    </Container>
  )
}
