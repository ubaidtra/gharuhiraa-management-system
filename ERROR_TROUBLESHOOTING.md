# Internal Server Error - Troubleshooting Guide

## Common Causes

### 1. Missing Environment Variables

**Error:** Supabase connection fails
**Solution:** Create `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXTAUTH_URL=http://localhost:5008
NEXTAUTH_SECRET=cave-of-hiraa-secret-key-change-in-production
```

**To get Supabase keys:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy the keys

### 2. Database Schema Not Run

**Error:** Table "User" does not exist
**Solution:** 
1. Go to Supabase Dashboard → **SQL Editor**
2. Copy and paste contents of `supabase/schema.sql`
3. Click **Run**

### 3. No Users in Database

**Error:** Authentication fails
**Solution:** Create a user via:
- Signup page: http://localhost:5008/signup (if no users exist)
- Or manually in Supabase Dashboard → Table Editor → User table

### 4. Check Server Logs

**To see detailed errors:**
1. Look at the terminal where `npm run dev` is running
2. Check for error messages
3. Common errors:
   - "NEXT_PUBLIC_SUPABASE_URL is required"
   - "relation 'User' does not exist"
   - "Invalid API key"

## Quick Fix Steps

1. **Check environment variables:**
   ```bash
   # Verify .env.local exists and has all required variables
   ```

2. **Run database schema:**
   - Supabase Dashboard → SQL Editor → Run `supabase/schema.sql`

3. **Create first user:**
   - Visit http://localhost:5008/signup
   - Create user with role: `ACCOUNTS`, `MANAGEMENT`, or `TEACHER`

4. **Restart server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

5. **Check browser console:**
   - Open DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed API calls

## Testing

After fixing, test:
1. Visit http://localhost:5008
2. Should redirect to /login
3. Try creating a user via /signup
4. Try logging in

## Still Not Working?

Check the terminal output for specific error messages and share them for further debugging.

