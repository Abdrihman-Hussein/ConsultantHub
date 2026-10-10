/**
 * Types shared across the app. `lib` holds the interfaces, `data` holds the
 * seed content that gets copied into localStorage on first run.
 */

/** Roles a user can hold. Drives which flows are available to them. */
export type UserRole = 'CLIENT' | 'CONSULTANT' | 'ADMIN';

/**
 * A stored user record. `passwordHash` is only ever a SHA-256 digest — see
 * `lib/crypto.ts`. This is NOT real authentication: everything is client-side
 * and readable by anyone with devtools. See README.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  passwordHash: string;
  /** ISO timestamp, used to sort and to show "member since". */
  createdAt: string;
}

/** The signed-in user, without the password digest. */
export interface Session {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

/**
 * A listed consultant.
 *
 * There is deliberately no `rating` and no `reviewCount` here. Both used to be
 * seeded numbers that nothing in the app could substantiate, and every figure
 * shown beside a name is now computed from the reviews that actually exist —
 * see `ratingFor` in `lib/reviews.ts`. Until a consultant has been reviewed by
 * someone who booked and completed a session with them, they have no rating,
 * and the UI says so rather than showing a default.
 */
export interface Consultant {
  id: string;
  userId: string;
  name: string;
  title: string;
  specialization: string;
  bio: string;
  hourlyRate: number;
  location: string;
  experience: string;
  avatar: string;
  verified: boolean;
  sessions: number;
  responseTime: string;
}

export interface Service {
  id: string;
  consultantId: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  isFree: boolean;
}

/**
 * A written review.
 *
 * A review can only be created through the gate in `lib/reviews.ts`: the client
 * must have a `COMPLETED` appointment with that consultant, and
 * `appointmentId` records which one it was for. Uniqueness is per appointment,
 * so booking three sessions earns three reviews rather than locking a
 * consultant out after the first.
 *
 * `appointmentId` and `clientId` are absent only on the sample content in
 * `data/index.ts`, which is fictional and is not rendered anywhere. Real
 * reviews always carry both.
 */
export interface Review {
  id: string;
  consultantId: string;
  /** The completed session this review is for. Set on every earned review. */
  appointmentId?: string;
  /** The reviewer, as a first name and last initial — never the full name. */
  clientId?: string;
  authorName: string;
  rating: number;
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  body: string;
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export type MeetingType = 'video' | 'in-person';

/**
 * A booked session. Consultant name/avatar and price are snapshotted at booking
 * time so the record still reads correctly if the directory later changes.
 */
export interface Appointment {
  id: string;
  clientId: string;
  consultantId: string;
  consultantName: string;
  consultantAvatar: string;
  serviceId: string;
  serviceName: string;
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  startTime: string;
  endTime: string;
  /** Price charged, snapshotted so totals stay accurate. */
  price: number;
  status: AppointmentStatus;
  meetingType: MeetingType;
  location?: string;
  createdAt: string;
}

import type { MessageKey } from '../i18n/strings';

/**
 * Result of an auth attempt, so forms can show a specific message.
 *
 * `error` is a dictionary key rather than a sentence — see `lib/auth.ts`. The
 * form renders it through the active language, so an error never arrives
 * pre-written in the wrong language. Typing it as `MessageKey` means a
 * misspelled key is a compile error rather than a blank error message.
 */
export type AuthResult =
  | { ok: true; session: Session }
  | { ok: false; error: { key: MessageKey } };
