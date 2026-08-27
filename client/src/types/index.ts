export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CLIENT' | 'CONSULTANT' | 'ADMIN';
  avatar?: string;
}

export interface Consultant {
  id: string;
  userId: string;
  name: string;
  title: string;
  specialization: string;
  bio: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  location: string;
  experience: string;
  avatar: string;
  verified: boolean;
  sessions: number;
  responseTime: string;
}

export interface Service {
  id: string;
  consultantId: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  isFree: boolean;
}

export interface Availability {
  id: string;
  consultantId: string;
  date: string;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Appointment {
  id: string;
  clientId: string;
  consultantId: string;
  consultantName: string;
  consultantAvatar: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  meetingType: 'video' | 'in-person';
  location?: string;
}