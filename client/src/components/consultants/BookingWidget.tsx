import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { addMinutes, formatPrice } from '../../lib/format'
import { bookedTimes, generateSlots, isSlotTaken, upcomingDays } from '../../lib/booking'
import type { Consultant, MeetingType, Service } from '../../types'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import ServiceStep from './booking/ServiceStep'
import SlotStep from './booking/SlotStep'
import FormatStep from './booking/FormatStep'
import ConfirmStep from './booking/ConfirmStep'
import DoneStep from './booking/DoneStep'

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
      <DoneStep
        consultantName={consultant.name}
        service={service}
        date={date}
        time={time}
        endTime={endTime}
        isPersistent={isPersistent}
        onBookAnother={() => {
          setStage('select');
          setTime(null);
        }}
      />
    );
  }

  if (stage === 'confirm' && service && time && endTime) {
    return (
      <ConfirmStep
        consultantName={consultant.name}
        service={service}
        date={date}
        time={time}
        endTime={endTime}
        meetingType={meetingType}
        error={error}
        onBack={() => {
          setStage('select');
          setError(null);
        }}
        onConfirm={submit}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="border-b border-line bg-accent-50/50 px-6 py-5">
        <h2 className="text-lg font-semibold tracking-tight text-ink-950">Book a session</h2>
        <p className="mt-1 text-xs text-muted">Pick a service, a date and a time.</p>
      </div>

      <div className="space-y-6 p-6">
        <ServiceStep
          services={services}
          selectedId={serviceId}
          selected={service}
          onSelect={(id) => {
            setServiceId(id);
            setTime(null);
          }}
        />

        <SlotStep
          days={days}
          selectedDate={date}
          onSelectDate={(candidate) => {
            setDate(candidate);
            setTime(null);
          }}
          slots={slots}
          bookedCount={taken.length}
          selectedTime={time}
          onSelectTime={setTime}
        />

        <FormatStep selected={meetingType} onSelect={setMeetingType} />

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
