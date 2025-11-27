# Receipt Printing Troubleshooting Guide

## Steps to Diagnose the Issue

### Step 1: Check Browser Console

1. **Open the app**: http://localhost:8001
2. **Login**: accounts / accounts123  
3. **Open Developer Tools**: Press F12
4. **Go to Console tab**
5. **Navigate to**: Payments page
6. **Click**: "Print" link on any transaction
7. **Check console**: Look for any red error messages

### Common Errors and Solutions

#### Error: "Cannot read property 'id' of undefined"
**Cause**: Transaction data not loading
**Solution**: API endpoint issue - check below

#### Error: "404 Not Found"
**Cause**: API route not working
**Solution**: Restart the dev server

#### Error: "useParams is not defined"
**Cause**: Missing import
**Solution**: Already fixed in latest code

#### Error: "redirect is not a function"
**Cause**: Missing import  
**Solution**: Already fixed in latest code

---

## Step 2: Test API Endpoint Directly

### Method 1: Using Browser

1. **Get a transaction ID**:
   - Go to Payments page
   - Right-click on a transaction row
   - Inspect element
   - Find the transaction ID in the href attribute
   
2. **Test the API**:
   - Open new tab
   - Go to: `http://localhost:8001/api/transactions/YOUR_TRANSACTION_ID`
   - Replace YOUR_TRANSACTION_ID with actual ID
   
3. **Expected Result**:
   ```json
   {
     "id": "...",
     "type": "SCHOOL_FEE",
     "amount": 100,
     "description": "...",
     "date": "...",
     "student": {
       "id": "...",
       "studentId": "STU-2025-0001",
       "firstName": "Ali",
       ...
     }
   }
   ```

### Method 2: Using Test File

1. **Open**: `test-receipt.html` in your browser
2. **Get transaction ID** from Payments page
3. **Enter ID** in the test form
4. **Click**: Test API button
5. **Check**: Should show transaction data

---

## Step 3: Check Server Logs

1. **Look at terminal** where `npm run dev` is running
2. **Check for errors** like:
   - "Error fetching transaction"
   - "PrismaClient" errors
   - "Cannot find module" errors

---

## Step 4: Verify File Structure

Make sure these files exist:

```
app/
└── accounts/
    └── transactions/
        └── [id]/
            └── receipt/
                └── page.tsx  ← This file must exist
                
app/
└── api/
    └── transactions/
        └── [id]/
            └── route.ts  ← This file must exist
```

---

## Step 5: Quick Fixes

### Fix 1: Restart Dev Server

```powershell
# Press Ctrl+C to stop server
# Then run:
npm run dev
```

### Fix 2: Regenerate Prisma Client

```powershell
npx prisma generate
```

### Fix 3: Clear Next.js Cache

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

---

## Step 6: Manual Test

Try accessing the receipt page directly:

1. Get a transaction ID from database or payments page
2. Go to: `http://localhost:8001/accounts/transactions/YOUR_ID/receipt`
3. What do you see?
   - **Loading forever**: API issue
   - **"Transaction not found"**: Wrong ID or database issue
   - **Blank page**: JavaScript error (check console)
   - **Receipt displays**: It's working! Check if print button works

---

## What to Report

If still not working, please provide:

1. **Console Error** (from F12 → Console tab)
2. **Server Error** (from terminal where npm run dev is running)
3. **What happens when you click Print**:
   - Nothing happens?
   - Opens blank page?
   - Shows error message?
   - Page loads but doesn't display?

---

## Quick Test Checklist

- [ ] Server is running (`npm run dev`)
- [ ] Logged in as accounts
- [ ] Can see transactions on Payments page
- [ ] Print link is visible in Actions column
- [ ] Browser console open (F12)
- [ ] Clicked Print link
- [ ] Checked for error messages

---

## Expected Behavior

**When working correctly**:
1. Click "Print" on any transaction
2. New tab/window opens
3. Receipt page loads in 1-2 seconds
4. Shows:
   - School logo
   - Transaction details
   - Student info (for payments)
   - "Print Receipt" button at top
5. Clicking "Print Receipt" opens browser print dialog

---

## Need More Help?

Please provide:
- Screenshot of error (if any)
- Browser console log
- Server terminal output
- What step fails

Then I can provide more specific help!

