import type { Consultant } from '../types';

/**
 * Ordering and copy-extraction for the featured consultant in the home hero.
 * Kept out of the component so the rotation maths and the sentence extraction
 * can be reasoned about — and checked — independently of React.
 */

/**
 * A period that does NOT end a sentence: `4.9` (decimal) or `U.S.` (initial).
 * Without this guard the hero would truncate every bio at its first number.
 */
function isSentenceEnd(text: string, index: number): boolean {
  const char = text[index];
  if (char !== '.' && char !== '!' && char !== '?') return false;

  // A digit on either side means a decimal point, not a full stop.
  const before = text[index - 1];
  const after = text[index + 1];
  if (before && after && /\d/.test(before) && /\d/.test(after)) return false;

  // A single uppercase letter before the period is an initial (U.S., e.g.).
  if (before && /[A-Z]/.test(before)) {
    const beforeBefore = text[index - 2];
    if (!beforeBefore || !/[a-z]/.test(beforeBefore)) return false;
  }

  return true;
}

/**
 * The first sentence of a bio, verbatim, for display in the hero.
 *
 * The spec requires this to be extracted rather than written: putting quote
 * marks around composed marketing copy would read as something the consultant
 * said, which none of them did. Falls back when the bio is blank.
 */
export function bioLine(bio: string, fallback: string): string {
  const trimmed = bio.trim();
  if (!trimmed) return fallback;

  for (let i = 0; i < trimmed.length; i += 1) {
    if (isSentenceEnd(trimmed, i)) return trimmed.slice(0, i + 1).trim();
  }

  return trimmed;
}

/**
 * Featured order: rating first, then session volume as the tiebreak. Omar Nur
 * leads on 5.0. Returns a new array — the caller passes the seed directory
 * directly and must not see it reordered.
 */
export function featuredOrder(consultants: Consultant[]): Consultant[] {
  return [...consultants].sort(
    (a, b) => b.rating - a.rating || b.sessions - a.sessions,
  );
}

export function rowConsultants(order: Consultant[], excludeId: string, count: number): Consultant[] {
  return order.filter((consultant) => consultant.id !== excludeId).slice(0, count);
}

/**
 * The next rotation index. Stays put when there is nothing to rotate to, so a
 * one-consultant directory does not loop and an empty one does not divide by
 * zero.
 */
export function nextIndex(current: number, total: number): number {
  if (total <= 1) return current;
  return (current + 1) % total;
}