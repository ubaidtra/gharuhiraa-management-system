# Teacher Halaqa Editing - COMPLETE

## Feature Implemented

Teachers can now edit and manage the Halaqas assigned to them!

---

## What Teachers Can Now Do

### Edit Halaqa Details
- **Change Halaqa Name** - Update the name of their assigned halaqa
- **Update Student Level** - Modify the level description (Beginner, Intermediate, Advanced, etc.)
- **Manage Students** - Continue to add/remove students (existing feature)

### Restrictions
- Teachers can ONLY edit halaqas assigned to them
- Teachers CANNOT change the teacher assignment
- Teachers CANNOT delete halaqas
- Teachers CANNOT edit halaqas assigned to other teachers

---

## How to Use

### Step 1: Navigate to Your Halaqa
1. Login as teacher (teacher / teacher123)
2. Go to "My Halaqa" in the navbar
3. Click on any halaqa you're assigned to

### Step 2: Edit Halaqa Details
1. Click "Edit Halaqa Details" button (top right)
2. Update the name or level fields
3. Click "Save Changes"
4. Or click "Cancel" to discard changes

### Step 3: Manage Students (Existing)
- Add students using the dropdown
- Remove students with the Remove button
- All changes are saved immediately

---

## What Changed

### API Endpoint Updated
**PUT /api/halaqas/[id]**

**Before:**
- Only ACCOUNTS users could update halaqas

**After:**
- ACCOUNTS: Full update (name, level, teacher assignment, status)
- TEACHER: Limited update (name and level only, only for their own halaqas)

### Security Added
- API checks if halaqa is assigned to the requesting teacher
- Returns 403 error if teacher tries to edit another teacher's halaqa
- Teachers cannot change teacher assignment (security feature)

### UI Enhanced
**Teacher Halaqa Management Page:**
- Added "Edit Halaqa Details" button
- Inline editing form (appears when clicking Edit)
- "Save Changes" and "Cancel" buttons
- Real-time form validation
- Success/error messages

---

## Permissions Summary

### ACCOUNTS Users
- Create new halaqas
- Edit all halaqa details (including teacher assignment)
- Delete halaqas
- View all halaqas

### TEACHERS
- View assigned halaqas only
- **Edit name and level** of assigned halaqas (NEW!)
- Add/remove students in assigned halaqas
- Record learning progress
- CANNOT create new halaqas
- CANNOT delete halaqas
- CANNOT change teacher assignments
- CANNOT edit other teachers' halaqas

### MANAGEMENT
- View all halaqas (read-only)
- No edit or delete permissions

---

## Example Usage

### Scenario 1: Rename Your Halaqa
```
1. Teacher logs in
2. Goes to "My Halaqa"
3. Clicks on "Beginners Group A"
4. Clicks "Edit Halaqa Details"
5. Changes name to "Morning Beginner Circle"
6. Clicks "Save Changes"
Result: Halaqa renamed successfully
```

### Scenario 2: Update Student Level
```
1. Navigate to assigned halaqa
2. Click "Edit Halaqa Details"
3. Change level from "Beginner" to "Lower Intermediate"
4. Save changes
Result: Level updated, reflects new student progress
```

### Scenario 3: Try to Edit Another Teacher's Halaqa
```
1. Teacher Ahmad tries to edit Teacher Fatima's halaqa
2. System checks: teacherId doesn't match
3. API returns error: "You can only edit Halaqas assigned to you"
Result: Update blocked, security maintained
```

---

## Technical Details

### Files Modified

**1. app/api/halaqas/[id]/route.ts**
- Updated PUT method
- Added teacher permission check
- Added ownership verification
- Limited teacher update fields

**2. app/teachers/halaqa/[id]/page.tsx**
- Added edit mode state
- Added edit form component
- Added save/cancel handlers
- Enhanced UI with inline editing

### API Request Format

**Teacher Update (Limited):**
```json
PUT /api/halaqas/{id}
{
  "name": "Updated Halaqa Name",
  "studentLevel": "Intermediate"
}
```

**Accounts Update (Full):**
```json
PUT /api/halaqas/{id}
{
  "name": "Updated Halaqa Name",
  "studentLevel": "Intermediate",
  "teacherId": "teacher-id-here",
  "isActive": true
}
```

### Security Validation

```typescript
// Check 1: Is user authenticated?
if (!session) return 401

// Check 2: Is user ACCOUNTS or TEACHER?
if (role === "ACCOUNTS") {
  // Allow full update
}

if (role === "TEACHER") {
  // Check 3: Does this halaqa belong to this teacher?
  if (halaqa.teacherId !== session.user.id) {
    return 403 // Unauthorized
  }
  // Allow limited update (name and level only)
}
```

---

## User Interface

### Before Editing
```
┌────────────────────────────────────┐
│ Beginners Group A  [Edit Details]  │
│ Level: Beginner                    │
└────────────────────────────────────┘
```

### During Editing
```
┌────────────────────────────────────────┐
│ [Name: ___________] [Save] [Cancel]   │
│ [Level: __________]                    │
└────────────────────────────────────────┘
```

---

## Benefits

**Teacher Empowerment**
- Teachers can adapt halaqa names to their teaching style
- Update levels as students progress
- Better reflect current group status

**Flexibility**
- Quick updates without needing accounts staff
- Real-time adjustments
- Responsive to student needs

**Maintained Security**
- Teachers can only edit their own halaqas
- Teacher assignments protected
- Deletion still restricted to accounts

**User-Friendly**
- Inline editing (no separate page)
- Clear save/cancel options
- Immediate feedback
- Simple interface

---

## Testing Checklist

### Test as Teacher

**Edit Own Halaqa:**
- [ ] Login as teacher
- [ ] Go to My Halaqa
- [ ] Click assigned halaqa
- [ ] Click "Edit Halaqa Details"
- [ ] Change name
- [ ] Change level
- [ ] Save changes
- [ ] Verify updates appear

**Security Tests:**
- [ ] Try to access another teacher's halaqa URL
- [ ] Verify cannot edit unassigned halaqa
- [ ] Check teacher assignment cannot be changed
- [ ] Confirm delete button not present

**Cancel Functionality:**
- [ ] Start editing
- [ ] Make changes
- [ ] Click Cancel
- [ ] Verify changes discarded
- [ ] Check original values restored

### Test as Accounts

**Verify Full Access:**
- [ ] Login as accounts
- [ ] Edit any halaqa
- [ ] Change teacher assignment
- [ ] Verify full update works
- [ ] Check deletion still works

---

## Error Handling

### Possible Errors

**403 Unauthorized**
- Message: "You can only edit Halaqas assigned to you"
- Cause: Teacher trying to edit another teacher's halaqa
- Solution: Only edit your assigned halaqas

**404 Not Found**
- Message: "Halaqa not found"
- Cause: Invalid halaqa ID
- Solution: Navigate from halaqa list

**500 Server Error**
- Message: "Failed to update halaqa"
- Cause: Database or network issue
- Solution: Try again, check connection

---

## Quick Reference

### Teacher Capabilities

| Action | Before | After |
|--------|--------|-------|
| View assigned halaqas | Yes | Yes |
| Edit halaqa name | No | **Yes** |
| Edit student level | No | **Yes** |
| Change teacher assignment | No | No |
| Add/remove students | Yes | Yes |
| Delete halaqa | No | No |
| Create new halaqa | No | No |

---

## Access Now

**URL**: http://localhost:8001

**Login**: teacher / teacher123

**Try it:**
1. Go to "My Halaqa"
2. Click on any halaqa
3. Click "Edit Halaqa Details"
4. Make changes and save!

---

**Teachers can now fully manage their assigned Halaqas!**

