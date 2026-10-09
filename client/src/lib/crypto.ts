import type { MessageKey } from '../i18n/strings'

/**
 * Password hashing for the local demo accounts.
 *
 * This is SHA-256 via WebCrypto. That is enough to avoid writing plaintext
 * passwords into localStorage, and it is genuinely NOT how you authenticate a
 * real application: a fast hash is trivially brute-forced, and the whole scheme
 * is client-side, so anyone can read or alter it from devtools. A real backend
 * would use bcrypt/argon2 with a per-user salt and a server-held secret.
 */

/** Salted SHA-256. Falls back to a plain digest if WebCrypto is unavailable. */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const input = `${salt}:${password}`

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const bytes = new TextEncoder().encode(input)
    const digest = await crypto.subtle.digest('SHA-256', bytes)
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('')
  }

  // Deterministic fallback so the demo still works over plain http.
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return `fallback${Math.abs(hash)}`
}

export function createSalt(): string {
  const bytes = new Uint8Array(16)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256)
    }
  }
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Rough password strength check, used to drive the meter on the register form.
 *
 * Returns the score and the dictionary key for its label, not the label: these
 * were English literals, so the meter read "Weak" on a Somali form. Scoring
 * stays here; naming the result belongs to the dictionary.
 */
export function scorePassword(password: string): {
  score: 0 | 1 | 2 | 3 | 4
  labelKey: MessageKey
} {
  if (!password) return { score: 0, labelKey: 'strength.empty' }

  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1
  if (/\d/.test(password) && /[^\w\s]/.test(password)) score += 1

  const keys: MessageKey[] = [
    'strength.too_short',
    'strength.weak',
    'strength.fair',
    'strength.good',
    'strength.strong',
  ]
  const scoreClamped = Math.min(score, 4) as 0 | 1 | 2 | 3 | 4
  return { score: scoreClamped, labelKey: keys[scoreClamped] }
}
