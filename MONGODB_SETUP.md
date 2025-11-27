# MongoDB Setup Guide - Manual Instructions

## ⚠️ Windows File Lock Issue

There's a Windows file lock issue with Prisma DLL files. Please follow these manual steps:

---

## Step 1: Close All Node/Next.js Processes

1. **Close this terminal/PowerShell**
2. **Open Task Manager** (Ctrl + Shift + Esc)
3. Look for any **node.exe** or **Next.js** processes
4. **End all node.exe tasks**
5. Wait 10 seconds

---

## Step 2: Delete Locked Folders

Open **File Explorer** and navigate to:
```
C:\Cave of Hiraa Management system\node_modules
```

Manually delete these folders (if they exist):
- `.prisma`
- `@next`

If Windows says "file is in use", restart your computer and try again.

---

## Step 3: Open Fresh PowerShell

Open a **NEW PowerShell window** as Administrator:
1. Press Windows key
2. Type "PowerShell"
3. Right-click "Windows PowerShell"
4. Select "Run as Administrator"
5. Navigate to project:
```powershell
cd "C:\Cave of Hiraa Management system"
```

---

## Step 4: Clean Install

Run these commands one by one:

```powershell
# Remove node_modules completely
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

# Remove package-lock.json
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# Fresh install
npm install --legacy-peer-deps
```

---

## Step 5: Generate Prisma Client

```powershell
npx prisma generate
```

You should see: "Generated Prisma Client successfully"

---

## Step 6: Push Schema to MongoDB

```powershell
npx prisma db push
```

You should see: "Your database is now in sync with your Prisma schema"

---

## Step 7: Seed Database

```powershell
npm run db:seed
```

You should see the success messages with test credentials.

---

## Step 8: Start the Server

```powershell
npm run dev
```

Server should start at: **http://localhost:8001**

---

## ✅ Quick Verification

1. Open: http://localhost:8001
2. Login with: `accounts` / `accounts123`
3. If you see the dashboard, setup is complete!

---

## 🔄 Alternative: Use Setup Script

If manual steps don't work, try restarting your computer, then run:

```powershell
.\setup-mongodb.ps1
```

---

## 📝 Connection Details

Your MongoDB connection is configured as:
- **Database**: ubaitech_portio
- **Cluster**: cluster0.cevggcp.mongodb.net
- **Port**: 8001 (local server)

---

## 🆘 Still Having Issues?

### Option A: Use Different Terminal
Try using **Git Bash** or **CMD** instead of PowerShell

### Option B: Restart Computer
Restart Windows to release all file locks, then repeat steps above

### Option C: Check MongoDB Connection
Verify your MongoDB Atlas cluster is accessible:
```powershell
# Test connection
npx prisma db push --skip-generate
```

---

## 📚 Environment Variables

Your `.env` file has been created with:
```
DATABASE_URL="mongodb+srv://traubaid:ubaid281986@cluster0.cevggcp.mongodb.net/ubaitech_portio?retryWrites=true&w=majority"
NEXTAUTH_URL=http://localhost:8001
NEXTAUTH_SECRET=cave-of-hiraa-secret-key-change-in-production
PORT=8001
```

---

## ✨ After Successful Setup

Test Credentials:
- Management: `management` / `management123`
- Accounts: `accounts` / `accounts123`
- Teacher: `teacher` / `teacher123`

Access your application at: **http://localhost:8001**

