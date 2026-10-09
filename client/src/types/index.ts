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

export interface Consultant {
  id: string;
  userId: string;
  name: string;
  title: string;
  specialization: string;
  bio: string;
  rating: number;
  reviewCount: number;
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
 * A written client review.
 *
 * Sample content for the MVP, like the rest of the directory: these people are
 * fictional. Only a handful are seeded per consultant, so
 * `Consultant.reviewCount` remains the true aggregate and the UI states how
 * many of the total it is actually showing. Never render a seeded review
 * without that framing.
 */
export interface Review {
  id: string;
  consultantId: string;
  /** Fictional client name. */
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
