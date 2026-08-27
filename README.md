# ConsultantHub

**Find the right consultant. Book in minutes.**

ConsultantHub is a consultant discovery and appointment booking platform. Clients browse verified consultants by specialty, review their experience and rates, and book sessions directly — no back-and-forth emails, no scheduling friction.

**Live Demo:** _Coming soon_

---

## Features

- **Browse & filter** consultants by specialty, availability, and rating
- **Rich profiles** — bio, experience, services, and real-time availability
- **Instant booking** — select a time slot and confirm in one flow
- **Client dashboard** — manage upcoming and past appointments in one place
- **Role-based access** — separate flows for clients and consultants

---

## Tech Stack

| Layer        | Technology                        |
| ------------ | --------------------------------- |
| Frontend     | React 18 + TypeScript             |
| Styling      | Tailwind CSS                      |
| Routing      | React Router v6                   |
| Build        | Vite                              |
| Deployment   | Vercel                            |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/Abdrihman-Hussein/ConsultantHub.git
cd ConsultantHub/client
npm install
npm run dev
```

Open `http://localhost:5173`

### Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build (TypeScript must pass)
npm run preview  # Preview production build locally
```

---

## Pages

| Page             | Route               | Description                                   |
| ---------------- | ------------------- | --------------------------------------------- |
| Home             | `/`                 | Hero, featured consultants, how it works      |
| Browse           | `/consultants`      | Filter and search all consultants             |
| Profile          | `/consultants/:id`  | Consultant detail + booking widget            |
| Client Dashboard | `/client/dashboard` | Appointments, history, account overview       |
| Login            | `/login`            | Sign in                                       |
| Register         | `/register`         | Create client or consultant account           |

---

## Project Structure

```
ConsultantHub/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/       # Navbar, Footer, Sidebar
│   │   │   ├── ui/           # Button, Card, Badge, Modal
│   │   │   └── consultants/  # ConsultantCard, FilterSidebar, BookingWidget
│   │   ├── data/             # Mock data (dev only)
│   │   ├── pages/            # Route-level page components
│   │   ├── types/            # Shared TypeScript interfaces
│   │   ├── App.tsx           # Router config
│   │   └── main.tsx          # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── design/                   # UI prototypes and specs
└── docs/                     # Architecture and planning docs
```

---

## Design System

Built on a clean, trust-first visual language.

| Token           | Value           |
| --------------- | --------------- |
| Primary         | `#000000`       |
| Secondary       | `#0051d5`       |
| Background      | `#f8f9ff`       |
| Trust Gold      | `#B45309`       |
| Success         | `#059669`       |
| Error           | `#E11D48`       |
| Headline font   | Hanken Grotesk  |
| Body font       | Inter           |
| Label font      | JetBrains Mono  |

---

## Roadmap

### v1 — Current (Frontend MVP)
- [x] Project setup and design system
- [x] TypeScript types and mock data
- [ ] Layout components
- [ ] Home, Login, Register pages
- [ ] Browse and Profile pages
- [ ] Client Dashboard
- [ ] Deployment

### v2 — Backend
- [ ] REST API: Express + TypeScript
- [ ] Database: PostgreSQL + Prisma ORM
- [ ] Authentication: JWT + refresh tokens
- [ ] Consultant dashboard — availability management, booking control
- [ ] Real booking engine with conflict detection
- [ ] Email notifications

### v3 — Growth
- [ ] Payments: Stripe integration
- [ ] Reviews and ratings
- [ ] Admin panel
- [ ] Mobile app

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit with clear messages: `feat: add booking confirmation flow`
4. Open a Pull Request against `main`

All PRs require a passing build (`npm run build`) before review.

---

## License

MIT — open to use, fork, and build on.
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| React Router | Navigation |
| Vite | Build tool |
| Vercel | Deployment |

**No backend in MVP** — using mock data (`client/src/data/`)

## Pages (MVP)

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, specialties, featured consultants, how it works |
| Browse | `/consultants` | Filter sidebar + consultant cards grid |
| Profile | `/consultants/:id` | Bio, experience, booking widget with calendar |
| Dashboard | `/client/dashboard` | Sidebar + upcoming/past appointments + stats |
| Login | `/login` | Email + password form |
| Register | `/register` | Name + email + password + role form |

### Design References
- **Browse page**: `maak/code (1) (2).html` — filter sidebar, consultant cards, pagination
- **Profile page**: `maak/screen (4) (2).html` — profile header, about, experience, booking widget
- **Dashboard**: `maak/DESIGN (2).html` — sidebar nav, upcoming appointments, past appointments, stats

## Implementation Plan

Full step-by-step plan: `docs/superpowers/plans/2026-08-27-consultanthub-mvp.md`

10 tasks, ~3 hours total. Each task has files, code, and commit messages.

## Quick Start

```bash
# Clone
git clone <repository-url>
cd consultanthub/client

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173`

### Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Project Structure

```
consultanthub/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── layout/       # Navbar, Footer, Sidebar
│   │   │   ├── ui/           # Button, Card, Badge, Modal
│   │   │   └── consultants/  # ConsultantCard, FilterSidebar, BookingWidget
│   │   ├── data/             # Mock data (consultants, services, appointments)
│   │   ├── pages/            # All page components
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Consultants.tsx
│   │   │   ├── ConsultantProfile.tsx
│   │   │   └── client/
│   │   │       └── ClientDashboard.tsx
│   │   ├── types/            # TypeScript interfaces
│   │   ├── App.tsx           # Router setup
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Tailwind imports
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js    # Design system tokens
├── maak/                     # Design prototypes
│   ├── design.md             # Full project spec
│   ├── DESIGN (2).html       # Client Dashboard design
│   ├── code (1) (2).html     # Browse page design
│   └── screen (4) (2).html   # Profile page design
├── docs/
│   └── superpowers/
│       └── plans/            # Implementation plan
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── .gitignore
└── README.md
```

## Project Status

| Task | Status |
|------|--------|
| Task 1: Project Setup | ✅ Done (issue #1 closed) |
| Task 2: Tailwind Config | ✅ Done (issue #2 closed) |
| Task 3: Types + Mock Data | ✅ Done (issue #3 closed) |
| Task 4: Layout Components | ⬜ Open (issue #4) |
| Task 5: Home/Login/Register | ⬜ Open (issue #5) |
| Task 6: Browse Page | ⬜ Open (issue #6) |
| Task 7: Profile Page | ⬜ Open (issue #7) |
| Task 8: Dashboard | ⬜ Open (issue #8) |
| Task 9: Router Setup | ⬜ Open (issue #9) |
| Task 10: Deploy | ⬜ Open (issue #10) |

All work is tracked in GitHub Issues: https://github.com/Abdrihman-Hussein/ConsultantHub/issues

## GitHub Workflow (Full)

We use the **feature branch workflow**: every task gets its own branch, a Pull Request, and a code review before merging into `main`.

### 1. First Time Setup (once per person)

```bash
# Clone the repo
git clone https://github.com/Abdrihman-Hussein/ConsultantHub.git
cd consultanthub

# Install dependencies
cd client
npm install
```

Verify your setup:
```bash
npm run dev        # should start the server at http://localhost:5173
npm run build      # should pass without errors
```

### 2. Pick a Task (GitHub Issue)

1. Go to **Issues**: https://github.com/Abdrihman-Hussein/ConsultantHub/issues
2. Choose an open issue (Tasks 4-10 are available)
3. **Assign yourself** (right side → Assignees)
4. Move the issue to **In Progress** on the Project board
5. Note the issue number (e.g. `#6`)

### 3. Create a Feature Branch

Never work directly on `main`. Always branch:

```bash
cd C:\Users\hp\consultantHub

# Make sure you have the latest code
git checkout main
git pull origin main

# Create your feature branch (name matches the task)
git checkout -b feature/consultants-browse
```

### 4. Do the Work + Commit Small

Work on the task. Make **small, descriptive commits** as you go:

```bash
git add client/src/pages/Consultants.tsx
git commit -m "feat: add consultants browse page"

git add client/src/components/consultants/ConsultantCard.tsx
git commit -m "feat: add consultant card component"
```

### 5. Commit Convention

| Prefix | Use for |
|--------|---------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `refactor:` | Code restructuring |
| `docs:` | Documentation |
| `style:` | Formatting / layout |
| `test:` | Adding tests |
| `chore:` | Maintenance, dependencies |

Examples:
```bash
feat: add consultant card component
fix: prevent duplicate time slots
refactor: simplify booking widget
docs: update API documentation
```

**Avoid** bad commits like `update`, `fix`, `changes`, `final`, `final2`, `new`.

### 6. Test Before Pushing

```bash
cd client
npm run build      # MUST pass — no TypeScript errors
npm run dev        # manually check your page in the browser
```

### 7. Push + Create a Pull Request

```bash
git push origin feature/consultants-browse
```

Then open a PR on GitHub:
- **Base:** `main`
- **Compare:** `feature/consultants-browse`
- Title: e.g. `feat: add consultants browse page`
- Body: what changed, how you tested it, screenshot
- Add label (e.g. `frontend`, `ui`)

### 8. Code Review

1. Ask a teammate to review your PR
2. Reviewer checks: code quality, matches design, build passes
3. If changes are requested → push more commits to the same branch
4. Once approved → **merge** the PR

### 9. Close the Issue

Add `Closes #N` (N = issue number) to the PR description or commit message. The issue auto-closes when the PR merges into `main`:

```text
feat: add consultants browse page

Closes #6
```

### 10. Update Your Local Repo

After your PR merges, get the latest code:

```bash
git checkout main
git pull origin main
git branch -d feature/consultants-browse   # delete old branch (local)
```

### 11. Task → Branch Mapping

| Task | Branch Name |
|------|-------------|
| Task 1: Project Setup | `feature/project-setup` |
| Task 2: Tailwind Config | `feature/tailwind-config` |
| Task 3: Types + Data | `feature/mock-data` |
| Task 4: Layout Components | `feature/layout-components` |
| Task 5: Home/Login/Register | `feature/auth-pages` |
| Task 6: Browse Page | `feature/consultants-browse` |
| Task 7: Profile Page | `feature/consultant-profile` |
| Task 8: Dashboard | `feature/client-dashboard` |
| Task 9: Router Setup | `feature/router-setup` |
| Task 10: Deploy | `feature/deployment` |

### 12. Merge Conflict Help

If GitHub says "can't merge automatically":

```bash
git checkout main
git pull origin main
git checkout feature/consultants-browse
git merge main        # pull latest main into your branch
# Fix conflicts in the files GitHub marks, then:
git add .
git commit -m "merge: resolve conflicts with main"
git push origin feature/consultants-browse
```

### Branch Protection (recommended)
- `main` — protect it: require PR + review, no direct pushes
- `feature/*` — all work happens here

## Deployment

**Vercel** (automatic on push to `main`):

1. Connect GitHub repo to Vercel
2. Set root directory: `client`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy

## Hackathon Schedule (1 Day)

| Time | Activity | Who |
|------|----------|-----|
| 0:00-0:30 | Repo setup, GitHub config, clone, install | Lead |
| 0:30-1:00 | Tailwind config + Types + Mock data | Lead + F3 |
| 1:00-1:30 | Layout components (Navbar, Footer, Sidebar) | F2 |
| 1:30-3:00 | Parallel page development | Everyone |
| 3:00-4:00 | Integration, routing, testing | Lead |
| 4:00-4:30 | Deploy to Vercel | Lead |
| 4:30-5:00 | Retrospective, document lessons learned | Everyone |

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
