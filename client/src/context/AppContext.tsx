import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { KEYS, read, write, remove, clearAll, isPersistent } from '../lib/storage';
import { login as loginUser, register as registerUser, enableConsultantRole } from '../lib/auth';
import type { AuthFailure, LoginInput, RegisterInput } from '../lib/auth';
import { createId, todayISO } from '../lib/format';
import { canComplete } from '../lib/booking';
import { canReview, reviewerName } from '../lib/reviews';
import { seedAppointments, seedUsers } from '../data/seed';
import type {
  Appointment,
  AppointmentStatus,
  MeetingType,
  Review,
  Service,
  Session,
  User,
} from '../types';

/**
 * Application state: accounts, the signed-in session, and bookings.
 *
 * State lives in localStorage so the app behaves like a real one across
 * reloads. This is a stand-in for a backend — see README for what a real
 * implementation would move server-side.
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
  users: User[];
  session: Session | null;
  appointments: Appointment[];
  isPersistent: boolean;

  /**
   * `null` on success, or the failure key from `lib/auth` — a dictionary key,
   * not a sentence, so the caller renders it in the active language.
   */
  register: (input: RegisterInput) => Promise<AuthFailure | null>;
  login: (input: LoginInput) => Promise<AuthFailure | null>;
  logout: () => void;

  /**
   * Independent switch for offering services. Registration never asks about it —
   * anyone can add the consultant role later without losing their bookings.
   * Returns false when nobody is signed in.
   */
  becomeConsultant: () => boolean;

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

/** Seeds demo data the first time the app runs. */
function initialUsers(): User[] {
  const stored = read<User[]>(KEYS.users, []);
  if (stored.length > 0) return stored;
  write(KEYS.users, seedUsers);
  return seedUsers;
}

function initialAppointments(): Appointment[] {
  const stored = read<Appointment[]>(KEYS.appointments, []);
  if (stored.length > 0) return stored;
  write(KEYS.appointments, seedAppointments);
  return seedAppointments;
}

/**
 * Reads the stored reviews, writing an empty list on first run.
 *
 * Unlike users and appointments this has no seed: every review in here was
 * written by a real client against a completed session, and inventing some
 * would be exactly the thing the review gate exists to prevent.
 */
function initialReviews(): Review[] {
  return read<Review[]>(KEYS.reviews, []);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [session, setSession] = useState<Session | null>(() =>
    read<Session | null>(KEYS.session, null),
  );
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const persistUsers = useCallback((next: User[]) => {
    setUsers(next);
    write(KEYS.users, next);
  }, []);

  const persistAppointments = useCallback((next: Appointment[]) => {
    setAppointments(next);
    write(KEYS.appointments, next);
  }, []);

  const persistReviews = useCallback((next: Review[]) => {
    setReviews(next);
    write(KEYS.reviews, next);
  }, []);

  const register = useCallback(
    async (input: RegisterInput) => {
      const { result, users: nextUsers } = await registerUser(users, input);
      if (!result.ok) return result.error;

      persistUsers(nextUsers);
      write(KEYS.session, result.session);
      setSession(result.session);
      return null;
    },
    [users, persistUsers],
  );

  const login = useCallback(
    async (input: LoginInput) => {
      const result = await loginUser(users, input);
      if (!result.ok) return result.error;

      write(KEYS.session, result.session);
      setSession(result.session);
      return null;
    },
    [users],
  );

  const logout = useCallback(() => {
    remove(KEYS.session);
    setSession(null);
  }, []);

  const becomeConsultant = useCallback(() => {
    if (!session) return false;

    persistUsers(enableConsultantRole(users, session.userId));

    const nextSession: Session = { ...session, role: 'CONSULTANT' };
    write(KEYS.session, nextSession);
    setSession(nextSession);
    return true;
  }, [session, users, persistUsers]);

  const bookSession = useCallback(
    (input: BookingInput) => {
      if (!session) return null;

      const appointment: Appointment = {
        id: createId('a'),
        clientId: session.userId,
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
    [session, appointments, persistAppointments],
  );

  const cancelAppointment = useCallback(
    (id: string) => {
      // Guard: only the owner can cancel.
      if (!session) return;

      persistAppointments(
        appointments.map((appointment) =>
          appointment.id === id && appointment.clientId === session.userId
            ? { ...appointment, status: 'CANCELLED' as AppointmentStatus }
            : appointment,
        ),
      );
    },
    [session, appointments, persistAppointments],
  );

  const rescheduleAppointment = useCallback(
    (id: string, date: string, startTime: string, endTime: string) => {
      const target = appointments.find((appointment) => appointment.id === id);
      if (!target || !session || target.clientId !== session.userId) return false;
      if (target.date === date && target.startTime === startTime) return false;

      persistAppointments(
        appointments.map((appointment) =>
          appointment.id === id ? { ...appointment, date, startTime, endTime } : appointment,
        ),
      );
      return true;
    },
    [appointments, session, persistAppointments],
  );

  const completeAppointment = useCallback(
    (id: string) => {
      const target = appointments.find((appointment) => appointment.id === id);
      // Ownership first, then `canComplete`: the helper is the single rule and
      // the button that offers this action reads it too, so the two cannot
      // disagree about which bookings are eligible.
      if (!target || !session || target.clientId !== session.userId) return false;
      if (!canComplete(target)) return false;

      persistAppointments(
        appointments.map((appointment) =>
          appointment.id === id ? { ...appointment, status: 'COMPLETED' as AppointmentStatus } : appointment,
        ),
      );
      return true;
    },
    [appointments, session, persistAppointments],
  );

  const addReview = useCallback(
    ({ consultantId, rating, body }: { consultantId: string; rating: number; body: string }) => {
      if (!session) return false;

      // The form is not the authority. Re-running the gate here means a review
      // cannot be written for a session that was cancelled or already reviewed
      // while the form was on screen.
      const gate = canReview(consultantId, session.userId, appointments, reviews, new Date(), isPersistent);
      if (!gate.ok) return false;

      const review: Review = {
        id: createId('r'),
        consultantId,
        appointmentId: gate.appointmentId,
        clientId: session.userId,
        // Never the account's full name — see `reviewerName`.
        authorName: reviewerName(session.name),
        rating,
        date: todayISO(),
        body: body.trim(),
      };

      persistReviews([...reviews, review]);
      return true;
    },
    [session, appointments, reviews, persistReviews],
  );

  const myAppointments = useMemo(() => {
    if (!session) return [];
    return appointments
      .filter((appointment) => appointment.clientId === session.userId)
      .sort((a, b) => {
        const byDate = a.date.localeCompare(b.date);
        return byDate !== 0 ? byDate : a.startTime.localeCompare(b.startTime);
      });
  }, [appointments, session]);

  const resetDemoData = useCallback(() => {
    clearAll();
    write(KEYS.users, seedUsers);
    write(KEYS.appointments, seedAppointments);
    remove(KEYS.session);
    setUsers(seedUsers);
    setAppointments(seedAppointments);
    setSession(null);
    // Reviews too: a reset demo has to land back on the honest empty state,
    // otherwise a review written before the reset would survive the data it
    // was written against.
    setReviews([]);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      users,
      session,
      appointments,
      reviews,
      isPersistent,
      register,
      login,
      logout,
      becomeConsultant,
      bookSession,
      cancelAppointment,
      rescheduleAppointment,
      completeAppointment,
      addReview,
      myAppointments,
      resetDemoData,
    }),
    [
      users,
      session,
      appointments,
      reviews,
      register,
      login,
      logout,
      becomeConsultant,
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

/** Convenience hook for pages that only care about the signed-in user. */
export function useSession() {
  return useApp().session;
}

export { todayISO };
