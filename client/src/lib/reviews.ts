import type { Consultant, Review } from '../types';
import { translateEn } from '../i18n/strings';
import type { Translate } from '../i18n/strings';

/**
 * Presentation helpers for the reviews section.
 *
 * The seeded directory carries a realistic `reviewCount` per consultant but
 * only a few written reviews. Everything here exists to keep that gap visible
 * in the UI rather than papering over it.
 */

/**
 * The ` (12)` suffix for a review count, formatted once so the idiom cannot
 * drift. No component renders it any more — `Rating` has no count prop, because
 * a parenthesised figure beside five stars reads as a written-review count on
 * surfaces that show no reviews. It is retained as the single definition of
 * that format, and the logic checks pin its behaviour.
 */
export function reviewCountSuffix(count?: number): string {
  return count !== undefined && count > 0 ? ` (${count})` : '';
}

/** Mean rating of a set of reviews, or `null` when there are none. */
export function avgRating(reviews: Review[]): number | null {
  if (reviews.length === 0) return null;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return total / reviews.length;
}

/**
 * The line under the reviews stating how many of the real total are shown.
 *
 * Three distinct cases, because collapsing them would each mislead: no reviews
 * at all, a total with nothing seeded, and the normal case.
 *
 * `sample.length` and `consultant.reviewCount` are passed through as parameters
 * rather than written into the sentence, so the Somali wording cannot drift
 * into reporting the sample as the total — the exact failure the checks below
 * exist to catch. Both figures are interpolated in whatever word order the
 * chosen language needs.
 */
export function reviewsSummary(
  consultant: Consultant,
  sample: Review[],
  t: Translate = translateEn,
): string {
  if (consultant.reviewCount === 0) return t('reviews.summary.none');
  if (sample.length === 0) return t('reviews.summary.unshown');
  return t('reviews.summary.showing', {
    count: sample.length,
    total: consultant.reviewCount,
  });
}