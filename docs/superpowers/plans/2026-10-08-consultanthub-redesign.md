# ConsultantHub Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild ConsultantHub's design system and all eight routes around a cinematic ink hero and a rotating featured consultant, keeping every figure on the site derived from real seed data.

**Architecture:** Tailwind tokens gain a dark-surface family so cream-on-ink becomes a first-class surface. Three new pure modules (`lib/featured.ts`, `format.ts` additions, `lib/reviews` selectors) carry the logic that must be reasoned about independently of React; components consume them. The rotation, the bio-line extraction, and the filter/sort controls are all pure functions tested in `check-logic.ts` before any JSX changes.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind 3, React Router v6, esbuild-bundled `check-logic.ts` harness.

**Spec:** `docs/superpowers/specs/2026-10-08-consultanthub-redesign-design.md`

## Global Constraints

- Page background `#FDF8F3`; ink surface `#2A2118`; terracotta `#C2622D`; ink type `#2A2118`; display font Fraunces; UI font Inter. None of these change.
- **No invented figures anywhere.** Every count, average, and total shown on any page must be computed from `consultants` or `services` at render time. Never a literal in JSX. This extends the pattern already established in `Home.tsx`.
- **No fabricated testimonials.** Review bodies are seeded content in `data/index.ts` and are labelled as sample reviews in the UI (§7 of the spec).
- Ink bands: never more than two per page. Permitted on Home (hero + closing CTA), Dashboard (header), Auth (aside), Footer.
- Every ink-surface pairing meets WCAG AA. `accent-500` `#C2622D` fails on ink; use `accent-on-ink` `#E8A05C`.
- Existing easing tokens (`out`, `spring`, `smooth`) and `Reveal`/`CountUp` are reused, not replaced.
- Verification gate for every task: `npm run verify` (typecheck + check:logic + build) must pass.
- Existing public prop signatures on `Hero`, `ConsultantCard`, `BookingWidget`, `FilterSidebar`, `AppointmentCard` may change; the router, auth model, and data storage format may not.

## Review Focus

Five input conditions the spec implies that no existing check covers:

1. **A bio with no sentence terminator** — `bioLine` must not return an empty string or a fragment. Expect the trimmed bio, or the fallback when the bio is blank.
2. **A single-consultant directory** — the rotation must not attempt to advance past index 0, and the next-control must disable rather than loop forever.
3. **`reviewCount` of 0** — `Rating` must show the score alone with no `(0)` and no dangling parenthesis.
4. **`prefers-reduced-motion`** — the hero must not start its interval. Verified by keyboard/emulation, not by `check-logic.ts`.
5. **A long consultant name at 360px inside an ink band** — must truncate or wrap without horizontal overflow. Verified in the browser, not by `check-logic.ts`.

Conditions 4 and 5 have no automated coverage and must be exercised by hand in Task 12.

---

## File Structure

**New**

| Path | Responsibility |
| --- | --- |
| `client/src/lib/featured.ts` | Featured-consultant ordering, bio first-sentence extraction, rotation index maths. No React. |
| `client/src/lib/reviews.ts` | Review selectors: fetch for a consultant, average, sample-vs-total labelling. |
| `client/src/components/marketing/FeaturedConsultant.tsx` | The rotating consultant card rendered inside the ink hero. |
| `client/src/components/marketing/InkBand.tsx` | Wrapper providing the ink surface, focus-ring colour, and full-bleed containment. Used by hero, closing CTA, dashboard header, auth aside, footer. |
| `client/src/components/consultants/SortSelect.tsx` | Sort dropdown bound to `SortKey`. |
| `client/src/components/consultants/ReviewList.tsx` | Seeded reviews plus the "showing N of M" line. |
| `client/src/components/consultants/booking/ServiceStep.tsx` | Service selection, extracted from `BookingWidget`. |
| `client/src/components/consultants/booking/SlotStep.tsx` | Date + time slot selection, extracted from `BookingWidget`. |

**Modified** — `tailwind.config.js`, `client/src/index.css`, `types/index.ts`, `data/index.ts`, `lib/format.ts`, `check-logic.ts`, and every component in §5 of the spec.

---

### Task 1: Ink-surface tokens and the `onInk` button variant

**Files:**
- Modify: `client/tailwind.config.js` — add to `theme.extend.colors`
- Modify: `client/src/components/ui/Button.tsx:4` — `Variant` union and `variants` record
- Modify: `client/src/index.css` — focus ring on ink
- Test: `client/check-logic.ts`

**Interfaces:**
- Produces: Tailwind colour classes `bg-surface-ink`, `bg-surface-ink-soft`, `text-on-ink`, `text-on-ink-muted`, `text-accent-on-ink`, `text-gold-on-ink`, `border-ink-line`.
- Produces: `Button` gains `variant="onInk"` (primary action on dark) and `variant="onInkOutline"` (secondary on dark). Later tasks depend on both.

- [ ] **Step 1: Write the failing check**

Add to `check-logic.ts`:

```ts
console.log('\ndesign tokens');
// Guards the spec's binding decision: terracotta is unreadable on ink.
check(
  'accent-on-ink clears AA on the ink surface',
  contrast('#E8A05C', '#2A2118') >= 4.5,
  contrast('#E8A05C', '#2A2118').toFixed(2),
);
check('on-ink clears AA on ink', contrast('#F9F1E8', '#2A2118') >= 4.5);
check('on-ink-muted clears AA on ink', contrast('#B79E88', '#2A2118') >= 4.5);
check('accent-500 on ink is NOT used', contrast('#C2622D', '#2A2118') < 4.5);
```

Also add a local helper above `check`:

```ts
function luminance(hex: string): number { /* WCAG 2.1 relative luminance */ }
function contrast(a: string, b: string): number { /* (L1+.05)/(L2+.05) */ }
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run check:logic`
Expected: FAIL — `contrast` is not defined.

- [ ] **Step 3: Add the helpers**

Implement `luminance(hex: string): number` and `contrast(a: string, b: string): number` in `check-logic.ts` above `check`. Expand 3-digit hex, normalise channels to 0–1, apply the 0.2126/0.7152/0.0722 weighting, return `(lighter + 0.05) / (darker + 0.05)`.

- [ ] **Step 4: Run to verify the colour checks pass**

Run: `npm run check:logic`
Expected: the four `design tokens` checks PASS — this proves the spec's token values are correct before they are written into CSS. If `on-ink-muted` fails, darken it until it passes and record the final value.

- [ ] **Step 5: Add the tokens to `tailwind.config.js`**

Into `theme.extend.colors`, alongside the existing semantic aliases:

```js
'surface-ink': '#2A2118',
'surface-ink-soft': '#3D3229',
'on-ink': '#F9F1E8',
'on-ink-muted': '#B79E88',
'accent-on-ink': '#E8A05C',
'gold-on-ink': '#E8C88A',
'ink-line': 'rgba(249, 241, 232, 0.14)',
```

Use the final `on-ink-muted` value that passed Step 4 if it differed.

- [ ] **Step 6: Add the button variants**

In `Button.tsx`, extend `type Variant` to include `'onInk' | 'onInkOutline'` and add to `variants`:

- `onInk`: `bg-accent-on-ink text-ink-950 hover:bg-gold-on-ink shadow-sm`
- `onInkOutline`: `border border-ink-line bg-transparent text-on-ink hover:bg-ink-line`

The shared `base` string's `focus-visible:ring-accent-500/40` is tuned for cream and will vanish on ink. Add to the `onInk` variants `focus-visible:ring-accent-on-ink/60` and `focus-visible:ring-offset-surface-ink`.

- [ ] **Step 7: Add an ink focus ring to `index.css`**

Inside `@layer base`, after the existing `:focus-visible` rule, add:

```css
.on-ink :focus-visible {
  @apply ring-accent-on-ink/70 ring-offset-surface-ink;
}
```

- [ ] **Step 8: Verify**

Run: `npm run verify`
Expected: typecheck, logic, and build all pass.

- [ ] **Step 9: Commit**

```bash
git add client/tailwind.config.js client/src/index.css client/src/components/ui/Button.tsx client/check-logic.ts
git commit -m "feat: add ink-surface tokens and on-ink button variants"
```

---

### Task 2: `bioLine` and featured ordering

**Files:**
- Create: `client/src/lib/featured.ts`
- Modify: `client/check-logic.ts`
- Test: `client/check-logic.ts`

**Interfaces:**
- Produces: `bioLine(bio: string, fallback: string): string` — the consultant's first sentence verbatim, no quote marks.
- Produces: `featuredOrder(consultants: Consultant[]): Consultant[]` — rating desc, then sessions desc.
- Produces: `nextIndex(current: number, total: number): number` — wraps, and returns `current` when `total <= 1`.
- Consumed by: Task 4 (`FeaturedConsultant`), Task 5 (Home closing CTA ordering).

- [ ] **Step 1: Write the failing checks**

```ts
console.log('\nfeatured: bio line');
check(
  'first sentence only',
  bioLine('Cloud architecture work. Previously led platform teams.', 'x') ===
    'Cloud architecture work.',
);
check(
  'a bio with no terminator is returned whole',
  bioLine('Forecasting and valuation for early stage companies', 'x') ===
    'Forecasting and valuation for early stage companies',
);
check('a blank bio falls back', bioLine('   ', 'Systems Engineering') === 'Systems Engineering');
check('a single-sentence bio is unchanged', bioLine('Only one sentence.', 'x') === 'Only one sentence.');
check(
  'a decimal point does not split the sentence',
  bioLine('Sells at 4.9 average. Second sentence here.', 'x') ===
    'Sells at 4.9 average.',
);
check(
  'abbreviations do not split the sentence',
  bioLine('Focused on U.S. tax. Also estates.', 'x') === 'Focused on U.S. tax.',
);

console.log('\nfeatured: ordering');
check(
  'highest rated leads',
  featuredOrder(consultants)[0].name === 'Omar Nur',
  featuredOrder(consultants)[0].name,
);
check(
  'rating ties break on sessions',
  (() => {
    const tied = [
      { ...consultants[0], id: 'a', rating: 5, sessions: 10 },
      { ...consultants[0], id: 'b', rating: 5, sessions: 90 },
    ];
    return featuredOrder(tied)[0].id === 'b';
  })(),
);
check('ordering does not mutate its input', (() => {
  const before = consultants.map((c) => c.id).join();
  featuredOrder(consultants);
  return consultants.map((c) => c.id).join() === before;
})());
check('a single-consultant directory is returned as-is', featuredOrder([consultants[0]]).length === 1);

console.log('\nfeatured: rotation');
check('next wraps to the start', nextIndex(5, 6) === 0);
check('next advances', nextIndex(0, 6) === 1);
check('a one-item rotation does not move', nextIndex(0, 1) === 0);
check('an empty rotation does not move', nextIndex(0, 0) === 0);
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run check:logic`
Expected: FAIL — `bioLine`, `featuredOrder`, `nextIndex` are not exported.

- [ ] **Step 3: Implement `lib/featured.ts`**

Three exported pure functions with the signatures above.

- `bioLine`: trim. If empty, return `fallback`. Split on the first sentence terminator that is a `.`, `!`, or `?` — but **not** a `.` that is preceded by a single uppercase letter (`U.S.`) or followed by a digit (`4.9`). Return the first sentence with the terminator, trimmed.
- `featuredOrder`: `[...consultants].sort()` by `b.rating - a.rating`, then `b.sessions - a.sessions`. Must not mutate the input.
- `nextIndex`: `(current + 1) % total` when `total > 1`, else `current`.

- [ ] **Step 4: Run to verify it passes**

Run: `npm run check:logic`
Expected: PASS, including `highest rated leads` (Omar Nur, 5.0).

- [ ] **Step 5: Commit**

```bash
git add client/src/lib/featured.ts client/check-logic.ts
git commit -m "feat: add featured ordering and bio first-sentence extraction"
```

---

### Task 3: Reviews — type, seed, and selectors

**Files:**
- Modify: `client/src/types/index.ts` — add `Review`
- Modify: `client/src/data/index.ts` — add `reviews`, `getReviewsFor`
- Create: `client/src/lib/reviews.ts` — `reviewsSummary`, `avgRating`
- Modify: `client/check-logic.ts`

**Interfaces:**
- Produces: `Review { id: string; consultantId: string; authorName: string; rating: number; date: string; body: string }`
- Produces: `getReviewsFor(consultantId: string): Review[]` — newest first.
- Produces: `reviewsSummary(consultant: Consultant, sample: Review[]): string` — e.g. `"Showing 3 of 128 reviews"`, or `"No written reviews yet"` when `reviewCount` is 0.
- `consultant.reviewCount` stays the true aggregate; seeded reviews are an explicitly labelled sample. Consumed by Task 7.

- [ ] **Step 1: Write the failing checks**

```ts
console.log('\nreviews');
check('every seeded review belongs to a real consultant', reviews.every((r) => getConsultant(r.consultantId)));
check('every seeded review has a rating in range', reviews.every((r) => r.rating >= 1 && r.rating <= 5));
check('every seeded review has a body', reviews.every((r) => r.body.trim().length > 20));
check('every consultant has at least one seeded review', consultants.every((c) => getReviewsFor(c.id).length > 0));
check('reviews come back newest first', (() => {
  const dates = getReviewsFor('2').map((r) => r.date);
  return dates.every((d, i) => i === 0 || dates[i - 1] >= d);
})());
check(
  'sample label counts the total, not the sample',
  reviewsSummary(consultants[0], getReviewsFor(consultants[0].id)) ===
    `Showing 3 of ${consultants[0].reviewCount} reviews`,
  reviewsSummary(consultants[0], getReviewsFor(consultants[0].id)),
);
check(
  'a zero review count does not print (0)',
  reviewsSummary({ ...consultants[0], reviewCount: 0 }, []) === 'No written reviews yet',
  reviewsSummary({ ...consultants[0], reviewCount: 0 }, []),
);
check('a seeded review average is within its own bounds', (() => {
  const avg = avgRating(getReviewsFor('2'));
  return avg === null || (avg >= 1 && avg <= 5);
})());
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run check:logic`
Expected: FAIL — `reviews` is not exported.

- [ ] **Step 3: Add the `Review` type and seed the sample**

In `types/index.ts`, add the `Review` interface above with a doc comment stating it is sample content for the MVP, alongside the existing note that the directory is fictional.

In `data/index.ts`, add `export const reviews: Review[]` with **three reviews per consultant, eighteen in total**. Each body must be specific to that consultant's actual specialisation and at least 20 characters — the check enforces length, and the review must read as though a client wrote it about real work. Dates must be ISO `YYYY-MM-DD` and spread across 2026 so the newest-first ordering is observable. Do not invent figures inside a review body; if a review mentions a duration or a price, use one that appears in that consultant's real `services` entries.

- [ ] **Step 4: Add the selectors**

`getReviewsFor(consultantId: string): Review[]` in `data/index.ts`, filtering `reviews` and sorting `date` descending.

`client/src/lib/reviews.ts`:

- `avgRating(reviews: Review[]): number | null` — mean of `rating`, or `null` for an empty list.
- `reviewsSummary(consultant: Consultant, sample: Review[]): string` — when `consultant.reviewCount === 0` return `'No written reviews yet'`; when `sample.length` is 0 but the count is not, return `'Written reviews not shown yet'`; otherwise `` `Showing ${sample.length} of ${consultant.reviewCount} reviews` ``.

- [ ] **Step 5: Run to verify it passes**

Run: `npm run check:logic`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add client/src/types/index.ts client/src/data/index.ts client/src/lib/reviews.ts client/check-logic.ts
git commit -m "feat: add sample reviews with honest sample-versus-total labelling"
```

---

### Task 4: `InkBand` and the rotating featured consultant

**Files:**
- Create: `client/src/components/marketing/InkBand.tsx`
- Create: `client/src/components/marketing/FeaturedConsultant.tsx`
- Test: manual, plus the rotation checks already in Task 2

**Interfaces:**
- Consumes: `bioLine`, `nextIndex` from `lib/featured.ts`; `Button` `onInk`/`onInkOutline` from Task 1.
- Produces: `InkBand({ children, className?, as?: 'section' | 'div' | 'footer' | 'aside' })`.
- Produces: `FeaturedConsultant({ consultant }: { consultant: Consultant })` — the card only; the rotation interval lives in the hero (Task 5).

- [ ] **Step 1: Create `InkBand.tsx`**

`bg-surface-ink text-on-ink on-ink` wrapper. Full-bleed: apply the background to the outer element and constrain content with a `Container` **inside** it — never `w-screen`, which causes horizontal scroll at 360px. Include the low-opacity terracotta radial glow, `pointer-events-none`, `aria-hidden`, positioned off the right edge.

- [ ] **Step 2: Create `FeaturedConsultant.tsx`**

A translucent card — `bg-white/[0.07] border border-ink-line rounded-2xl` — containing, in order: the portrait (`Avatar`, size 112), name, a credential line formatted exactly as `"{title} · {location} · ★{rating} · responds {responseTime}"`, the `bioLine` result with no surrounding quotation marks, and a `Button variant="onInk"` reading `View {firstName}'s profile →` linking to `/consultants/{id}`.

**Portrait field.** `Avatar` already takes `src`. Confirm it falls back to `initials(name)` when the image fails, because the portrait is a drawn SVG today and a real photograph later. If it does not, add that fallback and cover it with the existing `initials()` helper.

- [ ] **Step 3: Verify the credential line formats correctly**

Run `npm run typecheck`. Then, in the browser, temporarily render `<FeaturedConsultant consultant={consultants[1]} />` alone and confirm it reads `Systems Engineering · Hargeisa, Somaliland · ★5.0 · responds under 1h`.

- [ ] **Step 4: Verify contrast by hand**

Open the card over the ink band and confirm name, credential line, and bio line are all legible. The credential line is the risk — it uses `on-ink-muted`.

- [ ] **Step 5: Commit**

```bash
git add client/src/components/marketing/InkBand.tsx client/src/components/marketing/FeaturedConsultant.tsx client/src/components/ui/Avatar.tsx
git commit -m "feat: add InkBand wrapper and FeaturedConsultant card"
```

---

### Task 5: Home — cinematic ink hero with rotation

**Files:**
- Rewrite: `client/src/components/marketing/Hero.tsx`
- Modify: `client/src/pages/Home.tsx:64-82` — hero props
- Test: Task 2 checks cover the maths; rotation behaviour is manual

**Interfaces:**
- Consumes: `InkBand`, `FeaturedConsultant` (Task 4); `bioLine`, `nextIndex`, `featuredOrder` (Task 2); `Button` on-ink variants (Task 1).
- Produces: `Hero({ consultant: Consultant; onNext: () => void; position: number; total: number })`. The rotation **interval is owned by `Home`**, not `Hero`, so the interval pauses on hover/focus without the hero needing document-level listeners.

- [ ] **Step 1: Rewrite `Hero.tsx`**

Ink band. Structure, in order: eyebrow `Independent expertise`; `h1` in `display-2xl` Fraunces reading `Find your person.` with `Move forward.` on the second line in `accent-on-ink`; a lede at `max-w-xl`; the `FeaturedConsultant` card; then two buttons — `onInk` "View this profile" and `onInkOutline` "Browse all". Below the buttons, a dot row — one dot per consultant, current one filled — plus a `Next consultant` control wired to `onNext`.

Wrap the changing region in `aria-live="polite"` and `aria-atomic="true"` so rotation is announced without stealing focus.

Add `display-2xl` to `theme.extend.fontSize` in `tailwind.config.js`: `['clamp(3rem, 8vw, 6rem)', { lineHeight: '0.98', letterSpacing: '-0.035em' }]`.

- [ ] **Step 2: Drive the rotation from `Home.tsx`**

In `Home`:

```ts
const order = useMemo(() => featuredOrder(consultants), []);
const [position, setPosition] = useState(0);
```

A `useEffect` holds the interval. It must: not start when `prefers-reduced-motion` is set; pause on hero hover, on focus within the hero, and when `document.visibilityState` is `'hidden'`; resume on return; and clean up on unmount. `onNext` calls `setPosition((p) => nextIndex(p, order.length))`.

Gate all of this on `matchMedia('(prefers-reduced-motion: reduce)')`, re-reading it on change so a user toggling the OS setting mid-session is respected. Under reduced motion the dots and the next control still work — only the automatic advance is suppressed.

- [ ] **Step 3: Pass the hero props from `Home.tsx`**

Replace the existing `Hero` call with `consultant={order[position]}` and the rotation props. Delete the old `proof` array — the derived figures move to the closing CTA in Task 6, where they belong.

- [ ] **Step 4: Verify the rotation by hand**

Run `npm run dev`. Confirm: Omar Nur leads; it advances roughly every 7s; hovering the hero stops it; tabbing into the hero stops it; switching tabs stops it; `nextIndex` wraps from the last consultant back to Omar Nur; and with reduced-motion emulated it does **not** advance at all while the next control still works.

This is Review Focus items 2 and 4.

- [ ] **Step 5: Verify**

Run: `npm run verify`
Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add client/src/components/marketing/Hero.tsx client/src/pages/Home.tsx client/tailwind.config.js
git commit -m "feat: rebuild the home hero as a rotating cinematic ink band"
```

---

### Task 6: Home — the remaining five sections

**Files:**
- Rewrite: `client/src/pages/Home.tsx` (sections below the hero)
- Modify: `client/src/components/marketing/HowItWorks.tsx`
- Modify: `client/src/components/consultants/ConsultantCard.tsx`
- Modify: `client/src/lib/format.ts` — add `countLabel`
- Delete: `client/src/components/marketing/AvailabilityPanel.tsx`

**Interfaces:**
- Consumes: `featuredOrder`, `bioLine` (Task 2), `InkBand` (Task 4), `Button` on-ink variants (Task 1).
- Produces: `countLabel(count: number, singular: string, plural?: string): string` in `lib/format.ts` — `"1 consultant"` / `"6 consultants"`.

- [ ] **Step 1: Add `countLabel` with a failing check**

```ts
console.log('\nformat: countLabel');
check('singular', countLabel(1, 'consultant') === '1 consultant');
check('plural', countLabel(6, 'consultant') === '6 consultants');
check('zero is plural', countLabel(0, 'review') === '0 reviews');
check('irregular plural', countLabel(2, 'person', 'people') === '2 people');
```

Implement:

```ts
export function countLabel(count: number, singular: string, plural?: string): string {
  const word = count === 1 ? singular : (plural ?? `${singular}s`);
  return `${count} ${word}`;
}
```

- [ ] **Step 2: Rebuild the sections**

Replace the current five stacked sections. New order and shape:

1. **More people worth a call** — cream. Portrait-led row of three from `featuredOrder`, excluding the current hero consultant, so the hero and the row never show the same person. Headline from `SectionHeading`, with a `Browse all` action.
2. **How it works** — cream, `Editorial` shape. The three existing steps become numbered rows separated by rules, not three identical cards.
3. **Browse by specialty** — `Index` shape. Each specialty is a ruled row linking to `/consultants?specialty={name}`, showing `countLabel(count, 'consultant')`.
4. **Why book here** — `surface-subtle` band. The three existing `guarantees`, ruled, not cards.
5. **Closing CTA** — `InkBand`. The two CTAs, then the derived figures: `consultants.length`, the mean rating, and total sessions. **Every one computed at render time**, phrased with `countLabel`.

Remove `AvailabilityPanel` from the page and delete `AvailabilityPanel.tsx`. Its "live availability" framing duplicates the featured consultant's credentials, and the spec assigns it repurpose-or-retire; retiring is simpler and loses nothing the booking widget does not already cover. Confirm nothing else imports it before deleting.

- [ ] **Step 3: Restyle `ConsultantCard` portrait-led**

Portrait at the top, then name, credential line, rating, rate. It must read as the same card as `FeaturedConsultant`, at a smaller scale. Keep the existing `consultant` prop.

- [ ] **Step 4: Verify no figure is hardcoded**

Run: `npm run dev`, then read `Home.tsx` top to bottom and confirm every number in the JSX is inside an expression, not a literal. This is the spec's binding constraint.

- [ ] **Step 5: Verify**

Run: `npm run verify`
Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add client/src/pages/Home.tsx client/src/components/marketing/HowItWorks.tsx client/src/components/consultants/ConsultantCard.tsx client/src/lib/format.ts client/check-logic.ts
git commit -m "feat: rebuild home sections with varied rhythm and derived figures"
```

---

### Task 7: Browse — sort control, mobile filter sheet, result count

**Files:**
- Create: `client/src/components/consultants/SortSelect.tsx`
- Modify: `client/src/pages/Consultants.tsx`
- Modify: `client/src/components/consultants/FilterSidebar.tsx`
- Test: manual

**Interfaces:**
- Consumes: `SortKey`, `sortLabels`, `Filters` from `lib/search.ts` — **already exist**; this task adds UI only, no search logic changes.
- Produces: `SortSelect({ value, onChange }: { value: SortKey; onChange: (key: SortKey) => void })`.

- [ ] **Step 1: Create `SortSelect.tsx`**

A labelled `<select>` bound to `sortLabels`. Options come from `Object.entries(sortLabels)`, so adding a `SortKey` needs no change here.

- [ ] **Step 2: Add sort and a result count to `Consultants.tsx`**

Above the grid: a results bar with the count as `countLabel(filtered.length, 'consultant')` and the `SortSelect`. Keep the existing `describeFilters` chips.

- [ ] **Step 3: Move filters into a sheet below `md`**

On small screens, `FilterSidebar` renders inside a bottom sheet opened by a `Filters` trigger that shows the active count from `countActiveFilters`. Keep the sidebar inline on `md` and up. The sheet traps focus, closes on `Escape`, and returns focus to its trigger.

- [ ] **Step 4: Verify each sort actually reorders**

Run `npm run dev`, go to `/consultants`, and cycle all five `SortKey` values. `lib/search.ts` comparators are already covered by `check-logic.ts`; this confirms the control is wired.

- [ ] **Step 5: Verify**

Run: `npm run verify`
Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add client/src/components/consultants/SortSelect.tsx client/src/pages/Consultants.tsx client/src/components/consultants/FilterSidebar.tsx
git commit -m "feat: add sort control and mobile filter sheet to browse"
```

---

### Task 8: Profile — header and reviews

**Files:**
- Modify: `client/src/pages/ConsultantProfile.tsx`
- Create: `client/src/components/consultants/ReviewList.tsx`

**Interfaces:**
- Consumes: `getReviewsFor` (Task 3), `reviewsSummary`, `avgRating` (Task 3), `bioLine` (Task 2).
- Produces: `ReviewList({ consultant }: { consultant: Consultant })`.

- [ ] **Step 1: Rewrite the header**

`surface-subtle` — **not** ink, per spec §4.3, which reserves ink so it stays a signal. Large portrait, name, title, location, experience, rating, response time, and the verified state. Two columns below: about, services, and reviews on the left; the sticky booking widget on the right.

- [ ] **Step 2: Build `ReviewList.tsx`**

Render the sample reviews with author name, star rating, and formatted date via `formatDate`, then the `reviewsSummary` line beneath. The label is what keeps this honest — it states the total, so nothing implies eighteen reviews exist when there are three.

- [ ] **Step 3: Fix `Rating` for a zero count**

`Rating.tsx:36` currently renders `({reviewCount})` whenever `reviewCount !== undefined`, so a consultant with `reviewCount: 0` shows `(0)`. Only render the suffix when `reviewCount > 0`. This is Review Focus item 3.

- [ ] **Step 4: Verify against a zero-count consultant**

Run `npm run dev`, open a profile, and confirm the rating shows no empty parenthesis. Confirm the reviews section states the true total, not the sample size.

- [ ] **Step 5: Verify**

Run: `npm run verify`
Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add client/src/pages/ConsultantProfile.tsx client/src/components/consultants/ReviewList.tsx client/src/components/ui/Rating.tsx
git commit -m "feat: rebuild profile header and add honestly labelled reviews"
```

---

### Task 9: Split `BookingWidget`

**Files:**
- Create: `client/src/components/consultants/booking/ServiceStep.tsx`
- Create: `client/src/components/consultants/booking/SlotStep.tsx`
- Modify: `client/src/components/consultants/BookingWidget.tsx`
- Test: `client/check-logic.ts` already guards the booking logic — it must stay green

**Interfaces:**
- Consumes: `generateSlots`, `bookedTimes`, `upcomingDays` from `lib/booking.ts` — **unchanged**.
- Produces: `ServiceStep({ services, selectedId, onSelect })`.
- Produces: `SlotStep({ duration, bookedTimes, selectedDate, onSelectDate, selectedTime, onSelectTime })`.
- `BookingWidget` keeps its current props signature so `ConsultantProfile.tsx` does not change.

- [ ] **Step 1: Confirm the logic baseline**

Run: `npm run check:logic`
Expected: PASS on every existing booking check. This is the regression net for the rest of this task — `check-logic.ts` covers overlap detection, slot generation, and weekday exclusion, which is exactly the behaviour a refactor here would break.

- [ ] **Step 2: Extract `ServiceStep`**

Service radio list. Takes the three props above; holds no state.

- [ ] **Step 3: Extract `SlotStep`**

Date picker and slot grid. Takes the six props above; holds no state. All slot generation stays in `lib/booking.ts` — `SlotStep` renders what it is given and computes nothing.

- [ ] **Step 4: Make `BookingWidget` the coordinator**

It owns `selectedServiceId`, `selectedDate`, and `selectedTime`, and passes them down. No rendering of the two sub-steps' internals.

- [ ] **Step 5: Verify the behaviour is unchanged**

Run: `npm run verify`
Expected: typecheck, all logic checks, and build pass.

Then run `npm run dev` and complete a real booking end to end: pick a service, pick a date, pick a slot, confirm. Confirm a slot already taken by another appointment is still rejected.

- [ ] **Step 6: Commit**

```bash
git add client/src/components/consultants/booking client/src/components/consultants/BookingWidget.tsx
git commit -m "refactor: split BookingWidget into service and slot steps"
```

---

### Task 10: Client area — ink dashboard header

**Files:**
- Modify: `client/src/components/layout/DashboardLayout.tsx`
- Modify: `client/src/pages/client/ClientDashboard.tsx`
- Modify: `client/src/pages/client/ClientAppointments.tsx`

**Interfaces:**
- Consumes: `InkBand` (Task 4), `Button` on-ink variants (Task 1).
- No new exports.

- [ ] **Step 1: Ink header in `DashboardLayout`**

An `InkBand` carrying the page title and the account menu. The sidebar stays on `surface` — ink is the header band only, per spec §4.4.

- [ ] **Step 2: Give the upcoming appointment real presence on the dashboard**

It is the one thing the user came to the dashboard for. Move it above the stat cards and make it visually dominant. Keep the stats, derived as they already are.

- [ ] **Step 3: Turn the appointments status filters into a segmented control**

On ink, using `border-ink-line` and `text-on-ink` for the active state. Filter behaviour is unchanged.

- [ ] **Step 4: Verify**

Run: `npm run dev`, sign in, and confirm both client pages render correctly at 360 / 768 / 1280.

Run `npm run verify`. Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add client/src/components/layout/DashboardLayout.tsx client/src/pages/client
git commit -m "feat: add ink header band and reprioritise the client dashboard"
```

---

### Task 11: Auth aside and footer on ink

**Files:**
- Modify: `client/src/components/marketing/AuthShell.tsx`
- Modify: `client/src/components/layout/Footer.tsx`

**Interfaces:**
- Consumes: `InkBand` (Task 4), `Button` on-ink variants (Task 1).
- No new exports.

- [ ] **Step 1: Put the auth aside on ink**

The form panel stays on cream so inputs keep their familiar treatment; only the aside becomes `InkBand`. This is the last permitted ink surface.

- [ ] **Step 2: Restyle the footer on ink**

Closing band, mirroring the hero. Keep every existing link and the copyright line, restyled with `on-ink` and `on-ink-muted`.

- [ ] **Step 3: Verify**

Run `npm run dev`. Visit `/`, `/login`, `/register`, `/become-a-consultant`. Confirm no page has more than two ink bands and that link contrast passes against ink.

Run `npm run verify`. Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/marketing/AuthShell.tsx client/src/components/layout/Footer.tsx
git commit -m "feat: apply ink surfaces to the auth aside and footer"
```

---

### Task 12: Polish sweep

**Files:**
- Modify: as findings require, across the files touched above
- Test: manual, at three viewports

**Interfaces:**
- No new exports. This task may adjust styles and add focus handling; it must not change any component's public props.

- [ ] **Step 1: Check every route at three widths**

`/`, `/consultants`, `/consultants/:id`, `/login`, `/register`, `/become-a-consultant`, `/client/dashboard`, `/client/appointments` at 360px, 768px, and 1280px. Look for horizontal scroll first — it is the most likely regression from the full-bleed ink bands.

- [ ] **Step 2: Check the long-name overflow case**

Open a consultant whose name is longest at 360px inside the hero card and the dashboard header. It must truncate or wrap cleanly. This is Review Focus item 5.

- [ ] **Step 3: Keyboard-only pass**

Tab through the hero rotation controls, the filter sheet, the sort select, and the booking widget. Confirm every stop has a visible ring **against its own surface** — the cream-tuned default ring vanishes on ink. Confirm the sheet closes on `Escape` and restores focus.

- [ ] **Step 4: Reduced-motion pass**

With reduced motion emulated, confirm the hero does not auto-advance, that `Reveal` content is visible without scrolling to trigger it, and that the manual next control still works. This is Review Focus item 4.

- [ ] **Step 5: Contrast sweep**

For every ink band, confirm `on-ink`, `on-ink-muted`, `accent-on-ink`, and `gold-on-ink` all clear AA against `surface-ink`. `check-logic.ts` pins the token values; this confirms nothing was overridden in a component.

- [ ] **Step 6: Final honesty audit**

Read every page's JSX and trace each visible figure back to `consultants` or `services`. No literals. No quote marks around the `bioLine` output. The reviews section states its true total.

- [ ] **Step 7: Verify and commit**

Run: `npm run verify`. Expected: pass.

```bash
git add -A
git commit -m "style: polish sweep for contrast, keyboard, and responsive"
```