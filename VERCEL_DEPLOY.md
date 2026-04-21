# Vercel Deployment

## Required Environment Variables

Add these in Vercel project settings for Production, Preview, and Development:

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Required for protected server writes and bucket management |
| `NEXTAUTH_URL` | Yes | Production URL, for example `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Yes | Generate a secure random secret |
| `SUPABASE_STORAGE_BUCKET` | No | Defaults to `receipts` |

Generate a secret locally:

```bash
openssl rand -base64 32
```

## Storage Notes

- Receipt and withdrawal evidence uploads use Supabase Storage.
- The app expects a public bucket, default name `receipts`.
- If the service role key has permission, the upload route will create the bucket automatically on first upload.
- If your Supabase policy setup blocks automatic creation, create the bucket manually and keep it public.

## Deploy Steps

1. Push the latest code.
2. Open the project in [Vercel Dashboard](https://vercel.com/dashboard).
3. Add the environment variables above.
4. Redeploy the latest commit.

Or with the CLI:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
vercel env add SUPABASE_STORAGE_BUCKET
vercel --prod
```

## Post-Deploy Smoke Check

After deploy, verify:

1. `/login` loads successfully.
2. First login redirects to the correct dashboard.
3. Accounts can create a user and link a teacher profile.
4. Payment receipt upload works and the saved image opens.
5. Withdrawal upload works and the saved image opens.
6. Management reports and financial reports load without auth errors.

## Recommended CI Commands

Run these before promoting a release:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```
