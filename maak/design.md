# ConsultantHub

A full-stack consultant appointment booking platform that allows clients to discover consultants, view services, check availability, and book appointments online.

## Project Overview

ConsultantHub is a team-built web application designed to simplify the process of finding and booking professional consultants.

Clients can browse consultants, view their profiles and services, select available appointment times, and manage their bookings.

Consultants can manage their profiles, services, working hours, and appointments.

Administrators can manage users, consultants, and appointments across the platform.

## Main Goals

- Make consultant discovery simple.
- Make appointment booking easy.
- Allow consultants to manage their schedules.
- Practice real-world full-stack development.
- Practice collaborative GitHub development.
- Build a production-style portfolio project.

## User Roles

### Client

Clients can:

- Create an account.
- Log in and log out.
- Browse consultants.
- View consultant profiles.
- View services.
- Select available appointment times.
- Book appointments.
- View upcoming appointments.
- View past appointments.
- Cancel their appointments.
- Manage their profile.

### Consultant

Consultants can:

- Create and manage their profile.
- Add services.
- Edit services.
- Remove services.
- Set working hours.
- View available appointments.
- Confirm appointments.
- Reject appointments.
- Mark appointments as completed.
- Manage their profile.

### Admin

Administrators can:

- View users.
- View consultants.
- View appointments.
- Manage platform data.
- Disable problematic accounts.

## Core Features

### Authentication

- Registration
- Login
- Logout
- JWT authentication
- Protected routes
- Role-based authorization

### Consultant Discovery

- Consultant listing
- Consultant profile
- Specialty
- Experience
- Services
- Search
- Filtering

### Appointment Booking

- Select consultant
- Select service
- Select date
- View available times
- Book appointment
- Cancel appointment
- Appointment status

### Availability

Consultants can define their working days and working hours.

The application generates available appointment slots and prevents conflicting bookings.

### Dashboards

The project includes separate dashboards for:

- Clients
- Consultants
- Administrators

## Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- React Router

### Backend

- Node.js
- Express.js
- TypeScript
- Zod

### Database

- PostgreSQL
- Prisma ORM

### Authentication

- JWT

### Development

- Git
- GitHub
- Postman

### Deployment

- Vercel
- Render
- PostgreSQL hosting

## Project Structure

```text
consultanthub/
│
├── client/
│   └── React frontend
│
├── server/
│   ├── Express API
│   └── Prisma database
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   ├── contributing.md
│   └── deployment.md
│
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
│
├── .env.example
├── README.md
└── LICENSE
```

## Application Flow

```text
Client
   |
   v
Browse Consultants
   |
   v
Consultant Profile
   |
   v
Select Service
   |
   v
Select Date
   |
   v
Check Availability
   |
   v
Select Time
   |
   v
Confirm Booking
   |
   v
Appointment Created
```

## Architecture

```text
React Frontend
      |
      | REST API
      v
Express Backend
      |
      v
Prisma ORM
      |
      v
PostgreSQL
```

The frontend handles the user interface.

The Express backend handles authentication, validation, business logic, authorization, availability, and appointments.

PostgreSQL stores users, consultants, services, availability, and appointments.

## Database Models

The main database models are:

```text
User
Consultant
Service
Availability
Appointment
```

### User

Stores account information and user roles.

### Consultant

Stores consultant-specific information such as specialization, biography, and experience.

### Service

Stores the services offered by consultants.

### Availability

Stores consultant working days and working hours.

### Appointment

Stores bookings between clients and consultants.

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd consultanthub
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Configure environment variables

Create `.env` files using the provided `.env.example`.

Required variables include:

```text
DATABASE_URL=
JWT_SECRET=
PORT=
CLIENT_URL=
```

### 5. Configure the database

Run the Prisma migrations:

```bash
npx prisma migrate dev
```

Seed demo data:

```bash
npx prisma db seed
```

### 6. Start the backend

```bash
npm run dev
```

### 7. Start the frontend

From the client directory:

```bash
npm run dev
```

## API

Main API groups include:

```text
/api/auth
/api/consultants
/api/services
/api/availability
/api/appointments
/api/admin
```

Detailed API documentation is available in:

```text
docs/api.md
```

## GitHub Workflow

We use a feature-branch workflow.

```text
main
  |
develop
  |
feature/your-feature
```

Developers should not push directly to `main`.

### Example

```bash
git checkout develop
git pull origin develop

git checkout -b feature/booking

git add .
git commit -m "feat: implement appointment booking"

git push origin feature/booking
```

Then create a Pull Request into `develop`.

After review and testing, the Pull Request can be merged.

## Commit Convention

We use conventional commit prefixes:

```text
feat:
fix:
refactor:
docs:
test:
style:
chore:
```

Examples:

```text
feat: add consultant profile page
fix: prevent duplicate appointment booking
docs: update API documentation
test: add appointment validation tests
```

## GitHub Issues

All work should be tracked through GitHub Issues.

Examples:

```text
Authentication
Consultant Profiles
Services
Availability
Appointments
Dashboards
Testing
Documentation
Deployment
```

Each issue should have:

- A clear title.
- A description.
- Acceptance criteria.
- Appropriate labels.
- An assigned contributor.

## Development Rules

1. Create an issue before starting major work.
2. Create a feature branch from `develop`.
3. Keep commits small and descriptive.
4. Do not commit secrets.
5. Test your changes before creating a Pull Request.
6. Explain important changes in the Pull Request.
7. Ask for review before merging.
8. Do not directly push to `main`.

## Roadmap

### Version 1

- Authentication
- Consultant profiles
- Services
- Availability
- Appointment booking
- Client dashboard
- Consultant dashboard
- Admin dashboard
- Responsive UI
- Deployment

### Version 2

Possible future features:

- Email notifications
- Online payments
- Reviews and ratings
- Consultant verification
- Calendar integration
- Appointment reminders
- Advanced search
- Analytics

### Version 3

Possible long-term features:

- Multiple organizations
- Subscription system
- Video consultations
- Mobile application
- Recommendation system

## Project Status

Current status:

```text
In Development
```

## Contributors

Contributors are listed here as the project develops.

## License

This project is licensed under the MIT License.