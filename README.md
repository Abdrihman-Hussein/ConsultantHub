# Lataliye Web

**Find the right consultant. Book in minutes.**

Lataliye is a consultant discovery and appointment-booking web app. Clients browse consultants by specialty, read reviews written only by people who completed a session with that consultant, and book time slots directly. The interface is available in English and Somali.

> **Status: pre-backend MVP.** The interface, booking flow, review gating and bilingual content work in the browser. All data is stored in `localStorage`. There is no database, no payments and no deployed environment yet. See [Current status](#current-status).

---

## Table of contents

- [Why it exists](#why-it-exists)
- [Features](#features)
- [How it works](#how-it-works)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Routes](#routes)
- [Project structure](#project-structure)
- [Core domain](#core-domain)
- [Architecture](#architecture)
- [Data and persistence](#data-and-persistence)
- [Internationalisation](#internationalisation)
- [Quality gates and testing](#quality-gates-and-testing)
- [Security model](#security-model)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Why it exists

Finding a professional adviser usually means word of mouth, with no shared place to compare specialties, see what past clients said, or see when someone is free. Lataliye puts those in one place. Its central rule is that **reviews are earned**: a client can only review a consultant after finishing a session with them, and each session earns one review. Ratings are calculated from those reviews, not typed in by hand.

---

## Features

| Area | What it does |
| --- | --- |
| **Discovery** | Browse consultants, search by text, and filter by specialty and other attributes. |
| **Profiles** | Each consultant has a bio, title, experience, location, hourly rate, services (with duration and price), and verification status. |
| **Booking** | Pick a day from the next five weekdays, pick a 90-minute-grid slot, choose a service, and confirm. |
| **Reviews** | Written after a completed session only. Ratings are computed from the reviews that exist. A consultant with none shows "No reviews yet" rather than a default score. |
| **Client dashboard** | Upcoming and past appointments, with the ability to cancel, mark a passed session as completed, and leave a review. |
| **Consultant onboarding** | `/become-a-consultant` lets someone offer services. There is no management screen yet. |
| **Bilingual UI** | English and Somali, switchable at runtime. The Somali dictionary is typed against the English one, so a missing key is a compile-time error. |
| **Authentication** | Sign-up, sign-in and sign-out through Clerk. |

---

## How it works

### Booking a session

1. A client opens a consultant's profile and chooses a **service** (its duration sets the slot length).
2. The booking widget offers the **next five weekdays**, starting tomorrow. Weekends are skipped.
3. Slots run from **09:00 to 17:00** on a 90-minute grid. The last slot must finish by 17:00, so a 60-minute service and a 90-minute service produce different slot lists.
4. Slots already taken for that consultant on that day are removed from the list.
5. Confirming creates an appointment with status `CONFIRMED`. The consultant's name, avatar and the service price are **copied into the appointment**, so the record still reads correctly if the directory changes later.

### Conflict rules

- Two appointments for the same consultant on the same day may not overlap.
- The comparison uses half-open intervals: a session ending at 11:00 and one starting at 11:00 **do not** conflict, so back-to-back bookings are allowed.
- **Cancelled appointments free their slot.** `PENDING` and `CONFIRMED` ones still block it.

### Completing and reviewing

- The only transitions are `CONFIRMED → COMPLETED` and `CONFIRMED → CANCELLED`.
- A session can be marked completed **only after its day has passed**. A meeting happening today cannot be closed early, because that would unlock a review for something that has not happened.
- A review is allowed when the signed-in client has at least one `COMPLETED` appointment with that consultant that has not yet been reviewed. The review is linked to that specific appointment.
- Three completed sessions give three reviews, not one. A consultant is never locked out after the first review.
- Reviewer names are shown as a first name and a last initial. The full name is never displayed.

### Ratings

No rating or review count is stored on a consultant. Both are derived from the reviews that exist at render time. This was a deliberate change: earlier versions had seeded numbers that nothing in the app could substantiate.

---

## Tech stack

| Layer | Technology | Notes |
| --- | --- | --- |
| UI | React 18, TypeScript 5.2 | Strict typing across components and the pure logic in `src/lib`. |
| Styling | Tailwind CSS 3 | Design tokens are defined in `tailwind.config.js`. |
| Routing | React Router v6 | Route table in `src/App.tsx`. |
| Build | Vite 5 | Typecheck runs before the production build. |
| Auth | Clerk (`@clerk/react`) | Owns identity. The app reads it through `src/lib/useCurrentUser.ts`. |
| Verification | `tsc` plus a custom logic checker | `check-logic.ts` runs with esbuild, no test framework. |

---

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm
- A Clerk application (the free tier is enough)

### Install

```bash
git clone https://github.com/Abdrihman-Hussein/Lataliye-Web.git
cd Lataliye-Web/client
npm install
```

### Configure Clerk

Create `client/.env.local`:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

- The **publishable key** is public by design. Vite inlines `VITE_` variables into the bundle, and the key only identifies your Clerk instance.
- Do **not** add a Clerk **secret key** to this file. The client code never reads one, and anything in a `VITE_` variable reaches every visitor's browser.

Start the dev server:

```bash
npm run dev
```

Then open `http://localhost:5173`.

---

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with hot reload. |
| `npm run typecheck` | Run `tsc --noEmit` across the whole project. |
| `npm run check:logic` | Bundle `check-logic.ts` with esbuild and run the pure-logic checks. |
| `npm run build` | Typecheck, then produce a production build. |
| `npm run preview` | Serve the production build locally. |
| `npm run verify` | Typecheck, logic checks, then build. **Run before every push.** |

---

## Routes

| Path | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Home |
| `/consultants` | Public | Browse and filter consultants |
| `/consultants/:id` | Public | Profile and booking widget |
| `/login`, `/register` | Public | Clerk sign-in and sign-up |
| `/become-a-consultant` | Public | Offer services |
| `/client/dashboard` | Signed in | Client overview |
| `/client/appointments` | Signed in | Appointments, cancel, complete, review |

Unmatched paths render the home page. `/client/*` is wrapped in `RequireAuth`, which sends signed-out visitors to sign in and then returns them to the page they asked for.

---

## Project structure

```
client/
├── check-logic.ts            # pure-logic checks run by `npm run check:logic`
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── src/
    ├── App.tsx               # route table
    ├── main.tsx              # providers: Clerk, i18n, app data
    ├── components/
    │   ├── layout/           # Public and dashboard layouts, navbar, footer
    │   ├── consultants/      # cards, filters, booking widget, review form
    │   ├── appointments/     # appointment cards
    │   ├── marketing/        # home-page sections and auth shell
    │   ├── ui/               # buttons, inputs, rating, count-up, progress
    │   ├── RequireAuth.tsx
    │   └── ErrorBoundary.tsx
    ├── context/
    │   └── AppContext.tsx    # bookings and reviews store
    ├── data/
    │   ├── seed.ts           # starter appointments
    │   └── index.ts          # consultant directory and services
    ├── i18n/
    │   ├── strings.ts        # English and Somali dictionaries
    │   └── LanguageContext.tsx
    ├── lib/                  # pure logic: booking, reviews, search, storage
    ├── pages/                # routed screens
    └── types/index.ts        # shared domain types
```

The rule of thumb: **`lib/` holds logic with no React in it**, so it can be checked without a browser. Components and pages only wire that logic to the screen.

---

## Core domain

| Type | Key fields | Notes |
| --- | --- | --- |
| `Consultant` | `id`, `userId`, `name`, `title`, `specialization`, `hourlyRate`, `verified`, `responseTime` | No `rating` or `reviewCount` by design. |
| `Service` | `consultantId`, `duration`, `price`, `isFree` | Duration in minutes. |
| `Appointment` | `clientId`, `consultantId`, `date`, `startTime`, `endTime`, `price`, `status`, `meetingType` | Name, avatar and price are snapshotted at booking. |
| `Review` | `consultantId`, `appointmentId`, `clientId`, `authorName`, `rating`, `date`, `body` | Real reviews always carry `appointmentId` and `clientId`. |

**Appointment status:** `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`. The current booking flow creates `CONFIRMED` directly, so `PENDING` is reserved for a future approval step.

**Meeting type:** `video` or `in-person`. An in-person booking can carry a location.

**Roles:** `CLIENT`, `CONSULTANT`, `ADMIN`. Clerk has no role field of its own here, so the role is read through `useConsultantRole` in `lib/useCurrentUser.ts`. That hook can show or hide screens, but it cannot enforce anything. Enforcement needs a backend.

---

## Architecture

```
            ┌──────────────────────────────┐
            │ Clerk (identity, sessions)   │
            └──────────────┬───────────────┘
                           │ useCurrentUser()
┌──────────────────────────▼────────────────────────────┐
│ React app (Vite)                                      │
│                                                       │
│  pages/ + components/  ──►  context/AppContext        │
│                              │        ▲               │
│                              ▼        │               │
│                         lib/ (pure rules)             │
│                              │                        │
│                              ▼                        │
│                    lib/storage ─► localStorage        │
└───────────────────────────────────────────────────────┘
```

- **Identity** comes only from Clerk. `AppContext` reads the current user to attribute writes, and it never stores its own session.
- **Rules** (overlap, slot generation, completion timing, review gate, ratings) live in `lib/` as pure functions.
- **State** for bookings and reviews lives in `AppContext`, which is the seam where a real API would go.
- **Persistence** goes through `lib/storage.ts`, which falls back to in-memory storage when `localStorage` is unavailable (for example, private browsing).

---

## Data and persistence

Everything is stored in the browser under the `consultanthub:` key prefix:

| Key | Contents | Seeded? |
| --- | --- | --- |
| `consultanthub:appointments` | Bookings | Yes, from `data/seed.ts` on first run |
| `consultanthub:reviews` | Written reviews | No. A review can only exist against a completed session. |
| `consultanthub:lang` | Language preference | Set on first switch |

Reads are defensive. A missing key, corrupted JSON, or unavailable storage falls back to a safe default instead of crashing the page.

**Important limitation:** anyone with browser developer tools can edit this data, including marking a booking as completed and writing a review. The review gate is correct as logic, but it is only enforceable on a server. Treat the current app as a prototype, not as a source of trustworthy reviews.

### Moving to a backend

The planned path is Supabase, using Clerk JWTs for authentication. Suggested tables:

- `profiles`, `consultants`, `services`, `availability`
- `appointments`, with a unique constraint that prevents overlapping `PENDING` or `CONFIRMED` slots per consultant
- `reviews`, with a constraint that allows one review per `appointment_id`

Row Level Security should enforce the same rules the logic checks now verify: a client can only complete or review their own appointments, and a review can only be inserted when the appointment is `COMPLETED` and its day has passed.

---

## Internationalisation

- All visible strings live in `src/i18n/strings.ts`, in an English dictionary and a Somali dictionary.
- The Somali dictionary is typed against the English one, so a missing translation fails the build.
- The language preference is held in `LanguageContext` and saved to `localStorage`.
- Review-gate messages use dictionary keys (for example `no_completed_booking`), so every reason is translated, not hard-coded.

When adding UI text, add the key to **both** dictionaries. The type check will tell you if one is missing.

---

## Quality gates and testing

### Logic checks

`check-logic.ts` is a standalone script with no test framework. It covers:

- **Booking:** overlap detection, touching endpoints, cancelled slots freed, slot generation, and the completion-date rule.
- **Search:** filtering, sorting, and active-filter counts.
- **Reviews:** the review gate, one review per session, aggregation, reviewer-name formatting, and isolation between consultants.
- **Trust copy:** the verified-count wording.
- **Design tokens:** WCAG AA contrast for text and non-text colours on the dark "ink" surfaces, measured after compositing transparency.

The last group is unusual: it fails the build if someone adds a low-contrast colour pairing.

### Current result

At the time of writing, the logic checks report **161 passing and 0 failing**.

### Verification

There is no CI yet. Run this before every push:

```bash
npm --prefix client run verify
```

It typechecks, runs the logic checks, and builds. A green run means the types line up, the rules hold, and the app compiles.

---

## Security model

| Concern | Current state |
| --- | --- |
| Secrets in the bundle | Only the Clerk publishable key is used. No secret keys are referenced in client code. |
| `.env` files | Ignored by git (`.env`, `.env.local`, `*.local`). |
| Authorisation | UI-only. Ownership checks (for example, cancelling your own booking) run in the browser. |
| Data integrity | Not enforced. Local data can be edited. |
| XSS | No `dangerouslySetInnerHTML`, `eval` or raw `innerHTML` in `src/`. |

Before any real users, the backend must enforce ownership, review eligibility and slot conflicts, and the app should be reviewed against OWASP guidance for personal data.

---

## Roadmap

**Next**

- Finish the open issues on the tracker (client dashboard, router, Vercel deployment).
- Add GitHub Actions CI running `npm run verify` on every push and pull request.
- Replace `localStorage` with Supabase, with Row Level Security.

**Then**

- Consultant dashboard: manage availability, accept or decline bookings, mark sessions complete, edit services.
- Booking states beyond `CONFIRMED`: approval flow (`PENDING`), rescheduling.
- Email confirmations and reminders.
- Payments suited to the Somali market (mobile money providers), not only card payments.
- Admin approval of consultant applications before listing.
- Meeting links for video sessions.

**Later**

- Time-zone handling: store times in UTC and display them in the viewer's zone.
- SEO and social previews for consultant profiles.
- Accessibility audit of the booking flow with a screen reader.

---

## Contributing

1. Branch from `main`. Active development is on `feature/redesign-ui`.
2. Keep pure rules in `src/lib/` with no React imports, and add a check to `check-logic.ts`.
3. Add every new string to both dictionaries.
4. Run `npm --prefix client run verify` before pushing.

---

## Repository

- `main`: the last stable state.
- `feature/redesign-ui`: active work.

---

## Current status

**Working**

- Clerk sign-up, sign-in and sign-out
- Browse, search, filter, profiles and the booking flow
- Conflict detection and completion-date rule
- Review gating on completed sessions, with ratings computed from reviews
- English and Somali switching
- Logic checks and token contrast checks

**Not built yet**

- **Database:** Supabase is planned. Today all data is in `localStorage`.
- **Consultant dashboard:** consultants can register but have no management screen.
- **Payments**
- **Deployed environment**
- **CI**

---

## License

Released under the [MIT License](LICENSE).
olds the last stable state.
