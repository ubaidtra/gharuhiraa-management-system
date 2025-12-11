# Quick Fix for Vercel Domain Issues

## 🚨 Most Likely Problems (Check These First)

### 1. **Deployment Protection is ON** ⚠️
**Fix:** Vercel Dashboard → Settings → Deployment Protection → **DISABLE**

### 2. **NEXTAUTH_URL is Wrong** ⚠️
**Fix:** Settings → Environment Variables → Set `NEXTAUTH_URL` to:
```
https://gharu-hiraa-school-management-syste-two.vercel.app
```
(Must match your deployment URL exactly, no trailing slash)

### 3. **Missing NEXTAUTH_SECRET** ⚠️
**Fix:** Generate secret:
```bash
openssl rand -base64 32
```
Then add to Vercel Environment Variables

### 4. **Database Not Accessible** ⚠️
**Fix:** MongoDB Atlas → Network Access → Add `0.0.0.0/0` (allow all IPs)

---

## ✅ 5-Minute Fix Checklist

1. [ ] Go to Vercel Dashboard
2. [ ] Settings → Deployment Protection → **Disable**
3. [ ] Settings → Environment Variables → Verify:
   - `DATABASE_URL` ✅
   - `NEXTAUTH_SECRET` ✅ (generate if missing)
   - `NEXTAUTH_URL` ✅ (must match deployment URL)
4. [ ] Deployments → Latest → **Redeploy**
5. [ ] Test: Visit your deployment URL
6. [ ] Should see login page (not Vercel login)

---

## 🔍 If Still Not Working

**Check Build Logs:**
- Deployments → Click latest → View Build Logs
- Look for errors (Prisma, TypeScript, missing modules)

**Check Function Logs:**
- Deployments → Click latest → View Function Logs
- Look for runtime errors (database connection, auth errors)

**Test Database:**
- MongoDB Atlas → Network Access → Ensure `0.0.0.0/0` is allowed
- Test connection string locally

---

## 📝 Environment Variables Template

Copy this to Vercel Environment Variables:

```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/gharu-hiraa?retryWrites=true&w=majority
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=https://gharu-hiraa-school-management-syste-two.vercel.app
```

**Important:** 
- Replace `username`, `password`, `cluster` with your actual MongoDB values
- Generate `NEXTAUTH_SECRET` with `openssl rand -base64 32`
- Update `NEXTAUTH_URL` to match your exact deployment URL

---

## 🎯 Expected Result

After fixes, visiting your domain should:
1. ✅ Show Gharu Hiraa login page (not Vercel login)
2. ✅ Allow you to login with credentials
3. ✅ Redirect to dashboard based on role

---

**Need more help?** See `VERCEL_DOMAIN_DIAGNOSTIC.md` for detailed troubleshooting.

