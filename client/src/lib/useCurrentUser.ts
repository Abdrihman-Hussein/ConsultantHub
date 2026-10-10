import { useCallback } from 'react'
import { useUser } from '@clerk/react'
import type { UserRole } from '../types'

/**
 * The signed-in user, in the shape the rest of the app already expects.
 *
 * `id` is Clerk's `user.id`, a string, so it drops straight into
 * `Appointment.clientId` and `Review.clientId` without changing those types or
 * anything that reads them. `name` is what `reviewerName` abbreviates — it is
 * never published whole.
 *
 * There is no localStorage copy of any of this. The old context kept a
 * `Session` object it wrote to `consultanthub:session`; that key is gone and so
 * is the module that minted it. Clerk owns identity, this hook is the one place
 * the app reads it.
 */

/** The Clerk fields this app is allowed to name someone by. */
export interface CurrentUser {
  id: string;
  name: string;
}

/**
 * The best available display name, or `''` when the account has none.
 *
 * Prefers `fullName`, then the two name parts assembled by hand — Clerk leaves
 * `fullName` null when only one of the two is set. Deliberately does NOT fall
 * back to the email address: `reviewerName` output is published next to a
 * review, and an address is not a name. A Clerk instance with name fields
 * disabled will therefore publish an empty reviewer label, which is visible
 * rather than misleading.
 */
export function fullNameOf(user: {
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
}): string {
  if (user.fullName && user.fullName.trim()) return user.fullName.trim();
  const joined = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  if (joined) return joined;
  return user.username?.trim() ?? '';
}

/** `null` while Clerk is still loading, and `null` when nobody is signed in. */
export function useCurrentUser(): CurrentUser | null {
  const { user } = useUser();

  if (!user) return null;

  return { id: user.id, name: fullNameOf(user) };
}

function roleOf(user: { publicMetadata: unknown; unsafeMetadata: unknown }): UserRole {
  const read = (metadata: unknown): string | undefined => {
    if (typeof metadata !== 'object' || metadata === null) return undefined;
    const role = (metadata as { role?: unknown }).role;
    return typeof role === 'string' ? role : undefined;
  };

  const role = read(user.publicMetadata) ?? read(user.unsafeMetadata);
  return role === 'CONSULTANT' || role === 'ADMIN' ? role : 'CLIENT';
}

/**
 * The consultant/client switch, now backed by Clerk's user metadata.
 *
 * Clerk has no notion of a role: there is no `role` field on the user, and no
 * client-side API that sets one. What exists is metadata, and of the two kinds
 * only `unsafeMetadata` is writable from the browser — `publicMetadata` and
 * `privateMetadata` come from the Backend API. So this reads
 * `publicMetadata.role` when a server has set it and falls back to
 * `unsafeMetadata.role`, which is what the button below writes.
 *
 * That fallback is the honest limit of a frontend-only migration: a user can
 * edit their own `unsafeMetadata`, so a role read from it is a display
 * preference, not an authorisation. See the migration report — anything that
 * has to *enforce* the consultant role needs a server and `publicMetadata`.
 */
export function useConsultantRole(): {
  /** `null` when nobody is signed in. */
  role: UserRole | null;
  isConsultant: boolean;
  /** Writes the role to `unsafeMetadata`; resolves false when signed out. */
  enableConsultantRole: () => Promise<boolean>;
} {
  const { user } = useUser();
  const role = user ? roleOf(user) : null;

  const enableConsultantRole = useCallback(async () => {
    if (!user) return false;
    await user.updateMetadata({ unsafeMetadata: { role: 'CONSULTANT' } });
    return true;
  }, [user]);

  return { role, isConsultant: role === 'CONSULTANT', enableConsultantRole };
}