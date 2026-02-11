# Quick Fix: Internal Server Error

## Most Likely Causes

### 1. Missing Supabase Environment Variables ⚠️

**Check if `.env.local` exists and has:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXTAUTH_URL=http://localhost:5008
NEXTAUTH_SECRET=cave-of-hiraa-secret-key-change-in-production
```

**Fix:** Create `.env.local` file in project root with your Supabase credentials.

### 2. Database Schema Not Run ⚠️

**Error:** Table "User" does not exist

**Fix:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy entire `supabase/schema.sql` file
3. Paste and click Run
4. Should complete without errors

### 3. No Users in Database ⚠️

**Error:** Authentication fails because no users exist

**Fix:**
1. Visit: http://localhost:5008/signup
2. Create first user with role: `ACCOUNTS`, `MANAGEMENT`, or `TEACHER`
3. Then you can login

## Step-by-Step Fix

1. **Check terminal output:**
   - Look at the terminal where `npm run dev` is running
   - Look for error messages like:
     - "NEXT_PUBLIC_SUPABASE_URL is required"
     - "relation 'User' does not exist"
     - "Invalid API key"

2. **Set environment variables:**
   - Create `.env.local` file
   - Add all required variables (see above)

3. **Run database schema:**
   - Supabase Dashboard → SQL Editor
   - Run `supabase/schema.sql`

4. **Create first user:**
   - Visit http://localhost:5008/signup
   - Create user: username `accounts`, password `accounts123`, role `ACCOUNTS`

5. **Restart server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

6. **Test:**
   - Visit http://localhost:5008
   - Should redirect to /login
   - Login with created user

## Check Server Logs

The terminal where `npm run dev` is running will show:
- Database connection errors
- Missing environment variable warnings
- Authentication errors

Look for lines starting with:
- `❌` (errors)
- `=== AUTH START ===` (authentication attempts)

## Still Getting Error?

Share the error message from the terminal output for specific help.

