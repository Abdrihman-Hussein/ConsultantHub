/** Small pure helpers shared across pages. */

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

/** "in 3 days" / "today" / "2 days ago", for upcoming and past sessions. */
export function relativeDay(iso: string): string {
  const date = parseISODate(iso)
  if (!date) return ''

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)

  const days = Math.round((target.getTime() - startOfToday.getTime()) / 86_400_000)

  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days === -1) return 'Yesterday'
  if (days > 0) return `In ${days} days`
  return `${Math.abs(days)} days ago`
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

export function emailIsValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}
