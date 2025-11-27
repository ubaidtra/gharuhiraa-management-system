# Step-by-Step Deployment Guide
## Gharu Hiraa School Management System

Complete guide to deploy your application from start to finish.

---

## 📋 Checklist Overview

- [ ] **Part 1**: Push code to GitHub (5 minutes)
- [ ] **Part 2**: Setup MongoDB Atlas (10 minutes)
- [ ] **Part 3**: Deploy to Vercel (5 minutes)
- [ ] **Part 4**: Test deployment (5 minutes)
- [ ] **Part 5**: Secure your app (5 minutes)

**Total Time**: ~30 minutes

---

# Part 1: Push Code to GitHub

## Step 1.1: Generate GitHub Personal Access Token

1. **Open your web browser**
2. **Go to**: https://github.com/settings/tokens
3. **Click**: "Generate new token" (top right)
4. **Select**: "Generate new token (classic)"
5. **Fill in the form**:
   - **Note**: `Gharu Hiraa Deployment Token`
   - **Expiration**: `90 days` (or `No expiration`)
   - **Select scopes**: 
     - ✅ **Check `repo`** (this will automatically check all sub-items)
     - ✅ **Check `workflow`** (optional, but recommended)
6. **Scroll down** and click **"Generate token"** (green button at bottom)
7. **⚠️ IMPORTANT**: **Copy the token immediately!**
   - It looks like: `ghp_1234567890abcdefghijklmnopqrstuvwxyz`
   - You will NOT see it again!
   - **Paste it in a text file** or password manager temporarily

---

## Step 1.2: Push Your Code to GitHub

1. **Open PowerShell** in your project directory:
   - You should already be in: `C:\Cave of Hiraa Management system`

2. **Run this command**:
   ```powershell
   git push -u origin main
   ```

3. **When prompted**, enter:
   - **Username for 'https://github.com'**: `ubaidtra`
   - **Password for 'https://github.com'**: **PASTE YOUR TOKEN** (the `ghp_xxx...` token from Step 1.1)
     - Right-click to paste in PowerShell
     - Or press `Ctrl+V`

4. **Press Enter**

5. **Wait** - You'll see:
   ```
   Enumerating objects: ...
   Counting objects: ...
   Compressing objects: ...
   Writing objects: 100% ...
   ```

6. **Success!** When you see:
   ```
   Branch 'main' set up to track remote branch 'main' from 'origin'.
   ```

---

## Step 1.3: Verify on GitHub

1. **Open browser** and go to: https://github.com/ubaidtra/Gharu-Hiraa
2. **You should see**:
   - ✅ All your files (108 files)
   - ✅ README.md with badges
   - ✅ Folders: `app/`, `components/`, `lib/`, `prisma/`, etc.

**✅ Part 1 Complete!** Your code is now on GitHub.

---

# Part 2: Setup MongoDB Atlas (Database)

## Step 2.1: Create MongoDB Atlas Account

1. **Open browser** and go to: https://www.mongodb.com/cloud/atlas
2. **Click**: "Try Free" or "Sign In" (if you have an account)
3. **Sign up**:
   - Use Google/GitHub sign-in (easiest)
   - Or create with email

---

## Step 2.2: Create a Cluster (Free Tier)

1. **After signing in**, click **"Create"** or **"Build a Database"**
2. **Choose**: **M0 (FREE)** tier
   - Shared cluster
   - 512 MB storage
   - No credit card required
3. **Provider & Region**:
   - **Provider**: AWS (recommended)
   - **Region**: Choose closest to your location
     - If in Africa: `Frankfurt (eu-central-1)` or `Ireland (eu-west-1)`
   - Click **"Create"**
4. **Wait** 1-3 minutes for cluster creation

---

## Step 2.3: Create Database User

1. **Security Quickstart** will appear
2. **Username**: `gharu_admin` (or any name you want)
3. **Password**: Click **"Autogenerate Secure Password"**
   - **⚠️ COPY THIS PASSWORD!** Save it somewhere safe
   - Or create your own strong password
4. **Click**: "Create User"

---

## Step 2.4: Add IP Address to Whitelist

1. Still on Security Quickstart page
2. **Under "Where would you like to connect from?"**
3. **Click**: "Add My Current IP Address"
   - This adds your current IP
4. **ALSO ADD**: `0.0.0.0/0` (for Vercel to connect)
   - Click "Add a Different IP Address"
   - IP Address: `0.0.0.0/0`
   - Description: `Allow from anywhere (for deployment)`
   - Click "Add Entry"
5. **Click**: "Finish and Close"

---

## Step 2.5: Get Connection String

1. **Click**: "Connect" button on your cluster
2. **Choose**: "Connect your application"
3. **Driver**: Node.js
4. **Version**: 5.5 or later
5. **Copy the connection string**:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Important**: Replace `<password>` with the password from Step 2.3
7. **Important**: Add database name before `?`:
   ```
   mongodb+srv://gharu_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/gharu_hiraa?retryWrites=true&w=majority
   ```
   - Note: `gharu_hiraa` is the database name (you can use any name)

8. **Save this connection string** - you'll need it for Vercel!

**✅ Part 2 Complete!** Your database is ready.

---

# Part 3: Deploy to Vercel

## Step 3.1: Create Vercel Account

1. **Go to**: https://vercel.com
2. **Click**: "Sign Up" (if new) or "Login"
3. **Sign up with GitHub** (easiest - click the GitHub button)
4. **Authorize Vercel** to access your GitHub account

---

## Step 3.2: Import Your Repository

1. **After login**, click **"Add New..."** (top right)
2. **Click**: "Project"
3. **You'll see your GitHub repositories**
4. **Find**: `ubaidtra/Gharu-Hiraa`
5. **Click**: "Import" button next to it

---

## Step 3.3: Configure Project

1. **Project Name**: `gharu-hiraa` (or keep default)
2. **Framework Preset**: Next.js (should be auto-detected)
3. **Root Directory**: `./` (leave as default)
4. **Build and Output Settings**: Leave as default
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

---

## Step 3.4: Add Environment Variables (IMPORTANT!)

1. **Click**: "Environment Variables" section (expand it)
2. **Add these THREE variables**:

   **Variable 1:**
   - **Name**: `DATABASE_URL`
   - **Value**: Your MongoDB connection string from Step 2.5
     ```
     mongodb+srv://gharu_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/gharu_hiraa?retryWrites=true&w=majority
     ```
   - **Environment**: All (Production, Preview, Development)
   - Click "Add"

   **Variable 2:**
   - **Name**: `NEXTAUTH_SECRET`
   - **Value**: Generate a random secret:
     - **Option A**: Use this generator: https://generate-secret.vercel.app/32
     - **Option B**: Or in PowerShell run: `openssl rand -base64 32`
     - Should be a long random string like: `abc123def456...`
   - **Environment**: All
   - Click "Add"

   **Variable 3:**
   - **Name**: `NEXTAUTH_URL`
   - **Value**: Leave EMPTY for now (we'll add it after first deploy)
     - Or add: `https://gharu-hiraa.vercel.app` (guess your URL)
   - **Environment**: Production only
   - Click "Add"

3. **Verify** all three variables are added

---

## Step 3.5: Deploy!

1. **Click**: "Deploy" button (big blue button at bottom)
2. **Wait** 2-4 minutes
   - You'll see build logs
   - Building... Generating... Deploying...
3. **Success!** When you see:
   ```
   ✓ Production: https://gharu-hiraa-xxx.vercel.app [deployed]
   ```
4. **Click** the URL or "Visit" button

---

## Step 3.6: Update NEXTAUTH_URL (Critical!)

1. **Copy your deployment URL** (e.g., `https://gharu-hiraa-xxx.vercel.app`)
2. **In Vercel dashboard**, go to:
   - Your Project → Settings → Environment Variables
3. **Find**: `NEXTAUTH_URL`
4. **Edit** and set value to your actual URL (include `https://`)
   - Example: `https://gharu-hiraa-abc123.vercel.app`
5. **Save**
6. **Go to**: Deployments → Three dots (...) → Redeploy
   - Click "Redeploy"
   - This applies the correct URL

**✅ Part 3 Complete!** Your app is live on the internet!

---

# Part 4: Test Your Deployment

## Step 4.1: Initialize Database

1. **Your app is deployed but database is empty**
2. **Option A - Run seed script** (recommended):
   - In Vercel dashboard → Settings → Functions
   - Or manually via API route (if you created one)
   
3. **Option B - Manual setup**:
   - Open your deployed app
   - You might see connection errors - that's okay
   - The database schema will be created on first connection

---

## Step 4.2: Test Login

1. **Open your deployed URL**: `https://your-app.vercel.app`
2. **You should see**: The login page with Gharu Hiraa logo
3. **Try to login** with default credentials:
   - Username: `management`
   - Password: `management123`

**If login fails** - Database needs seeding. See Step 4.3.

---

## Step 4.3: Seed Database (If Needed)

**Option 1 - Via Vercel CLI** (if available):
```powershell
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Run seed
vercel env pull
npm run db:seed
```

**Option 2 - Manually create users**:
Since you can't seed easily, you'll need to create users manually or via a setup script.

**Recommended**: For now, let's use the Prisma Studio approach:

1. **In your local machine**, update `.env` with your production `DATABASE_URL`
2. **Run**: `npx prisma studio`
3. **Create test users manually**
4. **Or run**: `npm run db:seed` locally (it will seed production DB)

---

## Step 4.4: Test All Features

Once logged in, test:

1. **Director Login** (`management` / `management123`):
   - ✅ Can view dashboard
   - ✅ Can view students (read-only)
   - ✅ Can view teachers (read-only)
   - ✅ Can view reports
   - ✅ Can view statistics

2. **Accounts & Admin Login** (`accounts` / `accounts123`):
   - ✅ Can add students
   - ✅ Can add teachers
   - ✅ Can create Halaqas
   - ✅ Can record payments
   - ✅ Can record withdrawals
   - ✅ Can print receipts

3. **Teacher Login** (`teacher` / `teacher123`):
   - ✅ Can view assigned Halaqa
   - ✅ Can add learning records
   - ✅ Can submit reports

**If any test fails**, check:
- Browser console for errors (F12)
- Vercel deployment logs
- Environment variables are correct

**✅ Part 4 Complete!** Your app is working!

---

# Part 5: Secure Your Application

## Step 5.1: Change All Default Passwords

**⚠️ CRITICAL SECURITY STEP**

1. **Login as each user** and change passwords:
   
   **Director**:
   - Login: `management` / `management123`
   - Change password to something secure
   
   **Accounts**:
   - Login: `accounts` / `accounts123`
   - Change password to something secure
   
   **Teacher**:
   - Login: `teacher` / `teacher123`
   - Change password to something secure

2. **Note**: You'll need to implement password change functionality
   - Or manually update in database via Prisma Studio

---

## Step 5.2: Setup Production Users

1. **Create real user accounts**:
   - Real director account
   - Real accounts staff accounts
   - Real teacher accounts

2. **Delete or disable default accounts** (optional but recommended)

---

## Step 5.3: Configure Backups

1. **In MongoDB Atlas**:
   - Go to your cluster
   - Click "Backup" tab
   - Enable automatic backups (available in paid tiers)
   - Or manually export data regularly

2. **Setup backup schedule**:
   - Daily or weekly exports
   - Store backups securely

---

## Step 5.4: Setup Custom Domain (Optional)

1. **Buy a domain** (e.g., from Namecheap, GoDaddy)
2. **In Vercel**:
   - Go to: Project → Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions
3. **Update** `NEXTAUTH_URL` to your custom domain
4. **Redeploy**

---

## Step 5.5: Monitor Your Application

1. **Vercel Analytics**: Already included
   - View in Vercel dashboard → Analytics

2. **Check logs regularly**:
   - Vercel → Deployments → View Function Logs

3. **MongoDB Metrics**:
   - Atlas → Metrics tab
   - Monitor connections, operations, storage

**✅ Part 5 Complete!** Your app is secure and production-ready!

---

# 🎉 Deployment Complete!

## Your Application is Live!

- **URL**: https://your-app.vercel.app
- **GitHub**: https://github.com/ubaidtra/Gharu-Hiraa
- **Database**: MongoDB Atlas (Cloud)
- **Hosting**: Vercel (Global CDN)

---

## Quick Reference

### URLs to Bookmark
- **App**: Your Vercel URL
- **Vercel Dashboard**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://cloud.mongodb.com/
- **GitHub Repo**: https://github.com/ubaidtra/Gharu-Hiraa

### Default Credentials (Change These!)
- Director: `management` / `management123`
- Accounts: `accounts` / `accounts123`
- Teacher: `teacher` / `teacher123`

### Important Commands
```powershell
# Update code and deploy
git add .
git commit -m "Your changes"
git push origin main
# Vercel auto-deploys!

# View logs
vercel logs

# Pull env variables
vercel env pull
```

---

## Troubleshooting

### Issue: "Invalid session"
**Solution**: 
- Check `NEXTAUTH_URL` matches your actual URL
- Must include `https://`
- Redeploy after changing

### Issue: "Database connection failed"
**Solution**:
- Verify `DATABASE_URL` in Vercel environment variables
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Test connection string in local `.env` first

### Issue: "Build failed"
**Solution**:
- Check Vercel build logs
- Ensure all environment variables are set
- Try deploying from main branch

### Issue: "API route returns 500"
**Solution**:
- Check Vercel function logs
- Verify Prisma Client is generated
- Check database schema is pushed

---

## Next Steps

1. **Share with your team** - Send them the URL
2. **Train users** - Show them how to use the system
3. **Monitor usage** - Check Vercel analytics
4. **Regular backups** - Export database periodically
5. **Keep updated** - `git push` whenever you make changes

---

## Support

- **Documentation**: Check the `*.md` files in your repo
- **GitHub Issues**: https://github.com/ubaidtra/Gharu-Hiraa/issues
- **Vercel Support**: https://vercel.com/support

---

**Congratulations! Your Gharu Hiraa School Management System is deployed and running! 🎊**

