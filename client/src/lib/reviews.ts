import type { Appointment, Consultant, Review } from '../types';
import type { Translate } from '../i18n/strings';

/**
 * The review rules, kept out of React so the gate can be reasoned about — and
 * checked — on its own.
 *
 * A review is earned, not offered: a client may only review a consultant they
 * have actually finished a session with, and only once per session. Everything
 * displayed about a consultant's standing is then computed from the reviews
 * that exist. There is no seeded `rating` and no seeded `reviewCount` left to
 * fall back on, so an un-reviewed consultant reads as un-reviewed.
 */

/** Why the review form is not available. Rendered as a dictionary key. */
export type ReviewBlockReason =
  | 'not_signed_in'
  | 'no_completed_booking'
  | 'already_reviewed'
  | 'storage_unavailable';

export type ReviewGate =
  | { ok: true; appointmentId: string }
  | { ok: false; reason: ReviewBlockReason };

/**
 * Whether this client may review this consultant right now, and which session
 * the review is for.
 *
 * The session it returns is the earliest completed one that has not been
 * reviewed yet, so booking three sessions earns three reviews — uniqueness is
 * per appointment, never per consultant.
 *
 * `now` is accepted so the gate and `canComplete` read alike, but no date test
 * is applied here: once an appointment is `COMPLETED` it stays reviewable, and
 * gating on the clock would quietly expire a review the client is entitled to
 * write. `storageAvailable` is last so the four-argument form in the checks
 * stays the whole contract; a review that cannot survive a reload is not
 * offered at all rather than accepted and lost.
 */
export function canReview(
  consultantId: string,
  clientId: string | null,
  appointments: Appointment[],
  reviews: Review[],
  now: Date = new Date(),
  storageAvailable = true,
): ReviewGate {
  void now;

  if (!clientId) return { ok: false, reason: 'not_signed_in' };

  const reviewable = appointments
    .filter(
      (appointment) =>
        appointment.clientId === clientId &&
        appointment.consultantId === consultantId &&
        appointment.status === 'COMPLETED',
    )
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));

  const unreviewed = reviewable.find(
    (appointment) => !reviews.some((review) => review.appointmentId === appointment.id),
  );

  if (!unreviewed) {
    return {
      ok: false,
      reason: reviewable.length > 0 ? 'already_reviewed' : 'no_completed_booking',
    };
  }

  if (!storageAvailable) return { ok: false, reason: 'storage_unavailable' };

  return { ok: true, appointmentId: unreviewed.id };
}

/** A consultant's reviews, newest first. Never another consultant's. */
export function reviewsFor(consultantId: string, reviews: Review[]): Review[] {
  return reviews
    .filter((review) => review.consultantId === consultantId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * A consultant's average rating, or `null` when nobody has reviewed them.
 *
 * `null` is the honest answer and is rendered as such — it is not smoothed to
 * a neutral score or backfilled from the directory, because a star rating with
 * no reviews behind it is a claim the data cannot support.
 */
export function ratingFor(consultant: Consultant, reviews: Review[]): number | null {
  return avgRating(reviewsFor(consultant.id, reviews));
}

/** Mean rating of a set of reviews, or `null` when there are none. */
export function avgRating(reviews: Review[]): number | null {
  if (reviews.length === 0) return null;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return total / reviews.length;
}

/**
 * The name a review is published under: a first name and a last initial.
 *
 * A written review is attached to a real account, so the reader is entitled to
 * something that distinguishes them — but not to a full name on a profile they
 * can open by guessing. Single-word names get no invented initial, because a
 * trailing full stop is not an initial.
 */
export function reviewerName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
}

/**
 * The line under the reviews, from the reviews themselves.
 *
 * The count is interpolated as a parameter rather than written into the
 * sentence, so the Somali wording cannot drift into reporting a sample as a
 * total. There is no separate "total" to qualify any more: every review that
 * exists is shown, so the one thing this line must not do is imply a larger
 * figure that the app cannot show.
 */
export function reviewsSummary(sample: Review[], t: Translate): string {
  if (sample.length === 0) return t('reviews.summary.none');
  return t('reviews.summary.showing', { count: sample.length });
}