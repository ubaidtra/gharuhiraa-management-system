# GitHub Deployment Guide - Gharu Hiraa

Quick guide to push your code to GitHub and deploy.

---

## Step 1: Initialize Git (Already Done!)

Your repository has been initialized and linked to:
**https://github.com/ubaidtra/Gharu-Hiraa.git**

---

## Step 2: Stage All Files

```powershell
git add .
```

This adds all your project files to git staging area.

---

## Step 3: Commit Your Code

```powershell
git commit -m "Initial commit - Gharu Hiraa School Management System"
```

---

## Step 4: Push to GitHub

```powershell
git push -u origin main
```

If this is your first time, you might need to authenticate with GitHub.

---

## Step 5: Verify on GitHub

Visit your repository:
https://github.com/ubaidtra/Gharu-Hiraa

You should see all your files!

---

## What's Included

### ✅ Application Code
- All Next.js pages and components
- API routes
- Database schema (Prisma)
- Authentication setup
- UI components

### ✅ Configuration Files
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- `tailwind.config.ts` - Styling config
- `next.config.js` - Next.js config
- `prisma/schema.prisma` - Database schema

### ✅ Documentation
- `README.md` - Main documentation
- `DEPLOYMENT.md` - Deployment guide
- `REPORTS_SYSTEM_COMPLETE.md` - Reports feature
- `PROJECT_SUMMARY.md` - Complete feature list

### ✅ Security
- `.gitignore` - Protects sensitive files
- `.env.example` - Environment variable template
- `.env` is NOT included (protected by .gitignore)

### ❌ Not Included (Intentionally)
- `.env` - Contains your secrets
- `node_modules/` - Dependencies (can be installed)
- `.next/` - Build files (generated)
- `/public/uploads/checks/*` - Uploaded files

---

## Deploy to Vercel (Easiest Option)

### Option A: Via Vercel Dashboard

1. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**:
   - Click "Add New..."
   - Select "Project"
   - Find `ubaidtra/Gharu-Hiraa`
   - Click "Import"

3. **Configure**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)

4. **Environment Variables**:
   Click "Environment Variables" and add:
   
   ```
   DATABASE_URL=mongodb+srv://your-connection-string
   NEXTAUTH_SECRET=your-secret-here
   NEXTAUTH_URL=https://your-app-name.vercel.app
   ```

   **Important**:
   - Get `DATABASE_URL` from MongoDB Atlas
   - Generate `NEXTAUTH_SECRET`: run `openssl rand -base64 32`
   - `NEXTAUTH_URL` will be provided by Vercel after first deploy

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live!

6. **Update NEXTAUTH_URL**:
   - After deployment, copy your app URL
   - Go to Settings → Environment Variables
   - Update `NEXTAUTH_URL` to your actual URL
   - Redeploy

### Option B: Via Vercel CLI

```powershell
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: Gharu-Hiraa
# - Directory: ./
# - Override settings? No

# Add environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL

# Deploy to production
vercel --prod
```

---

## Deploy to Railway

1. **Push to GitHub** (steps above)

2. **Go to Railway**:
   - Visit [railway.app](https://railway.app)
   - Sign in with GitHub

3. **New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `ubaidtra/Gharu-Hiraa`

4. **Add MongoDB**:
   - In your project, click "New"
   - Select "Database" → "MongoDB"
   - Copy the connection string

5. **Add Environment Variables**:
   - Go to your app service
   - Click "Variables"
   - Add:
     - `DATABASE_URL` - From Railway MongoDB
     - `NEXTAUTH_SECRET` - Generate new
     - `NEXTAUTH_URL` - From Railway (after first deploy)
     - `PORT` - 8001

6. **Deploy**:
   - Railway automatically builds and deploys
   - Get your URL from the deployment
   - Update `NEXTAUTH_URL` if needed

---

## Post-Deployment Checklist

After your app is live:

### 1. Test Login
```
- Visit your deployed URL
- Try logging in with default credentials
- Verify all pages load correctly
```

### 2. Change Default Passwords
```
CRITICAL: Change these immediately!
- Director (management / management123)
- Accounts (accounts / accounts123)  
- Teacher (teacher / teacher123)
```

### 3. Setup Database
```
If you didn't seed:
- Create your first real users
- Add teachers
- Create Halaqas
- Register students
```

### 4. Test Features
```
- Student registration
- Teacher management
- Halaqa assignment
- Financial transactions
- Learning records
- Report generation
- Receipt printing
```

### 5. Configure Backups
```
- Setup MongoDB Atlas automated backups
- Export important data regularly
- Document recovery procedures
```

---

## Continuous Deployment

Every time you push to GitHub:

```powershell
git add .
git commit -m "Your update description"
git push origin main
```

**Vercel/Railway** will automatically:
1. Detect the push
2. Build your app
3. Run tests
4. Deploy to production

---

## Common Issues & Solutions

### Issue: Build Fails

**Cause**: Missing environment variables

**Solution**:
```
1. Go to deployment platform dashboard
2. Check Environment Variables section
3. Ensure all required variables are set:
   - DATABASE_URL
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL
```

### Issue: Database Connection Error

**Cause**: MongoDB Atlas IP whitelist

**Solution**:
```
1. Go to MongoDB Atlas
2. Network Access
3. Add IP Address: 0.0.0.0/0 (allow all)
4. Or add your deployment platform's IPs
```

### Issue: "Invalid Session" Error

**Cause**: Wrong NEXTAUTH_URL

**Solution**:
```
1. Update NEXTAUTH_URL to match your actual deployment URL
2. Must include https://
3. No trailing slash
4. Example: https://gharu-hiraa.vercel.app
```

### Issue: API Routes Return 404

**Cause**: Build or routing issue

**Solution**:
```
1. Check build logs for errors
2. Ensure all API files are committed
3. Verify next.config.js is correct
4. Try redeploying
```

---

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.net/db` |
| `NEXTAUTH_SECRET` | Secret for session encryption | Generated with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your app's public URL | `https://your-app.vercel.app` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8001` |

---

## Monitoring Your Deployment

### Vercel
- **Dashboard**: View deployments, logs, analytics
- **Logs**: Real-time function logs
- **Analytics**: Page views, performance
- **Domains**: Custom domain management

### Railway
- **Dashboard**: Deployment status
- **Logs**: Application logs
- **Metrics**: CPU, memory usage
- **Deployments**: History and rollback

---

## Update Your App

To push updates:

```powershell
# Make your changes
# Save all files

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add new feature: XYZ"

# Push to GitHub
git push origin main

# Vercel/Railway automatically deploys!
```

---

## Rollback if Needed

### Vercel
```
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"
```

### Railway
```
1. Go to Deployments
2. Select previous deployment
3. Click "Redeploy"
```

---

## Get Help

### Resources
- **GitHub Issues**: https://github.com/ubaidtra/Gharu-Hiraa/issues
- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Next.js Docs**: https://nextjs.org/docs

### Support
- Open an issue on GitHub
- Check documentation files
- Review deployment logs

---

## Summary - What You Need to Do

1. ✅ **Repository is initialized** - Already done!
2. ⏳ **Stage files**: `git add .`
3. ⏳ **Commit**: `git commit -m "Initial commit"`
4. ⏳ **Push**: `git push -u origin main`
5. ⏳ **Deploy to Vercel/Railway**
6. ⏳ **Add environment variables**
7. ⏳ **Test deployment**
8. ⏳ **Change default passwords**

---

**Your code is ready to push to GitHub and deploy!**

Run these commands now:

```powershell
git add .
git commit -m "Initial commit - Gharu Hiraa School Management System"
git push -u origin main
```

Then deploy to Vercel or Railway! 🚀

