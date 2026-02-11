# Setup Required for localhost:5008

## ✅ Server Status
- Server is running on port 5008
- Application is accessible at http://localhost:5008

## ⚠️ Required Setup Steps

### 1. Create `.env.local` File

Create a file named `.env.local` in the project root with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# NextAuth
NEXTAUTH_URL=http://localhost:5008
NEXTAUTH_SECRET=cave-of-hiraa-secret-key-change-in-production

# Port
PORT=5008
```

**To get your Supabase keys:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Run Database Schema

1. Go to Supabase Dashboard → **SQL Editor**
2. Copy entire contents of `supabase/schema.sql`
3. Paste and click **Run**
4. Should complete without errors

### 3. Create First User

1. Visit: http://localhost:5008/signup
2. Create user:
   - Username: `accounts`
   - Password: `accounts123`
   - Role: `ACCOUNTS`

### 4. Restart Server

After creating `.env.local`:
```bash
# Stop server (Ctrl+C in terminal)
npm run dev
```

### 5. Test Login

1. Visit: http://localhost:5008
2. Should redirect to /login
3. Login with: `accounts` / `accounts123`

## Current Status

- ✅ Server running on port 5008
- ⚠️ Environment variables needed (create `.env.local`)
- ⚠️ Database schema needs to be run
- ⚠️ First user needs to be created

## Quick Test

After setup, you should be able to:
- Visit http://localhost:5008 → redirects to /login
- Login with created user
- Access dashboard based on role

