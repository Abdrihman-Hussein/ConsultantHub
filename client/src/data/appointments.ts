import { Appointment } from '../types';
import { consultants } from './consultants';

// Appointments are stored as seeds and hydrated from `consultants` so that names
// and avatars can never drift out of sync with the consultant directory.
type AppointmentSeed = Omit<Appointment, 'consultantName' | 'consultantAvatar'>;

const seeds: AppointmentSeed[] = [
  {
    id: 'a1',
    clientId: 'u1',
    consultantId: '2',
    serviceName: 'Architecture Review',
    date: '2026-10-24',
    startTime: '10:00',
    endTime: '11:30',
    status: 'PENDING',
    meetingType: 'video',
  },
  {
    id: 'a2',
    clientId: 'u1',
    consultantId: '1',
    serviceName: 'Marketing Strategy Session',
    date: '2026-10-28',
    startTime: '14:00',
    endTime: '15:00',
    status: 'CONFIRMED',
    meetingType: 'in-person',
    location: 'SF Office',
  },
  {
    id: 'a3',
    clientId: 'u1',
    consultantId: '4',
    serviceName: 'Financial Modeling Consultation',
    date: '2026-09-25',
    startTime: '09:00',
    endTime: '10:00',
    status: 'COMPLETED',
    meetingType: 'video',
  },
  {
    id: 'a4',
    clientId: 'u1',
    consultantId: '3',
    serviceName: 'Contract Review',
    date: '2026-09-18',
    startTime: '11:00',
    endTime: '12:00',
    status: 'COMPLETED',
    meetingType: 'video',
  },
  {
    id: 'a5',
    clientId: 'u1',
    consultantId: '2',
    serviceName: 'Quick Consultation',
    date: '2026-09-10',
    startTime: '14:00',
    endTime: '15:00',
    status: 'CANCELLED',
    meetingType: 'video',
  },
];

export const appointments: Appointment[] = seeds.map((seed) => {
  const consultant = consultants.find((candidate) => candidate.id === seed.consultantId);

  if (!consultant) {
    throw new Error(`appointments: unknown consultantId "${seed.consultantId}"`);
  }

  return {
    ...seed,
    consultantName: consultant.name,
    consultantAvatar: consultant.avatar,
  };
});
