/**
 * Persistence helpers backed by localStorage.
 *
 * Everything in this app is client-side. Reads are defensive: a missing key, a
 * corrupt value, or storage being unavailable (private browsing, disabled
 * cookies) all fall back rather than crashing the render.
 */

const PREFIX = 'consultanthub:'

export const KEYS = {
  users: `${PREFIX}users`,
  session: `${PREFIX}session`,
  appointments: `${PREFIX}appointments`,
  /**
   * Written reviews. Deliberately seeded empty — a review can only be created
   * against a completed session (see `canReview`), so there is no honest seed
   * content for this key. The fictional sample in `data/index.ts` is not
   * written here, which is why every consultant shows no reviews on first run.
   */
  reviews: `${PREFIX}reviews`,
} as const

function available() {
  try {
    const probe = `${PREFIX}__probe`
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

const hasStorage = typeof window !== 'undefined' && available()

/**
 * In-memory stand-in used when localStorage is unavailable, so the app still
 * works for the length of the session instead of throwing.
 */
const memory = new Map<string, string>()

export function read<T>(key: string, fallback: T): T {
  try {
    const raw = hasStorage ? window.localStorage.getItem(key) : (memory.get(key) ?? null)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function write(key: string, value: unknown): void {
  try {
    const raw = JSON.stringify(value)
    if (hasStorage) window.localStorage.setItem(key, raw)
    else memory.set(key, raw)
  } catch {
    // Quota exceeded or storage disabled — non-fatal, the session continues
    // with in-memory state only.
  }
}

export function remove(key: string): void {
  try {
    if (hasStorage) window.localStorage.removeItem(key)
    else memory.delete(key)
  } catch {
    // Ignore.
  }
}

/** Wipes every key this app owns. Used by the "reset demo data" control. */
export function clearAll(): void {
  Object.values(KEYS).forEach(remove)
}

/** True when data survives a reload — false means in-memory only. */
export const isPersistent = hasStorage
