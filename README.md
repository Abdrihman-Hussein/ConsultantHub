# Lataliye

**Find the right consultant. Book in minutes.**

Lataliye is a consultant discovery and appointment booking platform. Clients browse consultants by specialty, read reviews left by people who actually completed a booking with them, and book sessions directly.

> **Status: pre-backend MVP.** The interface, the booking flow, the review gating, and the English/Somali content all work in the browser. Data lives in `localStorage` — there is no database, no payments, and no deployed environment yet. See [Current status](#current-status).

---

## Features

- **Browse and filter** consultants by specialty
- **Rich profiles** — bio, services, and availability
- **Booking flow** — pick a slot and confirm in one pass
- **Gated reviews** — only a client with a completed booking for that consultant can leave one. Ratings are computed from real reviews at render time and never stored as static figures, so a consultant with no reviews honestly shows "No reviews yet".
- **Client dashboard** — upcoming and past appointments in one place
- **Bilingual (EN + SO)** — every user-visible string ships in both languages and can be switched at runtime. The Somali dictionary is typed against the English one, so a missing translation is a build error, not a silent gap.
- **Authentication** — Clerk

---

## Tech stack

| Layer       | Technology                     |
| ----------- | ------------------------------ |
| UI          | React 18 + TypeScript 5.2      |
| Styling     | Tailwind CSS 3                 |
| Routing     | React Router v6                |
| Build       | Vite 5                         |
| Auth        | Clerk (`@clerk/react`)         |
| Verification| tsc + esbuild logic checks     |

---

## Getting started

### Prerequisites

- Node.js 18+
- npm
- A Clerk application — the free tier is enough

### Installation

```bash
git clone https://github.com/Abdrihman-Hussein/ConsultantHub.git
cd ConsultantHub/client
npm install
```

### Configure Clerk

Create `client/.env.local`:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

The publishable key is public by design — it is inlined into the bundle and only identifies your Clerk instance. `CLERK_SECRET_KEY` must **not** carry a `VITE_` prefix, otherwise it would ship to every visitor.

Then start the dev server:

```bash
npm run dev
```

Open `http://localhost:5173`.

---

## Scripts

| Script                  | What it does                                          |
| ----------------------- | ----------------------------------------------------- |
| `npm run dev`           | Start the dev server                                  |
| `npm run build`         | Typecheck, then production build                      |
| `npm run preview`       | Preview the production build locally                  |
| `npm run typecheck`     | `tsc --noEmit`                                        |
| `npm run check:logic`   | Run the pure-logic checks                             |
| `npm run verify`        | typecheck → check:logic → build. **Run before pushing.** |

---

## Routes

| Route                    | Description                       |
| ------------------------ | --------------------------------- |
| `/`                      | Home                              |
| `/consultants`           | Browse consultants                |
| `/consultants/:id`       | Consultant profile                |
| `/login`                 | Sign in                           |
| `/register`              | Create an account                 |
| `/become-a-consultant`   | Offer your services               |
| `/client/dashboard`      | Client dashboard (requires sign-in) |
| `/client/appointments`   | Appointments (requires sign-in)   |

Any unmatched route renders the home page.

---

## Project structure

```
client/
├── check-logic.ts      # pure-logic checks, run by `npm run verify`
├── index.html
└── src/
    ├── components/     # UI
    ├── context/        # booking + review store
    ├── data/           # seed content
    ├── i18n/           # English + Somali dictionaries
    ├── lib/            # pure logic (reviews, formatting, availability)
    ├── pages/          # routed views
    └── App.tsx         # route table
```

---

## Verification

There is no CI yet, so `npm --prefix client run verify` is the gate. It typechecks, runs the logic checks, and builds. Run it before every push.

---

## Current status

**Working**

- Clerk authentication — sign up, sign in, sign out
- Browse, filter, profiles, and the booking flow
- Review gating on completed bookings
- English ↔ Somali switching

**Not built yet**

- **Database** — Supabase is planned; today all data is in `localStorage`
- **Consultant dashboard** — consultants can register, but have no management surface yet
- **Payments**
- **Deployed environment**
- **CI**

---

## Repository

Branch `feature/redesign-ui` carries the active work; `main` holds the last stable state.
