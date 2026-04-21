# Project Summary

## Current Status

The project is now aligned around the live stack and deployment model:

- Next.js 16
- React 19
- TypeScript
- NextAuth credentials authentication
- Supabase PostgreSQL
- Supabase Storage for receipt uploads
- Tailwind CSS
- Vitest smoke tests

## Completed Product Areas

### Accounts
- Student registration and management
- Teacher registration and management
- Halaqa management
- Payment recording
- Withdrawal recording
- User creation, password reset, username update, and teacher-profile linking
- Working settings page with password change and operations summary

### Teachers
- Dashboard
- Halaqa views
- Learning record entry
- Report submission and detail views

### Management
- Dashboard
- Students and teachers read-only views
- Statistics dashboard
- Financial reporting
- Teacher report review
- Working settings page with password change and oversight summary

## Operational Improvements Added

- Next 16 compatible lint script and flat ESLint configuration
- Dedicated `typecheck` script
- Durable receipt uploads using Supabase Storage
- First-user bootstrap restricted to an Accounts admin so setup can continue inside the app
- Smoke tests for validation and receipt-upload rules
- Updated deployment and testing documentation

## Important Notes

- The primary setup docs are now [`README.md`](README.md), [`VERCEL_DEPLOY.md`](VERCEL_DEPLOY.md), and [`TESTING_GUIDE.md`](TESTING_GUIDE.md).
- Historical migration and deployment markdown files in the repo should be treated as archival context, not the canonical setup path.

## Release Checklist

Before shipping a release, run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Then complete the manual UAT steps in [`TESTING_GUIDE.md`](TESTING_GUIDE.md).

