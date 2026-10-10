import type { Consultant } from '../types';
import { translateEn } from '../i18n/strings';
import type { Translate } from '../i18n/strings';

/**
 * Identity-check coverage, stated the way the directory supports.
 *
 * The pages used to claim every consultant was verified, and then that every
 * consultant had been "reviewed before they are listed". Neither survives
 * contact with the seed: two of the six consultants are unverified, and no
 * field on a Consultant records a review at all, so listing someone says
 * nothing about a review process having happened. Only the one measurable
 * claim is left — how many of the listed have completed an identity check —
 * and it is generated from the directory rather than written, which makes it
 * incapable of overstating the data, and checkable, because it lives here
 * rather than in the pages.
 */

/** How many of the given consultants carry a completed identity check. */
export function verifiedCount(consultants: Consultant[]): number {
  return consultants.filter((consultant) => consultant.verified).length;
}

/**
 * The coverage sentence shown in place of the old review guarantee.
 *
 * Reports a shortfall as a shortfall. It never rounds up to "everyone", never
 * implies the remainder are mid-check (nothing in the data says that), and
 * prints no figures at all for an empty directory.
 *
 * `t` is the only thing that varies: the branching, the figures, and the claim
 * are identical in every language, so a translation can restate the number but
 * cannot change what is being claimed about it. It defaults to English, which
 * is what the logic checks assert against.
 */
export function identityCheckSentence(
  consultants: Consultant[],
  t: Translate = translateEn,
): string {
  const total = consultants.length;

  if (total === 0) return t('trust.none');

  const verified = verifiedCount(consultants);
  if (verified === total) return t('trust.all', { total });

  return t('trust.partial', { verified, total });
}
