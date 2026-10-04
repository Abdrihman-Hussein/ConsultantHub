import { hashPassword, createSalt } from './crypto';
import { createId } from './format';
import type { AuthResult, Session, User, UserRole } from '../types';

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
    return { result: { ok: false, error: 'Enter your full name.' }, users };
  }
  if (findByEmail(users, email)) {
    return { result: { ok: false, error: 'An account with that email already exists.' }, users };
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
    return { ok: false, error: 'That email and password combination is not recognised.' };
  }

  return { ok: true, session: toSession(user) };
}

/** Whether an email is already taken — used to warn while typing. */
export function emailTaken(users: User[], email: string): boolean {
  return Boolean(findByEmail(users, email));
}

export { toSession, findByEmail };
