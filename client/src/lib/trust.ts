import type { Consultant } from '../types';

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
 */
export function identityCheckSentence(consultants: Consultant[]): string {
  const total = consultants.length;

  if (total === 0) return 'No consultants are listed yet.';

  const verified = verifiedCount(consultants);
  if (verified === total) return `All ${total} listed have completed an identity check.`;

  return `${verified} of the ${total} listed have completed an identity check.`;
}
