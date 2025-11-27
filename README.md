# Gharu Hiraa - School Management System

> A comprehensive management system for Gharu Hiraa School for Quranic Memorization

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.18-2D3748?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)

A modern, full-featured school management system built specifically for Gharu Hiraa School for Quranic Memorization. Manage students, teachers, Halaqas, financial transactions, learning records, and comprehensive reporting - all in one place.

## ✨ Key Features

### 👥 User Management
- **Three Role Types**: Director, Accounts & Admin, Teachers
- Secure authentication with NextAuth.js
- Role-based access control and permissions

### 📚 Student Management
- Student registration with unique IDs (STU-YYYY-NNNN)
- Complete student profiles with photos
- Halaqa assignment tracking
- Learning progress monitoring
- Search by ID or name

### 👨‍🏫 Teacher Management
- Teacher profiles with unique IDs (TCH-YYYY-NNN)
- Halaqa assignment
- Employment type tracking
- Performance monitoring

### 🕌 Halaqa Management
- Create and manage study circles
- Assign teachers and students
- Track student levels
- Monitor attendance and progress

### 💰 Financial Management
- **Payments**: Registration fees, school fees, uniform fees
- **Withdrawals**: Track all expenses separately
- **Currency**: Gambian Dalasi (GMD)
- Receipt generation and printing
- Photo uploads for checks
- Transaction history

### 📊 Learning Records
- Weekly progress tracking
- Memorization tracking (Hifz)
- Review (Murajaa) monitoring
- Attendance recording
- Performance notes

### 📝 Teacher Reports (NEW!)
- **Weekly Reports**: Teachers submit end-of-week summaries
- **Monthly Reports**: Comprehensive monthly updates
- Director can view all reports with filters
- Read/Unread status tracking
- Professional report interface

### 🔒 Security
- Encrypted passwords (bcrypt)
- Session-based authentication
- API route protection
- Role-based middleware

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB Atlas (via Prisma ORM)
- **Authentication**: NextAuth.js
- **Styling**: TailwindCSS
- **Deployment**: Vercel-ready

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git (optional)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/ubaidtra/Gharu-Hiraa.git
cd Gharu-Hiraa
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example file and configure:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database
DATABASE_URL="your_mongodb_connection_string"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:8001"

# Port (optional, defaults to 3000)
PORT=8001
```

### 3. Setup Database

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:8001**

## Default User Accounts

### Management (Read-Only Oversight)
- **Username**: `management`
- **Password**: `management123`
- **Access**: View all data, statistics, and reports

### Accounts (Full Administrative)
- **Username**: `accounts`
- **Password**: `accounts123`
- **Access**: Manage students, teachers, payments, expenses, halaqas

### Teacher (Educational Operations)
- **Username**: `teacher`
- **Password**: `teacher123`
- **Access**: Manage assigned halaqas, record learning progress

## Project Structure

```
cave-of-hiraa-management/
├── app/                      # Next.js App Router pages
│   ├── accounts/            # Accounts role pages
│   ├── teachers/            # Teacher role pages
│   ├── management/          # Management role pages
│   ├── api/                 # API routes
│   └── login/               # Login page
├── components/              # Reusable React components
├── lib/                     # Utility functions and configs
├── prisma/                  # Database schema and seed
└── public/                  # Static assets
```

## Key Features

### For Accounts Users
- Register and manage students
- Add and manage teachers
- Record student fee payments
- Record school expenses (withdrawals)
- Create and manage halaqas
- Print transaction receipts
- View financial summaries

### For Teachers
- View assigned halaqas
- Add/remove students in halaqas
- Record student learning progress
- Track memorization achievements

### For Management
- View all students and teachers
- Access financial statistics
- Monitor halaqa distribution
- Generate reports

## Database Schema

### Main Models
- **User**: System users (management, accounts, teachers)
- **Student**: Student profiles and registration data
- **Teacher**: Teacher profiles and employment details
- **Halaqa**: Study circles with teacher assignment
- **Transaction**: Fee payments and expense records
- **LearningRecord**: Quran memorization progress tracking

## Scripts

```bash
# Development
npm run dev              # Start development server

# Production
npm run build            # Build for production
npm start                # Start production server

# Database
npm run db:push          # Push schema changes to database
npm run db:seed          # Seed database with test data
npm run db:studio        # Open Prisma Studio (database GUI)
npm run db:reset         # Reset and reseed database

# Combined Setup
npm run db:setup         # Install, generate, push, and seed
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MongoDB connection string | `mongodb+srv://...` |
| `NEXTAUTH_SECRET` | Secret key for JWT | `your-secret-key` |
| `NEXTAUTH_URL` | Application URL | `http://localhost:8001` |
| `PORT` | Server port (optional) | `8001` |

## Permissions Overview

| Feature | Management | Accounts | Teacher |
|---------|-----------|----------|---------|
| View Students | Read-Only | Full | Read-Only |
| Register Student | No | Yes | No |
| View Teachers | Read-Only | Full | No |
| Add Teacher | No | Yes | No |
| View Halaqas | Read-Only | Full | Own Only |
| Create Halaqa | No | Yes | No |
| Manage Students in Halaqa | No | No | Yes |
| View Transactions | Read-Only | Full | No |
| Record Payment | No | Yes | No |
| Record Expense | No | Yes | No |
| Record Learning Progress | No | No | Yes |
| View Statistics | Yes | Yes | No |

## API Routes

### Students
- `GET /api/students` - List all students
- `POST /api/students` - Create new student
- `GET /api/students/[id]` - Get student by ID
- `PUT /api/students/[id]` - Update student
- `DELETE /api/students/[id]` - Delete student

### Teachers
- `GET /api/teachers` - List all teachers
- `POST /api/teachers` - Create new teacher
- `GET /api/teachers/[id]` - Get teacher by ID
- `PUT /api/teachers/[id]` - Update teacher
- `DELETE /api/teachers/[id]` - Delete teacher

### Halaqas
- `GET /api/halaqas` - List all halaqas
- `POST /api/halaqas` - Create new halaqa (Accounts only)
- `GET /api/halaqas/[id]` - Get halaqa by ID
- `PUT /api/halaqas/[id]` - Update halaqa (Accounts only)
- `DELETE /api/halaqas/[id]` - Delete halaqa (Accounts only)
- `POST /api/halaqas/[id]/students` - Add student to halaqa
- `DELETE /api/halaqas/[id]/students` - Remove student from halaqa

### Transactions
- `GET /api/transactions` - List all transactions
- `POST /api/transactions` - Create new transaction

### Learning Records
- `GET /api/learning-records` - List all learning records
- `POST /api/learning-records` - Create new learning record

### Statistics
- `GET /api/statistics` - Get system statistics

## Troubleshooting

### Port Already in Use
If port 8001 is already in use, you can:
1. Change the PORT in `.env` file
2. Update scripts in `package.json` to use the new port

### Database Connection Issues
1. Check your `DATABASE_URL` in `.env`
2. Ensure MongoDB Atlas allows connections from your IP
3. Verify database credentials are correct

### Prisma Generation Errors
1. Delete `node_modules` and reinstall: `npm install --legacy-peer-deps`
2. Manually run: `npx prisma generate`
3. Check Prisma version compatibility (using 5.18.0)

## Development

### Adding a New Feature
1. Create API route in `app/api/`
2. Create page component in appropriate role folder
3. Update navigation in `components/Navbar.tsx`
4. Add permissions check in `middleware.ts`
5. Test with all user roles

### Database Changes
1. Update `prisma/schema.prisma`
2. Run `npx prisma db push`
3. Update seed data in `prisma/seed.ts`
4. Run `npm run db:seed`

## Production Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
1. Build the project: `npm run build`
2. Start the server: `npm start`
3. Ensure environment variables are set
4. Configure reverse proxy if needed

## Support

For issues or questions:
1. Check existing documentation
2. Review error logs in terminal
3. Verify environment configuration
4. Check MongoDB connection

## License

Proprietary - Gharu Hiraa School for Quranic Memorization

## Version

Current Version: 1.0.0

Last Updated: November 2025
