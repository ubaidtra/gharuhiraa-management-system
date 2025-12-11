# Quick Deployment Steps - Cheat Sheet

**Fast reference for deploying Gharu Hiraa School Management System**

---

## 🚀 GitHub Deployment (5 minutes)

```powershell
# 1. Check status
git status

# 2. Stage all files
git add .

# 3. Commit
git commit -m "Initial commit - Gharu Hiraa School Management System"

# 4. Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/Gharu-Hiraa.git

# 5. Push to GitHub
git branch -M main
git push -u origin main
```

**Then:**
1. Create repository on GitHub.com (if not exists)
2. Copy repository URL
3. Use commands above

---

## ⚡ Vercel Deployment (10 minutes)

### Step 1: Import Project
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Select your repository
5. Click **"Import"**

### Step 2: First Deploy
- Click **"Deploy"** (don't add env vars yet)
- Wait for deployment
- Copy your deployment URL

### Step 3: Add Environment Variables
Go to **Settings** → **Environment Variables**, add:

```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/gharu-hiraa?retryWrites=true&w=majority
NEXTAUTH_SECRET=<generate-with-node-command-below>
NEXTAUTH_URL=https://your-deployment-url.vercel.app
```

**Generate NEXTAUTH_SECRET:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 4: Redeploy
- Go to **Deployments** → Latest → **"..."** → **"Redeploy"**
- Wait for completion

### Step 5: Disable Protection
- **Settings** → **Deployment Protection** → **Disable** all

---

## 📝 MongoDB Atlas Setup

1. **Network Access:**
   - Add IP: `0.0.0.0/0` (allow all)

2. **Database User:**
   - Create user with password
   - Set permissions: Read/Write

3. **Connection String:**
   - Clusters → Connect → Connect your application
   - Copy and replace `<password>` and `<database>`

---

## ✅ Post-Deployment Checklist

- [ ] Site loads (shows login page)
- [ ] Can log in with default credentials
- [ ] Database is seeded
- [ ] Changed default passwords
- [ ] Tested key features

---

## 🔧 Common Commands

```powershell
# Git
git status
git add .
git commit -m "message"
git push origin main

# Vercel CLI
vercel login
vercel
vercel --prod

# Database
npx prisma generate
npx prisma db push
npm run db:seed
```

---

## 🆘 Quick Fixes

**Build fails?**
→ Check environment variables are set

**Can't access site?**
→ Disable Deployment Protection

**Login doesn't work?**
→ Check NEXTAUTH_URL matches deployment URL exactly

**Database errors?**
→ Verify DATABASE_URL and MongoDB Network Access

---

**Full Guide:** See `COMPLETE_DEPLOYMENT_GUIDE.md`

