import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { canComplete } from '../../lib/booking'
import { formatDate, relativeDay, formatPrice } from '../../lib/format'
import { useCurrentUser } from '../../lib/useCurrentUser'
import { useTranslation } from '../../i18n/LanguageContext'
import type { MessageKey } from '../../i18n/strings'
import type { AppointmentStatus, MeetingType } from '../../types'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Reveal from '../../components/ui/Reveal'
import EmptyState from '../../components/ui/EmptyState'
import InkBand from '../../components/marketing/InkBand'

type Tab = 'ALL' | AppointmentStatus

/**
 * Tab labels and the empty-state title for each one.
 *
 * Both are keys, not strings: the empty state used to be built as
 * `` `Nothing ${label.toLowerCase()}` ``, which only works in English — "Nothing
 * Pending" is a phrase, and Somali needs a different one per tab. Two entries
 * per tab rather than one string, so neither has to be assembled at runtime.
 */
const TABS: {
  value: Tab;
  labelKey: MessageKey;
  emptyTitleKey: MessageKey;
}[] = [
  {
    value: 'ALL',
    labelKey: 'appointments.tab_all',
    emptyTitleKey: 'appointments.empty_all_title',
  },
  {
    value: 'CONFIRMED',
    labelKey: 'appointments.tab_confirmed',
    emptyTitleKey: 'appointments.empty_confirmed_title',
  },
  {
    value: 'PENDING',
    labelKey: 'appointments.tab_pending',
    emptyTitleKey: 'appointments.empty_pending_title',
  },
  {
    value: 'COMPLETED',
    labelKey: 'appointments.tab_completed',
    emptyTitleKey: 'appointments.empty_completed_title',
  },
  {
    value: 'CANCELLED',
    labelKey: 'appointments.tab_cancelled',
    emptyTitleKey: 'appointments.empty_cancelled_title',
  },
]

const statusTone = {
  CONFIRMED: 'accent',
  PENDING: 'gold',
  COMPLETED: 'muted',
  CANCELLED: 'danger',
} as const

function meetingTypeKey(meetingType: MeetingType): MessageKey {
  return meetingType === 'video' ? 'meeting.video' : 'meeting.in_person'
}

function statusLabelKey(status: AppointmentStatus): MessageKey {
  return `status.${status}` as MessageKey
}

export default function ClientAppointments() {
  const { myAppointments, cancelAppointment, completeAppointment } = useApp()
  const user = useCurrentUser()
  const { t } = useTranslation()
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

  // One clock read per render, shared by every row, so two appointments cannot
  // disagree about what "today" is. This is also the only path out of
  // CONFIRMED: without it a booking can never be finished, and a finished
  // booking is the only thing that unlocks a review.
  const now = useMemo(() => new Date(), [myAppointments])

  if (!user) {
    return (
      <Container className="py-16 lg:py-24">
        <Reveal>
          <EmptyState
            title={t('client.login_title')}
            body={t('client.login_body')}
            icon="user"
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Button to="/login">{t('common.log_in')}</Button>
                <Button to="/register" variant="outline">
                  {t('common.create_account')}
                </Button>
              </div>
            }
          />
        </Reveal>
      </Container>
    )
  }

  const currentTab = TABS.find((option) => option.value === tab) ?? TABS[0]

  return (
    <>
      {/* Continues the layout's ink header rather than starting a new band: this
          sits directly beneath the page title, so it shares the header's
          padding scale rather than adding a second `pb-10`. Previously the two
          stacked into ~88px of unbroken ink between the title and these tabs,
          roughly twice the density of `/client/dashboard`. */}
      <InkBand flush noGlow className="pb-6">
        <div
          role="group"
          aria-label={t('appointments.filter_group')}
          className="inline-flex max-w-full flex-wrap items-center gap-1 rounded-full border border-ink-line p-1"
        >
          {TABS.map((option) => {
            const active = tab === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setTab(option.value)}
                aria-pressed={active}
                aria-label={`${t(option.labelKey)}: ${counts[option.value]}`}
                className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ease-out ${
                  active
                    ? 'bg-surface-ink-soft font-semibold text-on-ink'
                    : 'text-on-ink-muted hover:bg-ink-line hover:text-on-ink'
                }`}
              >
                {t(option.labelKey)}
                <span
                  aria-hidden="true"
                  className={`ml-1.5 rounded-full px-1.5 text-xs transition-colors ${
                    active ? 'bg-on-ink/15 text-on-ink' : 'text-on-ink-muted'
                  }`}
                >
                  {counts[option.value]}
                </span>
              </button>
            )
          })}
        </div>
      </InkBand>

      <Container className="py-10 lg:py-14">
      <div key={tab} className="animate-fade-in">
        {visible.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title={t(currentTab.emptyTitleKey)}
              body={
                tab === 'ALL'
                  ? t('appointments.empty_all_body')
                  : t('appointments.empty_filtered_body')
              }
              icon="calendar"
              action={<Button to="/consultants">{t('appointments.browse')}</Button>}
            />
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {visible.map((appointment, index) => {
              const canCancel =
                appointment.status === 'CONFIRMED' || appointment.status === 'PENDING'
              // Eligibility is `canComplete`, the same helper the state change
              // runs, so the button can never be offered for a booking that
              // would be refused — and never for a future, pending, cancelled
              // or already-completed one.
              const canFinish = canComplete(appointment, now)

              return (
                <Reveal key={appointment.id} delay={index * 70}>
                  <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-ink-950">{appointment.serviceName}</p>
                        <Badge tone={statusTone[appointment.status]}>
                          {t(statusLabelKey(appointment.status))}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted truncate">{appointment.consultantName}</p>
                      <p className="mt-1.5 text-sm text-muted">
                        {formatDate(appointment.date)} · {appointment.startTime} –{' '}
                        {appointment.endTime} ·{' '}
                        {t(meetingTypeKey(appointment.meetingType))}
                      </p>
                      <p className="mt-1 text-xs text-subtle">
                        {relativeDay(appointment.date, t)} ·{' '}
                        {appointment.price === 0 ? t('common.free') : formatPrice(appointment.price)}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 self-start sm:self-center">
                      <Link
                        to={`/consultants/${appointment.consultantId}`}
                        className="rounded-full border border-line-strong px-4 py-2 text-sm text-body transition-all duration-200 hover:border-accent-500 hover:text-accent-600"
                      >
                        {t('appointments.profile')}
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
                            {cancelling === appointment.id
                              ? t('appointments.confirm')
                              : t('client.cancel')}
                          </button>
                        )}
                        {canFinish && (
                          <button
                            type="button"
                            onClick={() => completeAppointment(appointment.id)}
                            className="rounded-full border border-line-strong px-4 py-2 text-sm text-muted transition-all duration-200 hover:border-accent-500 hover:text-accent-600"
                          >
                            {t('appointments.complete')}
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
    </>
  )
}