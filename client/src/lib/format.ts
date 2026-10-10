/** Small pure helpers shared across pages. */

import { translateEn } from '../i18n/strings';
import type { MessageKey, Translate } from '../i18n/strings';

/** Collision-resistant enough for local demo ids. */
export function createId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 10)
  return `${prefix}_${Date.now().toString(36)}${random}`
}

/** Today's date as `YYYY-MM-DD` in the user's local timezone. */
export function todayISO(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

/**
 * Parses `YYYY-MM-DD` as a *local* date. `new Date('2026-10-24')` parses as UTC
 * and can render as the previous day in negative-offset timezones.
 */
export function parseISODate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) return null
  const [, year, month, day] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(iso: string): string {
  const date = parseISODate(iso)
  if (!date) return iso
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateShort(iso: string): string {
  const date = parseISODate(iso)
  if (!date) return iso
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

/**
 * "in 3 days" / "today" / "2 days ago", for upcoming and past sessions.
 *
 * The offset is computed here and only the words come from `t`, so the day
 * maths stays in one place. `days` is passed as a parameter rather than being
 * spliced into the sentence, which is what lets the Somali wording put the
 * number first without changing what the number is.
 */
export function relativeDay(iso: string, t: Translate = translateEn): string {
  const date = parseISODate(iso)
  if (!date) return ''

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)

  const days = Math.round((target.getTime() - startOfToday.getTime()) / 86_400_000)

  if (days === 0) return t('time.today')
  if (days === 1) return t('time.tomorrow')
  if (days === -1) return t('time.yesterday')
  if (days > 0) return t('time.in_days', { days })
  return t('time.days_ago', { days: Math.abs(days) })
}

/** Adds minutes to a `HH:MM` string, returning `HH:MM`. */
export function addMinutes(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number)
  const total = hours * 60 + mins + minutes
  const nextHours = Math.floor(total / 60) % 24
  const nextMins = total % 60
  return `${String(nextHours).padStart(2, '0')}:${String(nextMins).padStart(2, '0')}`
}

/** `150` → `$150`, `1250` → `$1,250`. */
export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`
}

/** Two-letter monogram for avatar fallbacks. */
export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/** Tailwind `md` breakpoint in px — the width at which the desktop layout starts. */
export const mdBreakpointPx = 768;

/** True when the viewport is at or above the `md` breakpoint. */
export function isMdUp(viewportWidth: number): boolean {
  return viewportWidth >= mdBreakpointPx;
}

export function countLabel(count: number, singular: string, plural?: string): string {
  const word = count === 1 ? singular : (plural ?? `${singular}s`);
  return `${count} ${word}`;
}

/**
 * A count rendered in the active language.
 *
 * English appends an `s`; Somali does not, and a numeral takes the noun in its
 * singular attributive form either way (`6 la-talin`). So both forms are
 * supplied and the language picks — rather than this function guessing, which is
 * what `countLabel` does and what makes it English-only.
 *
 * Deliberately separate from `countLabel`: that function's plural rule is
 * asserted by the logic checks, and its behaviour is unchanged.
 */
export function countLabelLocalized(
  count: number,
  t: Translate,
  singularKey: MessageKey,
  pluralKey: MessageKey,
): string {
  const word = count === 1 ? t(singularKey) : t(pluralKey);
  return `${count} ${word}`;
}
