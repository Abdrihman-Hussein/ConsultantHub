import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { addMinutes, formatDateShort, formatPrice } from '../../lib/format'
import { bookedTimes, generateSlots, isSlotTaken, upcomingDays } from '../../lib/booking'
import type { Consultant, MeetingType, Service } from '../../types'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

interface BookingWidgetProps {
  consultant: Consultant;
  services: Service[];
}

type Stage = 'select' | 'confirm' | 'done'

export default function BookingWidget({ consultant, services }: BookingWidgetProps) {
  const { session, appointments, bookSession, isPersistent } = useApp();
  const navigate = useNavigate();

  const [serviceId, setServiceId] = useState(services[0]?.id ?? '');
  const [days, setDays] = useState(() => upcomingDays(5));
  const [date, setDate] = useState(days[0]);
  const [time, setTime] = useState<string | null>(null);
  const [meetingType, setMeetingType] = useState<MeetingType>('video');
  const [stage, setStage] = useState<Stage>('select');
  const [error, setError] = useState<string | null>(null);

  const service = useMemo(
    () => services.find((candidate) => candidate.id === serviceId),
    [services, serviceId],
  );

  // Recomputed whenever the date changes, so slots reflect real bookings.
  const taken = useMemo(
    () => bookedTimes(appointments, consultant.id, date),
    [appointments, consultant.id, date],
  );

  const slots = useMemo(
    () => generateSlots(service?.duration ?? 60, taken),
    [service?.duration, taken],
  );

  // Drop a now-unavailable selection when the date or duration changes.
  useEffect(() => {
    if (time && !slots.includes(time)) setTime(null);
  }, [slots, time]);

  // Refresh the day list if the app is left open past midnight.
  useEffect(() => {
    const timer = setInterval(() => setDays(upcomingDays(5)), 60_000);
    return () => clearInterval(timer);
  }, []);

  if (services.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
        <p className="text-sm text-muted">This consultant hasn&apos;t published services yet.</p>
      </div>
    );
  }

  const endTime = service && time ? addMinutes(time, service.duration) : null;

  const submit = () => {
    if (!session) {
      navigate('/login', { state: { from: `/consultants/${consultant.id}` } });
      return;
    }
    if (!service || !time || !endTime) {
      setError('Choose a service and a time first.');
      return;
    }

    // Re-check at submit time in case another tab booked the slot meanwhile.
    if (
      isSlotTaken(appointments, {
        consultantId: consultant.id,
        date,
        startTime: time,
        endTime,
      })
    ) {
      setError('That slot was just taken. Pick another time.');
      setTime(null);
      setStage('select');
      return;
    }

    const created = bookSession({
      consultantId: consultant.id,
      consultantName: consultant.name,
      consultantAvatar: consultant.avatar,
      service,
      date,
      startTime: time,
      endTime,
      meetingType,
    });

    if (!created) {
      setError('Something went wrong saving that booking.');
      return;
    }

    setError(null);
    setStage('done');
  };

  if (stage === 'done' && service && time && endTime) {
    return (
      <div className="rounded-2xl border border-accent-200 bg-accent-50/60 p-6 text-center shadow-card">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent-500 text-white">
          <svg viewBox="0 0 20 20" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4.5 10.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h2 className="mt-4 font-display text-display-md text-ink-950">You&apos;re booked</h2>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted">
          {service.name} with {consultant.name} on {formatDateShort(date)} at {time} (
          {endTime}).
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Button to="/client/appointments" className="w-full">
            View my appointments
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStage('select');
              setTime(null);
            }}
          >
            Book another session
          </Button>
        </div>

        {!isPersistent && (
          <p className="mt-4 text-xs text-subtle">
            Storage is unavailable, so this booking will not survive a reload.
          </p>
        )}
      </div>
    );
  }

  if (stage === 'confirm' && service && time && endTime) {
    return (
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        <div className="border-b border-line bg-accent-50/50 px-6 py-5">
          <h2 className="text-lg font-semibold tracking-tight text-ink-950">Confirm booking</h2>
        </div>

        <dl className="space-y-3 p-6 text-sm">
          {[
            ['Consultant', consultant.name],
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
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setStage('select');
              setError(null);
            }}
          >
            Back
          </Button>
          <Button className="flex-1" onClick={submit}>
            Confirm
          </Button>
        </div>
      </div>
    );
  }

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
              onChange={(event) => {
                setServiceId(event.target.value);
                setTime(null);
              }}
              className="w-full cursor-pointer appearance-none rounded-xl border border-line-strong bg-surface px-4 py-2.5 pr-10 text-sm transition-all duration-200 hover:border-ink-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
            >
              {services.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name} — {candidate.isFree ? 'Free' : formatPrice(candidate.price)} ·{' '}
                  {candidate.duration} min
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
            {days.map((candidate) => (
              <button
                key={candidate}
                type="button"
                onClick={() => {
                  setDate(candidate);
                  setTime(null);
                }}
                aria-pressed={date === candidate}
                className={`rounded-full border px-3.5 py-2 text-sm transition-all duration-200 ease-out ${
                  date === candidate
                    ? 'border-accent-500 bg-accent-500 text-white shadow-glow'
                    : 'border-line-strong text-muted hover:border-accent-400 hover:text-body'
                }`}
              >
                {formatDateShort(candidate)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-sm font-medium text-body">Available times</span>
            {taken.length > 0 && (
              <span className="text-xs text-muted">{taken.length} booked</span>
            )}
          </div>

          {slots.length === 0 ? (
            <p className="rounded-xl bg-surface-muted px-4 py-3 text-sm text-muted">
              No free times on this date. Try another day.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((candidate) => (
                <button
                  key={candidate}
                  type="button"
                  onClick={() => setTime(candidate)}
                  aria-pressed={time === candidate}
                  className={`rounded-xl border px-3 py-2 text-sm transition-all duration-200 ease-out ${
                    time === candidate
                      ? 'border-accent-500 bg-accent-500 text-white shadow-glow'
                      : 'border-line-strong text-muted hover:border-accent-400 hover:text-body'
                  }`}
                >
                  {candidate}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-body">Format</span>
          <div className="grid grid-cols-2 gap-2">
            {(['video', 'in-person'] as MeetingType[]).map((candidate) => (
              <button
                key={candidate}
                type="button"
                onClick={() => setMeetingType(candidate)}
                aria-pressed={meetingType === candidate}
                className={`rounded-xl border px-3 py-2 text-sm capitalize transition-all duration-200 ease-out ${
                  meetingType === candidate
                    ? 'border-accent-500 bg-accent-500 text-white shadow-glow'
                    : 'border-line-strong text-muted hover:border-accent-400 hover:text-body'
                }`}
              >
                {candidate.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-line pt-5">
          <div>
            <span className="text-xl font-semibold tracking-tight text-ink-950">
              {service ? (service.isFree ? 'Free' : formatPrice(service.price)) : '—'}
            </span>
            {service && <span className="text-sm text-subtle"> · {service.duration} min</span>}
          </div>
          {service?.isFree && <Badge tone="accent">Intro call</Badge>}
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        <Button
          className="w-full"
          disabled={!service || !time}
          onClick={() => {
            setError(null);
            setStage('confirm');
          }}
        >
          {session ? 'Continue' : 'Log in to book'}
        </Button>

        {!session && (
          <p className="text-center text-xs text-muted">
            You can browse freely — an account is only needed to book.{' '}
            <Link to="/register" className="underline underline-offset-4 hover:text-ink-950">
              Create one
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
