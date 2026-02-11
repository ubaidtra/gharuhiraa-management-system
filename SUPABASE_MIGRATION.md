# Supabase Migration Guide

## Migration from Prisma/MongoDB to Supabase/SQL

This project has been migrated from Prisma ORM with MongoDB to direct SQL queries with Supabase.

## Environment Variables Required

Add these to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ljfjxigtpeigrqjwfwml.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database Connection (for direct SQL if needed)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.ljfjxigtpeigrqjwfwml.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# NextAuth
NEXTAUTH_URL=http://localhost:8001
NEXTAUTH_SECRET=cave-of-hiraa-secret-key-change-in-production

# Port
PORT=8001
```

## Getting Supabase Keys

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Database Setup

1. **Run the SQL schema:**
   - Go to Supabase Dashboard → **SQL Editor**
   - Copy and paste the contents of `supabase/schema.sql`
   - Click **Run**

2. **Or use Supabase CLI:**
   ```bash
   supabase db push
   ```

## API Routes Migration Status

All main API routes have been migrated from Prisma to Supabase:

- [x] `app/api/teachers/[id]/route.ts` - Migrated
- [x] `app/api/halaqas/[id]/route.ts` - Migrated
- [x] `app/api/transactions/[id]/route.ts` - Migrated
- [x] `app/api/learning-records/route.ts` - Migrated
- [x] `app/api/reports/route.ts` - Migrated
- [x] `app/api/reports/[id]/route.ts` - Migrated
- [x] `app/api/statistics/route.ts` - Migrated
- [x] `app/api/financial-reports/route.ts` - Migrated
- [x] `app/api/signup/route.ts` - Migrated
- [x] `app/api/change-password/route.ts` - Migrated
- [x] `app/api/users/reset-password/route.ts` - Migrated
- [x] `app/api/users/update-username/route.ts` - Migrated

## Migration Complete

All API routes have been migrated from Prisma to Supabase:
- [x] `app/api/seed-users/route.ts` - Migrated
- [x] `app/api/test-auth/route.ts` - Migrated
- [x] `app/api/admin/delete-all/route.ts` - Migrated
- [x] `app/api/teachers/[id]/delete/route.ts` - Migrated
- [x] `app/api/teachers/[id]/toggle-status/route.ts` - Migrated
- [x] `app/api/students/[id]/delete/route.ts` - Migrated
- [x] `app/api/students/[id]/toggle-status/route.ts` - Migrated
- [x] `app/api/halaqas/[id]/students/route.ts` - Migrated

## Key Changes

1. **Replaced Prisma Client** with Supabase Client
2. **All queries** now use Supabase's query builder or raw SQL
3. **Schema** converted from Prisma to PostgreSQL SQL
4. **IDs** changed from ObjectId to UUID

## Testing

After migration:
1. Test authentication
2. Test CRUD operations for all entities
3. Verify relationships work correctly
4. Check statistics and reports

