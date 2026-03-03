# Architecture

## System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Homepage  │  │Marketplace│  │Dashboard │  │   Blog   │    │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘    │
└────────┼─────────────┼─────────────┼─────────────┼──────────┘
         │             │             │             │
    ┌────▼─────────────▼─────────────▼─────────────▼────┐
    │              Next.js App Router                     │
    │  ┌────────────────────┐  ┌──────────────────────┐  │
    │  │ Server Components   │  │   Server Actions     │  │
    │  │ (data fetching)     │  │   (mutations)        │  │
    │  └─────────┬──────────┘  └──────────┬───────────┘  │
    │            │                         │              │
    │  ┌─────────▼─────────────────────────▼───────────┐  │
    │  │              NextAuth.js v5                     │  │
    │  │         (JWT sessions, role-based)              │  │
    │  └─────────┬──────────────────────────────────────┘  │
    │            │                                         │
    │  ┌─────────▼──────────────────────────────────────┐  │
    │  │              Prisma ORM (v6)                     │  │
    │  └─────────┬──────────────────────────────────────┘  │
    └────────────┼─────────────────────────────────────────┘
                 │
    ┌────────────▼──────────────────────────────────────┐
    │              SQLite (dev.db)                       │
    └───────────────────────────────────────────────────┘
```

## Component Breakdown

### Pages (Server Components)
| Component | Responsibility |
|-----------|---------------|
| `app/page.tsx` | Homepage — hero, stats, featured courses, categories |
| `app/marketplace/page.tsx` | Course listing with filter query params |
| `app/courses/[slug]/page.tsx` | Course detail — lessons, tutor info, enrollment |
| `app/dashboard/tutor/page.tsx` | Tutor stats, course management |
| `app/dashboard/student/page.tsx` | Enrolled courses, calendar |
| `app/blog/page.tsx` | Blog post listing |
| `app/blog/[slug]/page.tsx` | Blog post article |

### Client Components
| Component | Responsibility |
|-----------|---------------|
| `Navbar` | Auth-aware navigation, mobile menu |
| `LayoutWrapper` | Session provider + navbar wrapper |
| `MarketplaceFilters` | Search input + category/level filter buttons |
| `EnrollButton` | Course enrollment with loading/success states |
| `TutorCourseManager` | Full course CRUD — create, publish, delete, add lessons |
| `StudentCalendar` | Calendar event creation and management |

### UI Primitives
| Component | Description |
|-----------|-------------|
| `Button` | Variant-based button (default, outline, ghost, destructive) |
| `Card` | Container with header, content, footer slots |
| `Input` | Styled text input with focus states |
| `Textarea` | Multi-line text input |
| `Badge` | Category/status labels (default, success, warning, outline) |
| `Avatar` | Image or initials fallback with gradient background |

## Data Flow

### Read (Server Components)
```
User navigates to /marketplace
  → Server Component renders
  → Prisma query: course.findMany({ where: { published: true }, include: tutor })
  → HTML streamed to browser
  → Client components hydrate for interactivity (filters)
```

### Write (Server Actions)
```
User submits "Create Course" form
  → Server Action: createCourse(formData)
  → auth() checks session and role
  → Prisma: course.create({ data: ... })
  → revalidatePath("/marketplace", "/dashboard/tutor")
  → Page re-renders with new data
```

### Authentication
```
User submits login form
  → Server Action: loginUser(formData)
  → Prisma: user.findUnique({ email })
  → bcrypt.compare(password, hash)
  → NextAuth signIn() creates JWT
  → JWT stored in HTTP-only cookie
  → Subsequent requests: auth() reads JWT, returns session
```

## Storage Schema

```
User
├── id (cuid)
├── email (unique)
├── name
├── passwordHash (bcrypt)
├── role ("student" | "tutor")
├── bio, avatar, expertise
└── timestamps

Course
├── id (cuid)
├── title, slug (unique), description
├── category, level
├── published, featured
├── tutorId → User
└── timestamps

Lesson
├── id (cuid)
├── title, content
├── order, duration
├── courseId → Course
└── timestamps

Enrollment
├── id (cuid)
├── progress (0-100)
├── studentId → User
├── courseId → Course
├── UNIQUE(studentId, courseId)
└── timestamps

CalendarEvent
├── id (cuid)
├── title, description
├── startTime, endTime
├── color
├── userId → User
└── timestamps

BlogPost
├── id (cuid)
├── title, slug (unique), content
├── excerpt, tags (comma-separated)
├── published
├── authorId → User
└── timestamps
```

## Error Handling Strategy

- **Server Actions** return `{ error: string }` on validation/auth failures
- **Client Components** display error messages in styled alert boxes
- **Auth Guards** — server pages redirect to `/login` if session is missing
- **Role Guards** — tutor-only actions check `session.user.role === "tutor"`
- **404s** — `notFound()` called when slugs don't resolve

## Extension Points

- **New course types** — add fields to Course model (video URL, quiz data)
- **Payment** — add Price model, Stripe webhook handler, enrollment gating
- **OAuth** — add providers to NextAuth config (Google, GitHub)
- **Notifications** — add Notification model, real-time via SSE or WebSocket
- **Comments** — add Comment model linked to Course or BlogPost
- **File uploads** — integrate S3/R2 for avatars, thumbnails, lesson attachments
