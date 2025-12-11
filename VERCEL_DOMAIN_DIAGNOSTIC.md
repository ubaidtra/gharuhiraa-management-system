# Vercel Domain Diagnostic & Fix Guide

## Problem Analysis

Your Vercel deployment domains are experiencing issues:
- `gharu-hiraa-school-management-syste-two.vercel.app`
- `gharu-hiraa-school-management-syste-ocd54juaa.vercel.app`

## Common Issues & Solutions

### 1. **Deployment Protection Enabled** (Most Common)

**Symptoms:**
- Site redirects to Vercel login page
- Cannot access the application publicly
- Shows "Protected by Vercel" message

**Solution:**
1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project: `Gharu-Hiraa-School-Management-System`
3. Navigate to **Settings** → **Deployment Protection**
4. Disable **Password Protection** and **SSO Protection**
5. Save changes
6. Redeploy the latest deployment

---

### 2. **Missing or Incorrect Environment Variables**

**Required Variables:**
- `DATABASE_URL` - MongoDB connection string
- `NEXTAUTH_SECRET` - Random secret (32+ characters)
- `NEXTAUTH_URL` - Must match your deployment URL exactly

**Check & Fix:**
1. Go to **Settings** → **Environment Variables**
2. Verify these are set for **Production**, **Preview**, and **Development**:
   ```
   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/gharu-hiraa?retryWrites=true&w=majority
   NEXTAUTH_SECRET=your-random-secret-here-generate-with-openssl-rand-base64-32
   NEXTAUTH_URL=https://gharu-hiraa-school-management-syste-two.vercel.app
   ```

3. **Important:** Update `NEXTAUTH_URL` to match your actual deployment URL
   - For `gharu-hiraa-school-management-syste-two.vercel.app`:
     ```
     NEXTAUTH_URL=https://gharu-hiraa-school-management-syste-two.vercel.app
     ```
   - For `gharu-hiraa-school-management-syste-ocd54juaa.vercel.app`:
     ```
     NEXTAUTH_URL=https://gharu-hiraa-school-management-syste-ocd54juaa.vercel.app
     ```

4. **Generate NEXTAUTH_SECRET** (if missing):
   ```bash
   openssl rand -base64 32
   ```

5. After updating variables, **redeploy** the project

---

### 3. **Build Failures**

**Check Build Logs:**
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Check **Build Logs** for errors

**Common Build Issues:**

**a) Prisma Client Not Generated:**
- Error: `@prisma/client did not initialize yet`
- Fix: Ensure `postinstall` script runs: `"postinstall": "prisma generate"`
- Verify in `package.json` (should already be there)

**b) Missing Dependencies:**
- Error: `Cannot find module 'xyz'`
- Fix: Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

**c) TypeScript Errors:**
- Check build logs for TypeScript compilation errors
- Fix any type errors before redeploying

---

### 4. **Database Connection Issues**

**Symptoms:**
- Site loads but shows database errors
- Authentication fails
- API routes return 500 errors

**Check MongoDB Atlas:**
1. **Network Access:**
   - Go to MongoDB Atlas → **Network Access**
   - Ensure `0.0.0.0/0` is whitelisted (allows all IPs)
   - Or add Vercel's IP ranges

2. **Database User:**
   - Verify database user exists
   - Check username/password in `DATABASE_URL`
   - Ensure user has read/write permissions

3. **Connection String:**
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
   - Replace `<password>` with actual password (URL encoded if special chars)
   - Replace `<database>` with `gharu-hiraa`

**Test Connection:**
```bash
# Test locally with production DATABASE_URL
DATABASE_URL="your-production-url" npx prisma db push
```

---

### 5. **DNS Resolution Issues**

**Symptoms:**
- Domain doesn't resolve
- "This site can't be reached" error
- Works on some networks but not others

**Solutions:**
1. **Try Different DNS:**
   - Use Google DNS: `8.8.8.8` and `8.8.4.4`
   - Use Cloudflare DNS: `1.1.1.1` and `1.0.0.1`

2. **Clear Browser Cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Try incognito/private mode
   - Clear browser cache completely

3. **Check ISP Blocking:**
   - Some ISPs block `.vercel.app` domains
   - Try accessing from different network
   - Use VPN if necessary

---

### 6. **Incorrect NEXTAUTH_URL**

**Critical:** `NEXTAUTH_URL` must match your deployment URL exactly!

**Common Mistakes:**
- ❌ Missing `https://`
- ❌ Trailing slash: `https://domain.com/`
- ❌ Wrong domain
- ❌ Using localhost in production

**Correct Format:**
```
NEXTAUTH_URL=https://gharu-hiraa-school-management-syste-two.vercel.app
```

**For Multiple Deployments:**
- Each deployment (production, preview) needs its own `NEXTAUTH_URL`
- Set different values for Production vs Preview environments in Vercel

---

## Step-by-Step Fix Checklist

### Immediate Actions:

- [ ] **1. Disable Deployment Protection**
  - Settings → Deployment Protection → Disable Password/SSO

- [ ] **2. Verify Environment Variables**
  - Check `DATABASE_URL` is set correctly
  - Check `NEXTAUTH_SECRET` exists (generate if missing)
  - Check `NEXTAUTH_URL` matches deployment URL exactly

- [ ] **3. Check Build Status**
  - Go to Deployments → Check latest build logs
  - Fix any build errors

- [ ] **4. Verify Database Access**
  - MongoDB Atlas → Network Access → Allow `0.0.0.0/0`
  - Test database connection

- [ ] **5. Redeploy**
  - After making changes, redeploy the project
  - Wait for deployment to complete

- [ ] **6. Test Access**
  - Visit deployment URL
  - Should see login page (not Vercel login)
  - Try logging in with test credentials

---

## Quick Diagnostic Commands

### Check Deployment Status:
```bash
# View deployment logs (via Vercel CLI)
vercel logs
```

### Test Environment Variables Locally:
```bash
# Test with production DATABASE_URL
DATABASE_URL="your-production-url" npm run build
```

### Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

---

## Expected Behavior After Fix

✅ **Working Site Should:**
1. Load without redirecting to Vercel login
2. Show the Gharu Hiraa login page
3. Allow authentication with valid credentials
4. Redirect users based on their role after login

❌ **If Still Not Working:**
1. Check browser console for JavaScript errors
2. Check network tab for failed API requests
3. Review Vercel function logs for runtime errors
4. Verify database is accessible from Vercel's servers

---

## Additional Resources

- [Vercel Deployment Docs](https://vercel.com/docs)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)
- [MongoDB Atlas Network Access](https://www.mongodb.com/docs/atlas/security/ip-access-list/)

---

## Contact & Support

If issues persist:
1. Check Vercel deployment logs
2. Review MongoDB Atlas connection logs
3. Test locally with production environment variables
4. Contact Vercel support if deployment protection is stuck

---

**Last Updated:** Based on current project configuration
**Project:** Gharu Hiraa School Management System

