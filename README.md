# VersaLearn — Tutor Marketplace

> Connect with expert tutors, discover curated courses, and accelerate your learning journey.

A full-stack tutor marketplace where tutors register, design courses, and publish them for students to discover, enroll in, and study. Includes a blog platform and student calendar for scheduling study sessions. Built with Next.js 16, TypeScript, and SQLite.

## Features

### For Tutors
- **Registration & Profiles** — Sign up as a tutor with expertise tags and bio
- **Course Creation** — Create courses with title, description, category, and difficulty level
- **Lesson Management** — Add and delete lessons with content and duration
- **Publish Control** — Toggle course visibility between draft and published states
- **Dashboard** — Overview of total courses, enrolled students, and published courses

### For Students
- **Course Discovery** — Browse the marketplace with search, category, and level filters
- **Enrollment** — One-click enrollment in any published course (free for Phase 1)
- **Progress Tracking** — Visual progress bars on enrolled courses
- **Calendar** — Schedule study sessions and deadlines with color-coded events
- **Dashboard** — View enrolled courses, average progress, and upcoming events

### Community
- **Blog Platform** — Write and publish blog posts with markdown-style formatting
- **Tag System** — Posts tagged for easy discovery
- **Author Profiles** — Posts linked to tutor/student profiles

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | **Next.js 16** (App Router) | Full-stack React with server components, server actions, and API routes |
| Language | **TypeScript** | Type safety across the entire stack |
| Database | **SQLite + Prisma 6** | Zero-config, local-first persistence — perfect for Phase 1 |
| Auth | **NextAuth.js v5** (beta) | Credential-based auth with JWT sessions and role-based access |
| Styling | **Tailwind CSS v4** | Utility-first CSS with dark mode default |
| UI Components | **Radix UI** + custom | Accessible primitives with custom dark-themed components |
| Icons | **Lucide React** | Consistent, lightweight icon set |

## Prerequisites

- Node.js 20+ (tested with Node 24)
- npm 10+

## Installation

```bash
git clone https://github.com/thotas/VersaLearn.git
cd VersaLearn
npm install
```

## Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed with sample data
npx tsx prisma/seed.ts
```

## Run

```bash
npm run dev
```

Open [http://localhost:5192](http://localhost:5192)

### Test Accounts (password: `password123`)

| Role | Email |
|------|-------|
| Tutor | sarah@example.com |
| Tutor | marcus@example.com |
| Tutor | elena@example.com |
| Student | alex@example.com |
| Student | jordan@example.com |

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `file:./dev.db` | SQLite database path |
| `NEXTAUTH_SECRET` | dev secret | JWT signing secret (change in production) |
| `NEXTAUTH_URL` | `http://localhost:5192` | Application URL |

## Architecture Overview

```
Browser → Next.js App Router → Server Components / Server Actions → Prisma ORM → SQLite
                                    ↕
                              NextAuth.js (JWT sessions)
```

- **Server Components** fetch data directly via Prisma — no API layer needed
- **Server Actions** handle mutations (create, update, delete) with auth checks
- **Client Components** manage interactive state (forms, filters, modals)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage with hero, stats, featured courses
│   ├── login/              # Credential login
│   ├── register/           # Role-based registration (student/tutor)
│   ├── profile/            # User profile editing
│   ├── marketplace/        # Course discovery with search & filters
│   ├── courses/[slug]/     # Course detail with lessons & enrollment
│   ├── dashboard/
│   │   ├── tutor/          # Course management, stats
│   │   └── student/        # Enrolled courses, calendar
│   ├── blog/               # Blog listing
│   │   ├── [slug]/         # Blog post detail
│   │   └── new/            # Write new post
│   └── api/auth/           # NextAuth API routes
├── actions/                # Server actions (CRUD operations)
│   ├── auth.ts             # Login, register
│   ├── courses.ts          # Course & lesson CRUD, enrollment
│   ├── blog.ts             # Blog post CRUD
│   ├── calendar.ts         # Calendar event CRUD
│   └── profile.ts          # Profile updates
├── components/             # React components
│   ├── ui/                 # Reusable UI primitives (Button, Card, Input, etc.)
│   ├── navbar.tsx           # Navigation with auth-aware links
│   ├── layout-wrapper.tsx   # Root layout with session provider
│   ├── marketplace-filters.tsx  # Search & filter controls
│   ├── enroll-button.tsx    # Course enrollment with loading states
│   ├── tutor-course-manager.tsx # Course CRUD interface
│   └── student-calendar.tsx # Calendar event management
├── lib/                    # Shared utilities
│   ├── auth.ts             # NextAuth configuration
│   ├── db.ts               # Prisma client singleton
│   ├── types.ts            # TypeScript type augmentations
│   └── utils.ts            # Helper functions
prisma/
├── schema.prisma           # Data models
├── seed.ts                 # Sample data seeder
└── migrations/             # SQLite migrations
```

## Known Limitations

- **No payment processing** — all courses are free (Phase 1 design decision)
- **No file uploads** — avatars and thumbnails are URL-based only
- **No real-time updates** — pages require refresh to see other users' changes
- **SQLite** — single-writer limitation; not suitable for high-concurrency production
- **No email verification** — accounts are created without email confirmation
- **Basic markdown rendering** — blog posts use simple paragraph/heading parsing, not full markdown

## Roadmap

- [ ] Payment integration (Stripe) for paid courses
- [ ] File upload for avatars, thumbnails, and lesson attachments
- [ ] Full markdown rendering with syntax highlighting
- [ ] Real-time notifications for enrollments and comments
- [ ] Course ratings and reviews
- [ ] Tutor analytics dashboard with enrollment trends
- [ ] PostgreSQL migration for production deployment
- [ ] Email verification and password reset
- [ ] Course progress tracking per lesson
- [ ] Video lesson support

## License

MIT
