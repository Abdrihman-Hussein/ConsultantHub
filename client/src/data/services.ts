import { Service } from '../types';

export const services: Service[] = [
  { id: 's1', consultantId: '1', name: 'Marketing Strategy Session', description: 'Deep dive into your marketing strategy and growth plan.', duration: 60, price: 150, isFree: false },
  { id: 's2', consultantId: '1', name: '15min Intro Call', description: 'Brief alignment to discuss needs and fit.', duration: 15, price: 0, isFree: true },
  { id: 's3', consultantId: '2', name: 'Architecture Review', description: 'Review your system architecture and provide recommendations.', duration: 90, price: 200, isFree: false },
  { id: 's4', consultantId: '2', name: 'Quick Consultation', description: 'Quick chat about your engineering challenges.', duration: 30, price: 0, isFree: true },
  { id: 's5', consultantId: '3', name: '60min Strategy Session', description: 'Deep dive into a specific business challenge.', duration: 60, price: 250, isFree: false },
  { id: 's6', consultantId: '3', name: '15min Intro Call', description: 'Brief alignment to discuss needs and fit.', duration: 15, price: 0, isFree: true },
  { id: 's7', consultantId: '4', name: 'Financial Modeling Consultation', description: 'Review your financial model and projections.', duration: 60, price: 120, isFree: false },
  { id: 's8', consultantId: '4', name: 'Quick Financial Check', description: 'Quick overview of your financial situation.', duration: 15, price: 0, isFree: true },
];