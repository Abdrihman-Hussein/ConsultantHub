# ConsultantHub

A consultant appointment booking platform built as a **1-day hackathon MVP** by a beginner team.

## Project Overview

ConsultantHub helps clients discover consultants, view their services, and book appointments. Built as a learning exercise for GitHub collaboration, React/TypeScript/Tailwind, and deployment.

**Live Demo:** [Add Vercel URL after deployment]

## Team

- **Team Lead** — Repository, GitHub workflow, integration, deployment
- **Frontend 1** — Consultant listing, profiles, search
- **Frontend 2** — Booking flow, dashboards
- **Frontend 3** (optional) — Shared components, layout

## Tech Stack (Frontend Only for MVP)

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| React Router | Navigation |
| Vite | Build tool |
| Vercel | Deployment |

**No backend in MVP** — using mock data (`client/src/data/`)

## Features (MVP Scope)

### Public Pages
- **Home** — Hero, featured consultants, how it works
- **Consultants** — List with search/filter by specialty
- **Consultant Profile** — Bio, services, "Book" buttons

### Auth (Simulated)
- Login/Register pages (UI only, no real auth)
- Role selection: Client / Consultant / Admin

### Client Dashboard
- Upcoming appointments
- Past appointments
- Profile settings

### Consultant Dashboard
- My services (CRUD UI)
- My availability (UI only)
- Appointment requests (Accept/Reject/Complete)

### Admin Dashboard
- Users table
- Consultants table
- Appointments table

## Quick Start

```bash
# Clone
git clone <repository-url>
cd consultanthub

# Install dependencies
cd client
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173`

## Project Structure

```
consultanthub/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/     # Reusable UI (Button, Card, Navbar, Modal)
│   │   ├── data/           # Mock data (consultants, appointments)
│   │   ├── pages/          # Page components
│   │   ├── types/          # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── .gitignore
└── README.md
```

## GitHub Workflow

We use **feature branches** + **Pull Requests**:

```bash
# 1. Start from develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/consultant-profile

# 3. Work, commit with conventional messages
git add .
git commit -m "feat: add consultant profile page"

# 4. Push and create PR
git push origin feature/consultant-profile
# Open PR on GitHub → develop
```

### Commit Convention
```
feat: new feature
fix: bug fix
refactor: code restructuring
docs: documentation
style: formatting
chore: maintenance
```

### Branch Protection
- `main` — protected, requires PR + review
- `develop` — integration branch
- `feature/*` — feature branches

## Deployment

**Vercel** (automatic on push to `main`):

1. Connect GitHub repo to Vercel
2. Set root directory: `client`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy

## Hackathon Schedule (1 Day)

| Time | Activity |
|------|----------|
| 0:00-0:30 | Repo setup, GitHub config, clone, install |
| 0:30-1:30 | Shared components + layout + types + mock data |
| 1:30-4:30 | Parallel page development |
| 4:30-5:30 | Integration, testing, conflict resolution |
| 5:30-6:00 | Deploy to Vercel, create demo accounts |
| 6:00-6:30 | Retrospective, document lessons learned |

## Learning Goals

- [ ] GitHub Issues, Projects, Labels, Milestones
- [ ] Feature branches, Pull Requests, Code Reviews
- [ ] React + TypeScript + Tailwind component patterns
- [ ] React Router for navigation
- [ ] State management (React Context or props)
- [ ] Responsive design with Tailwind
- [ ] Vercel deployment
- [ ] Team communication & retrospective

## Post-Hackathon (Version 2+)

- Real backend: Express + TypeScript
- Database: PostgreSQL + Prisma
- Authentication: JWT
- Real booking logic & availability calculation
- Email notifications
- Payments integration

## License

MIT — feel free to use for learning.