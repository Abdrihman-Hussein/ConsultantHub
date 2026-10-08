import type { Consultant } from '../types';

/**
 * Identity-check coverage, stated the way the directory supports.
 *
 * The home page used to claim every consultant was verified and reviewed by the
 * people they had worked with. Neither survives contact with the seed: two of
 * the six consultants are unverified, and the only written reviews are the
 * three fabricated sample bodies per consultant. So the claim is generated from
 * the directory rather than written, which makes it incapable of overstating
 * the data — and checkable, because it lives here rather than in the page.
 */

/** How many of the given consultants carry a completed identity check. */
export function verifiedCount(consultants: Consultant[]): number {
  return consultants.filter((consultant) => consultant.verified).length;
}

/**
 * The coverage sentence shown beside the "reviewed before listing" guarantee.
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