import { User } from '../types';

export const users: User[] = [
  { id: 'u1', name: 'Sarah', email: 'sarah@example.com', role: 'CLIENT', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5nFo79njj6_qkc0T02R_mn_LboLPeFZEz1m6t5d-1MpABx3GVcOqZ8GQUEuQiT1coePAAsZMW7SCLTZNcAsoTjiHLs9B9ra4VVTyj1jlA-ryVLTwdSluL7XpXQxKfAt6qfQco9iA4jqsA6ml0Yas3sbc0I9r_wZ2sYiwjql54G9KFIaYmdn3QAHnl0in6zQGhq4Yr5mdgobDaIs12Mfx88zFtpWAXePw-OxZD6cCO9qMxelgMO28h' },
  { id: 'u2', name: 'Ali', email: 'ali@example.com', role: 'CLIENT' },
  { id: 'c1', name: 'Sarah Jenkins', email: 'jenkins@example.com', role: 'CONSULTANT' },
  { id: 'a1', name: 'Admin User', email: 'admin@example.com', role: 'ADMIN' },
];