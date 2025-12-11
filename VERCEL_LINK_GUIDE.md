# Linking Project to Vercel

You need to link your local project to a Vercel project before you can pull environment variables.

---

## Option 1: Link to Existing Vercel Project

If you already have a project deployed on Vercel:

```powershell
# Link to existing project
vercel link

# When prompted:
# - Set up this directory? → Yes (Y)
# - Which scope? → Select your account/team
# - Link to existing project? → Yes (Y)
# - What's the name of your existing project? → Enter your project name
```

---

## Option 2: Create New Vercel Project

If you don't have a project yet, create one:

```powershell
# Link and create new project
vercel link

# When prompted:
# - Set up this directory? → Yes (Y)
# - Which scope? → Select your account/team
# - Link to existing project? → No (N)
# - What's your project's name? → gharuhiraa-management-system (or your choice)
# - In which directory is your code located? → ./ (current directory)
```

---

## After Linking

Once linked, you can:

### Pull Environment Variables:
```powershell
vercel env pull .env.local
```

This will create a `.env.local` file with your Vercel environment variables.

### Deploy:
```powershell
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## Alternative: Use Vercel Dashboard

If CLI linking is problematic, you can:

1. **Go to Vercel Dashboard:**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Select `ubaidtra/gharuhiraa-management-system`
   - Click "Import"

3. **Configure Environment Variables:**
   - Go to Settings → Environment Variables
   - Add your variables there

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically deploy from GitHub

---

## Troubleshooting

### Error: "Project was deleted or transferred"
- The project might have been deleted or moved
- Create a new project using Option 2 above

### Error: "Not linked to a project"
- Run `vercel link` first
- Or deploy via Vercel Dashboard instead

### Can't find project
- Make sure you're logged in: `vercel login`
- Check you're in the right team/scope

---

## Recommended Approach

**For first-time deployment, use Vercel Dashboard:**
1. It's easier and more visual
2. You can configure everything in one place
3. No need to link locally first

**For ongoing development, use CLI:**
1. After project is created on Vercel
2. Link locally: `vercel link`
3. Pull env vars: `vercel env pull .env.local`
4. Deploy: `vercel --prod`

---

**Choose the option that works best for you!**

