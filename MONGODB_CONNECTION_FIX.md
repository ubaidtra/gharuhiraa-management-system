# MongoDB Connection String Fix

## ⚠️ Issue Found

Your current MongoDB connection string is missing the database name:

**Current (Incorrect):**
```
mongodb+srv://ubaidtrawally:ubaidtrawally.281986@cluster0.lxszwnk.mongodb.net/?appName=Cluster0
```

## ✅ Correct Format

The connection string should include:
1. Database name (after the `/`)
2. Proper query parameters (`retryWrites=true&w=majority`)

**Correct Format:**
```
mongodb+srv://ubaidtrawally:ubaidtrawally.281986@cluster0.lxszwnk.mongodb.net/gharu-hiraa?retryWrites=true&w=majority
```

**Or if you want to keep appName:**
```
mongodb+srv://ubaidtrawally:ubaidtrawally.281986@cluster0.lxszwnk.mongodb.net/gharu-hiraa?retryWrites=true&w=majority&appName=Cluster0
```

---

## 🔧 How to Fix in Vercel

### Option 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/abdoulkarim-trawallys-projects/gharuhiraa-management-system
   - Or: https://vercel.com → Select your project

2. **Update Environment Variable:**
   - Go to **Settings** → **Environment Variables**
   - Find `DATABASE_URL`
   - Click **"Edit"** or **"..."** → **"Edit"**
   - Update the value to:
     ```
     mongodb+srv://ubaidtrawally:ubaidtrawally.281986@cluster0.lxszwnk.mongodb.net/gharu-hiraa?retryWrites=true&w=majority
     ```
   - Make sure it's set for **Production**, **Preview**, and **Development**
   - Click **"Save"**

3. **Redeploy:**
   - Go to **Deployments** tab
   - Click **"..."** on latest deployment
   - Click **"Redeploy"**
   - Wait for deployment to complete

### Option 2: Via Vercel CLI

```powershell
# Update DATABASE_URL
vercel env rm DATABASE_URL production
vercel env add DATABASE_URL production

# When prompted, paste:
mongodb+srv://ubaidtrawally:ubaidtrawally.281986@cluster0.lxszwnk.mongodb.net/gharu-hiraa?retryWrites=true&w=majority

# Repeat for preview and development:
vercel env add DATABASE_URL preview
vercel env add DATABASE_URL development

# Redeploy
vercel --prod
```

---

## 📝 Connection String Components

Breaking down the correct connection string:

```
mongodb+srv://
  ubaidtrawally                    ← Username
  :                                 ← Separator
  ubaidtrawally.281986              ← Password
  @                                 ← Separator
  cluster0.lxszwnk.mongodb.net      ← Cluster hostname
  /                                 ← Separator
  gharu-hiraa                       ← Database name (IMPORTANT!)
  ?                                 ← Query string start
  retryWrites=true                  ← Retry writes enabled
  &                                 ← Parameter separator
  w=majority                        ← Write concern
```

---

## ✅ Verification Steps

After updating:

1. **Check Vercel Environment Variables:**
   - Verify `DATABASE_URL` includes `/gharu-hiraa` before the `?`

2. **Test Connection Locally:**
   ```powershell
   # Update .env.local with the correct connection string
   # Then test:
   npx prisma db push
   ```

3. **Check Deployment Logs:**
   - Go to Vercel → Deployments → Latest → View logs
   - Look for database connection errors
   - Should see successful Prisma client generation

4. **Test Application:**
   - Visit production URL
   - Try logging in
   - If database errors occur, check the connection string format

---

## 🗄️ Database Name Options

You can use any database name. Common choices:

- `gharu-hiraa` (recommended - matches project name)
- `gharuhiraa` (without hyphen)
- `school-management` (descriptive)
- `production` (if this is production database)

**Important:** The database name must match what you use in your Prisma schema or what you want to create.

---

## 🔍 Current Prisma Schema Database

Check your `prisma/schema.prisma` file to see what database name is expected, or MongoDB Atlas will create a new database with the name you specify in the connection string.

---

## ⚠️ Important Notes

1. **Database Creation:**
   - If the database doesn't exist, MongoDB will create it automatically
   - First connection will create the database

2. **Password Encoding:**
   - If your password contains special characters, they may need URL encoding
   - Current password (`ubaidtrawally.281986`) should work as-is

3. **Network Access:**
   - Ensure MongoDB Atlas Network Access allows `0.0.0.0/0` (all IPs)
   - Or add Vercel's IP ranges

4. **User Permissions:**
   - Database user must have read/write permissions
   - Check MongoDB Atlas → Database Access

---

## 🚀 After Fixing

Once you update the connection string:

1. ✅ Redeploy the application
2. ✅ Test database connection
3. ✅ Run Prisma migrations if needed:
   ```powershell
   npx prisma db push
   ```
4. ✅ Seed database if needed:
   ```powershell
   npm run db:seed
   ```

---

## 📞 Need Help?

If you encounter issues:

1. Check Vercel deployment logs
2. Verify MongoDB Atlas Network Access
3. Test connection string locally first
4. Check Prisma schema for database name expectations

---

**Update the DATABASE_URL in Vercel with the database name included!**

