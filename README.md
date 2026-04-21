# Gharu Hiraa School Management System

Role-based school management system for Quran memorization operations at Gharu Hiraa.

## Current Stack

- Next.js 16 App Router
- React 19
- TypeScript
- NextAuth credentials auth with JWT sessions
- Supabase PostgreSQL
- Supabase Storage for receipt uploads
- Tailwind CSS
- Vitest for smoke tests

## Core Product Areas

### Accounts
- Manage students, teachers, halaqas, fees, withdrawals, and users
- Create additional users
- Link teacher logins to teacher profiles
- Upload and view receipt evidence for payments and withdrawals

### Teachers
- View assigned halaqas
- Record weekly learning progress
- Submit weekly or monthly reports

### Management
- Review students, teachers, reports, statistics, and financial summaries
- Access read-only oversight dashboards

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Add environment variables in `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   NEXTAUTH_URL=http://localhost:5008
   NEXTAUTH_SECRET=
   SUPABASE_STORAGE_BUCKET=receipts
   ```
3. Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL editor.
4. Start the app:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5008/signup` to create the first account.

The first bootstrap account must be an `ACCOUNTS` user so initial setup can continue inside the app.

## Scripts

- `npm run dev` - start local development on port `5008`
- `npm run build` - create a production build
- `npm run start` - run the production build on port `5008`
- `npm run lint` - run ESLint
- `npm run typecheck` - run TypeScript checks
- `npm run test` - run automated smoke tests
- `npm run test:watch` - run tests in watch mode

## Storage

Receipt uploads are stored in Supabase Storage. The app uses the bucket set in `SUPABASE_STORAGE_BUCKET` and defaults to `receipts`. The upload route will create the bucket automatically when the service role key has permission to do so.

## Important Paths

- [`app`](app) - pages and API routes
- [`components`](components) - shared UI
- [`lib`](lib) - auth, Supabase, validation, storage helpers
- [`supabase/schema.sql`](supabase/schema.sql) - database schema
- [`types`](types) - shared TypeScript types

## Documentation

- [`VERCEL_DEPLOY.md`](VERCEL_DEPLOY.md) - deployment setup
- [`TESTING_GUIDE.md`](TESTING_GUIDE.md) - automated checks and manual UAT
- [`PROJECT_SUMMARY.md`](PROJECT_SUMMARY.md) - current implementation summary

Older migration and deployment notes in the repo are historical references and should not be treated as the primary source of truth.
