# Testing Guide - Cave of Hiraa School Management System

## System Overview

The Cave of Hiraa School Management System is now fully operational and ready for testing. The application is running at **http://localhost:3000**.

---

## Test Credentials

| Role | Username | Password |
|------|----------|----------|
| **Management** | `management` | `management123` |
| **Accounts** | `accounts` | `accounts123` |
| **Teacher** | `teacher` | `teacher123` |

---

## Verification Scenarios

### 1. Authentication & Role-Based Access

#### Test Login Flows
1. **Navigate to**: http://localhost:3000
2. **Expected**: Automatic redirect to `/login` page
3. **Test each role**:
   - Login with each credential set above
   - Verify successful authentication
   - Check that you're redirected to the appropriate dashboard

#### Verify Role-Based Navigation
- **Management User**: Should see Dashboard, Students, Teachers, Statistics in navbar
- **Accounts User**: Should see Dashboard, Students, Teachers, Transactions in navbar
- **Teacher User**: Should see Dashboard, My Halaqa, Learning Records in navbar

---

### 2. Accounts User Testing

#### Scenario A: Student Registration
1. **Login as**: `accounts` / `accounts123`
2. **Navigate to**: Accounts Dashboard → "Register New Student"
3. **Fill in the form**:
   - First Name: `Yusuf`
   - Father Name: `Hassan`
   - Last Name: `Rahman`
   - Date of Birth: `2013-05-10`
   - Gender: `Male`
   - Address: `123 Test Street`
   - Phone: `555-9999`
4. **Submit** and verify student appears in Students list
5. **Expected Result**: ✅ Student created successfully

#### Scenario B: Teacher Registration
1. **Navigate to**: Accounts → Teachers → "Add New Teacher"
2. **Fill in the form**:
   - First Name: `Khadija`
   - Last Name: `Ibrahim`
   - Gender: `Female`
   - Date of Birth: `1988-12-20`
   - Employment Type: `Full Time`
   - Certificate: `Ijazah in Warsh`
   - Address: `456 Teacher Lane`
3. **Submit** and verify teacher appears in Teachers list
4. **Expected Result**: ✅ Teacher created successfully

#### Scenario C: Recording Fees
1. **Navigate to**: Accounts → Transactions → "Record Transaction"
2. **Test Registration Fee**:
   - Type: `Registration Fee`
   - Amount: `50.00`
   - Student: Select any student
   - Date: Today's date
3. **Submit** and verify transaction appears in list
4. **Repeat for other fee types**: School Fee, Uniform Fee
5. **Expected Result**: ✅ All transactions recorded correctly

#### Scenario D: Recording Withdrawal
1. **Navigate to**: Accounts → Transactions → "Record Transaction"
2. **Fill withdrawal**:
   - Type: `Withdrawal`
   - Amount: `150.00`
   - Description: `Office supplies purchase`
   - Student: Leave blank (optional for withdrawals)
3. **Submit** and verify withdrawal appears
4. **Expected Result**: ✅ Withdrawal recorded with negative amount display

#### Scenario E: Permission Verification
1. **While logged as Accounts**:
   - Try to access `/teachers` URL directly
   - **Expected**: ✅ Redirected or access denied
2. **Verify you CANNOT see**:
   - Learning Records
   - Teacher-specific pages

---

### 3. Teacher User Testing

#### Scenario A: Create Halaqa
1. **Login as**: `teacher` / `teacher123`
2. **Navigate to**: Teachers Dashboard → "Create New Halaqa"
3. **Fill in the form**:
   - Halaqa Name: `Advanced Group C`
   - Student Level: `Advanced`
   - Teacher: Select a teacher
4. **Submit** and verify halaqa appears
5. **Expected Result**: ✅ Halaqa created successfully

#### Scenario B: Assign Students to Halaqa
1. **Navigate to**: Teachers → My Halaqa → Select a halaqa
2. **Click "Manage Students"**
3. **Add a student**:
   - Select an unassigned student from dropdown
   - Click "Add Student"
4. **Verify student appears** in "Current Students" list
5. **Test removal**: Click "Remove" on a student
6. **Expected Result**: ✅ Students can be added/removed from halaqa

#### Scenario C: Weekly Learning Record Entry
1. **Navigate to**: Teachers → Learning Records → "Add Weekly Record"
2. **Fill comprehensive learning data**:
   - **Student**: Select a student
   - **Teacher**: Select a teacher
   - **Week Start Date**: Last Monday's date
   - **Attendance**: `6` days
   - **Memorization Section**:
     - Surah: `Al-Kahf`
     - Daily Dars: `Ayah 50-60`
     - Memorized Days: `5`
     - Not Memorized Days: `1`
     - Rubu Amount: `0.75`
   - **Review Section**:
     - Murajaa From: `Al-Mulk`
     - Murajaa To: `Al-Mulk`
     - Murajaa Days: `6`
     - Murajaa Not Days: `0`
   - **Notes**: `Excellent progress this week`
3. **Submit** and verify record appears in list
4. **Expected Result**: ✅ Learning record saved with all details

#### Scenario D: View Learning Progress
1. **Navigate to**: Teachers → Learning Records
2. **Verify**:
   - All records display correctly
   - Filter by week date works
   - Student names show properly
   - Memorization and review stats visible
3. **Expected Result**: ✅ Learning records displayed accurately

#### Scenario E: Permission Verification
1. **While logged as Teacher**:
   - Try to access `/accounts/transactions` URL
   - **Expected**: ✅ Redirected or access denied
2. **Verify you CANNOT see**:
   - Financial transactions
   - Student registration forms
   - Teacher management

---

### 4. Management User Testing

#### Scenario A: View Dashboard Statistics
1. **Login as**: `management` / `management123`
2. **Verify Dashboard shows**:
   - Total Students count
   - Total Teachers count
   - Total Halaqas count
   - Net Balance (Revenue - Withdrawals)
   - Learning progress metrics
   - Halaqas overview table
3. **Expected Result**: ✅ All statistics display correctly

#### Scenario B: View Students (Read-Only)
1. **Navigate to**: Management → Students
2. **Verify**:
   - "View Only" badge is visible
   - All students are listed
   - Search functionality works
   - **NO** edit/delete buttons visible
   - **NO** "Add Student" button
3. **Expected Result**: ✅ Read-only access enforced

#### Scenario C: View Teachers (Read-Only)
1. **Navigate to**: Management → Teachers
2. **Verify**:
   - "View Only" badge is visible
   - All teachers listed with details
   - Employment types displayed
   - Number of halaqas and students shown
   - **NO** edit capabilities
3. **Expected Result**: ✅ Read-only access enforced

#### Scenario D: Detailed Statistics
1. **Navigate to**: Management → Statistics
2. **Verify comprehensive metrics**:
   - **Financial Overview**:
     - Total Revenue
     - Total Withdrawals
     - Net Balance
   - **Enrollment Statistics**:
     - Student/Teacher/Halaqa counts
   - **Learning Progress Metrics**:
     - Total Memorized Days
     - Total Murajaa Days
     - Total Rubu Completed
     - Average memorized per week
   - **Halaqa Distribution**:
     - Each halaqa with student count
     - Percentage distribution
3. **Expected Result**: ✅ All statistics calculated correctly

#### Scenario E: Permission Verification
1. **While logged as Management**:
   - Try to access `/accounts/students/new`
   - **Expected**: ✅ Redirected or access denied
2. **Try to access**: `/teachers/learning-records/new`
   - **Expected**: ✅ Redirected or access denied
3. **Verify you CANNOT**:
   - Edit any student records
   - Create transactions
   - Add learning records
   - Modify teacher information
4. **Expected Result**: ✅ All write operations blocked

---

### 5. Cross-Role Permission Testing

#### Critical Security Tests

1. **Test URL Direct Access**:
   - Login as **Teacher**
   - Manually type: `http://localhost:3000/accounts/transactions/new`
   - **Expected**: ✅ Redirected to home or access denied

2. **Test API Endpoint Protection**:
   - Open browser console (F12)
   - Try to POST to `/api/transactions` while logged as Teacher
   - **Expected**: ✅ 403 Forbidden error

3. **Test Management Write Block**:
   - Login as **Management**
   - Try to access any form URL directly
   - **Expected**: ✅ Blocked or redirected

4. **Test Session Persistence**:
   - Login as any user
   - Refresh the page
   - **Expected**: ✅ Still logged in with correct role

---

### 6. Data Integrity Testing

#### Verify Relationships
1. **As Accounts**: View a student profile
   - Check if their halaqa assignment shows correctly
   - View their transaction history

2. **As Teacher**: View a halaqa
   - Verify student count matches actual students
   - Check that learning records link to correct students

3. **As Management**: View statistics
   - Verify totals match actual data counts
   - Check that financial calculations are accurate

---

### 7. UI/UX Testing

#### Navigation Flow
1. **Test all navbar links** for each role
2. **Verify breadcrumbs** or back buttons work
3. **Check form validation**:
   - Try submitting empty forms
   - Test required field validation
   - Verify error messages display

#### Responsive Design
1. **Resize browser window** to mobile size
2. **Verify**:
   - Tables are scrollable
   - Navigation adapts
   - Forms remain usable

#### Visual Indicators
1. **Check status badges**: Active/Inactive students and teachers
2. **Verify color coding**: 
   - Green for income/success
   - Red for withdrawals/errors
   - Blue for info
3. **Confirm loading states** appear during data fetching

---

## Sample Test Data Included

The seeded database includes:

### Users
- 3 test users (one per role)

### Teachers
- Ahmad Khan (Male, Full-time)
- Fatima Ahmed (Female, Part-time)

### Students
- Ali Muhammad Hassan (Halaqa: Beginners Group A)
- Aisha Ibrahim Ali (Halaqa: Beginners Group A)
- Omar Abdullah Yusuf (Halaqa: Intermediate Group B)
- Zainab Umar Malik (Halaqa: Intermediate Group B)

### Halaqas
- Beginners Group A (Teacher: Ahmad Khan)
- Intermediate Group B (Teacher: Fatima Ahmed)

### Transactions
- 5 fee payments (registration, school, uniform)
- 1 withdrawal

### Learning Records
- 3 weekly learning records with complete data

---

## Expected System Behavior Summary

### ✅ Accounts Users CAN:
- Register and manage students
- Add and manage teachers
- Record all types of transactions
- View financial reports
- Search and filter students

### ❌ Accounts Users CANNOT:
- View or edit learning records
- Access teacher-specific features
- View detailed statistics

### ✅ Teachers CAN:
- Create and manage halaqas
- Assign students to halaqas
- Record weekly learning progress
- View their students' learning records
- Track memorization and review

### ❌ Teachers CANNOT:
- View financial information
- Register students
- Access transaction records
- Manage other teachers

### ✅ Management CAN:
- View all students (read-only)
- View all teachers (read-only)
- View comprehensive statistics
- See learning progress metrics
- View financial reports

### ❌ Management CANNOT:
- Edit any student information
- Modify teacher profiles
- Create or edit transactions
- Add learning records
- Make any changes to data

---

## Quick Verification Checklist

- [ ] All 3 test users can login successfully
- [ ] Each role sees appropriate navbar and pages
- [ ] Accounts can register new students
- [ ] Accounts can add new teachers
- [ ] Accounts can record all transaction types
- [ ] Teachers can create halaqas
- [ ] Teachers can assign students to halaqas
- [ ] Teachers can add learning records
- [ ] Management sees dashboard statistics
- [ ] Management has read-only access to students
- [ ] Management has read-only access to teachers
- [ ] Management sees detailed statistics page
- [ ] Cross-role permission blocks work
- [ ] Search/filter features work
- [ ] Forms validate required fields
- [ ] Data relationships display correctly
- [ ] Responsive design works on mobile

---

## Troubleshooting

### Issue: Cannot login
- **Solution**: Verify database was seeded correctly. Run `npm run db:seed`

### Issue: Page shows "Unauthorized"
- **Solution**: Clear browser cookies, logout, and login again

### Issue: Data not showing
- **Solution**: Check browser console (F12) for errors. Verify API endpoints are responding.

### Issue: Server not running
- **Solution**: Check terminal. Run `npm run dev` if needed.

---

## Next Steps After Testing

1. **Report any bugs or issues** you discover
2. **Verify all critical features** work as expected
3. **Test edge cases** (empty data, long names, etc.)
4. **Check performance** with larger datasets
5. **Prepare for production** deployment if testing is successful

---

**Testing completed on**: [Date]
**System Status**: ✅ Ready for verification
**Server URL**: http://localhost:3000

