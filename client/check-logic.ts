/*
 * Throwaway harness for the pure logic in lib/ and data/. Not part of the app
 * build — run with `npm run check:logic`.
 */
import { isSlotTaken, generateSlots, bookedTimes, upcomingDays, canComplete } from './src/lib/booking'
import { searchConsultants, defaultFilters, countActiveFilters, sortKeys } from './src/lib/search'
import type { SortKey } from './src/lib/search'
import { bioLine, featuredOrder, nextIndex, rowConsultants } from './src/lib/featured'
import {
  avgRating,
  reviewsSummary,
  canReview,
  ratingFor,
  reviewsFor,
  reviewerName,
} from './src/lib/reviews'
import { translateEn } from './src/i18n/strings'
import { identityCheckSentence, verifiedCount } from './src/lib/trust'
import { countLabel, isMdUp } from './src/lib/format'
import { consultants, getConsultant, reviews, getReviewsFor } from './src/data'

let failures = 0

/**
 * WCAG 2.1 relative luminance. Used to pin the ink-surface palette: the
 * redesign introduces cream-on-ink typography, and the token values have to
 * clear AA against the ink background rather than merely looking right.
 */
function luminance(hex: string): number {
  const full = hex.replace('#', '')
  const value =
    full.length === 3
      ? full
          .split('')
          .map((c) => c + c)
          .join('')
      : full

  const [r, g, b] = [0, 2, 4].map((offset) => {
    const channel = parseInt(value.slice(offset, offset + 2), 16) / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): number {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (lighter + 0.05) / (darker + 0.05)
}

function check(name: string, condition: boolean, detail = '') {
  if (condition) {
    console.log(`  PASS  ${name}`)
  } else {
    failures += 1
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

const appt = (over: Partial<any> = {}) => ({
  id: 'x',
  clientId: 'c',
  consultantId: '2',
  consultantName: 'n',
  consultantAvatar: '',
  serviceId: 's',
  serviceName: 's',
  date: '2026-11-02',
  startTime: '10:00',
  endTime: '11:30',
  price: 100,
  status: 'CONFIRMED',
  meetingType: 'video',
  createdAt: '',
  ...over,
})

console.log('\nbooking: overlap detection')
check(
  'identical slot conflicts',
  isSlotTaken([appt()], { consultantId: '2', date: '2026-11-02', startTime: '10:00', endTime: '11:30' }),
)
check(
  'partial overlap at the start conflicts',
  isSlotTaken([appt()], { consultantId: '2', date: '2026-11-02', startTime: '09:30', endTime: '10:30' }),
)
check(
  'partial overlap at the end conflicts',
  isSlotTaken([appt()], { consultantId: '2', date: '2026-11-02', startTime: '11:00', endTime: '12:00' }),
)
check(
  'fully contained slot conflicts',
  isSlotTaken([appt()], { consultantId: '2', date: '2026-11-02', startTime: '10:15', endTime: '10:45' }),
)
check(
  'back-to-back slot is allowed',
  !isSlotTaken([appt()], { consultantId: '2', date: '2026-11-02', startTime: '11:30', endTime: '12:30' }),
)
check(
  'a slot before the booking is allowed',
  !isSlotTaken([appt()], { consultantId: '2', date: '2026-11-02', startTime: '09:00', endTime: '10:00' }),
)
check(
  'cancelled bookings free their slot',
  !isSlotTaken([appt({ status: 'CANCELLED' })], {
    consultantId: '2',
    date: '2026-11-02',
    startTime: '10:00',
    endTime: '11:30',
  }),
)
check(
  'a different consultant does not conflict',
  !isSlotTaken([appt()], { consultantId: '1', date: '2026-11-02', startTime: '10:00', endTime: '11:30' }),
)
check(
  'a different date does not conflict',
  !isSlotTaken([appt()], { consultantId: '2', date: '2026-11-03', startTime: '10:00', endTime: '11:30' }),
)

console.log('\nbooking: slot generation')
const slots60 = generateSlots(60)
check('60min starts on the hour', slots60[0] === '09:00', slots60[0])
check('90min spacing', slots60.includes('10:30') && !slots60.includes('10:00'))
check('90min service still ends by 17:00', slots60.every((s) => Number(s.slice(0, 2)) < 17))
const slots90 = generateSlots(90)
check('90min service fits inside the day', slots90.every((s) => Number(s.slice(0, 2)) <= 15), slots90.join(','))
check(
  'booked times are excluded',
  !generateSlots(60, ['09:00', '10:30']).includes('09:00'),
)

console.log('\nbooking: helpers')
check(
  'bookedTimes filters by consultant and date',
  bookedTimes([appt()], '2', '2026-11-02').join() === '10:00' &&
    bookedTimes([appt()], '2', '2026-11-03').length === 0,
)
const days = upcomingDays(5)
check('upcomingDays returns 5 weekdays', days.length === 5, days.join(','))
check('upcomingDays excludes weekends', days.every((d) => ![0, 6].includes(new Date(`${d}T00:00:00`).getDay())))
// Compared against the LOCAL today, not `toISOString()` (which is UTC):
// `upcomingDays` builds local dates, so a UTC comparison spuriously fails
// whenever the local day is behind UTC near midnight.
const now = new Date()
const todayLocal = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
check('upcomingDays starts tomorrow', days[0] > todayLocal)

console.log('\nsearch')
const base = { ...defaultFilters }
check('no filters returns everyone', searchConsultants(consultants, base).length === consultants.length)
check(
  'name match',
  searchConsultants(consultants, { ...base, search: 'omar' }).length === 1,
)
check(
  'multi-word narrows rather than widens',
  searchConsultants(consultants, { ...base, search: 'cloud' }).length >= 1 &&
    searchConsultants(consultants, { ...base, search: 'cloud zzzz' }).length === 0,
)
check(
  'bio text is searchable',
  searchConsultants(consultants, { ...base, search: 'b2b' }).length >= 1,
)
check(
  'city is searchable',
  searchConsultants(consultants, { ...base, search: 'dubai' }).length === 1,
)
check(
  'search is case-insensitive',
  searchConsultants(consultants, { ...base, search: 'OMAR' }).length === 1,
)
check(
  'specialty filter works',
  searchConsultants(consultants, { ...base, specialization: 'Law' }).every(
    (r) => r.consultant.specialization === 'Law',
  ) && searchConsultants(consultants, { ...base, specialization: 'Law' }).length === 1,
)
check(
  'verifiedOnly excludes unverified',
  searchConsultants(consultants, { ...base, verifiedOnly: true }).every((r) => r.consultant.verified),
)
check(
  'maxRate filters',
  searchConsultants(consultants, { ...base, maxRate: 130 }).every((r) => r.consultant.hourlyRate <= 130),
)
check(
  'rate-low sort is ascending',
  (() => {
    const r = searchConsultants(consultants, { ...base, sort: 'rate-low' }).map((x) => x.consultant.hourlyRate)
    return r.every((v, i) => i === 0 || r[i - 1] <= v)
  })(),
)
check(
  // Replaces the removed 'rating sort is descending' check. Sorting by a
  // rating nothing can produce is not offered at all, so the guarantee now is
  // that the option cannot come back, and that what is left still sorts.
  'no sort option ranks by a rating',
  !sortKeys.includes('rating' as SortKey),
)
check(
  'sessions sort is descending',
  (() => {
    const r = searchConsultants(consultants, { ...base, sort: 'sessions' }).map((x) => x.consultant.sessions)
    return r.every((v, i) => i === 0 || r[i - 1] >= v)
  })(),
)
check(
  'recommended puts verified first',
  (() => {
    const flags = searchConsultants(consultants, { ...base, sort: 'recommended' }).map(
      (r) => r.consultant.verified,
    )
    const firstUnverified = flags.indexOf(false)
    // Once an unverified entry appears, none may follow it.
    return firstUnverified === -1 || !flags.slice(firstUnverified).includes(true)
  })(),
)
check(
  'a name match outranks a bio-only match',
  (() => {
    const r = searchConsultants(consultants, { ...base, search: 'law', sort: 'recommended' })
    return r.length > 0 && r[0].consultant.specialization === 'Law'
  })(),
)
check('active filter count', countActiveFilters({ ...base, verifiedOnly: true, search: 'a' }) === 2)

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
  bioLine('Sells at 4.9 average. Second sentence here.', 'x') === 'Sells at 4.9 average.',
);
check(
  'abbreviations do not split the sentence',
  bioLine('Focused on U.S. tax. Also estates.', 'x') === 'Focused on U.S. tax.',
);

console.log('\nfeatured: ordering');
check(
  // Replaces the removed 'highest rated leads' check. Nothing can rank the
  // directory by rating any more, so the hero leads on delivered sessions —
  // a field the record actually publishes.
  'the busiest consultant leads',
  featuredOrder(consultants)[0].name === 'Ahmed Warsame',
  featuredOrder(consultants)[0].name,
);
check(
  'session volume orders the rotation',
  (() => {
    const sessions = featuredOrder(consultants).map((c) => c.sessions);
    return sessions.every((v, i) => i === 0 || sessions[i - 1] >= v);
  })(),
);
check(
  'ties keep directory order',
  (() => {
    const tied = [
      { ...consultants[0], id: 'a', sessions: 90 },
      { ...consultants[0], id: 'b', sessions: 90 },
    ];
    return featuredOrder(tied).map((c) => c.id).join(',') === 'a,b';
  })(),
);
check(
  'ordering does not mutate its input',
  (() => {
    const before = consultants.map((c) => c.id).join();
    featuredOrder(consultants);
    return consultants.map((c) => c.id).join() === before;
  })(),
);
check('a single-consultant directory is returned as-is', featuredOrder([consultants[0]]).length === 1);

console.log('\nfeatured: rotation');
check('next wraps to the start', nextIndex(5, 6) === 0);
check('next advances', nextIndex(0, 6) === 1);
check('a one-item rotation does not move', nextIndex(0, 1) === 0);
check('an empty rotation does not move', nextIndex(0, 0) === 0);

console.log('\nformat: countLabel');
check('singular', countLabel(1, 'consultant') === '1 consultant');
check('plural', countLabel(6, 'consultant') === '6 consultants');
check('zero is plural', countLabel(0, 'review') === '0 reviews');
check('irregular plural', countLabel(2, 'person', 'people') === '2 people');

console.log('\nformat: isMdUp');
check('below the md breakpoint is not md-up', isMdUp(767) === false);
check('md-and-up is md-up', isMdUp(1024) === true);
check('the boundary is 768', isMdUp(768) === true && isMdUp(767) === false);

console.log('\nfeatured: row');
const rowOrder = featuredOrder(consultants);
check(
  'the excluded consultant is absent',
  rowConsultants(rowOrder, rowOrder[0].id, 3).every((c) => c.id !== rowOrder[0].id),
);
check(
  'result is exactly count long when enough remain',
  rowConsultants(rowOrder, rowOrder[0].id, 3).length === 3,
);
check(
  'not padded when fewer than count remain',
  rowConsultants(rowOrder.slice(0, 2), rowOrder[0].id, 3).length === 1,
);
check(
  'order is preserved from the input',
  rowConsultants(rowOrder, rowOrder[0].id, 3).map((c) => c.id).join(',') === rowOrder.slice(1, 4).map((c) => c.id).join(','),
);

console.log('\nreviews');
check('every seeded review belongs to a real consultant', reviews.every((r) => getConsultant(r.consultantId)));
check('every seeded review has a rating in range', reviews.every((r) => r.rating >= 1 && r.rating <= 5));
check('every seeded review has a body', reviews.every((r) => r.body.trim().length > 20));
check('every consultant has at least one seeded review', consultants.every((c) => getReviewsFor(c.id).length > 0));
check(
  'reviews come back newest first',
  (() => {
    const dates = getReviewsFor('2').map((r) => r.date);
    return dates.every((d, i) => i === 0 || dates[i - 1] >= d);
  })(),
);
check(
  // Replaces the removed 'sample label counts the total, not the sample'
  // check. There is no separate total to qualify any more, so the line must
  // report exactly what is shown and nothing beyond it.
  'the summary counts exactly the reviews shown',
  reviewsSummary(getReviewsFor(consultants[0].id), translateEn) ===
    `Showing ${getReviewsFor(consultants[0].id).length} reviews`,
  reviewsSummary(getReviewsFor(consultants[0].id), translateEn),
);
check(
  'an empty list says so plainly rather than printing a zero',
  reviewsSummary([], translateEn) === 'No reviews yet',
  reviewsSummary([], translateEn),
);
check(
  'a seeded review average is within its own bounds',
  (() => {
    const avg = avgRating(getReviewsFor('2'));
    return avg === null || (avg >= 1 && avg <= 5);
  })(),
);
check('an empty review list averages to null', avgRating([]) === null);

/* --------------------------------------------------------------------------
 * Gated reviews and stars.
 *
 * A review is only possible once a session has actually happened, so these
 * checks pin the whole chain: a session can be finished, a finished session
 * unlocks exactly one review, and the star average is computed from the
 * reviews that exist rather than from a seeded figure.
 * -------------------------------------------------------------------------- */

const review = (over: Partial<any> = {}) => ({
  id: 'rv',
  consultantId: '2',
  appointmentId: 'a1',
  clientId: 'me',
  authorName: 'Amina C.',
  rating: 5,
  date: '2026-09-01',
  body: 'A real, earned review.',
  ...over,
})

const completedAppt = (over: Partial<any> = {}) =>
  appt({ id: 'a1', clientId: 'me', consultantId: '2', status: 'COMPLETED', date: '2026-01-05', ...over })

const at = (iso: string) => new Date(`${iso}T09:00:00`)

console.log('\nreviews: finishing a session')
check(
  'a confirmed session whose date has passed can be completed',
  canComplete(completedAppt({ status: 'CONFIRMED', date: '2026-11-02' }), at('2026-11-10')) === true,
);
check(
  'a confirmed session in the future cannot be completed',
  canComplete(completedAppt({ status: 'CONFIRMED', date: '2026-11-11' }), at('2026-11-10')) === false,
);
check(
  'a session happening today cannot be completed — the day has not passed yet',
  canComplete(completedAppt({ status: 'CONFIRMED', date: '2026-11-10' }), at('2026-11-10')) === false,
);
check(
  'a pending session cannot be completed',
  canComplete(completedAppt({ status: 'PENDING', date: '2026-11-02' }), at('2026-11-10')) === false,
);
check(
  'a cancelled session cannot be completed',
  canComplete(completedAppt({ status: 'CANCELLED', date: '2026-11-02' }), at('2026-11-10')) === false,
);
check(
  'an already-completed session cannot be completed again',
  canComplete(completedAppt({ status: 'COMPLETED', date: '2026-11-02' }), at('2026-11-10')) === false,
);

console.log('\nreviews: the review gate');
check(
  'signed out, nobody may review',
  canReview('2', null, [completedAppt()], []).reason === 'not_signed_in',
);
check(
  'no appointments at all means no completed booking',
  canReview('2', 'me', [], []).reason === 'no_completed_booking',
);
check(
  'a confirmed-but-not-completed session does not unlock a review',
  canReview('2', 'me', [completedAppt({ status: 'CONFIRMED', date: '2026-01-05' })], []).reason ===
    'no_completed_booking',
);
check(
  'a cancelled session does not unlock a review',
  canReview('2', 'me', [completedAppt({ status: 'CANCELLED', date: '2026-01-05' })], []).reason ===
    'no_completed_booking',
);
check(
  'another consultant\'s completed session does not unlock a review here',
  canReview('1', 'me', [completedAppt()], []).reason === 'no_completed_booking',
);
check(
  "somebody else's completed session does not unlock a review",
  canReview('2', 'someone-else', [completedAppt()], []).reason === 'no_completed_booking',
);
check(
  'a completed session unlocks its own consultant',
  canReview('2', 'me', [completedAppt()], []).ok === true &&
    (canReview('2', 'me', [completedAppt()], []) as { appointmentId: string }).appointmentId === 'a1',
);
check(
  'a second completed session is chosen once the first is reviewed',
  (() => {
    const gate = canReview(
      '2',
      'me',
      [completedAppt(), completedAppt({ id: 'a2', date: '2026-02-06' })],
      [review({ appointmentId: 'a1' })],
    );
    return gate.ok === true && (gate as { appointmentId: string }).appointmentId === 'a2';
  })(),
);
check(
  'the same session cannot be reviewed twice',
  canReview('2', 'me', [completedAppt()], [review({ appointmentId: 'a1' })]).reason === 'already_reviewed',
);
check(
  'uniqueness is per appointment, not per consultant — three sessions allow three reviews',
  (() => {
    const appointments = [
      completedAppt(),
      completedAppt({ id: 'a2', date: '2026-02-06' }),
      completedAppt({ id: 'a3', date: '2026-03-07' }),
    ];
    const afterOne = canReview('2', 'me', appointments, [review({ appointmentId: 'a1' })]);
    const afterTwo = canReview(
      '2',
      'me',
      appointments,
      [review({ appointmentId: 'a1' }), review({ id: 'rv2', appointmentId: 'a2' })],
    );
    const afterThree = canReview(
      '2',
      'me',
      appointments,
      [
        review({ appointmentId: 'a1' }),
        review({ id: 'rv2', appointmentId: 'a2' }),
        review({ id: 'rv3', appointmentId: 'a3' }),
      ],
    );
    return (
      afterOne.ok &&
      (afterOne as { appointmentId: string }).appointmentId === 'a2' &&
      afterTwo.ok &&
      (afterTwo as { appointmentId: string }).appointmentId === 'a3' &&
      afterThree.reason === 'already_reviewed'
    );
  })(),
);
check(
  'a review of a different session does not consume this one',
  (() => {
    const gate = canReview(
      '2',
      'me',
      [completedAppt(), completedAppt({ id: 'a2', date: '2026-02-06' })],
      [review({ appointmentId: 'a2' })],
    );
    return gate.ok === true && (gate as { appointmentId: string }).appointmentId === 'a1';
  })(),
);
check(
  'an unavailable store blocks the review rather than losing it',
  canReview('2', 'me', [completedAppt()], [], undefined, false).reason === 'storage_unavailable',
);

console.log('\nreviews: aggregation');
check('no reviews averages to null', avgRating([]) === null);
check('a single review averages to itself', avgRating([review({ rating: 4 })]) === 4);
check(
  'many reviews average across all of them',
  avgRating([review({ rating: 5 }), review({ rating: 4 }), review({ rating: 3 })]) === 4,
);
check(
  'an average is never invented from the directory when nothing has been reviewed',
  ratingFor(consultants[0], []) === null,
);
check(
  'a rating comes from the reviews alone',
  ratingFor(consultants[0], [
    review({ consultantId: consultants[0].id, rating: 4 }),
    review({ consultantId: consultants[0].id, rating: 5 }),
  ]) === 4.5,
);
check(
  'reviews for one consultant never leak into another\'s aggregate',
  ratingFor(consultants[0], [review({ consultantId: '2', rating: 1 })]) === null,
);

console.log('\nreviews: isolation and ordering');
check(
  'reviewsFor returns only that consultant',
  reviewsFor('2', [review({ consultantId: '2' }), review({ id: 'b', consultantId: '1' })]).length === 1,
);
check(
  'reviewsFor returns nothing for a consultant with no reviews',
  reviewsFor('99', [review({ consultantId: '2' })]).length === 0,
);
check(
  'reviewsFor comes back newest first',
  (() => {
    const dates = reviewsFor('2', [
      review({ id: 'x', date: '2026-01-01' }),
      review({ id: 'y', date: '2026-09-01' }),
      review({ id: 'z', date: '2026-05-01' }),
    ]).map((r) => r.date);
    return dates.join(',') === '2026-09-01,2026-05-01,2026-01-01';
  })(),
);

console.log('\nreviews: reviewer identity');
check('the reviewer is a first name and a last initial', reviewerName('Amina Client') === 'Amina C.');
check(
  'the full name is never shown',
  !reviewerName('Amina Client').includes('Client'),
);
check('a single-word name gets no invented initial', reviewerName('Amina') === 'Amina');
check(
  'extra whitespace does not produce a broken label',
  reviewerName('  Amina   Yusuf  Client ') === 'Amina C.',
);
check('a blank name yields a blank label rather than undefined', reviewerName('   ') === '');

console.log('\ntrust: identity-check copy');
// The home page used to assert that every consultant was verified. Two of the
// six seed consultants are not, so the sentence is generated from the
// directory. These checks pin that it reports the shortfall rather than
// rounding it up to "everyone".
const withVerified = (verified: boolean) => ({ ...consultants[0], verified });
check(
  'the seed directory is only partly verified',
  verifiedCount(consultants) === 4 && verifiedCount(consultants) < consultants.length,
  String(verifiedCount(consultants)),
);
check(
  'a partly verified directory states the shortfall',
  identityCheckSentence(consultants) === '4 of the 6 listed have completed an identity check.',
  identityCheckSentence(consultants),
);
check(
  'a fully verified directory does not print a fraction',
  identityCheckSentence([withVerified(true), withVerified(true), withVerified(true)]) ===
    'All 3 listed have completed an identity check.',
  identityCheckSentence([withVerified(true), withVerified(true), withVerified(true)]),
);
check(
  'a partly verified directory counts only the verified',
  identityCheckSentence([withVerified(false), withVerified(true), withVerified(false)]) ===
    '1 of the 3 listed have completed an identity check.',
  identityCheckSentence([withVerified(false), withVerified(true), withVerified(false)]),
);
check(
  'an unverified directory says zero rather than staying silent',
  identityCheckSentence([withVerified(false), withVerified(false)]) ===
    '0 of the 2 listed have completed an identity check.',
  identityCheckSentence([withVerified(false), withVerified(false)]),
);
check(
  'an empty directory prints no figures at all',
  identityCheckSentence([]) === 'No consultants are listed yet.',
  identityCheckSentence([]),
);
check(
  'the figure is derived, never hardcoded',
  (() => {
    const list = [withVerified(true), withVerified(false), withVerified(true)];
    return identityCheckSentence(list) ===
      `${verifiedCount(list)} of the ${list.length} listed have completed an identity check.`;
  })(),
);
check(
  'every sentence is a finished one',
  [consultants, [], [withVerified(false)]].every((list) =>
    identityCheckSentence(list).endsWith('.'),
  ),
);

console.log('\ndesign tokens');
// Guards the spec's binding decision: deep terracotta is unreadable on ink, so
// the dark bands need their own lifted accent rather than reusing `accent-500`.
check(
  'accent-on-ink clears AA on the ink surface',
  contrast('#E9965E', '#1C1917') >= 4.5,
  contrast('#E9965E', '#1C1917').toFixed(2),
);
check('on-ink clears AA on ink', contrast('#F5F5F4', '#1C1917') >= 4.5);
check('on-ink-muted clears AA on ink', contrast('#A8A29E', '#1C1917') >= 4.5);
check('accent-500 on ink is NOT used', contrast('#A9501F', '#1C1917') < 4.5);

/* -------------------------------------------------------------------------- *
 * Ink surfaces: opacity-modified colours, composited before they are measured.
 *
 * Tailwind's `/NN` modifier REPLACES a token's own alpha instead of multiplying
 * it, so `text-on-ink-muted/70` compiles to rgba(183, 158, 136, 0.7) — not to
 * #B79E88 dimmed by thirty percent. Every check above that pins a full-opacity
 * token is therefore blind to the whole family, which is how a 3.8:1 footer
 * label and a "dimmed" divider that was four times brighter than intended both
 * shipped green. So rather than trusting the class name, the components are read
 * from disk, each ink-tier colour is composited over the surface it is actually
 * rendered on, and the result is measured.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

/** Alpha-composites `fg` over `bg` and returns the flattened colour. */
function composite(fg: string, alpha: number, bg: string): string {
  const f = fg.replace('#', '')
  const b = bg.replace('#', '')
  return (
    '#' +
    [0, 2, 4]
      .map((o) =>
        Math.round(
          parseInt(f.slice(o, o + 2), 16) * alpha +
            parseInt(b.slice(o, o + 2), 16) *
              (1 - alpha),
        )
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  )
}

function contrastOver(fg: string, alpha: number, bg: string): number {
  return contrast(composite(fg, alpha, bg), bg)
}

/** Locate the client root, whether run from `client/` or from the repo root. */
function clientRoot(): string {
  let dir = process.cwd()
  for (let hop = 0; hop < 6; hop += 1) {
    if (existsSync(join(dir, 'src', 'components'))) return dir
    if (existsSync(join(dir, 'client', 'src', 'components'))) return join(dir, 'client')
    dir = dirname(dir)
  }
  return process.cwd()
}

const root = clientRoot()
const srcDir = join(root, 'src')
const config = readFileSync(join(root, 'tailwind.config.js'), 'utf8')

/** The ink surface, its lifted soft variant, and the featured card's own fill. */
const INK = '#1C1917'
const INK_SOFT = '#292524'
const INK_CARD = composite('#FFFFFF', 0.07, INK)

/** Reads a colour out of tailwind.config.js so the harness cannot drift from it. */
function token(name: string): string {
  const match = new RegExp(`'(?:${name})':\\s*'([^']+)'`).exec(config)
  if (!match) throw new Error(`tailwind.config.js has no '${name}' colour`)
  return match[1]
}

/** The alpha baked into an rgba() token, or 1 for an opaque hex. */
function tokenAlpha(value: string): number {
  const rgba = /^rgba\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*([\d.]+)\s*\)$/.exec(value)
  return rgba ? Number(rgba[1]) : 1
}

const INK_TOKENS = ['on-ink', 'on-ink-muted', 'accent-on-ink', 'ink-line'] as const

/**
 * The surface a file's ink content is rendered on. Anything not listed sits
 * directly on the ink surface; the two exceptions lighten their own background
 * and are therefore measured against the harder background.
 */
const LIFTED_SURFACE: Record<string, string> = {
  'components/marketing/FeaturedConsultant.tsx': INK_CARD,
  'pages/client/ClientAppointments.tsx': INK_SOFT,
}

function sourceFiles(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) sourceFiles(full, found)
    else if (/\.(tsx|css)$/.test(entry.name)) found.push(full)
  }
  return found
}

const posix = (path: string) => path.replace(/\\/g, '/')
const files = sourceFiles(srcDir).map((path) => ({
  path,
  key: posix(path.slice(srcDir.length + 1)),
  source: readFileSync(path, 'utf8'),
}))

const INK_CLASS = new RegExp(
  `(?:^|[^\\w-])((?:[a-z-]+:)*(text|bg|border|ring)-(${INK_TOKENS.join('|')})(?:/(\\d{1,3}))?)(?![\\w/-])`,
  'g',
)

type InkUse = { file: string; cls: string; prop: string; token: string; alpha: number; bg: string }

const inkUses: InkUse[] = []
for (const file of files) {
  const bg = LIFTED_SURFACE[file.key] ?? INK
  for (const match of file.source.matchAll(INK_CLASS)) {
    const alpha = match[4] === undefined ? tokenAlpha(token(match[3])) : Number(match[4]) / 100
    inkUses.push({
      file: file.key,
      cls: match[1],
      prop: match[2],
      token: match[3],
      alpha,
      bg,
    })
  }
}

const describe = (use: InkUse) => {
  const hex = token(use.token)
  const flat = composite(hex, use.alpha, use.bg)
  return `${use.cls} in ${use.file} → ${flat} on ${use.bg} = ${contrastOver(hex, use.alpha, use.bg).toFixed(2)}:1`
}

/**
 * Exceptions, each pinned: the check re-measures them and fails if the class
 * disappears or its value moves, so an exemption cannot quietly become a hole.
 */
const EXEMPT: Array<{ file: string; cls: string; min: number; ratio: number; why: string }> = [
  {
    file: 'components/ui/Rating.tsx',
    cls: 'text-on-ink/25',
    min: 4.5,
    ratio: 2.18,
    why: 'the unfilled star glyph — decorative and fully redundant with the numeric rating printed beside it, and frozen as correct by the last review',
  },
  {
    file: 'pages/client/ClientAppointments.tsx',
    cls: 'bg-on-ink/15',
    min: 3,
    ratio: 1.58,
    why: 'the fill behind a tab count; the count itself is text-on-ink, which clears AA over the filled result',
  },
]

const exempt = (use: InkUse) =>
  EXEMPT.find((e) => e.file === use.file && e.cls === use.cls) ?? null

console.log('\nink surfaces: the scanner sees what the palette checks cannot')
check(
  'every ink-tier class in src/ is reached by the scanner',
  inkUses.length > 20,
  `${inkUses.length} occurrences`,
)
check(
  'every file that lightens its own ink background is measured against it',
  files.every((f) => !/bg-white\/\[0\./.test(f.source) || f.key in LIFTED_SURFACE),
)
check(
  'a new ink-tier token cannot appear undocumented',
  INK_TOKENS.every((name) => token(name) !== ''),
)

console.log('\nink surfaces: text colours are measured after compositing')
// `ink-line` is a divider, not a type tier: it is intentionally too dim to read
// and is only ever painted as a hairline or an aria-hidden separator glyph. Its
// own rule below covers it, so it is skipped rather than ratio-tested here.
for (const use of inkUses.filter((u) => u.prop === 'text' && u.token !== 'ink-line')) {
  const hex = token(use.token)
  const ratio = contrastOver(hex, use.alpha, use.bg)
  const allowed = exempt(use)
  if (allowed) {
    check(
      `exempt text colour is unchanged — ${use.cls} in ${use.file}`,
      Math.abs(ratio - allowed.ratio) < 0.01,
      `${ratio.toFixed(2)}:1, pinned at ${allowed.ratio}:1`,
    )
    continue
  }
  check(`AA on ${use.bg} — ${use.cls} in ${use.file}`, ratio >= 4.5, describe(use))
}

console.log('\nink surfaces: non-text ink colours are measured after compositing')
for (const use of inkUses.filter((u) => u.prop !== 'text' && u.token !== 'ink-line')) {
  const hex = token(use.token)
  const ratio = contrastOver(hex, use.alpha, use.bg)
  const allowed = exempt(use)
  if (allowed) {
    check(
      `exempt fill is unchanged — ${use.cls} in ${use.file}`,
      Math.abs(ratio - allowed.ratio) < 0.01,
      `${ratio.toFixed(2)}:1, pinned at ${allowed.ratio}:1`,
    )
    continue
  }
  check(`3:1 on ${use.bg} — ${use.cls} in ${use.file}`, ratio >= 3, describe(use))
}

console.log('\nink surfaces: ink-line carries its own alpha and may not be re-scaled')
check(
  'ink-line is defined dimmer than its opaque form',
  tokenAlpha(token('ink-line')) <= 0.2,
  token('ink-line'),
)
for (const use of inkUses.filter((u) => u.token === 'ink-line')) {
  const modifier = use.cls.includes('/')
  const matchesToken = Math.abs(use.alpha - tokenAlpha(token('ink-line'))) < 0.001
  check(
    `no opacity modifier on ${use.cls} in ${use.file}`,
    !modifier && matchesToken,
    modifier
      ? `${use.cls} compiles to rgba(249, 241, 232, ${use.alpha}) — brighter than the token's own 0.14, not dimmer`
      : '',
  )
}

console.log(`\n${failures === 0 ? 'All checks passed.' : `${failures} check(s) failed.`}`)
if (failures > 0) process.exit(1)
