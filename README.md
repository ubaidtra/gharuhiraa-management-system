# Gharu Hiraa - School Management System

School management system for Gharu Hiraa School for Quranic Memorization.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Supabase (PostgreSQL)
- NextAuth.js (Credentials + JWT)
- TailwindCSS

## Setup

1. Install: `npm install`
2. Copy `.env.example` to `.env.local` and fill Supabase credentials
3. Run `supabase/schema.sql` in Supabase SQL Editor
4. Start: `npm run dev` (port 5008)
5. Create first user at `/signup` (enabled only when no users exist)

## Roles

- **ACCOUNTS**: Full CRUD on students, teachers, halaqas, transactions
- **TEACHER**: Manage assigned halaqas, learning records, reports
- **MANAGEMENT**: Read-only oversight, statistics, financial reports

## Project Structure

- `app/` - Pages and API routes
- `components/` - Shared UI
- `lib/` - Auth, Supabase, utils
- `supabase/schema.sql` - Database schema

## Scripts

- `npm run dev` - Development (port 5008)
- `npm run build` - Production build
- `npm start` - Production server
