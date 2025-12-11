# Complete Deployment Guide: GitHub → Vercel

**Step-by-step guide to deploy Gharu Hiraa School Management System**

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Part 1: Deploy to GitHub](#part-1-deploy-to-github)
3. [Part 2: Deploy to Vercel](#part-2-deploy-to-vercel)
4. [Post-Deployment Setup](#post-deployment-setup)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

- ✅ **Git** installed (check with `git --version`)
- ✅ **GitHub account** (create at [github.com](https://github.com))
- ✅ **Vercel account** (create at [vercel.com](https://vercel.com))
- ✅ **MongoDB Atlas account** (create at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
- ✅ **Node.js 18+** installed (check with `node --version`)

---

## Part 1: Deploy to GitHub

### Step 1: Initialize Git Repository (if not already done)

Open PowerShell in your project directory and run:

```powershell
# Check if git is initialized
git status

# If not initialized, run:
git init
```

### Step 2: Check Current Status

```powershell
# See what files will be committed
git status
```

### Step 3: Stage All Files

```powershell
# Add all files to staging area
git add .
```

**Note:** Files in `.gitignore` (like `.env`, `node_modules`) will NOT be added.

### Step 4: Create Initial Commit

```powershell
git commit -m "Initial commit - Gharu Hiraa School Management System"
```

### Step 5: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon → **"New repository"**
3. Repository name: `Gharu-Hiraa` (or your preferred name)
4. Description: `School Management System for Gharu Hiraa`
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license
7. Click **"Create repository"**

### Step 6: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```powershell
# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/Gharu-Hiraa.git

# Verify remote was added
git remote -v
```

### Step 7: Push to GitHub

```powershell
# Push to GitHub (first time)
git branch -M main
git push -u origin main
```

**If prompted for credentials:**
- Use your GitHub username
- For password, use a **Personal Access Token** (not your GitHub password)
- Create token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token
- Select scopes: `repo` (full control)

### Step 8: Verify on GitHub

1. Visit your repository: `https://github.com/YOUR_USERNAME/Gharu-Hiraa`
2. You should see all your files
3. ✅ **GitHub deployment complete!**

---

## Part 2: Deploy to Vercel

### Step 1: Sign Up / Sign In to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"** (recommended)
4. Authorize Vercel to access your GitHub account

### Step 2: Import Your Project

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find your repository: `YOUR_USERNAME/Gharu-Hiraa`
3. Click **"Import"**

### Step 3: Configure Project Settings

Vercel will auto-detect Next.js. Verify these settings:

- **Framework Preset:** `Next.js` ✅
- **Root Directory:** `./` (leave as is)
- **Build Command:** `npm run build` ✅
- **Output Directory:** `.next` ✅
- **Install Command:** `npm install` ✅

**Click "Deploy"** (we'll add environment variables after first deploy)

### Step 4: Wait for First Deployment

- Build will take 2-5 minutes
- Watch the build logs for any errors
- **Don't worry if it fails** - we'll fix it with environment variables

### Step 5: Get Your Deployment URL

After deployment completes:
1. Copy your deployment URL (e.g., `https://gharu-hiraa-xyz123.vercel.app`)
2. Save this URL - you'll need it for `NEXTAUTH_URL`

### Step 6: Prepare Environment Variables

Before adding environment variables, prepare:

#### A. MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Network Access:**
   - Click **"Network Access"** → **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   - Click **"Confirm"**

3. **Database Access:**
   - Click **"Database Access"** → **"Add New Database User"**
   - Choose **"Password"** authentication
   - Create username and password (save these!)
   - Set privileges: **"Atlas admin"** or **"Read and write to any database"**
   - Click **"Add User"**

4. **Get Connection String:**
   - Click **"Clusters"** → **"Connect"**
   - Choose **"Connect your application"**
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<database>` with `gharu-hiraa`
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/gharu-hiraa?retryWrites=true&w=majority`

#### B. Generate NEXTAUTH_SECRET

Run this command in PowerShell:

```powershell
# Generate a secure random secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output - this is your `NEXTAUTH_SECRET`.

#### C. NEXTAUTH_URL

Use your deployment URL from Step 5:
```
https://your-deployment-url.vercel.app
```

**Important:** Must include `https://` and NO trailing slash!

### Step 7: Add Environment Variables in Vercel

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Environment Variables"**
3. Add these three variables:

**Variable 1: DATABASE_URL**
- **Key:** `DATABASE_URL`
- **Value:** Your MongoDB connection string from Step 6A
- **Environment:** Select all (Production, Preview, Development)
- Click **"Save"**

**Variable 2: NEXTAUTH_SECRET**
- **Key:** `NEXTAUTH_SECRET`
- **Value:** The secret you generated in Step 6B
- **Environment:** Select all (Production, Preview, Development)
- Click **"Save"**

**Variable 3: NEXTAUTH_URL**
- **Key:** `NEXTAUTH_URL`
- **Value:** Your deployment URL from Step 5 (with `https://`)
- **Environment:** Select all (Production, Preview, Development)
- Click **"Save"**

### Step 8: Redeploy with Environment Variables

1. Go to **"Deployments"** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete (2-5 minutes)

### Step 9: Disable Deployment Protection

**Important:** Make sure your site is publicly accessible:

1. Go to **"Settings"** → **"Deployment Protection"**
2. **Disable** Password Protection (if enabled)
3. **Disable** SSO Protection (if enabled)
4. Save changes

### Step 10: Test Your Deployment

1. Visit your deployment URL
2. You should see the **Gharu Hiraa login page**
3. ✅ **Vercel deployment complete!**

---

## Post-Deployment Setup

### 1. Initialize Database

Your database needs to be set up. You have two options:

#### Option A: Use Prisma Studio (Recommended)

1. Install Vercel CLI:
   ```powershell
   npm install -g vercel
   ```

2. Pull environment variables:
   ```powershell
   vercel env pull .env.local
   ```

3. Run Prisma commands:
   ```powershell
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

#### Option B: Create API Endpoint for Seeding

Create a one-time seed endpoint (for production use only):

1. Create `app/api/seed-database/route.ts`:
   ```typescript
   import { NextResponse } from 'next/server';
   import { prisma } from '@/lib/prisma';
   import bcrypt from 'bcryptjs';

   export async function POST() {
     try {
       // Seed default users
       // ... (add your seed logic)
       
       return NextResponse.json({ success: true });
     } catch (error) {
       return NextResponse.json({ error: 'Failed to seed' }, { status: 500 });
     }
   }
   ```

2. Call this endpoint once to seed database
3. **Delete this endpoint after seeding** (security)

### 2. Test Login

Try logging in with default credentials:

- **Director:** `management` / `management123`
- **Accounts:** `accounts` / `accounts123`
- **Teacher:** `teacher` / `teacher123`

### 3. Change Default Passwords

**⚠️ CRITICAL:** Change all default passwords immediately!

1. Log in as each user
2. Go to Settings → Change Password
3. Set strong, unique passwords

### 4. Verify Features

Test these features:
- [ ] User authentication
- [ ] Student registration
- [ ] Teacher management
- [ ] Halaqa assignment
- [ ] Financial transactions
- [ ] Learning records
- [ ] Report generation
- [ ] Receipt printing

---

## Troubleshooting

### Issue: Build Fails

**Symptoms:** Deployment shows error in build logs

**Solutions:**
1. Check build logs in Vercel dashboard
2. Common causes:
   - Missing environment variables → Add them in Settings
   - Prisma errors → Ensure `DATABASE_URL` is correct
   - TypeScript errors → Fix code errors locally first

### Issue: Site Redirects to Vercel Login

**Symptoms:** Site shows Vercel password protection page

**Solution:**
1. Go to Vercel → Settings → Deployment Protection
2. Disable Password Protection
3. Disable SSO Protection
4. Redeploy

### Issue: "Invalid credentials" on Login

**Symptoms:** Can't log in even with correct credentials

**Solutions:**
1. Check `NEXTAUTH_SECRET` is set correctly
2. Check `NEXTAUTH_URL` matches deployment URL exactly
3. Verify database is seeded with default users
4. Check MongoDB connection is working

### Issue: Database Connection Error

**Symptoms:** API routes return 500 errors, database errors

**Solutions:**
1. Verify `DATABASE_URL` is correct in Vercel
2. Check MongoDB Atlas Network Access allows `0.0.0.0/0`
3. Verify database user has correct permissions
4. Test connection string locally

### Issue: Environment Variables Not Working

**Symptoms:** Variables not available in app

**Solutions:**
1. Ensure variables are added for correct environment (Production/Preview)
2. Redeploy after adding variables
3. Check variable names match exactly (case-sensitive)
4. Verify no extra spaces in values

---

## Quick Reference Commands

### Git Commands

```powershell
# Check status
git status

# Stage files
git add .

# Commit
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main
```

### Vercel CLI Commands

```powershell
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod

# Pull environment variables
vercel env pull .env.local

# View logs
vercel logs
```

### Database Commands

```powershell
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database
npm run db:seed

# Open Prisma Studio
npx prisma studio
```

---

## Environment Variables Checklist

Before deploying, ensure you have:

- [ ] `DATABASE_URL` - MongoDB connection string
- [ ] `NEXTAUTH_SECRET` - Generated secure secret
- [ ] `NEXTAUTH_URL` - Your deployment URL (with https://)

**All three must be set in Vercel for Production, Preview, and Development environments.**

---

## Continuous Deployment

Once set up, every push to GitHub will automatically:

1. ✅ Trigger Vercel build
2. ✅ Deploy to production
3. ✅ Update your live site

**To update your site:**
```powershell
git add .
git commit -m "Your update description"
git push origin main
# Vercel automatically deploys!
```

---

## Security Checklist

Before going live:

- [ ] Changed all default passwords
- [ ] `NEXTAUTH_SECRET` is unique and secure
- [ ] MongoDB password is strong
- [ ] Deployment protection is disabled (for public access)
- [ ] Environment variables are set correctly
- [ ] Database is backed up
- [ ] Tested all critical features

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com
- **GitHub Docs:** https://docs.github.com

---

## Summary

✅ **GitHub:** Code pushed and repository created  
✅ **Vercel:** Project imported and deployed  
✅ **Environment Variables:** All configured  
✅ **Database:** Connected and initialized  
✅ **Site:** Live and accessible  

**Your Gharu Hiraa School Management System is now deployed! 🚀**

---

**Last Updated:** Based on current project configuration  
**Need Help?** Check troubleshooting section or review deployment logs

