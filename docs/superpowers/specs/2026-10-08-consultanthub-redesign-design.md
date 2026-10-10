# ConsultantHub — Site Redesign

**Date:** 2026-10-08
**Status:** Draft for review
**Path classification:** Architectural (restructures the design system and every page)

---

## 1. Context

ConsultantHub is a frontend-only marketplace for booking sessions with independent
consultants. React 18 + TypeScript + Vite + Tailwind, no backend, seed data in
`client/src/data/`.

The current design is competent but reads as "cards on cream". Every section is the
same shape — `py-20 lg:py-28`, a `border-t`, an alternating `bg-surface` /
`bg-surface-subtle`, then a 3-up grid of identical bordered cards with a
`hover:-translate-y-1`. The hero is a centred or split text block with a decorative
wash. Nothing tells a visitor what the product is, why it beats the alternative, or
that the people on it are real.

### Decisions already made with the user

| Decision | Choice |
| --- | --- |
| Audience | Real marketplace, real users — trust and clarity over flash |
| Visual direction | Evolve the existing warm cream / terracotta / Fraunces system |
| Home structure | Cinematic ink — ink band opens the page |
| Hero contents | One person owns the band: featured consultant, real bio line, rotating |
| Portraits | Keep the drawn SVG illustrations; make `avatar` a first-class portrait field |
| Ink usage | Bounded — never more than two ink bands per page. Home: hero and closing CTA. Dashboard: header. Auth: the aside panel. Footer: closing band. Everything else cream |
| Numbers | Every figure derived from the directory, never hardcoded |

### What is explicitly NOT changing

- The tech stack, the router, the auth model, or the client-side data layer.
- The palette's identity: `#FDF8F3` page, `#C2622D` terracotta, `#2A2118` ink,
  Fraunces for display, Inter for UI.
- The rule that marketing figures are computed from `consultants`, not invented.
  `Home.tsx` already does this correctly and it is the pattern to extend.

---

## 2. Constraints

### 2.1 Honesty rule (binding)

The seed directory is fictional. The UI must never imply more than exists.

- **No invented aggregate figures.** "240+ consultants" is out; the real number is 6.
  Derived counts only, as `Home.tsx` already does.
- **No fabricated testimonials.** The `fa2b62a` commit ("fix: remove invented figures
  and fabricated testimonials") established this.
- **Open issue — `reviewCount` without reviews.** Every consultant carries a
  `reviewCount` of 52–128, and `Rating.tsx` renders "(128)", but there is no `Review`
  type and no review content anywhere. This implies written reviews that do not exist.
  Resolution is required before build — see §7.

### 2.2 Craft

- Contrast: the ink band introduces cream-on-ink text. Every pairing must meet WCAG AA.
- Motion respects `prefers-reduced-motion`; `index.css` already collapses transitions.
- Every interactive element needs a visible `:focus-visible` ring and a real
  accessible name.
- No layout that depends on a hover-only affordance.

---

## 3. Design system changes

### 3.1 Dark-surface tokens

The current config has no ink-surface palette — everything assumes a cream page. Add
semantic aliases rather than new raw ramps, so components stay readable:

| Token | Value | Use |
| --- | --- | --- |
| `surface-ink` | `#2A2118` | Ink band background |
| `surface-ink-soft` | `#3D3229` | Raised card on ink |
| `on-ink` | `#F9F1E8` | Primary type on ink |
| `on-ink-muted` | `#B79E88` | Secondary type on ink |
| `accent-on-ink` | `#E8A05C` | Accent type/CTA on ink — **lighter than `accent-500`**, because `#C2622D` fails contrast on `#2A2118` |
| `gold-on-ink` | `#E8C88A` | Ratings and figures on ink |

`accent-on-ink` is the load-bearing decision: terracotta on ink is unreadable, so the
dark band needs its own accent, not the light-surface one.

### 3.2 Section rhythm

The repetition of identical sections is the core problem. Introduce three distinct
section shapes and use them deliberately:

- **Band** — full-bleed, `surface-ink` or `surface-subtle`, no border, generous
  vertical padding. Used at most twice per page.
- **Editorial** — asymmetric 2-column, ruled, generous whitespace, content-led. The
  default for explanatory content.
- **Index** — a dense ruled list rather than a card grid. Used for directories and
  anything with 4+ comparable items.

Cards stay for genuinely individual, self-contained items (a consultant, a service).
They stop being the default container for everything.

### 3.3 Type and motion

- Add `display-2xl` above the existing `display-xl` for the cinematic hero only.
- Existing `Reveal` and `CountUp` are adequate. Add a hero entrance that staggers
  eyebrow → headline → lede → actions → featured card, and a subtle cross-fade when
  the featured consultant rotates.
- Keep the existing easing tokens (`out`, `spring`, `smooth`).

---

## 4. Page designs

### 4.1 Home (`/`)

Rebuilt in six sections. The narrative order changes; it currently leads with
specialties, which is a browsing action, before establishing what the product is.

1. **Cinematic ink hero** — ink band, bounded. Eyebrow, headline
   (*"Find your person. Move forward."*), lede, then the featured consultant as a
   translucent card: portrait, name, title · location, rating, response time, and one
   line lifted from their actual `bio`. Two CTAs — view that profile, browse all.
   A soft terracotta radial glow, low opacity, behind the portrait.
2. **More people worth a call** — portrait-led row of three, editorial Index shape.
3. **How it works** — three numbered steps as an Editorial section with rules between
   them, not three identical cards.
4. **Browse by specialty** — Index shape, rows with counts, not four identical cards.
5. **Why book here** — the three existing `guarantees`, as a ruled Band on
   `surface-subtle`.
6. **Closing CTA** — ink, mirroring the hero, with the derived counts from `consultants`.

**Featured consultant rotation.** Order the directory by rating desc, then sessions
desc, and advance through it every 7 seconds. The interval pauses on hover, on focus
within the hero, and when the tab is hidden; it resumes on return. Controls are a
"next consultant" button and dot indicators. The hero carries `aria-live="polite"` so
the change is announced without stealing focus. Omar Nur (5.0, 320 sessions) leads.
Under `prefers-reduced-motion` the rotation does not start at all — a static first
consultant, with the manual next control still available.

**The bio line is extracted, not written.** Take the consultant's first sentence from
their `bio` field verbatim. No composing, no trimming for effect, no quotation marks
implying speech. If a bio is shorter than one sentence, fall back to `title` and
`location`.

### 4.2 Browse (`/consultants`)

The conversion surface for visitors who already know what they want.

- Sticky left filter rail on desktop; on mobile, filters move into a bottom sheet with
  a visible "Filters" trigger showing the active count.
- Add a **sort** control (rating, price low→high, sessions). `lib/search.ts` already
  defines comparators but there is no sort UI.
- Result count stated in words ("6 consultants"), derived.
- `ConsultantCard` gets the portrait-led treatment from Home so the two read as one
  system.
- Existing empty state is kept.

### 4.3 Profile (`/consultants/:id`)

The booking path, so it gets the most care.

- Portrait-led header on `surface-subtle`: large portrait, name, title, location,
  experience, rating, response time, verified state.
- Body in two columns: about, services, and (once §7 is resolved) reviews on the left;
  sticky `BookingWidget` on the right.
- `BookingWidget` is 325 lines and the most complex component in the app. It should be
  split during this work — service selection, date selection, and slot selection are
  separable concerns. Keep the public props unchanged.
- Restyle the header to ink? No — reserve ink for Home, footer, and dashboard header so
  it stays a signal rather than a texture.

### 4.4 Client area (`/client/*`)

- Ink header band carrying the page title and the account menu; cream body below.
- `ClientDashboard` currently leans on stat cards; give the upcoming appointment real
  presence, since it is the one thing the user came for.
- `ClientAppointments`: status filters become a segmented control on ink.

### 4.5 Auth (`/login`, `/register`, `/become-a-consultant`)

- Keep cream. `AuthShell` already splits the panel from the aside; tighten the panel,
  and put the aside on ink so auth feels like a considered moment without going dark
  for form input.

### 4.6 Footer

Ink, closing the page and mirroring the hero. Keep the existing links; restyle to the
cream-on-ink tokens.

---

## 5. Component and data changes

| Change | Detail |
| --- | --- |
| `Hero.tsx` | Rewrite. Ink band, featured-consultant slot, rotation state, staggered entrance. |
| `AvailabilityPanel.tsx` | Repurpose or retire — its "live availability" framing overlaps the featured consultant. |
| `ConsultantCard.tsx` | Portrait-led layout, shared with Home. |
| `ConsultantProfile.tsx` | New header; review section pending §7. |
| `BookingWidget.tsx` | Split into service / date / slot steps; props unchanged. |
| `DashboardLayout.tsx` | Ink header band. |
| `Footer.tsx` | Ink. |
| `Button.tsx` | Add `onInk` variant using `accent-on-ink`. |
| `Rating.tsx` | Needs `countIsClaimingReviews: false` handling pending §7. |
| `types/index.ts` | `Consultant.avatar` documented as the portrait field; optional `Review` type if §7 adds reviews. |
| `data/index.ts` | No invented data. Sort/rotation helpers live in a new `lib/featured.ts`. |

---

## 6. Accessibility, responsive, performance

- AA contrast on every new pairing, especially `accent-on-ink` and `on-ink-muted`.
- The rotating hero must be keyboard reachable and announced politely, and must not
  auto-advance while focused or hovered.
- Ink bands need explicit focus-ring colour against dark; the default ring is tuned for
  cream and will disappear.
- Full-width ink bands need no horizontal scroll from `100vw` widths — use `w-full`
  inside a full-bleed wrapper.
- Portrait SVGs stay inline-able and scale; no new image payload.
- Check 360px, 768px, 1280px on every page.

---

## 7. Open decision — reviews

Must be resolved before the build, because it changes both the data layer and the
profile page.

- **(a) Seed real reviews.** Add a `Review` type and 3–5 reviews per consultant, then
  `reviewCount` becomes truthful and the profile gets a real social-proof section.
  Most work, and the only option that makes the existing numbers honest.
- **(b) Remove the counts.** Drop `reviewCount` and the "(128)" suffix, show rating
  alone. Cheapest and fully honest, but leaves the strongest trust signal on the page
  unused and loses `reviewCount` as a sort tiebreaker.
- **(c) Keep counts, relabel.** Show them as "sessions" or drop the parenthesis so the
  number reads as a directory stat rather than written reviews. Inconsistent — not
  recommended.

Recommendation: **(a)**, because the numbers are already there and the profile page is
where a marketplace converts.

---

## 8. Phasing

This spec covers the whole site. Implementation is phased, each phase independently
shippable and verifiable:

1. **Foundation** — §3 tokens, type, section shapes; `Button` on-ink variant.
2. **Home** — §4.1 in full, including featured rotation.
3. **Browse** — §4.2, including sort.
4. **Profile + booking** — §4.3, including the `BookingWidget` split. Depends on §7.
5. **Client area + auth + footer** — §4.4–4.6.
6. **Polish** — §6 sweep, responsive, motion, reduced-motion.

Phase 1–2 is the largest visible win and needs no dependency on §7.

---

## 9. Testing

The project has `check-logic.ts` and no test runner. Verification for this work:

- `npm run build` must pass with no TypeScript errors.
- `node check-logic.ts` must pass — it guards booking and search behaviour, which the
  widget split must not break.
- Manual pass on all 8 routes at 360 / 768 / 1280.
- Keyboard-only pass: featured rotation, filters, booking widget, mobile filter sheet.
- Reduced-motion pass on Home.
- A deliberate hunt for invented figures: every number on every page traced back to
  `consultants` or `services`.

---

## 10. Out of scope

- Backend, auth, payments, real availability, notifications.
- Adding consultants or services beyond the current six.
- Copywriting changes beyond the hero and section headings, except where existing copy
  makes a false claim.
- Photo photography. `avatar` becomes a first-class portrait field so real photos drop
  in later without a redesign.