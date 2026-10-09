import { hashPassword, createSalt } from './crypto';
import { createId } from './format';
import type { AuthResult, Session, User, UserRole } from '../types';
import type { MessageKey } from '../i18n/strings';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

/**
 * A failure reason, as a dictionary key rather than a sentence.
 *
 * These strings used to be English literals baked into the module, which meant
 * a Somali user saw an English error on a Somali form. Returning a key keeps
 * the wording in one place and lets the calling component render it in the
 * active language — and because the keys are `MessageKey`, a rename cannot
 * leave a dangling reference behind.
 */
/**
 * The keys this module can produce. Narrower than `MessageKey` on purpose: a
 * typo in one of these literals is a compile error here rather than a key that
 * resolves to nothing at runtime.
 */
export type AuthErrorKey = Extract<
  MessageKey,
  `auth.${string}` | 'register.error_name' | 'register.error_email_exists'
>;

/**
 * What the functions below actually return — the full `MessageKey` union, since
 * `AuthResult.error` carries `MessageKey`. The `AuthErrorKey` literals above
 * are what keeps the *construction* sites honest.
 */
export interface AuthFailure {
  key: MessageKey;
}

/**
 * Local account store.
 *
 * Real auth belongs on a server: passwords hashed with a slow KDF, sessions
 * issued as signed httpOnly cookies, authorisation enforced per request. This
 * module is the client-side stand-in so the flows are demonstrable end to end.
 * It is intentionally small and synchronous once hashed.
 */

function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

function findByEmail(users: User[], email: string): User | undefined {
  const target = normaliseEmail(email);
  return users.find((user) => user.email === target);
}

function toSession(user: User): Session {
  return { userId: user.id, email: user.email, name: user.name, role: user.role };
}

/**
 * Builds a failure. Typed to `AuthErrorKey`, so every key this module can emit
 * is checked against the dictionary at the call site.
 */
function fail(key: AuthErrorKey): { ok: false; error: { key: MessageKey } } {
  return { ok: false, error: { key } };
}

/**
 * Creates an account. Returns a session so the caller can sign in directly.
 *
 * Registration is deliberately role-free: everyone signs up the same way and
 * starts as a client. Offering services is a separate switch afterwards — see
 * `enableConsultantRole` and the `/become-a-consultant` page. ADMIN is never
 * assignable from signup.
 */
export async function register(
  users: User[],
  input: RegisterInput,
): Promise<{ result: AuthResult; users: User[] }> {
  const email = normaliseEmail(input.email);
  const name = input.name.trim();

  if (name.length < 2) {
    return { result: fail('register.error_name'), users };
  }
  if (findByEmail(users, email)) {
    return { result: fail('register.error_email_exists'), users };
  }

  const salt = createSalt();
  const passwordHash = await hashPassword(input.password, salt);

  const user: User = {
    id: createId('u'),
    name,
    email,
    role: 'CLIENT',
    avatar: undefined,
    passwordHash: `${salt}:${passwordHash}`,
    createdAt: new Date().toISOString(),
  };

  return { result: { ok: true, session: toSession(user) }, users: [...users, user] };
}

/**
 * Switches an existing account to the consultant role.
 *
 * This is the independent "offer my services" switch. It only ever adds the
 * role, so someone who was also booking sessions keeps their client history.
 */
export function enableConsultantRole(users: User[], userId: string): User[] {
  return users.map((user) =>
    user.id === userId ? { ...user, role: 'CONSULTANT' as UserRole } : user,
  );
}

/** Verifies credentials and returns a session. */
export async function login(
  users: User[],
  input: LoginInput,
): Promise<AuthResult> {
  const user = findByEmail(users, input.email);

  // Hash regardless of whether the user exists so the timing does not reveal
  // which emails are registered.
  const salt = user ? user.passwordHash.split(':')[0] : 'unknown-salt';
  const candidate = await hashPassword(input.password, salt);

  if (!user || user.passwordHash !== `${salt}:${candidate}`) {
    return fail('auth.invalid_credentials');
  }

  return { ok: true, session: toSession(user) };
}

/** Whether an email is already taken — used to warn while typing. */
export function emailTaken(users: User[], email: string): boolean {
  return Boolean(findByEmail(users, email));
}

export { toSession, findByEmail };
