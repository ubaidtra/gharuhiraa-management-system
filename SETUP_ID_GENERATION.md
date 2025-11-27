# Quick Setup: ID Generation Feature

## Important: Database Schema Update Required

The ID generation feature requires updating your database schema. Follow these steps:

---

## Step 1: Update Database Schema

Run this command in your terminal:

```powershell
npx prisma db push
```

**What this does**:
- Adds `studentId` field to Student model
- Adds `teacherId` field to Teacher model
- Adds `hireDate` field to Teacher model
- Creates unique indexes for IDs

---

## Step 2: Verify Changes

After running the command, you should see output like:

```
Your database is now in sync with your Prisma schema. Done in XXXms
```

---

## Step 3: Test ID Generation

1. **Login as accounts**:
   - URL: http://localhost:8001
   - Username: accounts
   - Password: accounts123

2. **Register a test student**:
   - Go to: Students → Register New Student
   - Fill in details
   - Submit
   - Check Students list - you should see ID: `STU-2025-0001`

3. **Add a test teacher**:
   - Go to: Teachers → Add New Teacher
   - Fill in details
   - Submit
   - Check Teachers list - you should see ID: `TCH-2025-001`

---

## Important Note: Existing Records

**If you have existing students or teachers in your database**, they will NOT have IDs automatically assigned. You have two options:

### Option A: Start Fresh (Recommended for Development)
```powershell
npx prisma db push --force-reset
npm run db:seed
```

This will:
- Reset the database
- Clear all existing data
- Reseed with test data (including generated IDs)

### Option B: Keep Existing Data
Existing records will not have IDs. Only newly created students and teachers will get IDs. You can manually assign IDs to existing records if needed.

---

## ID Formats

Once setup is complete, you'll see:

**Students**: `STU-2025-0001`, `STU-2025-0002`, etc.
**Teachers**: `TCH-2025-001`, `TCH-2025-002`, etc.

---

## Troubleshooting

### Error: "Schema is not in sync"
**Solution**: Run `npx prisma generate` then `npx prisma db push`

### Error: "Cannot find module"
**Solution**: Run `npm install --legacy-peer-deps`

### IDs not showing in list
**Solution**: 
1. Check browser console for errors
2. Refresh the page
3. Verify database was updated (`npx prisma db push`)

---

**That's it! Your system will now automatically generate IDs for all new students and teachers.**

