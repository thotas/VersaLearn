# Technical Decisions

## Framework: Next.js 16 (App Router)
- **Chosen:** Next.js 16 with App Router, Server Components, and Server Actions
- **Alternatives considered:** Remix, SvelteKit, plain React + Express
- **Rationale:** Full-stack in one framework. Server Components eliminate the need for a separate API layer for reads. Server Actions handle writes with built-in form handling. The App Router provides file-based routing with layouts.
- **Tradeoffs:** Beta features (NextAuth v5), more complex mental model than Pages Router

## Database: SQLite + Prisma 6
- **Chosen:** SQLite via Prisma ORM (v6)
- **Alternatives considered:** PostgreSQL, MongoDB, Drizzle ORM
- **Rationale:** Zero configuration, no external service needed, local-first. Perfect for Phase 1 development and demo. Prisma provides type-safe queries and easy migrations.
- **Tradeoffs:** Single-writer limitation, no concurrent writes. Will need PostgreSQL for production scale. Used Prisma v6 over v7 due to v7's breaking changes requiring driver adapters.

## Authentication: NextAuth.js v5 with Credentials
- **Chosen:** NextAuth.js v5 (beta) with credential-based auth
- **Alternatives considered:** Clerk, Supabase Auth, custom JWT implementation
- **Rationale:** Free, self-hosted, integrates natively with Next.js. Credentials provider is simplest for Phase 1. JWT strategy avoids database session storage.
- **Tradeoffs:** Beta status means potential API changes. Credentials provider doesn't support OAuth (would need additional providers later).

## Styling: Tailwind CSS v4 + Custom Components
- **Chosen:** Tailwind CSS v4 with custom UI component library inspired by shadcn/ui
- **Alternatives considered:** Material UI, Chakra UI, vanilla CSS
- **Rationale:** Utility-first approach keeps styles co-located with components. Custom components give full design control without framework lock-in. Dark mode first.
- **Tradeoffs:** More initial setup than pre-built component libraries, but results in a more cohesive, premium visual identity.

## Architecture: Server Components + Server Actions
- **Chosen:** Data fetching in Server Components, mutations via Server Actions
- **Alternatives considered:** REST API routes, tRPC, GraphQL
- **Rationale:** Eliminates boilerplate API layer. Server Components fetch data directly with Prisma. Server Actions handle form submissions with automatic revalidation. Client Components only where interactivity is needed.
- **Tradeoffs:** Tighter coupling between UI and data layer. Less reusable than a standalone API.

## Color Scheme: Dark Mode Default
- **Chosen:** Dark zinc color palette with indigo accents, dark mode as default and only mode
- **Alternatives considered:** Light mode default with dark toggle, system preference detection
- **Rationale:** Modern developer-focused audience prefers dark mode. Single theme reduces complexity. Zinc grays provide excellent contrast with indigo/purple accent colors.
- **Tradeoffs:** No light mode option for users who prefer it.

## Data Model: Flat Relational Schema
- **Chosen:** Six models (User, Course, Lesson, Enrollment, CalendarEvent, BlogPost) with direct relations
- **Alternatives considered:** Nested JSON fields, separate tutor/student models, polymorphic content
- **Rationale:** Simple, normalized schema. Role-based access via string field on User keeps auth straightforward. Unique constraint on Enrollment prevents double-enrollment.
- **Tradeoffs:** Role stored as string rather than enum (SQLite limitation). Tags stored as comma-separated strings rather than a junction table (acceptable for Phase 1).

## No Payment Processing
- **Chosen:** All courses are free, no payment infrastructure
- **Alternatives considered:** Stripe integration, placeholder payment flow
- **Rationale:** Explicit Phase 1 requirement. Adding payments would significantly increase scope (webhook handling, refund logic, pricing models). Free enrollment lets us validate the marketplace UX first.
- **Tradeoffs:** No revenue model. Will need Stripe integration in Phase 2.
