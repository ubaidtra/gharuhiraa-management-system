# Supabase Database Setup

## Environment Variables Configuration

### Required Environment Variables

Update your `.env.local` file with the following Supabase connection string:

```env
# Database - Supabase PostgreSQL
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# NextAuth
NEXTAUTH_URL=http://localhost:8001
NEXTAUTH_SECRET=cave-of-hiraa-secret-key-change-in-production

# Port Configuration
PORT=8001
```

## How to Get Your Supabase Connection String

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Sign in to your account

2. **Select Your Project:**
   - Click on your project (or create a new one)

3. **Get Connection String:**
   - Go to **Settings** → **Database**
   - Scroll to **Connection string** section
   - Select **URI** tab
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your database password

4. **Connection String Format:**
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

5. **For Production (Recommended):**
   Add `?pgbouncer=true&connection_limit=1` to the end:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
   ```

## Initialize Database

After setting up your environment variables:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to Supabase
npx prisma db push

# Seed database with initial data
npm run db:seed
```

## Verify Connection

Test your connection:

```bash
npx prisma db push
```

If successful, you should see:
```
✔ Generated Prisma Client
✔ Database schema is up to date
```

## Migration Notes

- ✅ All MongoDB-specific code has been removed
- ✅ Schema converted from MongoDB to PostgreSQL
- ✅ IDs changed from ObjectId to UUID
- ✅ All scripts updated to use Prisma (no direct MongoDB access)

## Troubleshooting

### Connection Issues

1. **Check your password:**
   - Ensure `[YOUR-PASSWORD]` is replaced with your actual Supabase database password

2. **Check project reference:**
   - Verify the project reference in the connection string matches your Supabase project

3. **Network access:**
   - Supabase allows connections by default, but check if you have IP restrictions enabled

### Common Errors

- **"Connection refused":** Check your connection string format
- **"Authentication failed":** Verify your database password
- **"Database does not exist":** The database `postgres` should exist by default in Supabase

