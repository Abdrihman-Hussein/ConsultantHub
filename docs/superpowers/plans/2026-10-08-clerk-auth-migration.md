# Clerk Auth Migration Plan

**Date:** 2026-10-08
**Status:** Draft — needs your approval before any code changes
**Decision locked with you:** Clerk (free plan) for authentication, Supabase as the database only.

---

## 1. Why this needs a plan

`npx clerk init` is not a drop-in here. Three things make it more than a config change:

1. **Auth is not a separate module.** `AppContext.tsx` (227 lines) owns identity *and* booking state
   together. Six files consume it: `RequireAuth.tsx`, `ConsultantProfile.tsx`, `Consultants.tsx`,
   `Login.tsx`, `Register.tsx`, and itself. Replacing auth means splitting this, not overwriting it.
2. **Password hashes are not portable.** Every stored user has a `passwordHash` produced by
   `lib/crypto.ts` (SHA-256 + per-user salt). Clerk uses bcrypt/scrypt. Clerk's migration guide is
   explicit that hashes must be compatible. **Every existing demo account stops working.** For
   frontend-only demo data this costs nothing — there is no real user to lose. It only becomes a
   problem once real accounts exist.
3. **User IDs change shape.** `Consultant.userId`, `Appointment.clientId`, and `Session.userId` all
   point at localStorage IDs like `u1`/`c1`. They will point at Clerk IDs (`user_2abc…`). Every row
   that joins on those needs migrating.

---

## 2. Current state (verified by inspection)

| File | Lines | Role | Fate |
| --- | --- | --- | --- |
| `lib/auth.ts` | 94 | `register`, `login`, `emailTaken`, `enableConsultantRole` | **Delete** |
| `lib/crypto.ts` | 52 | `hashPassword`, `createSalt`, `scorePassword` | **Delete** |
| `lib/storage.ts` | 62 | localStorage read/write, `KEYS`, `isPersistent` | **Keep, minus user keys** |
| `context/AppContext.tsx` | 227 | identity + appointments + booking | **Split** |
| `components/RequireAuth.tsx` | 14 | route guard | **Rewrite** on Clerk |
| `pages/Login.tsx` | 109 | sign-in form | **Rewrite** on Clerk |
| `pages/Register.tsx` | 139 | sign-up form | **Rewrite** on Clerk |
| `main.tsx` | 18 | entry | **Wrap in `ClerkProvider`** |

`scorePassword` is worth keeping as client-side UX feedback on the register form, if you want it —
Clerk can take a password and we never see it.

---

## 3. Target architecture

**Clerk owns identity.** Session, sign-in, sign-up, sign-out, verification. Never store a
`passwordHash` locally again.

**Supabase owns data.** `consultants`, `services`, `reviews`, `appointments`. Reached through
`lib/supabase.ts`, which exposes the same shapes the components already consume so pages barely change.

**`AppContext` keeps only data concerns** — appointments, booking, availability — reading the
current user from Clerk's hook instead of from local storage.

### The join key

One decision, and everything else follows from it: **Supabase rows carry `clerk_user_id text`.**

```
appointments.client_id  → clerk_user_id  (text, FK-free)
consultants.user_id     → clerk_user_id  (text)
```

Using Clerk's ID as the key avoids a second identity mapping table. Using Supabase's own
`auth.users` would be cleaner *if* Supabase Auth were enabled — it isn't, so that path would mean two
auth systems, which is exactly what this decision avoids.

**Consequence:** `Session.userId` becomes `string` holding a Clerk ID. No type changes needed
anywhere, because Clerk IDs are strings — the seed data just stops being the source of truth.

---

## 4. Execution order

Each step is independently reviewable and leaves the app building.

1. **Add Clerk, touch nothing else.** `npx -y clerk@latest init`, add `@clerk/clerk-react`. Install
   only — do not rewire `AppContext` yet. Commit separately.
2. **`ClerkProvider` in `main.tsx`.** Mount inside `<body>`, not wrapping `<html>`. App should still
   build and the old auth should still work.
3. **Add Clerk auth routes/components.** Sign-in, sign-up, and user button. Adapt into the existing
   `Navbar` — do not duplicate controls that already exist.
4. **Swap the three auth pages.** `Login`/`Register` become Clerk components; `RequireAuth` becomes
   `useAuth().isSignedIn` + `<Show>`. Keep the redesigned `/login` layout — the ink aside and cream
   form panel must survive.
5. **Split `AppContext`.** Identity out, data in. This is the risky step; `check-logic.ts` is the net.
6. **Supabase client + schema.** `lib/supabase.ts`, the tables, and a seed migration carrying the six
   existing consultants and 18 reviews. **Blocked on your keys.**
7. **Repoint the data layer.** `data/index.ts` becomes a Supabase query layer with the same exported
   shapes, so components do not change.
8. **Delete the dead auth code.** `lib/auth.ts`, `lib/crypto.ts`, orphaned `KEYS`. Only once nothing
   imports them — grep first, as with `AvailabilityPanel`.
9. **Verify.** `npx -y clerk@latest doctor`, plus `npm run verify`.

---

## 5. Environment variables

Never committed. `client/.env` is already gitignored via `*.local` patterns — confirm and add an
explicit entry.

```
VITE_CLERK_PUBLISHABLE_KEY=pk_...
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Only the **anon/publishable** keys reach the browser. The Supabase service-role key and
`CLERK_SECRET_KEY` are server-only — this app has no server, so neither is needed client-side, and
neither should ever be added.

---

## 6. Blocked on you

**Supabase requires a real account.** There is no accountless path. You must:

1. Create a project at supabase.com.
2. Send me the **project URL** and **anon key** (Settings → API). Both are safe to expose; the
   anon key is designed for the browser, and access is controlled by Row Level Security policies.

**Clerk does not.** `init` provisions a claimable app with temporary dev keys while signed out. Two
consequences:

- The app is **unclaimed**. Before production: `npx -y clerk@latest auth login`, then
  `npx -y clerk@latest deploy`. Temporary keys are not production-ready.
- Changing sign-in methods (adding Google, etc.) needs a claimed app.

**Free-plan ceilings:** Clerk 10,000 MAU. Supabase 2 projects, 500 MB database. Both fine for a demo;
Clerk's will eventually need attention if this grows.

---

## 7. Ruled out

- **Clerk Organizations.** Not needed for a two-sided marketplace at this stage. Revisit if you add
  teams or consultant firms.
- **Clerk + Supabase Auth together.** Two session systems and a mapping table for one job.
- **Migrating the demo password hashes.** They are throwaway; resetting them is cheaper and safer
  than a bcrypt conversion.
- **Payments, notifications, admin.** Still roadmap v3.

---

## 8. Open questions for you

1. **Sign-up: email only, or social providers too?** Email-only works on an unclaimed app; Google
   login needs the app claimed first.
2. **Should consultants and clients both sign in?** Today `UserRole` allows `CLIENT | CONSULTANT |
   ADMIN`, and `enableConsultantRole` exists. Clerk has no roles by default — you either use Clerk
   Organizations (overkill) or store the role in Supabase and read it. **I recommend storing the role
   in Supabase**, which keeps Clerk purely about identity.
3. **Keep the current role picker on the register form?** It would write a role to a Supabase profile
   row after Clerk sign-up completes.