# Testing Guide

## Local URL

- Development: `http://localhost:5008`

## Automated Checks

Run these before manual testing:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Manual UAT

### 1. Bootstrap
1. Open `/signup` on a fresh database.
2. Confirm only `Accounts & Admin` can be created as the first user.
3. Create the first account and verify automatic sign-in lands on `/accounts`.

### 2. Accounts admin workflow
1. Log in as an Accounts user.
2. Create a teacher profile in `Accounts -> Teachers`.
3. Open `Accounts -> User Management`.
4. Create:
   - one `MANAGEMENT` user
   - one `TEACHER` user linked to the teacher profile
5. Change a username and reset a password from the same screen.
6. Verify the Accounts settings page allows password change.

### 3. Student and halaqa workflow
1. Create a student.
2. Create a halaqa and assign the teacher profile.
3. Verify the student can be attached to the halaqa.
4. Confirm the teacher now sees the assigned halaqa.

### 4. Transaction and withdrawal workflow
1. Record a payment with a receipt image.
2. Open the payment receipt page and verify the uploaded image renders.
3. Record a withdrawal with a receipt image.
4. Open `Accounts -> Withdrawals` and verify the uploaded evidence link opens.

### 5. Teacher workflow
1. Log in as the linked teacher user.
2. Verify access to:
   - `Teachers -> My Halaqa`
   - `Teachers -> Learning Records`
   - `Teachers -> Reports`
3. Create a learning record for a student in the assigned halaqa.
4. Submit a report.

### 6. Management workflow
1. Log in as the Management user.
2. Verify the dashboard, statistics, financial reports, and reports pages load.
3. Open the management settings page and verify password change works.
4. Open the teacher report and verify read-only oversight is preserved.

### 7. Permission boundaries
Verify these direct URL checks:

- Accounts cannot access teacher-only pages.
- Teachers cannot access accounts transaction pages.
- Management cannot access create or edit flows in accounts or teacher areas.

## Release Sign-Off

Consider a release ready when:

- lint, typecheck, tests, and build all pass
- receipt uploads persist through Supabase Storage
- Accounts can create and link users without manual database edits
- all settings pages are functional
- role-based manual UAT completes without blockers
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

