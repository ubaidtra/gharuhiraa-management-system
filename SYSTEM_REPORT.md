# Cave of Hiraa Management System - System Report

Generated: February 11, 2025

## Executive Summary

The Cave of Hiraa (Gharu Hiraa) Management System is a school management application for a Quranic memorization school. It has been migrated from Prisma/MongoDB to Supabase (PostgreSQL) and uses Next.js 16 with App Router. The codebase is functional but has several bugs, inconsistencies, and design gaps that should be addressed.

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16.0.8 |
| Language | TypeScript 5 |
| Database | Supabase (PostgreSQL) |
| ORM | Supabase Client (Prisma schema present but not used at runtime) |
| Auth | NextAuth.js 4.24 (Credentials + JWT) |
| Styling | TailwindCSS 3.4 |
| Deployment | Vercel-ready |

---

## Architecture Overview

### Data Layer
- **Primary**: Supabase client (`@/lib/supabase`) for all API routes
- **Legacy**: `lib/prisma.ts` is a Prisma-compatible adapter that wraps Supabase (used only by `idGenerator.ts`)
- **Prisma**: Schema exists in `prisma/schema.prisma` but Prisma/`@prisma/client` is not in `package.json`
- **Seed**: `package.json` references `supabase/seed.ts` for `db:seed` and `db:setup` but that file does not exist

### Role-Based Access
- **MANAGEMENT**: Read-only oversight, statistics, reports, financial reports
- **ACCOUNTS**: Full CRUD on students, teachers, halaqas, transactions
- **TEACHER**: Manage assigned halaqas, learning records, reports

### Route Structure
- `/` - Home (redirects by role)
- `/login`, `/signup` - Auth
- `/accounts/*` - Accounts dashboard, students, teachers, transactions, withdrawals, halaqas
- `/management/*` - Statistics, reports, financial reports
- `/teachers/*` - Halaqa management, learning records, reports

---

## Critical Issues

### 1. Runtime Bug: Students API Returns Undefined Variable
**File:** `app/api/students/route.ts` (line 36)

Returns `formattedStudents` which is never defined. The variable `students` holds the data. This causes a `ReferenceError` when any client fetches the students list.

```ts
// Current (broken):
return NextResponse.json(formattedStudents);

// Should be:
return NextResponse.json(students);
```

### 2. Build Failure: TypeScript Null Check
**File:** `app/api/statistics/route.ts` (lines 84-86)

`recentRecords` can be null but is used without optional chaining:

```ts
// Current (fails build):
averageMemorizedPerWeek: recentRecords.length > 0
  ? totalMemorizedDays / recentRecords.length
  : 0,

// Fix: Use optional chaining
averageMemorizedPerWeek: (recentRecords?.length ?? 0) > 0
  ? totalMemorizedDays / (recentRecords?.length ?? 1)
  : 0,
```

### 3. idGenerator Incompatibility with Supabase Adapter
**File:** `lib/idGenerator.ts`

Uses `lib/prisma` (Supabase adapter) but calls:
- `prisma.student.count({ where: { registrationDate: { gte: startOfYear } } })` - adapter only supports flat `eq()`, not nested `gte`
- `prisma.student.findFirst({ where: { studentId } })` - adapter has no `findFirst`, only `findUnique` (by id) and `findMany`

Creating students or teachers will fail or produce incorrect ID sequences. The idGenerator needs to be rewritten to use Supabase client directly with proper date filters and lookups.

### 4. User-Teacher Link Missing (Design Gap)
**Schema:** `User` and `Teacher` are separate tables with no foreign key.

- `session.user.id` = User.id (from User table)
- `Halaqa.teacherId` = Teacher.id (from Teacher table)
- API checks `existingHalaqa.teacherId !== session.user.id` for teacher edit permission

Since User.id and Teacher.id are different UUIDs, teachers can never pass this check. They cannot edit their assigned halaqas. The teacher dashboard fetches all halaqas (comment: "In a real app, we'd need to get the teacher ID from the user") instead of filtering by teacher.

**Recommendation:** Add optional `teacherId` to User model linking to Teacher when role is TEACHER. Populate on user creation and use for permission checks.

---

## Configuration Issues

### 5. Missing supabase/seed.ts
- `package.json`: `"db:seed": "tsx supabase/seed.ts"`
- `supabase/seed.ts` does not exist; only `supabase/schema.sql` exists
- `npm run db:seed` will fail

### 6. Prisma Removed But Scripts Remain
- `package.json` has no `prisma` or `@prisma/client`
- `prisma/` folder contains scripts (seed.ts, createUser.ts, fixUsers.ts, etc.) that import `PrismaClient`
- These scripts will fail if run

### 7. README Out of Date
- States Next.js 14, MongoDB
- Actual: Next.js 16, Supabase/PostgreSQL
- Port 8001 in README vs 5008 in package.json
- References `db:push`, `db:studio`, `db:reset` (Prisma commands) - not applicable

### 8. .env.example Incorrect
- `DATABASE_URL` shows Supabase project URL format (e.g. `https://xxx.supabase.co`) - not a PostgreSQL connection string
- README mentions `postgresql://...` connection string
- Supabase requires `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (per SETUP_REQUIRED.md)

### 9. Middleware Dead Code
- Config includes `/dashboard/:path*` but no `/dashboard` route exists
- App uses `/accounts`, `/teachers`, `/management` directly

---

## Moderate Issues

### 10. Supabase Schema Trigger Syntax
`supabase/schema.sql` uses `EXECUTE FUNCTION` (PostgreSQL 11+). Some older Postgres versions use `EXECUTE PROCEDURE`. Verify target Supabase Postgres version.

### 11. prisma.student.count / prisma.teacher.count in idGenerator
The Supabase adapter's `count` implementation only supports simple `eq` in `where`. Passing `registrationDate: { gte: date }` will not filter correctly and may throw or return wrong counts.

### 12. Session User ID for Teachers
Reports and learning records use `session.user.id` as `teacherId`. The Report and LearningRecord models expect `teacherId` to reference `Teacher.id`. If these are meant to reference User, the schema is inconsistent. If they reference Teacher, the User-Teacher link must exist.

---

## What Works

- Next.js 16 build compiles (after fixing statistics null check)
- App structure: accounts, management, teachers route groups
- NextAuth credentials + JWT
- Supabase integration for User, Student, Teacher, Halaqa, Transaction, LearningRecord, Report
- Role-based permission constants
- API routes follow a consistent pattern (session check, role check, Supabase operations)
- Error boundaries (`error.tsx`, `global-error.tsx`)
- PWA setup (manifest, service worker)
- Receipt printing, photo upload for checks, financial reports

---

## Recommendations

1. **Immediate:** Fix students route (`formattedStudents` -> `students`) and statistics route (null check) so build succeeds and students list works
2. **Short-term:** Rewrite `idGenerator.ts` to use Supabase directly with correct date filters and `findFirst`-equivalent logic
3. **Short-term:** Create `supabase/seed.ts` or fix `package.json` scripts
4. **Design:** Add User-Teacher linkage (e.g. `teacherId` on User) and update auth/permissions to use it
5. **Maintenance:** Update README and .env.example to match current stack and setup
6. **Cleanup:** Remove or update Prisma scripts; either adopt Prisma again or remove prisma/ folder
7. **Optional:** Remove `/dashboard` from middleware matcher

---

## File Inventory Summary

| Category | Count |
|----------|-------|
| App pages | ~25 |
| API routes | ~20 route groups |
| Components | 16 |
| Lib modules | 10+ |
| Types | 4 |
| Documentation MD files | 40+ (many migration/fix docs) |

---

## Environment Requirements

For local/production:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXTAUTH_URL=http://localhost:5008
NEXTAUTH_SECRET=<32+ char secret>
```

Database: Run `supabase/schema.sql` in Supabase SQL Editor before first use. Create first user via `/signup` when system has no users.
