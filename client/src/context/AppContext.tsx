import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { KEYS, read, write, clearAll, isPersistent } from '../lib/storage';
import { useCurrentUser } from '../lib/useCurrentUser';
import { createId, todayISO } from '../lib/format';
import { canComplete } from '../lib/booking';
import { canReview, reviewerName } from '../lib/reviews';
import { seedAppointments } from '../data/seed';
import type {
  Appointment,
  AppointmentStatus,
  MeetingType,
  Review,
  Service,
} from '../types';

/**
 * Application data: bookings and the reviews written against them.
 *
 * Identity is not here any more. There is no `session`, no `login`, no
 * `register`, no `logout` — Clerk owns all of that, and `lib/useCurrentUser`
 * is the single place this app reads it. What is left is the data those flows
 * produce.
 *
 * The user is still needed here, and deliberately so: every write below is
 * attributed to whoever is signed in, and the ownership checks that stop
 * somebody cancelling or completing somebody else's booking compare against
 * that same id. Reading it from Clerk inside this provider keeps the identity
 * rules in one place without duplicating any of them into local state.
 *
 * Bookings and reviews still live in localStorage. That is a stand-in for a
 * backend — see README for what a real implementation would move server-side.
 */

interface BookingInput {
  consultantId: string;
  consultantName: string;
  consultantAvatar: string;
  service: Service;
  date: string;
  startTime: string;
  endTime: string;
  meetingType: MeetingType;
}

interface AppState {
  appointments: Appointment[];
  isPersistent: boolean;

  bookSession: (input: BookingInput) => Appointment | null;
  cancelAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, date: string, startTime: string, endTime: string) => boolean;

  /**
   * Marks a past confirmed booking finished, and only that. Without it there
   * is no way out of `CONFIRMED` except cancelling, so no client could ever
   * reach the review gate. Eligibility is `canComplete`, not a JSX condition,
   * so the same rule governs the button and the state change.
   */
  completeAppointment: (id: string) => boolean;

  /** Reviews written through the gate. Starts empty; never seeded. */
  reviews: Review[];

  /**
   * Records a review for a completed session. Re-runs `canReview` before
   * writing rather than trusting the caller, so a form that is still mounted
   * after its appointment has been cancelled cannot slip a review through.
   * Returns false when the gate closes.
   */
  addReview: (input: { consultantId: string; rating: number; body: string }) => boolean;

  /** Bookings belonging to the signed-in user, newest first. */
  myAppointments: Appointment[];
  resetDemoData: () => void;
}

const AppContext = createContext<AppState | null>(null);

function initialAppointments(): Appointment[] {
  const stored = read<Appointment[]>(KEYS.appointments, []);
  if (stored.length > 0) return stored;
  write(KEYS.appointments, seedAppointments);
  return seedAppointments;
}

/**
 * Reads the stored reviews, writing an empty list on first run.
 *
 * Unlike appointments this has no seed: every review in here was written by a
 * real client against a completed session, and inventing some would be exactly
 * the thing the review gate exists to prevent.
 */
function initialReviews(): Review[] {
  return read<Review[]>(KEYS.reviews, []);
}

export function AppProvider({ children }: { children: ReactNode }) {
  // The one place identity enters the data layer. `user` is null while Clerk is
  // loading and when nobody is signed in, so every guarded write below simply
  // does nothing in both cases rather than attributing data to a stale id.
  const user = useCurrentUser();
  const userId = user?.id ?? null;

  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const persistAppointments = useCallback((next: Appointment[]) => {
    setAppointments(next);
    write(KEYS.appointments, next);
  }, []);

  const persistReviews = useCallback((next: Review[]) => {
    setReviews(next);
    write(KEYS.reviews, next);
  }, []);

  const bookSession = useCallback(
    (input: BookingInput) => {
      if (!userId) return null;

      const appointment: Appointment = {
        id: createId('a'),
        clientId: userId,
        consultantId: input.consultantId,
        consultantName: input.consultantName,
        consultantAvatar: input.consultantAvatar,
        serviceId: input.service.id,
        serviceName: input.service.name,
        date: input.date,
        startTime: input.startTime,
        endTime: input.endTime,
        price: input.service.price,
        status: 'CONFIRMED',
        meetingType: input.meetingType,
        createdAt: new Date().toISOString(),
      };

      persistAppointments([...appointments, appointment]);
      return appointment;
    },
    [userId, appointments, persistAppointments],
  );

  const cancelAppointment = useCallback(
    (id: string) => {
      // Guard: only the owner can cancel.
      if (!userId) return;

      persistAppointments(
        appointments.map((appointment) =>
          appointment.id === id && appointment.clientId === userId
            ? { ...appointment, status: 'CANCELLED' as AppointmentStatus }
            : appointment,
        ),
      );
    },
    [userId, appointments, persistAppointments],
  );

  const rescheduleAppointment = useCallback(
    (id: string, date: string, startTime: string, endTime: string) => {
      const target = appointments.find((appointment) => appointment.id === id);
      if (!target || !userId || target.clientId !== userId) return false;
      if (target.date === date && target.startTime === startTime) return false;

      persistAppointments(
        appointments.map((appointment) =>
          appointment.id === id ? { ...appointment, date, startTime, endTime } : appointment,
        ),
      );
      return true;
    },
    [appointments, userId, persistAppointments],
  );

  const completeAppointment = useCallback(
    (id: string) => {
      const target = appointments.find((appointment) => appointment.id === id);
      // Ownership first, then `canComplete`: the helper is the single rule and
      // the button that offers this action reads it too, so the two cannot
      // disagree about which bookings are eligible.
      if (!target || !userId || target.clientId !== userId) return false;
      if (!canComplete(target)) return false;

      persistAppointments(
        appointments.map((appointment) =>
          appointment.id === id ? { ...appointment, status: 'COMPLETED' as AppointmentStatus } : appointment,
        ),
      );
      return true;
    },
    [appointments, userId, persistAppointments],
  );

  const addReview = useCallback(
    ({ consultantId, rating, body }: { consultantId: string; rating: number; body: string }) => {
      if (!user) return false;

      // The form is not the authority. Re-running the gate here means a review
      // cannot be written for a session that was cancelled or already reviewed
      // while the form was on screen.
      const gate = canReview(consultantId, user.id, appointments, reviews, new Date(), isPersistent);
      if (!gate.ok) return false;

      const review: Review = {
        id: createId('r'),
        consultantId,
        appointmentId: gate.appointmentId,
        clientId: user.id,
        // Never the account's full name — see `reviewerName`.
        authorName: reviewerName(user.name),
        rating,
        date: todayISO(),
        body: body.trim(),
      };

      persistReviews([...reviews, review]);
      return true;
    },
    [user, appointments, reviews, persistReviews],
  );

  const myAppointments = useMemo(() => {
    if (!userId) return [];
    return appointments
      .filter((appointment) => appointment.clientId === userId)
      .sort((a, b) => {
        const byDate = a.date.localeCompare(b.date);
        return byDate !== 0 ? byDate : a.startTime.localeCompare(b.startTime);
      });
  }, [appointments, userId]);

  const resetDemoData = useCallback(() => {
    clearAll();
    write(KEYS.appointments, seedAppointments);
    setAppointments(seedAppointments);
    // Reviews too: a reset demo has to land back on the honest empty state,
    // otherwise a review written before the reset would survive the data it
    // was written against.
    setReviews([]);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      appointments,
      reviews,
      isPersistent,
      bookSession,
      cancelAppointment,
      rescheduleAppointment,
      completeAppointment,
      addReview,
      myAppointments,
      resetDemoData,
    }),
    [
      appointments,
      reviews,
      bookSession,
      cancelAppointment,
      rescheduleAppointment,
      completeAppointment,
      addReview,
      myAppointments,
      resetDemoData,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside <AppProvider>');
  return context;
}

export { todayISO };