# ConsultantHub MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a frontend-only consultant booking MVP matching the exact designs in `/maak` folder — React + TypeScript + Tailwind with mock data, deployed to Vercel.

**Architecture:** Single-page React app with React Router. All data comes from mock files in `client/src/data/`. No backend. Custom Tailwind theme matching the exact design system from the HTML prototypes. Component-based architecture with shared layout components.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Google Material Symbols (icons)

**Spec:** `maak/design.md` + 3 HTML design files in `maak/`

## Global Constraints

- All colors, fonts, spacing, and border-radius values MUST come from the tailwind config in the HTML designs
- Fonts: Hanken Grotesk (headlines), Inter (body), JetBrains Mono (labels)
- Icons: Google Material Symbols Outlined (use `material-symbols-outlined` class)
- No backend — all data from `client/src/data/*.ts`
- React Router for navigation — no tab/page switching via state
- TypeScript interfaces for all data models
- Each page must match the HTML design within 95% visual fidelity

---

## File Structure

```
client/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Top nav (shared)
│   │   │   ├── Sidebar.tsx         # Client dashboard sidebar
│   │   │   └── Footer.tsx          # Footer (shared)
│   │   ├── ui/
│   │   │   ├── Button.tsx          # Reusable button
│   │   │   ├── Card.tsx            # Reusable card
│   │   │   ├── Modal.tsx           # Modal dialog
│   │   │   ├── Badge.tsx           # Status badges
│   │   │   ├── Avatar.tsx          # User avatar
│   │   │   ├── SearchInput.tsx     # Search bar
│   │   │   └── Pagination.tsx      # Pagination
│   │   └── consultants/
│   │       ├── ConsultantCard.tsx   # Card for browse page
│   │       ├── FilterSidebar.tsx    # Filters panel
│   │       └── BookingWidget.tsx    # Booking sidebar on profile
│   ├── data/
│   │   ├── consultants.ts          # Mock consultant data
│   │   ├── services.ts             # Mock service data
│   │   ├── appointments.ts         # Mock appointment data
│   │   └── users.ts                # Mock user data
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Consultants.tsx         # Browse page
│   │   ├── ConsultantProfile.tsx   # Profile page
│   │   ├── Booking.tsx             # Booking flow
│   │   ├── client/
│   │   │   ├── ClientDashboard.tsx
│   │   │   └── ClientAppointments.tsx
│   │   ├── consultant/
│   │   │   ├── ConsultantDashboard.tsx
│   │   │   └── ConsultantServices.tsx
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       └── AdminUsers.tsx
│   ├── types/
│   │   └── index.ts                # All TypeScript interfaces
│   ├── utils/
│   │   └── helpers.ts              # Date formatting, etc.
│   ├── context/
│   │   └── AuthContext.tsx          # Simulated auth state
│   ├── App.tsx                     # Router setup
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Tailwind imports
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── tailwind.config.js              # Exact config from designs
```

---

## Task 1: Project Setup (Vite + React + TypeScript)

**Files:**
- Create: `client/package.json`
- Create: `client/vite.config.ts`
- Create: `client/tsconfig.json`
- Create: `client/tsconfig.node.json`
- Create: `client/index.html`
- Create: `client/src/main.tsx`
- Create: `client/src/App.tsx`
- Create: `client/src/index.css`

- [ ] **Step 1: Initialize Vite project**

```bash
cd client
npm init -y
```

- [ ] **Step 2: Install dependencies**

```bash
npm install react react-dom react-router-dom
npm install -D typescript @types/react @types/react-dom vite @vitejs/plugin-react tailwindcss postcss autoprefixer
```

- [ ] **Step 3: Create `vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
})
```

- [ ] **Step 4: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 5: Create `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 6: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ConsultantHub</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Create `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

body {
  background-color: #f8f9ff;
  color: #0b1c30;
  font-family: 'Inter', sans-serif;
}
```

- [ ] **Step 8: Create `src/main.tsx`**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

- [ ] **Step 9: Create `src/App.tsx` (placeholder)**

```tsx
function App() {
  return <div className="text-primary">ConsultantHub</div>
}
export default App
```

- [ ] **Step 10: Run dev server to verify**

```bash
npm run dev
```

Expected: Browser opens, shows "ConsultantHub" text.

- [ ] **Step 11: Commit**

```bash
git add .
git commit -m "chore: initialize React + TypeScript + Vite project"
```

---

## Task 2: Tailwind Config (Exact Design System)

**Files:**
- Create: `client/tailwind.config.js`

- [ ] **Step 1: Create `tailwind.config.js`**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'on-tertiary-container': '#009668',
        'outline-variant': '#c6c6cd',
        'tertiary': '#000000',
        'on-primary-fixed-variant': '#3f465c',
        'trust-gold': '#B45309',
        'outline': '#76777d',
        'tertiary-fixed-dim': '#4edea3',
        'primary-fixed-dim': '#bec6e0',
        'secondary-container': '#316bf3',
        'background': '#f8f9ff',
        'surface-container-low': '#eff4ff',
        'inverse-surface': '#213145',
        'on-background': '#0b1c30',
        'secondary-fixed-dim': '#b4c5ff',
        'primary-fixed': '#dae2fd',
        'on-tertiary-fixed': '#002113',
        'on-primary-fixed': '#131b2e',
        'on-secondary-container': '#fefcff',
        'surface-variant': '#d3e4fe',
        'surface-tint': '#565e74',
        'surface-bright': '#f8f9ff',
        'error-crimson': '#E11D48',
        'primary': '#000000',
        'secondary': '#0051d5',
        'surface-container-high': '#dce9ff',
        'on-secondary-fixed': '#00174b',
        'on-tertiary-fixed-variant': '#005236',
        'tertiary-fixed': '#6ffbbe',
        'surface-alt': '#F8FAFC',
        'on-surface-variant': '#45464d',
        'on-primary': '#ffffff',
        'error': '#ba1a1a',
        'primary-container': '#131b2e',
        'tertiary-container': '#002113',
        'inverse-primary': '#bec6e0',
        'surface': '#f8f9ff',
        'surface-dim': '#cbdbf5',
        'on-surface': '#0b1c30',
        'inverse-on-surface': '#eaf1ff',
        'secondary-fixed': '#dbe1ff',
        'on-error': '#ffffff',
        'on-primary-container': '#7c839b',
        'surface-container-highest': '#d3e4fe',
        'on-tertiary': '#ffffff',
        'success-emerald': '#059669',
        'on-error-container': '#93000a',
        'error-container': '#ffdad6',
        'surface-container-lowest': '#ffffff',
        'surface-container': '#e5eeff',
        'on-secondary': '#ffffff',
        'on-secondary-fixed-variant': '#003ea8',
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem',
      },
      spacing: {
        'stack-sm': '8px',
        'max-width': '1280px',
        'stack-lg': '32px',
        'margin-page': 'auto',
        'unit': '4px',
        'stack-md': '16px',
        'section-gap': '80px',
        'gutter-md': '24px',
      },
      fontFamily: {
        'headline-lg-mobile': ['Hanken Grotesk'],
        'body-lg': ['Inter'],
        'headline-md': ['Hanken Grotesk'],
        'headline-lg': ['Hanken Grotesk'],
        'display-lg': ['Hanken Grotesk'],
        'label-sm': ['JetBrains Mono'],
        'body-md': ['Inter'],
        'label-md': ['JetBrains Mono'],
      },
      fontSize: {
        'headline-lg-mobile': ['28px', { lineHeight: '36px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.02em', fontWeight: '500' }],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "chore: add tailwind config with design system tokens"
```

---

## Task 3: TypeScript Interfaces + Mock Data

**Files:**
- Create: `client/src/types/index.ts`
- Create: `client/src/data/consultants.ts`
- Create: `client/src/data/services.ts`
- Create: `client/src/data/appointments.ts`
- Create: `client/src/data/users.ts`

- [ ] **Step 1: Create `src/types/index.ts`**

```typescript
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
```

- [ ] **Step 2: Create `src/data/consultants.ts`**

```typescript
import { Consultant } from '../types';

export const consultants: Consultant[] = [
  {
    id: '1',
    userId: 'c1',
    name: 'Sarah Jenkins',
    title: 'Strategic Marketing',
    specialization: 'Marketing',
    bio: 'Specializing in go-to-market strategies for B2B SaaS startups. Over 10 years of experience scaling marketing teams and driving ROI through data-driven campaigns.',
    rating: 4.9,
    reviewCount: 128,
    hourlyRate: 150,
    location: 'New York, NY (Remote)',
    experience: '10+ years',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9a6uRHh0-toAEFe6d0Gs5mkCo38NM82MgcJX8BjP5SoeNdnwiQbLUYJPOtagWj_fxXcb3DCewenbyGjCG_I7w71jh_I7kaRk-1aUdJ_wqozcdMm3BVX9ru4szAlpkGrDre0-9MEESGCwruc8AKdV22xzEfew8-lt0uI3UiwUFpS6CrFvvQuYYDKooCMOvj05TPrm3nsOQ1VrplXXcBHD_4_gPab9v2UrXJt6mZffwDZklstvS3b8-',
    verified: true,
    sessions: 450,
    responseTime: '< 2h',
  },
  {
    id: '2',
    userId: 'c2',
    name: 'David Chen',
    title: 'Systems Engineering',
    specialization: 'Engineering',
    bio: 'Expert in scalable cloud architecture and infrastructure optimization. Former lead engineer at Fortune 500 tech firms, dedicated to building resilient distributed systems.',
    rating: 5.0,
    reviewCount: 95,
    hourlyRate: 200,
    location: 'San Francisco, CA',
    experience: '12 years',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBW7TNGqPPOxidm2ydwYRhuwI2NlYJp3D66cDjXqSnKK2aIl2rGh3AtqtxT599hUjUoWj86FicFhsWZkwvCbc_N0XwyO-mLEkIpD571pqinrNNk-4r1TjeOYmm6jFWGXWsHyZ0EPFaVdYXLtNRS39BHpIZ3QUSRr5kzwM3H5s0dMYwVNREwb4dItGA-t-XFoiME2nMlzHjJ_EBDqWZBDPcWtL1gSt1Ze-IaLCHQQk5aZ4U0Urg2lsik',
    verified: true,
    sessions: 320,
    responseTime: '< 1h',
  },
  {
    id: '3',
    userId: 'c3',
    name: 'Elena Rodriguez',
    title: 'Corporate Law',
    specialization: 'Law',
    bio: 'Providing strategic counsel on mergers, acquisitions, and corporate governance. Known for navigating complex regulatory landscapes with precision and clarity.',
    rating: 4.8,
    reviewCount: 76,
    hourlyRate: 250,
    location: 'Chicago, IL (Hybrid)',
    experience: '15 years',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvQHRCYrUJ2CDNk1g06sYQ1Xh5sZeXeCr0hsxe2r5nCpM20P8a5-zEmkuT7hfa5DIFJMqBpuuJ2GKxeCpU_Tw7JE6MJP5bestcFUkA5MfjSFdcsbAcz1GjsuJ0x4TSqykgZhUZj879mQ_083IFgDiewIrcRD-EmD8mGjFxgpUat0qJIqwMd7ET64Vm0SmcWtZ9BZofPQayV8OMkq3SLAK3gRkO2jrTwVDHbOzibN5gvN1ToTQAi7Uy',
    verified: true,
    sessions: 210,
    responseTime: '< 3h',
  },
  {
    id: '4',
    userId: 'c4',
    name: 'Marcus Thorne',
    title: 'Financial Modeling',
    specialization: 'Finance',
    bio: 'Specialist in financial forecasting, valuation, and capital raising strategies for early-stage ventures. Translating complex data into actionable insights.',
    rating: 4.7,
    reviewCount: 64,
    hourlyRate: 120,
    location: 'Austin, TX (Remote)',
    experience: '8 years',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1L6ythsyZ6HOO8bFKps9hyJnuNiw-d2PLG0LC1FVPkATy9IolRmAEZucF1GRRXgD1-4UmbPgMvlfnf3M4tU5wuo4SIybBBAY2PC2f2bgueTYszQDN9_FTR3BTwfAOkpyjqkY3JujA-nleQtaQwO_Vi5ZQxpn0m-lRielT3oGctHuCW6kYq1SAxWTS0rC7O84_4EbnZFo3_PR1HH4nhtI3rJSOKmEnbJvkVTY4ttOdcIY2pDMvCbpA',
    verified: false,
    sessions: 180,
    responseTime: '< 4h',
  },
];
```

- [ ] **Step 3: Create `src/data/services.ts`**

```typescript
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
```

- [ ] **Step 4: Create `src/data/appointments.ts`**

```typescript
import { Appointment } from '../types';

export const appointments: Appointment[] = [
  {
    id: 'a1',
    clientId: 'u1',
    consultantId: '2',
    consultantName: 'Dr. Robert Chen',
    consultantAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUW-3JmLpbmTRAv8VPOI7_kLgc5GLfbdh9M_2wyhgSSY-KB3_-4MRhu_hYgbszJ7HCImYj0lUZO1P3vI_bGoEZhCeO-r82A8qDd3OAST75IgXTgs56OiqAepHHIRp6ItkSNOAAlJ92AOKigWO8H5kMBQXyJB8OZh_iOGwGZPICe9BsRgsT7dEkQT0JuKyZ5mcxc0B1SJgE9jzRApvlKionZWRFN4jBT0lFTwbAbgpcSQkAAqJrDN1m',
    serviceName: 'Strategic Financial Planning',
    date: '2024-10-24',
    startTime: '10:00',
    endTime: '11:30',
    status: 'PENDING',
    meetingType: 'video',
  },
  {
    id: 'a2',
    clientId: 'u1',
    consultantId: '3',
    consultantName: 'Elena Rostova',
    consultantAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKy_1q0yt8vAxuAu6-Z4VpN22r6FImKhRCMRgBv33vj9sUbWDUpzKtHlTIBJPCSn84fxm7d6vTxFV6X4w040ZJRDQ4d6bKBRUpwt48mJVdgpVbdYqE1GNMi8Ax5nj2WnefUEEJvhOS47Y06gbHQl-BgiGQTHTCNvHTyfQhDtu4IpmZVS51Gq7viVaeH2jRpwx1OeIwDClioSsb0cur-p2mYm11-bg1nebaPDr5EQyrW7Ama-tdF7uu',
    serviceName: 'Q4 Marketing Strategy Review',
    date: '2024-10-28',
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
    consultantName: 'Marcus Johnson',
    consultantAvatar: '',
    serviceName: 'Legal Compliance',
    date: '2024-10-12',
    startTime: '09:00',
    endTime: '10:00',
    status: 'COMPLETED',
    meetingType: 'video',
  },
  {
    id: 'a4',
    clientId: 'u1',
    consultantId: '3',
    consultantName: 'Elena Rostova',
    consultantAvatar: '',
    serviceName: 'Initial Audit',
    date: '2024-09-30',
    startTime: '11:00',
    endTime: '12:00',
    status: 'COMPLETED',
    meetingType: 'video',
  },
  {
    id: 'a5',
    clientId: 'u1',
    consultantId: '2',
    consultantName: 'Dr. Robert Chen',
    consultantAvatar: '',
    serviceName: 'Financial Plan',
    date: '2024-09-15',
    startTime: '14:00',
    endTime: '15:00',
    status: 'CANCELLED',
    meetingType: 'video',
  },
];
```

- [ ] **Step 5: Create `src/data/users.ts`**

```typescript
import { User } from '../types';

export const users: User[] = [
  { id: 'u1', name: 'Sarah', email: 'sarah@example.com', role: 'CLIENT', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5nFo79njj6_qkc0T02R_mn_LboLPeFZEz1m6t5d-1MpABx3GVcOqZ8GQUEuQiT1coePAAsZMW7SCLTZNcAsoTjiHLs9B9ra4VVTyj1jlA-ryVLTwdSluL7XpXQxKfAt6qfQco9iA4jqsA6ml0Yas3sbc0I9r_wZ2sYiwjql54G9KFIaYmdn3QAHnl0in6zQGhq4Yr5mdgobDaIs12Mfx88zFtpWAXePw-OxZD6cCO9qMxelgMO28h' },
  { id: 'u2', name: 'Ali', email: 'ali@example.com', role: 'CLIENT' },
  { id: 'c1', name: 'Sarah Jenkins', email: 'jenkins@example.com', role: 'CONSULTANT' },
  { id: 'a1', name: 'Admin User', email: 'admin@example.com', role: 'ADMIN' },
];
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add TypeScript interfaces and mock data"
```

---

## Task 4: Shared Layout Components

**Files:**
- Create: `client/src/components/layout/Navbar.tsx`
- Create: `client/src/components/layout/Footer.tsx`
- Create: `client/src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Create `src/components/layout/Navbar.tsx`**

```tsx
import { Link } from 'react-router-dom';

interface NavbarProps {
  activePage?: 'browse' | 'dashboard';
}

export default function Navbar({ activePage }: NavbarProps) {
  return (
    <header className="bg-surface border-b border-outline-variant full-width top-0 z-50 sticky">
      <div className="flex justify-between items-center w-full px-8 h-20 max-w-max-width mx-auto">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-headline-lg text-headline-lg font-bold text-primary">
            ConsultantHub
          </Link>
          <div className="relative hidden md:block w-64 ml-4">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              search
            </span>
            <input
              className="w-full pl-9 pr-4 py-2 bg-surface-alt border border-outline-variant rounded-full text-label-md font-label-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all"
              placeholder="Search consultants..."
              type="text"
            />
          </div>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/consultants"
            className={`font-label-md text-label-md h-20 flex items-center px-2 transition-colors ${
              activePage === 'browse'
                ? 'text-secondary font-bold border-b-2 border-secondary'
                : 'text-on-surface-variant hover:text-secondary hover:bg-surface-container-low'
            }`}
          >
            Browse
          </Link>
          <Link
            to="/client/dashboard"
            className={`font-label-md text-label-md h-20 flex items-center px-2 transition-colors ${
              activePage === 'dashboard'
                ? 'text-secondary font-bold border-b-2 border-secondary'
                : 'text-on-surface-variant hover:text-secondary hover:bg-surface-container-low'
            }`}
          >
            Dashboard
          </Link>
          <a className="text-on-surface-variant hover:text-secondary hover:bg-surface-container-low transition-colors font-label-md text-label-md h-20 flex items-center px-2" href="#">
            Resources
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="font-label-md text-label-md text-secondary border border-secondary px-4 py-2 rounded hover:bg-secondary/5 transition-colors">
            Log In
          </Link>
          <Link to="/register" className="font-label-md text-label-md bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90 transition-colors shadow-sm">
            Profile
          </Link>
        </div>
        <button className="md:hidden text-on-surface-variant">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Create `src/components/layout/Footer.tsx`**

```tsx
export default function Footer() {
  return (
    <footer className="bg-primary-container full-width border-t border-outline-variant mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center py-12 px-8 max-w-max-width mx-auto gap-6 md:gap-0">
        <div className="flex flex-col items-center md:items-start">
          <span className="font-headline-md text-headline-md text-on-primary-container mb-2">
            ConsultantHub
          </span>
          <span className="font-body-md text-body-md text-on-primary-container/80 text-center md:text-left">
            © 2024 ConsultantHub. All professional rights reserved.
          </span>
        </div>
        <nav className="flex flex-wrap justify-center gap-6">
          <a className="font-label-sm text-label-sm text-on-primary-container/80 hover:text-on-primary-container hover:opacity-100 transition-opacity" href="#">Terms of Service</a>
          <a className="font-label-sm text-label-sm text-on-primary-container/80 hover:text-on-primary-container hover:opacity-100 transition-opacity" href="#">Privacy Policy</a>
          <a className="font-label-sm text-label-sm text-on-primary-container/80 hover:text-on-primary-container hover:opacity-100 transition-opacity" href="#">Contact Support</a>
          <a className="font-label-sm text-label-sm text-on-primary-container/80 hover:text-on-primary-container hover:opacity-100 transition-opacity" href="#">Become a Consultant</a>
        </nav>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Create `src/components/layout/Sidebar.tsx`**

```tsx
import { Link } from 'react-router-dom';

interface SidebarProps {
  userName: string;
  activeItem: string;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: 'dashboard', path: '/client/dashboard' },
  { id: 'bookings', label: 'My Bookings', icon: 'event_available', path: '/client/appointments' },
  { id: 'messages', label: 'Messages', icon: 'mail', path: '#' },
  { id: 'settings', label: 'Settings', icon: 'settings', path: '#' },
  { id: 'help', label: 'Help', icon: 'help', path: '#' },
];

export default function Sidebar({ userName, activeItem }: SidebarProps) {
  return (
    <aside className="bg-surface-container-lowest h-full w-64 border-r border-outline-variant hidden md:flex flex-col py-6 px-4 space-y-2 shrink-0 z-40">
      <div className="flex items-center gap-3 mb-8 px-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-outline-variant bg-surface-container-high flex items-center justify-center text-secondary font-bold text-lg">
          {userName.charAt(0)}
        </div>
        <div>
          <h2 className="font-headline-md text-headline-md text-primary leading-tight">Client Portal</h2>
          <p className="font-body-md text-body-md text-on-surface-variant text-sm">Manage your sessions</p>
        </div>
      </div>
      <nav className="flex-1 space-y-2 font-label-md text-label-md">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
              activeItem === item.id
                ? 'text-secondary font-semibold bg-secondary-container/10 translate-x-1'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-4">
        <Link
          to="/consultants"
          className="w-full bg-secondary text-white py-3 rounded-md font-label-md text-label-md hover:bg-opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          Book New Consultant
        </Link>
      </div>
    </aside>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add Navbar, Footer, Sidebar layout components"
```

---

## Task 5: Pages — Home, Login, Register

**Files:**
- Create: `client/src/pages/Home.tsx`
- Create: `client/src/pages/Login.tsx`
- Create: `client/src/pages/Register.tsx`

- [ ] **Step 1: Create Home page**

```tsx
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { consultants } from '../data/consultants';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-br from-surface to-surface-container-high py-24 px-8">
          <div className="max-w-max-width mx-auto text-center">
            <h1 className="font-display-lg text-display-lg text-primary mb-4">
              Find the Right Consultant
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-2xl mx-auto">
              Book a consultation in minutes. Connect with expert professionals across marketing, engineering, law, and finance.
            </p>
            <Link to="/consultants" className="bg-secondary text-white px-8 py-4 rounded-lg font-label-md text-label-md hover:bg-secondary/90 transition-colors shadow-sm inline-flex items-center gap-2">
              Find a Consultant
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* Specialties */}
        <section className="py-20 px-8">
          <div className="max-w-max-width mx-auto">
            <h2 className="font-headline-md text-headline-md text-primary text-center mb-12">Popular Specialties</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['Marketing', 'Engineering', 'Law', 'Finance'].map((specialty) => (
                <Link key={specialty} to="/consultants" className="bg-surface-alt border border-outline-variant rounded-xl p-6 text-center hover:-translate-y-1 hover:shadow-lg transition-all">
                  <span className="material-symbols-outlined text-4xl text-secondary mb-3">category</span>
                  <p className="font-headline-md text-headline-md text-primary">{specialty}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Consultants */}
        <section className="py-20 px-8 bg-surface-container-low">
          <div className="max-w-max-width mx-auto">
            <h2 className="font-headline-md text-headline-md text-primary text-center mb-12">Featured Consultants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {consultants.map((c) => (
                <Link key={c.id} to={`/consultants/${c.id}`} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all">
                  <img src={c.avatar} alt={c.name} className="w-16 h-16 rounded-full object-cover border border-outline-variant mb-4" />
                  <h3 className="font-headline-md text-headline-md text-primary mb-1">{c.name}</h3>
                  <p className="font-label-md text-label-md text-trust-gold mb-2">{c.title}</p>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-4">{c.bio}</p>
                  <span className="font-label-md text-label-md text-secondary font-semibold">${c.hourlyRate}/hr</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-8">
          <div className="max-w-max-width mx-auto text-center">
            <h2 className="font-headline-md text-headline-md text-primary mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '1', title: 'Find a Consultant', desc: 'Browse experts by specialty, rating, and price.' },
                { step: '2', title: 'Choose a Service', desc: 'Select the service that fits your needs.' },
                { step: '3', title: 'Book & Meet', desc: 'Pick a time and confirm your appointment.' },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center font-headline-md text-headline-md mb-4">{item.step}</div>
                  <h3 className="font-headline-md text-headline-md text-primary mb-2">{item.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Create Login page**

```tsx
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md bg-surface-alt border border-outline-variant rounded-xl p-8">
          <h1 className="font-headline-lg text-headline-lg text-primary text-center mb-8">Welcome Back</h1>
          <form className="space-y-4">
            <div>
              <label className="block font-label-md text-label-md text-primary mb-2">Email</label>
              <input type="email" className="w-full px-4 py-3 bg-surface-alt border border-outline-variant rounded-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-primary mb-2">Password</label>
              <input type="password" className="w-full px-4 py-3 bg-surface-alt border border-outline-variant rounded-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-secondary text-white py-3 rounded-lg font-label-md text-label-md hover:bg-secondary/90 transition-colors shadow-sm">
              Log In
            </button>
          </form>
          <p className="text-center font-body-md text-body-md text-on-surface-variant mt-6">
            Don't have an account? <Link to="/register" className="text-secondary hover:underline">Sign up</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Create Register page**

```tsx
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function Register() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md bg-surface-alt border border-outline-variant rounded-xl p-8">
          <h1 className="font-headline-lg text-headline-lg text-primary text-center mb-8">Create Account</h1>
          <form className="space-y-4">
            <div>
              <label className="block font-label-md text-label-md text-primary mb-2">Full Name</label>
              <input type="text" className="w-full px-4 py-3 bg-surface-alt border border-outline-variant rounded-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all" placeholder="John Doe" />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-primary mb-2">Email</label>
              <input type="email" className="w-full px-4 py-3 bg-surface-alt border border-outline-variant rounded-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-primary mb-2">Password</label>
              <input type="password" className="w-full px-4 py-3 bg-surface-alt border border-outline-variant rounded-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all" placeholder="••••••••" />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-primary mb-2">I am a</label>
              <select className="w-full px-4 py-3 bg-surface-alt border border-outline-variant rounded-lg focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all">
                <option>Client</option>
                <option>Consultant</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-secondary text-white py-3 rounded-lg font-label-md text-label-md hover:bg-secondary/90 transition-colors shadow-sm">
              Create Account
            </button>
          </form>
          <p className="text-center font-body-md text-body-md text-on-surface-variant mt-6">
            Already have an account? <Link to="/login" className="text-secondary hover:underline">Log in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add Home, Login, Register pages"
```

---

## Task 6: Consultants Browse Page

**Files:**
- Create: `client/src/pages/Consultants.tsx`
- Create: `client/src/components/consultants/FilterSidebar.tsx`
- Create: `client/src/components/consultants/ConsultantCard.tsx`

- [ ] **Step 1: Create FilterSidebar**

```tsx
import { useState } from 'react';

interface FilterState {
  specialties: string[];
  experience: string;
  priceMin: string;
  priceMax: string;
}

interface FilterSidebarProps {
  onFilter: (filters: FilterState) => void;
}

export default function FilterSidebar({ onFilter }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    specialties: [],
    experience: 'any',
    priceMin: '',
    priceMax: '',
  });

  const specialties = ['Marketing', 'Engineering', 'Law', 'Finance'];

  const handleSpecialtyChange = (specialty: string) => {
    const updated = filters.specialties.includes(specialty)
      ? filters.specialties.filter((s) => s !== specialty)
      : [...filters.specialties, specialty];
    const newFilters = { ...filters, specialties: updated };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-6">
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
        <h2 className="font-headline-md text-headline-md text-primary mb-6">Filters</h2>

        <div className="mb-6">
          <h3 className="font-label-md text-label-md text-on-surface mb-3 font-semibold">Specialty</h3>
          <div className="space-y-2">
            {specialties.map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.specialties.includes(s)}
                  onChange={() => handleSpecialtyChange(s)}
                  className="rounded border-outline-variant text-secondary focus:ring-secondary/20 bg-surface-alt w-4 h-4 cursor-pointer"
                />
                <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">{s}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-label-md text-label-md text-on-surface mb-3 font-semibold">Years of Experience</h3>
          <div className="space-y-2">
            {['Any', '0 - 5 years', '5 - 10 years', '10+ years'].map((exp) => (
              <label key={exp} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="exp"
                  checked={filters.experience === exp.toLowerCase()}
                  onChange={() => setFilters({ ...filters, experience: exp.toLowerCase() })}
                  className="border-outline-variant text-secondary focus:ring-secondary/20 bg-surface-alt w-4 h-4 cursor-pointer"
                />
                <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">{exp}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-label-md text-label-md text-on-surface mb-3 font-semibold">Price Range ($/hr)</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceMin}
              onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
              className="w-full bg-surface-alt border border-outline-variant rounded px-2 py-1 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary/20 outline-none"
            />
            <span className="text-on-surface-variant">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceMax}
              onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
              className="w-full bg-surface-alt border border-outline-variant rounded px-2 py-1 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary/20 outline-none"
            />
          </div>
        </div>

        <button
          onClick={() => onFilter({ specialties: [], experience: 'any', priceMin: '', priceMax: '' })}
          className="w-full mt-6 bg-surface-container-low text-secondary font-label-md text-label-md py-2 rounded border border-secondary/20 hover:bg-surface-container transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Create ConsultantCard**

```tsx
import { Link } from 'react-router-dom';
import { Consultant } from '../../types';

interface ConsultantCardProps {
  consultant: Consultant;
}

export default function ConsultantCard({ consultant }: ConsultantCardProps) {
  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col hover:-translate-y-1 hover:shadow-[0px_4px_12px_rgba(15,23,42,0.05)] transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <img className="w-16 h-16 rounded-full object-cover border border-outline-variant" src={consultant.avatar} alt={consultant.name} />
        <div className="flex items-center gap-1 bg-surface-container-low text-secondary px-2 py-1 rounded text-label-sm font-label-sm">
          <span className="material-symbols-outlined text-[14px]">star</span>
          <span>{consultant.rating}</span>
        </div>
      </div>
      <h3 className="font-headline-md text-headline-md text-primary mb-1">{consultant.name}</h3>
      <p className="font-label-md text-label-md text-trust-gold mb-3">{consultant.title}</p>
      <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-3 flex-grow">{consultant.bio}</p>
      <div className="flex justify-between items-center pt-4 border-t border-outline-variant/50">
        <span className="font-label-md text-label-md text-on-surface font-semibold">${consultant.hourlyRate}/hr</span>
        <Link to={`/consultants/${consultant.id}`} className="text-secondary font-label-md text-label-md hover:underline flex items-center gap-1">
          View Profile <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Create Consultants page**

```tsx
import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FilterSidebar from '../components/consultants/FilterSidebar';
import ConsultantCard from '../components/consultants/ConsultantCard';
import { consultants } from '../data/consultants';

export default function Consultants() {
  const [filtered, setFiltered] = useState(consultants);

  const handleFilter = (filters: { specialties: string[]; experience: string; priceMin: string; priceMax: string }) => {
    let result = consultants;
    if (filters.specialties.length > 0) {
      result = result.filter((c) => filters.specialties.includes(c.specialization));
    }
    if (filters.priceMin) {
      result = result.filter((c) => c.hourlyRate >= Number(filters.priceMin));
    }
    if (filters.priceMax) {
      result = result.filter((c) => c.hourlyRate <= Number(filters.priceMax));
    }
    setFiltered(result);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activePage="browse" />
      <main className="flex-grow max-w-max-width mx-auto w-full px-4 md:px-8 py-section-gap flex flex-col md:flex-row gap-gutter-md">
        <FilterSidebar onFilter={handleFilter} />
        <section className="flex-grow">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="font-display-lg text-display-lg text-primary md:text-[48px] text-[36px]">Expert Consultants</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Find the right professional for your next project.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <ConsultantCard key={c.id} consultant={c} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">search_off</span>
              <p className="font-body-lg text-body-lg text-on-surface-variant">No consultants found matching your filters.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add Consultants browse page with filters and cards"
```

---

## Task 7: Consultant Profile Page

**Files:**
- Create: `client/src/pages/ConsultantProfile.tsx`
- Create: `client/src/components/consultants/BookingWidget.tsx`

- [ ] **Step 1: Create BookingWidget**

```tsx
import { useState } from 'react';
import { Service } from '../../types';

interface BookingWidgetProps {
  services: Service[];
}

export default function BookingWidget({ services }: BookingWidgetProps) {
  const [selectedService, setSelectedService] = useState(services[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(5);
  const [selectedTime, setSelectedTime] = useState('10:30 AM');

  const times = [
    { time: '09:00 AM', available: false },
    { time: '10:30 AM', available: true },
    { time: '11:00 AM', available: true },
    { time: '01:00 PM', available: true, selected: true },
    { time: '02:30 PM', available: true },
    { time: '04:00 PM', available: false },
  ];

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm sticky top-28">
      <h2 className="font-headline-md text-headline-md text-primary mb-6">Book an Appointment</h2>

      <div className="mb-6">
        <label className="block font-label-md text-label-md text-primary mb-3">Select Service</label>
        <div className="space-y-3">
          {services.map((service) => (
            <label
              key={service.id}
              className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors relative ${
                selectedService === service.id
                  ? 'border-secondary bg-surface-container-lowest'
                  : 'border-outline-variant bg-surface-alt hover:border-secondary hover:bg-surface-container-low'
              }`}
            >
              <input
                type="radio"
                name="service"
                checked={selectedService === service.id}
                onChange={() => setSelectedService(service.id)}
                className="mt-1 text-secondary focus:ring-secondary border-outline-variant"
              />
              <div className="ml-3 flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-headline-md text-headline-md text-base text-primary">{service.name}</span>
                  <span className="font-label-md text-label-md text-on-surface-variant font-bold">
                    {service.isFree ? 'Free' : `$${service.price}`}
                  </span>
                </div>
                <p className="font-body-md text-body-md text-sm text-on-surface-variant">{service.description}</p>
              </div>
              {selectedService === service.id && (
                <div className="absolute inset-0 border-2 border-secondary rounded-lg opacity-100 pointer-events-none" />
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-label-md text-label-md text-primary mb-3">Select Date & Time</label>
        <div className="border border-outline-variant rounded-lg p-4 mb-4 bg-surface-alt">
          <div className="flex justify-between items-center mb-4">
            <button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">chevron_left</span></button>
            <span className="font-label-md text-label-md text-primary font-bold">August 2026</span>
            <button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">chevron_right</span></button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center font-label-sm text-label-sm mb-2">
            <div className="text-on-surface-variant/70">Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div className="text-on-surface-variant/70">Sa</div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center font-body-md text-sm">
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 2;
              const isCurrentMonth = day >= 1 && day <= 31;
              const isSelected = day === selectedDate;
              return (
                <div
                  key={i}
                  onClick={() => isCurrentMonth && setSelectedDate(day)}
                  className={`p-2 rounded ${
                    !isCurrentMonth ? 'text-outline-variant/30' :
                    isSelected ? 'bg-primary text-on-primary font-bold cursor-pointer' :
                    'cursor-pointer hover:bg-surface-container-low'
                  }`}
                >
                  {isCurrentMonth ? day : ''}
                </div>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {times.map((t) => (
            <button
              key={t.time}
              disabled={!t.available}
              onClick={() => setSelectedTime(t.time)}
              className={`py-2 px-3 border rounded font-label-sm text-label-sm transition-colors ${
                !t.available
                  ? 'border-outline-variant bg-surface-alt text-on-surface-variant line-through opacity-50 cursor-not-allowed'
                  : selectedTime === t.time
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'border-secondary bg-surface-container-lowest text-secondary hover:bg-secondary hover:text-on-primary'
              }`}
            >
              {t.time}
            </button>
          ))}
        </div>
      </div>

      <button className="w-full bg-secondary text-on-primary font-label-md text-label-md py-3 rounded-lg hover:bg-secondary/90 transition-colors shadow-sm flex justify-center items-center gap-2">
        Continue to Booking <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </button>
      <p className="text-center font-label-sm text-label-sm text-outline-variant mt-3">No charge until confirmed.</p>
    </div>
  );
}
```

- [ ] **Step 2: Create ConsultantProfile page**

```tsx
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import BookingWidget from '../components/consultants/BookingWidget';
import { consultants } from '../data/consultants';
import { services } from '../data/services';

export default function ConsultantProfile() {
  const { id } = useParams();
  const consultant = consultants.find((c) => c.id === id) || consultants[0];
  const consultantServices = services.filter((s) => s.consultantId === consultant.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow w-full max-w-max-width mx-page px-4 md:px-8 py-section-gap">
        {/* Profile Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter-md mb-section-gap">
          <div className="md:col-span-8 bg-surface-alt border border-outline-variant rounded-xl p-8 flex flex-col md:flex-row items-start md:items-center gap-stack-lg relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-surface-variant rounded-full opacity-50 blur-3xl pointer-events-none" />
            <div className="w-32 h-32 flex-shrink-0">
              <img className="w-full h-full object-cover rounded-full border-2 border-surface-container-high shadow-sm" src={consultant.avatar} alt={consultant.name} />
            </div>
            <div className="flex-grow z-10">
              <div className="flex items-center gap-stack-sm mb-2">
                <span className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-2 py-1 rounded-DEFAULT border border-outline-variant/50">{consultant.specialization}</span>
                {consultant.verified && (
                  <span className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-2 py-1 rounded-DEFAULT border border-outline-variant/50 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified</span> Verified
                  </span>
                )}
              </div>
              <h1 className="font-display-lg text-display-lg text-primary mb-1">{consultant.name}</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-4">{consultant.title}</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1 text-trust-gold">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${i <= Math.floor(consultant.rating) ? 1 : 0}` }}>star</span>
                  ))}
                  <span className="font-label-md text-label-md text-on-surface-variant ml-1">{consultant.rating} ({consultant.reviewCount} Reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-on-surface-variant font-label-md text-label-md">
                  <span className="material-symbols-outlined">location_on</span>
                  {consultant.location}
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-4 bg-surface-alt border border-outline-variant rounded-xl p-8 flex flex-col justify-center">
            <h3 className="font-headline-md text-headline-md text-primary mb-4">Key Metrics</h3>
            <div className="grid grid-cols-2 gap-stack-md">
              <div className="bg-surface-container-lowest border border-outline-variant/50 p-4 rounded-lg">
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Sessions</p>
                <p className="font-headline-lg text-headline-lg text-primary">{consultant.sessions}+</p>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant/50 p-4 rounded-lg">
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Response</p>
                <p className="font-headline-lg text-headline-lg text-primary">{consultant.responseTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-md">
          <div className="lg:col-span-7 space-y-stack-lg">
            <section className="bg-surface-alt border border-outline-variant rounded-xl p-8">
              <h2 className="font-headline-md text-headline-md text-primary mb-4 border-b border-outline-variant/30 pb-2">About {consultant.name.split(' ')[0]}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{consultant.bio}</p>
            </section>
            <section className="bg-surface-alt border border-outline-variant rounded-xl p-8">
              <h2 className="font-headline-md text-headline-md text-primary mb-4 border-b border-outline-variant/30 pb-2">Professional Experience</h2>
              <div className="space-y-6">
                <div className="relative pl-6 border-l border-outline-variant/50">
                  <div className="absolute w-3 h-3 bg-secondary rounded-full -left-[6.5px] top-1.5 border-2 border-surface-alt" />
                  <h4 className="font-headline-md text-headline-md text-primary text-lg">Independent {consultant.specialization} Consultant</h4>
                  <p className="font-label-sm text-label-sm text-secondary mb-2">2020 - Present</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">{consultant.bio}</p>
                </div>
              </div>
            </section>
          </div>
          <div className="lg:col-span-5">
            <BookingWidget services={consultantServices} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: add ConsultantProfile page with BookingWidget"
```

---

## Task 8: Client Dashboard Page

**Files:**
- Create: `client/src/pages/client/ClientDashboard.tsx`

- [ ] **Step 1: Create ClientDashboard**

```tsx
import Sidebar from '../../components/layout/Sidebar';
import { appointments } from '../../data/appointments';

export default function ClientDashboard() {
  const upcoming = appointments.filter((a) => a.status === 'PENDING' || a.status === 'CONFIRMED');
  const past = appointments.filter((a) => a.status === 'COMPLETED' || a.status === 'CANCELLED');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="bg-[#fef08a] text-[#713f12] px-3 py-1 rounded-full font-label-sm text-label-sm">Pending Confirmation</span>;
      case 'CONFIRMED': return <span className="bg-[#d1fae5] text-[#065f46] px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> Confirmed</span>;
      case 'COMPLETED': return <span className="bg-[#d1fae5] text-[#065f46] px-2 py-1 rounded font-label-sm text-label-sm">Completed</span>;
      case 'CANCELLED': return <span className="bg-[#fee2e2] text-[#991b1b] px-2 py-1 rounded font-label-sm text-label-sm line-through">Cancelled</span>;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar userName="Sarah" activeItem="overview" />
      <main className="flex-1 overflow-y-auto bg-background p-8 md:p-12 scroll-smooth">
        <div className="max-w-max-width mx-auto space-y-section-gap pb-24">
          <section>
            <h1 className="font-display-lg text-display-lg text-primary mb-2">Hello, Sarah</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Here is a quick overview of your consulting engagements.</p>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-md">
            <div className="lg:col-span-2 space-y-stack-md">
              <div className="flex justify-between items-end mb-4">
                <h2 className="font-headline-md text-headline-md text-primary">Upcoming Appointments</h2>
                <a className="text-secondary font-label-md text-label-md hover:underline" href="#">View Calendar</a>
              </div>
              {upcoming.map((apt) => (
                <div key={apt.id} className="bg-surface-alt border border-outline-variant rounded-xl p-6 hover:shadow-[0px_4px_12px_rgba(15,23,42,0.05)] transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border border-outline-variant shrink-0 bg-surface-container-high flex items-center justify-center text-secondary font-bold text-lg">
                        {apt.consultantAvatar ? (
                          <img src={apt.consultantAvatar} alt={apt.consultantName} className="w-full h-full object-cover" />
                        ) : (
                          apt.consultantName.split(' ').map((n) => n[0]).join('')
                        )}
                      </div>
                      <div>
                        <h3 className="font-headline-md text-headline-md text-primary">{apt.consultantName}</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant mb-2">{apt.serviceName}</p>
                        <div className="flex flex-wrap items-center gap-3 font-label-sm text-label-sm text-on-surface-variant">
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span> {apt.date}</span>
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> {apt.startTime} - {apt.endTime}</span>
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">{apt.meetingType === 'video' ? 'videocam' : 'business'}</span> {apt.meetingType === 'video' ? 'Video Call' : apt.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      {getStatusBadge(apt.status)}
                      <div className="flex gap-2 w-full sm:w-auto mt-4">
                        <button className="flex-1 sm:flex-none border border-outline text-on-surface-variant px-4 py-2 rounded-md font-label-md text-label-md hover:bg-surface-container-low transition-colors">Reschedule</button>
                        <button className="flex-1 sm:flex-none border border-outline text-on-surface-variant px-4 py-2 rounded-md font-label-md text-label-md hover:text-error-crimson hover:border-error-crimson transition-colors">Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-stack-lg">
              <div className="bg-gradient-to-br from-surface to-surface-container-high border border-outline-variant rounded-xl p-6 backdrop-blur-sm shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-6xl">monitoring</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-primary mb-6 relative z-10">Engagement Summary</h3>
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2">
                    <span className="font-body-md text-body-md text-on-surface-variant">Active Consultants</span>
                    <span className="font-headline-md text-headline-md text-secondary">3</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2">
                    <span className="font-body-md text-body-md text-on-surface-variant">Hours Consulted</span>
                    <span className="font-headline-md text-headline-md text-secondary">12.5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body-md text-body-md text-on-surface-variant">Next Milestone</span>
                    <span className="font-label-md text-label-md text-primary">Q4 Review</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-headline-md text-headline-md text-primary mb-4">Past Appointments</h2>
                <div className="bg-surface-alt border border-outline-variant rounded-xl overflow-hidden">
                  {past.map((apt, i) => (
                    <div key={apt.id} className={`p-4 ${i < past.length - 1 ? 'border-b border-outline-variant/30' : ''} hover:bg-surface transition-colors flex items-center justify-between ${apt.status === 'CANCELLED' ? 'opacity-75' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${apt.status === 'CANCELLED' ? 'bg-surface-container-low text-on-surface-variant' : 'bg-surface-container-high text-secondary'}`}>
                          {apt.consultantName.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-label-md text-label-md text-primary">{apt.consultantName}</h4>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">{apt.date} • {apt.serviceName}</p>
                        </div>
                      </div>
                      {getStatusBadge(apt.status)}
                    </div>
                  ))}
                  <div className="p-3 bg-surface text-center border-t border-outline-variant/50">
                    <a className="font-label-md text-label-md text-secondary hover:underline" href="#">View Full History</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add ClientDashboard with sidebar and appointment cards"
```

---

## Task 9: Router + App.tsx Setup

**Files:**
- Modify: `client/src/App.tsx`

- [ ] **Step 1: Replace App.tsx with full router**

```tsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Consultants from './pages/Consultants';
import ConsultantProfile from './pages/ConsultantProfile';
import ClientDashboard from './pages/client/ClientDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/consultants" element={<Consultants />} />
      <Route path="/consultants/:id" element={<ConsultantProfile />} />
      <Route path="/client/dashboard" element={<ClientDashboard />} />
    </Routes>
  );
}

export default App;
```

- [ ] **Step 2: Update package.json scripts**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

- [ ] **Step 3: Run dev server and verify all pages work**

```bash
npm run dev
```

Test: Visit `/`, `/consultants`, `/consultants/1`, `/client/dashboard`, `/login`, `/register`

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: configure React Router with all page routes"
```

---

## Task 10: Deploy to Vercel

**Files:**
- Create: `client/vercel.json` (optional, usually auto-detected)

- [ ] **Step 1: Build the project**

```bash
npm run build
```

- [ ] **Step 2: Push to GitHub**

```bash
git add .
git commit -m "chore: ready for deployment"
git push origin main
```

- [ ] **Step 3: Deploy on Vercel**

1. Go to vercel.com
2. Import GitHub repository
3. Set root directory: `client`
4. Framework: Vite
5. Build command: `npm run build`
6. Output directory: `dist`
7. Deploy

- [ ] **Step 4: Add Vercel URL to README**

Update `README.md` with the live URL.

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "docs: add Vercel deployment URL to README"
```

---

## Summary

| Task | Pages | Time Est. |
|------|-------|-----------|
| 1. Project Setup | Vite + React + TS | 15 min |
| 2. Tailwind Config | Design tokens | 10 min |
| 3. Types + Mock Data | All interfaces | 15 min |
| 4. Layout Components | Navbar, Footer, Sidebar | 20 min |
| 5. Home, Login, Register | 3 pages | 30 min |
| 6. Consultants Browse | Filter + Cards | 30 min |
| 7. Consultant Profile | Profile + BookingWidget | 30 min |
| 8. Client Dashboard | Dashboard with sidebar | 30 min |
| 9. Router Setup | App.tsx routing | 10 min |
| 10. Deploy | Vercel | 15 min |
| **Total** | **~10 pages** | **~3 hours** |
