# Cave of Hiraa Management System - Rebuild Plan

## Strategy

**Approach:** Fresh rebuild in place. Keep existing `node_modules`, config files, and public assets. Replace `app/`, `lib/`, `components/`, `types/`, `supabase/` with clean implementations. Archive old docs.

**Why:** Current codebase has layered migrations (MongoDB → Prisma → Supabase) and design gaps (User-Teacher link). A clean rebuild ensures consistent architecture.

---

## Tech Stack (Confirmed)

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 16 (App Router) | Keep |
| Language | TypeScript 5 | Keep |
| Database | Supabase (PostgreSQL) | Single source of truth |
| Auth | NextAuth.js (Credentials + JWT) | Keep |
| Styling | TailwindCSS | Keep |
| ORM | Supabase client only | No Prisma adapter |

---

## Schema Changes

### 1. Add User-Teacher Link

```sql
-- Add to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "teacherId" UUID REFERENCES "Teacher"(id) ON DELETE SET NULL;
```

- `User.teacherId` nullable, FK to Teacher
- When creating a TEACHER user, optionally link to existing Teacher record
- When creating a Teacher (Accounts), optionally create/link User
- Session stores `userId`; for TEACHER role, include `teacherId` in JWT for halaqa/report checks

### 2. Models (Unchanged Otherwise)

- User, Student, Teacher, Halaqa, Transaction, LearningRecord, Report
- Transaction types: REGISTRATION_FEE, SCHOOL_FEE, UNIFORM_FEE, OTHER_FEE, WITHDRAWAL
- Currency: GMD

---

## Directory Structure (Clean)

```
app/
  layout.tsx
  page.tsx              # Role-based redirect
  globals.css
  error.tsx
  global-error.tsx
  login/page.tsx
  signup/page.tsx
  (auth)/layout.tsx     # Optional: layout for login/signup
  (dashboard)/
    layout.tsx          # Shared layout with Navbar
    accounts/
      page.tsx
      students/page.tsx, students/new/page.tsx, students/[id]/page.tsx
      teachers/page.tsx, teachers/new/page.tsx, teachers/[id]/page.tsx
      halaqas/page.tsx, halaqas/new/page.tsx, halaqas/[id]/page.tsx
      transactions/page.tsx, transactions/new/page.tsx, transactions/[id]/receipt/page.tsx
      withdrawals/page.tsx, withdrawals/new/page.tsx
      user-management/page.tsx
      settings/page.tsx
    teachers/
      page.tsx
      halaqa/[id]/page.tsx
      learning-records/page.tsx, learning-records/new/page.tsx
      reports/page.tsx, reports/new/page.tsx, reports/[id]/page.tsx
    management/
      page.tsx
      statistics/page.tsx
      students/page.tsx, students/[id]/page.tsx
      teachers/page.tsx, teachers/[id]/page.tsx
      reports/page.tsx, reports/[id]/page.tsx
      financial-reports/page.tsx, financial-reports/print/page.tsx
      settings/page.tsx
  api/
    auth/[...nextauth]/route.ts
    signup/route.ts
    change-password/route.ts
    students/route.ts, students/[id]/route.ts, students/[id]/delete/route.ts, students/[id]/toggle-status/route.ts
    teachers/route.ts, teachers/[id]/route.ts, teachers/[id]/delete/route.ts, teachers/[id]/toggle-status/route.ts
    halaqas/route.ts, halaqas/[id]/route.ts, halaqas/[id]/students/route.ts
    transactions/route.ts, transactions/[id]/route.ts
    learning-records/route.ts
    reports/route.ts, reports/[id]/route.ts
    statistics/route.ts
    financial-reports/route.ts
    upload/route.ts
    users/route.ts, users/reset-password/route.ts, users/update-username/route.ts
    seed/route.ts        # Dev only: seed initial users
lib/
  supabase.ts           # Server + client creation
  auth.ts               # NextAuth config
  auth-utils.ts         # getSessionUser, getTeacherId (for TEACHER role)
  permissions.ts
  constants.ts
  idGenerator.ts        # Supabase-native, no Prisma adapter
  apiClient.ts
  utils/errors.ts, format.ts, validation.ts
  currency.ts
components/
  Navbar.tsx
  ConfirmDialog.tsx
  EmptyState.tsx
  ErrorMessage.tsx
  FormField.tsx, FormSelect.tsx, FormTextarea.tsx
  LoadingSpinner.tsx, LoadingPage.tsx, SkeletonLoader.tsx
  StatCard.tsx, InfoCard.tsx
  SuccessMessage.tsx, Toast.tsx
  ErrorBoundary.tsx
  SessionProvider.tsx
types/
  next-auth.d.ts
  student.ts, teacher.ts, transaction.ts, user.ts
supabase/
  schema.sql            # Full schema including User.teacherId
  seed.sql              # Optional: seed data via SQL
```

---

## Implementation Phases

### Phase 1: Foundation (Day 1)

1. **Backup & Clean**
   - Create `_archive/` folder
   - Move old `app/`, `lib/`, `components/`, `types/` to `_archive/`
   - Keep: `package.json`, `next.config.mjs`, `tailwind.config.ts`, `tsconfig.json`, `middleware.ts`, `public/`, `.env.example`

2. **Schema**
   - Update `supabase/schema.sql` with User.teacherId
   - Create `supabase/seed.sql` for optional initial data (or seed API)

3. **Core Lib**
   - `lib/supabase.ts` - Supabase client
   - `lib/auth.ts` - NextAuth with User lookup from Supabase, JWT includes `teacherId` when role=TEACHER
   - `lib/auth-utils.ts` - `getSessionUser()`, `getTeacherId(session)` - returns Teacher.id for TEACHER or null
   - `lib/permissions.ts`, `lib/constants.ts`
   - `lib/idGenerator.ts` - Pure Supabase: count by `registrationDate >= startOfYear`, check exists by `studentId`

4. **Types**
   - `types/next-auth.d.ts` - Session with `role`, `id`, `teacherId?`

5. **Layout & Auth Pages**
   - `app/layout.tsx` - Root layout, SessionProvider
   - `app/page.tsx` - Redirect by role
   - `app/login/page.tsx`, `app/signup/page.tsx`
   - `app/globals.css`, `app/error.tsx`, `app/global-error.tsx`

6. **Middleware**
   - Protect `/accounts`, `/teachers`, `/management`, `/api/*` (except auth, signup)
   - Remove `/dashboard` from matcher

---

### Phase 2: API Layer (Day 2)

1. **Auth APIs**
   - `api/auth/[...nextauth]` - Uses auth.ts
   - `api/signup` - Create User, optionally link Teacher if teacherId provided
   - `api/change-password`

2. **Core CRUD**
   - `api/students` - GET, POST; use idGenerator for studentId
   - `api/students/[id]` - GET, PUT
   - `api/students/[id]/delete`, `api/students/[id]/toggle-status`
   - `api/teachers` - GET, POST; use idGenerator for teacherId
   - `api/teachers/[id]` - GET, PUT
   - `api/teachers/[id]/delete`, `api/teachers/[id]/toggle-status`
   - `api/halaqas` - GET (filter by teacherId for TEACHER via getTeacherId), POST
   - `api/halaqas/[id]` - GET, PUT, DELETE; TEACHER can only edit if halaqa.teacherId === session.teacherId
   - `api/halaqas/[id]/students` - POST, DELETE

3. **Financial & Learning**
   - `api/transactions`, `api/transactions/[id]`
   - `api/learning-records`
   - `api/reports`, `api/reports/[id]`
   - `api/statistics` - MANAGEMENT only; null-safe
   - `api/financial-reports`
   - `api/upload`

4. **Users**
   - `api/users`, `api/users/reset-password`, `api/users/update-username`
   - `api/seed` - Dev only, create management/accounts/teacher users

---

### Phase 3: Components (Day 3)

1. **Shared**
   - Navbar (role-based links, sign out)
   - FormField, FormSelect, FormTextarea
   - ConfirmDialog, EmptyState, ErrorMessage, SuccessMessage, Toast
   - LoadingSpinner, LoadingPage, SkeletonLoader
   - StatCard, InfoCard
   - ErrorBoundary, SessionProvider

2. **Layout**
   - `(dashboard)/layout.tsx` - Navbar + children

---

### Phase 4: Pages - Accounts (Day 4)

1. Accounts dashboard
2. Students list, new student, student detail
3. Teachers list, new teacher, teacher detail
4. Halaqas list, new halaqa, halaqa detail (Accounts)
5. Transactions list, new transaction, receipt
6. Withdrawals list, new withdrawal
7. User management
8. Settings

---

### Phase 5: Pages - Teachers (Day 5)

1. Teacher dashboard (filter halaqas by teacherId)
2. Halaqa detail - manage students
3. Learning records list, new record
4. Reports list, new report, report detail
5. Settings

---

### Phase 6: Pages - Management (Day 6)

1. Management dashboard
2. Statistics
3. Students (read-only), student detail
4. Teachers (read-only), teacher detail
5. Reports list, report detail
6. Financial reports, print
7. Settings

---

### Phase 7: Polish (Day 7)

1. Receipt printing
2. Photo upload for transactions
3. PWA (manifest, sw) - keep existing
4. Error handling, loading states
5. .env.example, README

---

## Auth Flow Fix

### Creating a Teacher User (Accounts)

When Accounts creates a Teacher:
1. Create Teacher record (get teacherId)
2. Optionally create User with role=TEACHER and teacherId=Teacher.id
3. User can log in; JWT includes teacherId from User.teacherId

### Signup (First User Only)

- Signup creates User only
- For TEACHER: require teacherId or create Teacher on first login (simplified: signup only MANAGEMENT/ACCOUNTS initially; teachers created via Accounts)

### JWT Callback

```ts
async jwt({ token, user }) {
  if (user) {
    token.role = user.role;
    token.id = user.id;
    token.teacherId = user.teacherId ?? null; // From DB User.teacherId
  }
  return token;
}
```

---

## idGenerator (Supabase-Native)

```ts
// Student: STU-YYYY-NNNN
const { count } = await supabase
  .from('Student')
  .select('*', { count: 'exact', head: true })
  .gte('registrationDate', `${currentYear}-01-01`);
const nextNum = (count || 0) + 1;
// Check exists, retry if collision
```

---

## Environment

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXTAUTH_URL=http://localhost:5008
NEXTAUTH_SECRET=
```

---

## Execution Order

1. Phase 1 - Foundation
2. Phase 2 - API Layer
3. Phase 3 - Components
4. Phases 4-6 - Pages (can parallelize accounts/teachers/management)
5. Phase 7 - Polish

---

## Out of Scope (Keep As-Is or Later)

- Admin delete-all
- create-admin, seed-users (consolidate into seed)
- test-auth (remove or dev-only)
