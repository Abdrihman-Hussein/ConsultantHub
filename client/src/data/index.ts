/**
 * The consultant directory and their services.
 *
 * Static sample content for the MVP — a real build would serve this from an
 * API. Everyone listed here is fictional, and the portraits in
 * `public/portraits` are drawn illustrations rather than photographs.
 */

import type { Consultant, Service } from '../types';

export const consultants: Consultant[] = [
  {
    id: '1',
    userId: 'c1',
    name: 'Ahmed Warsame',
    title: 'Strategic Marketing',
    specialization: 'Marketing',
    bio: 'Go-to-market strategy for B2B SaaS. Over a decade scaling marketing teams across East Africa and the Gulf, and tying spend to pipeline with data rather than instinct.',
    rating: 4.9,
    reviewCount: 128,
    hourlyRate: 150,
    location: 'Mogadishu, Somalia',
    experience: '10+ years',
    avatar: '/portraits/consultant-1.svg',
    verified: true,
    sessions: 450,
    responseTime: 'under 2h',
  },
  {
    id: '2',
    userId: 'c2',
    name: 'Omar Nur',
    title: 'Systems Engineering',
    specialization: 'Engineering',
    bio: 'Cloud architecture and infrastructure optimisation. Previously led platform teams at large-scale enterprises, now focused on helping small teams avoid the same costly mistakes.',
    rating: 5.0,
    reviewCount: 95,
    hourlyRate: 200,
    location: 'Hargeisa, Somaliland',
    experience: '12 years',
    avatar: '/portraits/consultant-2.svg',
    verified: true,
    sessions: 320,
    responseTime: 'under 1h',
  },
  {
    id: '3',
    userId: 'c3',
    name: 'Khalid Abdi',
    title: 'Corporate Law',
    specialization: 'Law',
    bio: 'Strategic counsel on mergers, acquisitions, and governance. I translate regulatory complexity into plain language so you can make a decision without a lawyer translating it twice.',
    rating: 4.8,
    reviewCount: 76,
    hourlyRate: 250,
    location: 'Nairobi, Kenya',
    experience: '15 years',
    avatar: '/portraits/consultant-3.svg',
    verified: true,
    sessions: 210,
    responseTime: 'under 3h',
  },
  {
    id: '4',
    userId: 'c4',
    name: 'Hassan Ali',
    title: 'Financial Modelling',
    specialization: 'Finance',
    bio: 'Forecasting, valuation, and capital strategy for early-stage companies. I will tell you which assumptions your model is actually sensitive to, and which ones you can stop worrying about.',
    rating: 4.7,
    reviewCount: 64,
    hourlyRate: 120,
    location: 'Minneapolis, MN',
    experience: '8 years',
    avatar: '/portraits/consultant-4.svg',
    verified: false,
    sessions: 180,
    responseTime: 'under 4h',
  },
  {
    id: '5',
    userId: 'c5',
    name: 'Yusuf Abdullahi',
    title: 'Product Design',
    specialization: 'Design',
    bio: 'Product design and design systems. I help teams move from scattered screens to one coherent system that a team can actually maintain after I leave.',
    rating: 4.9,
    reviewCount: 88,
    hourlyRate: 175,
    location: 'London, UK',
    experience: '9 years',
    avatar: '/portraits/consultant-5.svg',
    verified: true,
    sessions: 275,
    responseTime: 'under 2h',
  },
  {
    id: '6',
    userId: 'c6',
    name: 'Ibrahim Osman',
    title: 'Data Analytics',
    specialization: 'Data',
    bio: 'Analytics setup and measurement. Most dashboards I inherit are measuring the wrong things; I start by working out what decision each one is supposed to inform.',
    rating: 4.6,
    reviewCount: 52,
    hourlyRate: 140,
    location: 'Dubai, UAE',
    experience: '7 years',
    avatar: '/portraits/consultant-6.svg',
    verified: false,
    sessions: 140,
    responseTime: 'under 5h',
  },
];

export const services: Service[] = [
  {
    id: 's1',
    consultantId: '1',
    name: 'Marketing Strategy Session',
    description: 'A working session on positioning, channel mix, and what to measure first.',
    duration: 60,
    price: 150,
    isFree: false,
  },
  {
    id: 's2',
    consultantId: '1',
    name: 'Intro Call',
    description: 'A short call to work out whether I am the right fit before you commit.',
    duration: 15,
    price: 0,
    isFree: true,
  },
  {
    id: 's3',
    consultantId: '2',
    name: 'Architecture Review',
    description: 'Review of your current setup with a written list of changes, ordered by impact.',
    duration: 90,
    price: 200,
    isFree: false,
  },
  {
    id: 's4',
    consultantId: '2',
    name: 'Quick Consultation',
    description: 'Thirty minutes on one specific engineering decision.',
    duration: 30,
    price: 0,
    isFree: true,
  },
  {
    id: 's5',
    consultantId: '3',
    name: '60min Strategy Session',
    description: 'Structured counsel on one legal question, with the options laid out.',
    duration: 60,
    price: 250,
    isFree: false,
  },
  {
    id: 's6',
    consultantId: '3',
    name: 'Intro Call',
    description: 'A short call to scope the question before committing to a full session.',
    duration: 15,
    price: 0,
    isFree: true,
  },
  {
    id: 's7',
    consultantId: '4',
    name: 'Financial Modelling Consultation',
    description: 'Review of your model, focusing on which assumptions actually drive the output.',
    duration: 60,
    price: 120,
    isFree: false,
  },
  {
    id: 's8',
    consultantId: '4',
    name: 'Quick Financial Check',
    description: 'A short review of your current position and runway.',
    duration: 15,
    price: 0,
    isFree: true,
  },
  {
    id: 's9',
    consultantId: '3',
    name: 'Contract Review',
    description: 'Walk through an agreement clause by clause and flag the terms that matter.',
    duration: 60,
    price: 250,
    isFree: false,
  },
  {
    id: 's10',
    consultantId: '5',
    name: 'Design System Review',
    description: 'Audit of your existing components with a proposed token structure.',
    duration: 90,
    price: 175,
    isFree: false,
  },
  {
    id: 's11',
    consultantId: '5',
    name: 'Intro Call',
    description: 'A short call to see whether our working styles suit each other.',
    duration: 15,
    price: 0,
    isFree: true,
  },
  {
    id: 's12',
    consultantId: '6',
    name: 'Analytics Setup Review',
    description: 'Check whether your tracking and dashboards can answer your actual questions.',
    duration: 60,
    price: 140,
    isFree: false,
  },
  {
    id: 's13',
    consultantId: '6',
    name: 'Intro Call',
    description: 'A short call to scope the problem before a full session.',
    duration: 15,
    price: 0,
    isFree: true,
  },
];

export const specializations = Array.from(
  new Set(consultants.map((consultant) => consultant.specialization)),
).sort();

export function getConsultant(id: string): Consultant | undefined {
  return consultants.find((consultant) => consultant.id === id);
}

export function getServicesFor(consultantId: string): Service[] {
  return services.filter((service) => service.consultantId === consultantId);
}

export function getConsultantForService(serviceId: string): Consultant | undefined {
  const service = services.find((candidate) => candidate.id === serviceId);
  return service ? getConsultant(service.consultantId) : undefined;
}
