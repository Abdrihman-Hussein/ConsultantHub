/*
 * Throwaway harness for the pure logic in lib/ and data/. Not part of the app
 * build — run with `npm run check:logic`.
 */
import { isSlotTaken, generateSlots, bookedTimes, upcomingDays } from './src/lib/booking'
import { searchConsultants, defaultFilters, countActiveFilters } from './src/lib/search'
import { consultants } from './src/data'

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
check('upcomingDays starts tomorrow', days[0] > new Date().toISOString().slice(0, 10))

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
  'minRating filters',
  searchConsultants(consultants, { ...base, minRating: 4.8 }).every((r) => r.consultant.rating >= 4.8),
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
  'rating sort is descending',
  (() => {
    const r = searchConsultants(consultants, { ...base, sort: 'rating' }).map((x) => x.consultant.rating)
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

console.log('\ndesign tokens');
// Guards the spec's binding decision: terracotta is unreadable on ink, so the
// dark bands need their own accent rather than reusing `accent-500`.
check(
  'accent-on-ink clears AA on the ink surface',
  contrast('#E8A05C', '#2A2118') >= 4.5,
  contrast('#E8A05C', '#2A2118').toFixed(2),
);
check('on-ink clears AA on ink', contrast('#F9F1E8', '#2A2118') >= 4.5);
check('on-ink-muted clears AA on ink', contrast('#B79E88', '#2A2118') >= 4.5);
check('gold-on-ink clears AA on ink', contrast('#E8C88A', '#2A2118') >= 4.5);
check('accent-500 on ink is NOT used', contrast('#C2622D', '#2A2118') < 4.5);

console.log(`\n${failures === 0 ? 'All checks passed.' : `${failures} check(s) failed.`}`)
if (failures > 0) process.exit(1)
