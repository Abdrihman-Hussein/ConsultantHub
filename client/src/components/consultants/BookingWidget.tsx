import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { addMinutes, formatPrice } from '../../lib/format'
import { bookedTimes, generateSlots, isSlotTaken, upcomingDays } from '../../lib/booking'
import { useTranslation } from '../../i18n/LanguageContext'
import type { MessageKey } from '../../i18n/strings'
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
  const { t } = useTranslation();

  const [serviceId, setServiceId] = useState(services[0]?.id ?? '');
  const [days, setDays] = useState(() => upcomingDays(5));
  const [date, setDate] = useState(days[0]);
  const [time, setTime] = useState<string | null>(null);
  const [meetingType, setMeetingType] = useState<MeetingType>('video');
  const [stage, setStage] = useState<Stage>('select');
  /**
   * Stored as a dictionary key rather than a rendered sentence, so switching
   * language re-renders the message in the new one. A string captured at the
   * moment of failure would stay in whichever language was active then.
   */
  const [error, setError] = useState<MessageKey | null>(null);

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
        <p className="text-sm text-muted">{t('booking.no_services')}</p>
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
      setError('booking.error_choose');
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
      setError('booking.error_taken');
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
      setError('booking.error_save');
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
        error={error ? t(error) : null}
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
        <h2 className="text-lg font-semibold tracking-tight text-ink-950">{t('booking.title')}</h2>
        <p className="mt-1 text-xs text-muted">{t('booking.subtitle')}</p>
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
              {service
                ? service.isFree
                  ? t('common.free')
                  : formatPrice(service.price)
                : '—'}
            </span>
            {service && (
              <span className="text-sm text-subtle">
                {t('booking.price_row', { duration: service.duration })}
              </span>
            )}
          </div>
          {service?.isFree && <Badge tone="accent">{t('booking.intro_badge')}</Badge>}
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
            {t(error)}
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
          {session ? t('booking.continue') : t('booking.log_in_to_book')}
        </Button>

        {!session && (
          <p className="text-center text-xs text-muted">
            {t('booking.browse_note')}{' '}
            <Link to="/register" className="underline underline-offset-4 hover:text-ink-950">
              {t('booking.create_one')}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
