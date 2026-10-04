import type { Appointment, User } from '../types';

/**
 * Demo seed data.
 *
 * The accounts here are pre-built so the login form can be tried immediately.
 * Their password hashes were produced with `lib/crypto.ts`; see the comment on
 * `seedPassword` for how to reproduce them.
 *
 * Everything below is fictional sample content, not real people or companies.
 */

/**
 * Password for every seeded account: `consultant123`.
 *
 * The digests below are baked in so a fresh clone has a working login. They are
 * salted with the per-user salt stored as the prefix of `passwordHash`.
 */

export const seedUsers: User[] = [
  {
    id: 'u_client_demo',
    name: 'Sarah Client',
    email: 'sarah@example.com',
    role: 'CLIENT',
    passwordHash: 'demo-sarah:30014e1dfdb0670421263f68b710edfe926e3c3acbcf39f9627879a4ebdae911',
    createdAt: '2026-01-12T09:00:00.000Z',
  },
  {
    id: 'u_consultant_demo',
    name: 'David Consultant',
    email: 'david@example.com',
    role: 'CONSULTANT',
    passwordHash: 'demo-david:bd32cf2df9d2fe29c02834b322fb49ef863fdbae45253552b8aaf62192cb8fff',
    createdAt: '2026-01-20T09:00:00.000Z',
  },
];

/** Relative dates keep the dashboard meaningful whenever the app is opened. */
function relativeDate(offsetDays: number): string {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + offsetDays)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export const seedAppointments: Appointment[] = [
  {
    id: 'a_seed_1',
    clientId: 'u_client_demo',
    consultantId: '2',
    consultantName: 'David Chen',
    consultantAvatar: '',
    serviceId: 's3',
    serviceName: 'Architecture Review',
    date: relativeDate(4),
    startTime: '10:00',
    endTime: '11:30',
    price: 200,
    status: 'CONFIRMED',
    meetingType: 'video',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a_seed_2',
    clientId: 'u_client_demo',
    consultantId: '1',
    consultantName: 'Sarah Jenkins',
    consultantAvatar: '',
    serviceId: 's1',
    serviceName: 'Marketing Strategy Session',
    date: relativeDate(9),
    startTime: '14:00',
    endTime: '15:00',
    price: 150,
    status: 'PENDING',
    meetingType: 'in-person',
    location: 'SF Office',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a_seed_3',
    clientId: 'u_client_demo',
    consultantId: '4',
    consultantName: 'Marcus Thorne',
    consultantAvatar: '',
    serviceId: 's7',
    serviceName: 'Financial Modeling Consultation',
    date: relativeDate(-12),
    startTime: '09:00',
    endTime: '10:00',
    price: 120,
    status: 'COMPLETED',
    meetingType: 'video',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a_seed_4',
    clientId: 'u_client_demo',
    consultantId: '3',
    consultantName: 'Elena Rodriguez',
    consultantAvatar: '',
    serviceId: 's9',
    serviceName: 'Contract Review',
    date: relativeDate(-26),
    startTime: '11:00',
    endTime: '12:00',
    price: 250,
    status: 'COMPLETED',
    meetingType: 'video',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a_seed_5',
    clientId: 'u_client_demo',
    consultantId: '2',
    consultantName: 'David Chen',
    consultantAvatar: '',
    serviceId: 's4',
    serviceName: 'Quick Consultation',
    date: relativeDate(-40),
    startTime: '14:00',
    endTime: '15:00',
    price: 0,
    status: 'CANCELLED',
    meetingType: 'video',
    createdAt: new Date().toISOString(),
  },
];
