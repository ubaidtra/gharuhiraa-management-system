# 🚀 Quick MongoDB Setup Fix

## The Problem
Windows has locked some Prisma DLL files, preventing regeneration.

## The Solution (Choose One)

### ⭐ Option 1: Restart Computer (Recommended)
1. **Restart your computer**
2. Open PowerShell as Administrator
3. Navigate to project directory
4. Run:
```powershell
cd "C:\Cave of Hiraa Management system"
npm run db:setup
npm run dev
```

### 🔧 Option 2: Force Kill Processes
```powershell
# Kill all Node processes
taskkill /F /IM node.exe /T

# Wait 5 seconds
Start-Sleep -Seconds 5

# Try setup again
npm run db:setup
npm run dev
```

### 📋 Option 3: Manual Step-by-Step
```powershell
# 1. Kill processes
taskkill /F /IM node.exe /T
Start-Sleep -Seconds 5

# 2. Delete problematic folders
Remove-Item node_modules\.prisma -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item node_modules\@next -Recurse -Force -ErrorAction SilentlyContinue

# 3. Reinstall Prisma
npm uninstall @prisma/client prisma
npm install @prisma/client@5.18.0 prisma@5.18.0 --save-exact --legacy-peer-deps

# 4. Generate
npx prisma generate

# 5. Push schema
npx prisma db push

# 6. Seed
npm run db:seed

# 7. Start
npm run dev
```

## ✅ Success Indicators

You'll know it worked when you see:
- ✔ Generated Prisma Client
- ✔ Database synced
- ✔ Database seeded successfully
- ▲ Next.js running on http://localhost:8001

## 🌐 Then Access

Open: **http://localhost:8001**

Login: `accounts` / `accounts123`

