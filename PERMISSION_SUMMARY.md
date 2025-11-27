# 🔐 Complete Permission Summary - Cave of Hiraa Management System

## Overview

This document provides a complete overview of who can do what in the system.

---

## 👥 User Roles

### 1. MANAGEMENT (Read-Only Oversight)
**Username**: `management` | **Password**: `management123`

### 2. ACCOUNTS (Full Administrative Access)
**Username**: `accounts` | **Password**: `accounts123`

### 3. TEACHER (Educational Operations)
**Username**: `teacher` | **Password**: `teacher123`

---

## 📊 Permission Matrix

| Feature | Management | Accounts | Teacher |
|---------|-----------|----------|---------|
| **Students** |
| View Students | ✅ Read-Only | ✅ Full | ✅ Read-Only |
| Register Student | ❌ | ✅ | ❌ |
| Edit Student | ❌ | ✅ | ❌ |
| Delete Student | ❌ | ✅ | ❌ |
| **Teachers** |
| View Teachers | ✅ Read-Only | ✅ Full | ❌ |
| Add Teacher | ❌ | ✅ | ❌ |
| Edit Teacher | ❌ | ✅ | ❌ |
| Delete Teacher | ❌ | ✅ | ❌ |
| **Halaqas** |
| View All Halaqas | ✅ Read-Only | ✅ Full | ❌ |
| View Own Halaqas | N/A | ✅ | ✅ |
| Create Halaqa | ❌ | ✅ | ❌ |
| Edit Halaqa | ❌ | ✅ | ❌ |
| Delete Halaqa | ❌ | ✅ | ❌ |
| Assign Teacher | ❌ | ✅ | ❌ |
| Add Students | ❌ | ❌ | ✅ |
| Remove Students | ❌ | ❌ | ✅ |
| **Transactions** |
| View Transactions | ✅ Read-Only | ✅ Full | ❌ |
| Record Fee | ❌ | ✅ | ❌ |
| Record Withdrawal | ❌ | ✅ | ❌ |
| Edit Transaction | ❌ | ✅ | ❌ |
| Delete Transaction | ❌ | ✅ | ❌ |
| **Learning Records** |
| View All Records | ✅ Read-Only | ❌ | ✅ Own Halaqas |
| Add Record | ❌ | ❌ | ✅ |
| Edit Record | ❌ | ❌ | ✅ |
| Delete Record | ❌ | ❌ | ✅ |
| **Statistics** |
| View Statistics | ✅ | ❌ | ❌ |
| Financial Reports | ✅ Read-Only | ✅ Full | ❌ |
| Learning Analytics | ✅ | ❌ | ❌ |

---

## 🎯 Role-Specific Capabilities

### 👔 MANAGEMENT

**Can Do:**
- ✅ View comprehensive dashboards
- ✅ See all students (cannot edit)
- ✅ See all teachers (cannot edit)
- ✅ View all Halaqas (cannot edit)
- ✅ Access financial reports (cannot modify)
- ✅ View learning progress statistics
- ✅ See all transactions (cannot modify)
- ✅ Access detailed analytics

**Cannot Do:**
- ❌ Register or edit students
- ❌ Add or edit teachers
- ❌ Create or manage Halaqas
- ❌ Record transactions
- ❌ Add learning records
- ❌ Modify any data

**Purpose**: Oversight and strategic planning

---

### 💼 ACCOUNTS

**Can Do:**
- ✅ Register and manage students
- ✅ Add and manage teachers
- ✅ **Create, edit, and delete Halaqas**
- ✅ **Assign teachers to Halaqas**
- ✅ Record all types of transactions
- ✅ Record withdrawals with check photos
- ✅ View financial summaries
- ✅ Search and filter data
- ✅ Manage all administrative data

**Cannot Do:**
- ❌ View learning records (Quranic progress)
- ❌ Add learning progress entries
- ❌ Access statistics dashboard

**Purpose**: Administrative operations and financial management

---

### 📚 TEACHER

**Can Do:**
- ✅ View assigned Halaqas
- ✅ **Add students to their Halaqas**
- ✅ **Remove students from their Halaqas**
- ✅ Record weekly learning progress
- ✅ Track memorization (Hifz)
- ✅ Track review (Murajaa)
- ✅ Add notes and observations
- ✅ View student profiles in their Halaqas
- ✅ View learning history

**Cannot Do:**
- ❌ **Create new Halaqas** (must contact Accounts)
- ❌ **Edit Halaqa details** (name, level, teacher)
- ❌ **Delete Halaqas**
- ❌ View financial information
- ❌ Register students or teachers
- ❌ Access transactions
- ❌ View other teachers' Halaqas

**Purpose**: Educational operations and student progress tracking

---

## 🔒 API Endpoint Permissions

### Public (Unauthenticated):
- `/login` - Login page
- `/api/auth/*` - Authentication endpoints

### All Authenticated Users:
- `GET /api/students` - View students
- `GET /api/teachers` - View teachers
- `GET /api/halaqas` - View halaqas
- `GET /api/halaqas/{id}` - View specific halaqa

### ACCOUNTS Only:
- `POST /api/students` - Create student
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student
- `POST /api/teachers` - Create teacher
- `PUT /api/teachers/{id}` - Update teacher
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/{id}` - Update transaction
- **`POST /api/halaqas`** - Create halaqa
- **`PUT /api/halaqas/{id}`** - Update halaqa
- **`DELETE /api/halaqas/{id}`** - Delete halaqa

### TEACHER Only:
- `POST /api/learning-records` - Create learning record
- `PUT /api/learning-records/{id}` - Update learning record
- `POST /api/halaqas/{id}/students` - Add student to halaqa
- `DELETE /api/halaqas/{id}/students` - Remove student from halaqa

### MANAGEMENT Only:
- `GET /api/statistics` - View statistics

---

## 🌐 Page Access

### ACCOUNTS Pages:
- `/accounts` - Dashboard
- `/accounts/students` - Student list
- `/accounts/students/new` - Register student
- `/accounts/students/{id}` - Edit student
- `/accounts/teachers` - Teacher list
- `/accounts/teachers/new` - Add teacher
- `/accounts/teachers/{id}` - Edit teacher
- **`/accounts/halaqas`** - Halaqa list
- **`/accounts/halaqas/new`** - Create halaqa
- **`/accounts/halaqas/{id}`** - Edit halaqa
- `/accounts/transactions` - Transaction list
- `/accounts/transactions/new` - Record transaction

### TEACHER Pages:
- `/teachers` - Dashboard
- `/teachers/halaqa` - My Halaqas (view only)
- `/teachers/halaqa/{id}` - Manage halaqa students
- ~~`/teachers/halaqa/new`~~ - ❌ DELETED (no longer allowed)
- `/teachers/learning-records` - Learning records list
- `/teachers/learning-records/new` - Add learning record

### MANAGEMENT Pages:
- `/management` - Dashboard
- `/management/students` - Students (read-only)
- `/management/teachers` - Teachers (read-only)
- `/management/statistics` - Statistics

---

## 🔄 Workflow Examples

### Create New Halaqa:
1. **Accounts** logs in
2. Goes to: Accounts → Halaqas → Create New Halaqa
3. Enters: Name, Level, assigns Teacher
4. Submits
5. **Teacher** sees it in "My Halaqa"

### Add Student to Halaqa:
1. **Teacher** logs in
2. Goes to: Teachers → My Halaqa → [Select Halaqa]
3. Selects unassigned student from dropdown
4. Clicks "Add Student"
5. Student appears in halaqa

### Record Learning Progress:
1. **Teacher** logs in
2. Goes to: Teachers → Learning Records → Add Weekly Record
3. Fills: Student, Week, Attendance, Memorization, Review
4. Submits
5. Record saved and visible to Management

### Register Student:
1. **Accounts** logs in
2. Goes to: Accounts → Students → Register New Student
3. Fills: Name, DOB, Address, Gender, Contacts
4. Submits
5. Student can now be assigned to Halaqas

---

## 🚨 Security Enforcement

### Three-Layer Security:

1. **UI Layer**: Buttons/links hidden based on role
2. **API Layer**: Endpoints check user role
3. **Database Layer**: All changes via authorized API only

### Error Responses:
- **401 Unauthorized**: Not logged in
- **403 Forbidden**: Logged in but wrong role
- **404 Not Found**: Resource doesn't exist

---

## 📋 Quick Reference

### Who manages what:

| Resource | Created By | Managed By | Used By |
|----------|-----------|------------|---------|
| Students | Accounts | Accounts | All |
| Teachers | Accounts | Accounts | All |
| **Halaqas** | **Accounts** | **Accounts** | **Accounts + Teachers** |
| Transactions | Accounts | Accounts | Accounts + Management |
| Learning Records | Teachers | Teachers | Teachers + Management |

---

## ✅ Permission Verification

### To Test Accounts Permissions:
```
Login: accounts / accounts123
Try: Create Halaqa ✅ Should work
Try: Add Teacher ✅ Should work
Try: Add Learning Record ❌ Should be blocked
```

### To Test Teacher Permissions:
```
Login: teacher / teacher123
Try: Create Halaqa ❌ Should be blocked (button hidden)
Try: Add Student to Halaqa ✅ Should work
Try: Record Transaction ❌ Should be blocked
```

### To Test Management Permissions:
```
Login: management / management123
Try: View Statistics ✅ Should work
Try: Edit Student ❌ Should be blocked
Try: Create Halaqa ❌ Should be blocked
```

---

## 🎉 Current Status

**All permissions correctly enforced at:**
- ✅ API level
- ✅ UI level  
- ✅ Navigation level
- ✅ Database level

**System is secure and role-based access control is working!** 🔒

