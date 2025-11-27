# Deployment Checklist - Gharu Hiraa

Quick checklist for deployment. Check off each step as you complete it.

---

## ☐ Pre-Deployment (Already Done!)

- [x] Code is complete and tested locally
- [x] Git repository initialized
- [x] Code committed to git
- [x] Remote added (GitHub)
- [x] Documentation created
- [x] Environment example file created

---

## ☐ Part 1: GitHub Setup

- [ ] **1.1** Generate GitHub Personal Access Token
  - Go to: https://github.com/settings/tokens
  - Generate new token (classic)
  - Select scope: `repo`
  - Copy token

- [ ] **1.2** Push code to GitHub
  ```powershell
  git push -u origin main
  ```
  - Username: `ubaidtra`
  - Password: [paste token]

- [ ] **1.3** Verify on GitHub
  - Visit: https://github.com/ubaidtra/Gharu-Hiraa
  - Confirm all files are there

---

## ☐ Part 2: MongoDB Atlas

- [ ] **2.1** Create MongoDB Atlas account
  - Visit: https://www.mongodb.com/cloud/atlas
  - Sign up (free tier)

- [ ] **2.2** Create cluster
  - Choose: M0 (FREE)
  - Provider: AWS
  - Region: Closest to you
  - Wait for creation (1-3 min)

- [ ] **2.3** Create database user
  - Username: `gharu_admin`
  - Password: [generate & save]

- [ ] **2.4** Whitelist IP addresses
  - Add current IP
  - Add `0.0.0.0/0` (for Vercel)

- [ ] **2.5** Get connection string
  - Click "Connect" → "Connect your application"
  - Copy connection string
  - Replace `<password>` with actual password
  - Add database name: `/gharu_hiraa?`
  - Save for later

---

## ☐ Part 3: Vercel Deployment

- [ ] **3.1** Create Vercel account
  - Visit: https://vercel.com
  - Sign up with GitHub

- [ ] **3.2** Import repository
  - Click "Add New..." → "Project"
  - Select `ubaidtra/Gharu-Hiraa`
  - Click "Import"

- [ ] **3.3** Configure project
  - Framework: Next.js (auto-detected)
  - Leave defaults

- [ ] **3.4** Add environment variables
  - **DATABASE_URL**: [MongoDB connection string]
  - **NEXTAUTH_SECRET**: [generate random 32-char string]
  - **NEXTAUTH_URL**: [leave empty for now]

- [ ] **3.5** Deploy
  - Click "Deploy"
  - Wait 2-4 minutes
  - Copy deployment URL

- [ ] **3.6** Update NEXTAUTH_URL
  - Settings → Environment Variables
  - Edit `NEXTAUTH_URL`
  - Set to: `https://your-app.vercel.app`
  - Redeploy

---

## ☐ Part 4: Testing

- [ ] **4.1** Open deployed URL
  - Should see login page

- [ ] **4.2** Seed database (if needed)
  - Option A: Run locally with production DB
    ```powershell
    # Update local .env with production DATABASE_URL
    npm run db:seed
    ```
  - Option B: Use Prisma Studio to create users

- [ ] **4.3** Test Director login
  - Username: `management`
  - Password: `management123`
  - Verify dashboard loads

- [ ] **4.4** Test Accounts login
  - Username: `accounts`
  - Password: `accounts123`
  - Try creating a student

- [ ] **4.5** Test Teacher login
  - Username: `teacher`
  - Password: `teacher123`
  - Check Halaqa access

- [ ] **4.6** Test key features
  - Student registration
  - Payment recording
  - Receipt printing
  - Report submission

---

## ☐ Part 5: Security & Cleanup

- [ ] **5.1** Change default passwords
  - Director password
  - Accounts password
  - Teacher password

- [ ] **5.2** Create real users
  - Real director account
  - Real accounts staff
  - Real teachers

- [ ] **5.3** Remove/disable test accounts
  - Optional but recommended

- [ ] **5.4** Setup backups
  - Configure MongoDB Atlas backups
  - Or manual export schedule

- [ ] **5.5** Monitor application
  - Check Vercel analytics
  - Review function logs
  - Monitor MongoDB metrics

---

## ☐ Optional Enhancements

- [ ] **Custom domain**
  - Buy domain
  - Configure in Vercel
  - Update NEXTAUTH_URL

- [ ] **Email notifications**
  - Setup email service
  - Configure SMTP

- [ ] **Advanced monitoring**
  - Setup Sentry for error tracking
  - Configure uptime monitoring

- [ ] **Performance optimization**
  - Enable Vercel Analytics
  - Optimize images
  - Add caching strategies

---

## ✅ Deployment Complete!

When all checkboxes are checked:

- ✅ Your app is live and accessible
- ✅ Database is configured and seeded
- ✅ Security measures are in place
- ✅ Team can start using the system

---

## 📊 Final Status

- **Live URL**: ___________________________
- **Deployment Date**: ___________________________
- **MongoDB Cluster**: ___________________________
- **Vercel Project**: ___________________________

---

## 🔄 For Future Updates

Whenever you make changes:

```powershell
# 1. Make your changes in code
# 2. Test locally

# 3. Commit and push
git add .
git commit -m "Description of changes"
git push origin main

# 4. Vercel auto-deploys!
# 5. Check deployment status in Vercel dashboard
```

---

## 📞 Need Help?

- **Deployment Guide**: `STEP_BY_STEP_DEPLOYMENT.md`
- **GitHub Issues**: https://github.com/ubaidtra/Gharu-Hiraa/issues
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Docs**: https://docs.mongodb.com/

---

**Print this checklist and check off items as you complete them!**

