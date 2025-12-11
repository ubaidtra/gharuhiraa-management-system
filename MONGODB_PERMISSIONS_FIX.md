# MongoDB Permissions Issue - Fix Required

## ⚠️ Issue Found

The MongoDB user `ubaidtrawally` doesn't have sufficient permissions to perform database operations.

**Error:**
```
user is not allowed to do action [find] on [gharu-hiraa.User]
```

---

## ✅ Solution: Update MongoDB User Permissions

### Step 1: Go to MongoDB Atlas

1. Visit: https://cloud.mongodb.com
2. Sign in to your account
3. Select your cluster: `Cluster0`

### Step 2: Update Database User Permissions

1. **Go to Database Access:**
   - Click **"Database Access"** in the left sidebar
   - Find user: `ubaidtrawally`
   - Click **"Edit"** (pencil icon)

2. **Update Permissions:**
   - Under **"Database User Privileges"**
   - Change from current setting to:
     - **"Atlas admin"** (full access) - **Recommended**
     OR
     - **"Read and write to any database"** - **Alternative**

3. **Save Changes:**
   - Click **"Update User"**
   - Wait for changes to propagate (1-2 minutes)

### Step 3: Alternative - Create New User with Proper Permissions

If you prefer to create a new user:

1. **Database Access** → **"Add New Database User"**
2. **Authentication Method:** Password
3. **Username:** `gharuhiraa-admin` (or your choice)
4. **Password:** Create a strong password
5. **Database User Privileges:**
   - Select **"Atlas admin"** or **"Read and write to any database"**
6. **Click "Add User"**
7. **Update Connection String:**
   - Update `DATABASE_URL` in Vercel with new username/password

---

## 🔄 After Fixing Permissions

Once permissions are updated:

### Option 1: Seed via API Endpoint (Recommended)

1. **Visit your production URL:**
   ```
   https://gharuhiraa-management-system-5tdiztd5x.vercel.app/api/seed-users
   ```

2. **Make a POST request** (use browser console or Postman):
   ```javascript
   fetch('https://gharuhiraa-management-system-5tdiztd5x.vercel.app/api/seed-users', {
     method: 'POST'
   })
   .then(res => res.json())
   .then(data => console.log(data));
   ```

### Option 2: Seed Locally with Updated Permissions

After updating permissions, run:

```powershell
$env:DATABASE_URL="mongodb+srv://ubaidtrawally:ubaidtrawally.281986@cluster0.lxszwnk.mongodb.net/gharu-hiraa?retryWrites=true&w=majority"
npm run db:seed
```

---

## 📋 Required Permissions

The database user needs:

- ✅ **find** - Read data
- ✅ **insert** - Create data
- ✅ **update** - Modify data
- ✅ **delete** - Remove data (optional)

**Easiest:** Grant **"Atlas admin"** role for full access.

---

## 🔒 Security Note

- **Atlas admin** gives full access (recommended for production)
- **Read and write** is sufficient for application needs
- Never use **read-only** for application database user

---

## ✅ Verification

After updating permissions:

1. Wait 1-2 minutes for changes to propagate
2. Try seeding again (via API or locally)
3. Check Vercel deployment logs for any errors
4. Test login on production site

---

**Update MongoDB user permissions, then seed the database!**

