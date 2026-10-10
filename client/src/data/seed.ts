import type { Appointment } from '../types';

/**
 * Demo seed data.
 *
 * There are no seeded accounts. Accounts are Clerk's, created by signing up,
 * and there is nothing local to seed — which also means there is no demo
 * credential to type into a sign-in form.
 *
 * That has a visible consequence worth stating rather than hiding: every
 * appointment below belongs to `u_client_demo`, an account that no longer
 * exists. A real person who signs up owns none of them, so their dashboard is
 * empty and their review history starts empty. That is the honest state. No
 * appointments have been re-pointed at a real id to make the demo look
 * populated, because a booking attributed to somebody who never made it is
 * exactly the kind of claim this app does not make.
 *
 * Everything here is fictional sample content, not real people or companies.
 */

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
    consultantName: 'Omar Nur',
    consultantAvatar: '/portraits/consultant-2.svg',
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
    consultantName: 'Ahmed Warsame',
    consultantAvatar: '/portraits/consultant-1.svg',
    serviceId: 's1',
    serviceName: 'Marketing Strategy Session',
    date: relativeDate(9),
    startTime: '14:00',
    endTime: '15:00',
    price: 150,
    status: 'PENDING',
    meetingType: 'in-person',
    location: 'Mogadishu office',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a_seed_3',
    clientId: 'u_client_demo',
    consultantId: '4',
    consultantName: 'Hassan Ali',
    consultantAvatar: '/portraits/consultant-4.svg',
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
    consultantName: 'Khalid Abdi',
    consultantAvatar: '/portraits/consultant-3.svg',
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
    consultantName: 'Omar Nur',
    consultantAvatar: '/portraits/consultant-2.svg',
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
