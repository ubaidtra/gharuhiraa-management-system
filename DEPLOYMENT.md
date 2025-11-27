# Deployment Guide - Gharu Hiraa School Management System

Complete guide to deploy the Gharu Hiraa School Management System.

---

## Prerequisites

Before deployment, ensure you have:

- ✅ Node.js 18.x or higher installed
- ✅ MongoDB Atlas account (free tier available)
- ✅ Git installed
- ✅ GitHub account

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ubaidtra/Gharu-Hiraa.git
cd Gharu-Hiraa
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Your MongoDB Atlas connection string
DATABASE_URL="mongodb+srv://your-username:your-password@cluster.mongodb.net/gharu-hiraa?retryWrites=true&w=majority"

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-secure-random-secret"

# Local development URL
NEXTAUTH_URL="http://localhost:8001"

# Port
PORT=8001
```

### 4. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed initial data (optional)
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:8001`

---

## Default User Accounts

After seeding, these accounts are available:

| Role | Username | Password | Access |
|------|----------|----------|--------|
| **Director** | `management` | `management123` | Full read access to all data |
| **Accounts and Admin** | `accounts` | `accounts123` | Full control over students, teachers, transactions |
| **Teacher** | `teacher` | `teacher123` | Manage assigned Halaqas and learning records |

**⚠️ IMPORTANT**: Change these passwords in production!

---

## Production Deployment

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### Steps:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Import Project"
   - Select `ubaidtra/Gharu-Hiraa`

3. **Configure Environment Variables**:
   Add these in Vercel dashboard:
   - `DATABASE_URL` - Your MongoDB connection string
   - `NEXTAUTH_SECRET` - Generate a new secret
   - `NEXTAUTH_URL` - Your production URL (e.g., `https://gharu-hiraa.vercel.app`)

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live!

#### Vercel Settings:
```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
```

---

### Option 2: Railway

Railway provides easy deployment with built-in MongoDB support.

#### Steps:

1. **Push to GitHub** (same as above)

2. **Deploy to Railway**:
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `ubaidtra/Gharu-Hiraa`

3. **Add MongoDB**:
   - Click "New"
   - Select "Database" → "MongoDB"
   - Railway will provide connection string

4. **Configure Environment Variables**:
   - `DATABASE_URL` - Use Railway's MongoDB connection string
   - `NEXTAUTH_SECRET` - Generate new secret
   - `NEXTAUTH_URL` - Your Railway URL
   - `PORT` - 8001 (optional)

5. **Deploy**:
   - Railway auto-deploys on git push

---

### Option 3: Self-Hosted (VPS)

For deploying on your own server (e.g., DigitalOcean, AWS, Azure).

#### Requirements:
- Ubuntu 20.04+ or similar
- Node.js 18+
- Nginx (for reverse proxy)
- PM2 (for process management)

#### Steps:

1. **Setup Server**:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

2. **Clone and Setup**:
```bash
cd /var/www
git clone https://github.com/ubaidtra/Gharu-Hiraa.git
cd Gharu-Hiraa

# Install dependencies
npm install

# Setup environment
cp .env.example .env
nano .env  # Edit with production values

# Build application
npm run build
```

3. **Setup PM2**:
```bash
# Start application
pm2 start npm --name "gharu-hiraa" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

4. **Configure Nginx**:
```bash
sudo nano /etc/nginx/sites-available/gharu-hiraa
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/gharu-hiraa /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. **Setup SSL (Optional but Recommended)**:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Database Configuration

### MongoDB Atlas Setup

1. **Create Cluster**:
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create free cluster
   - Choose region closest to your users

2. **Create Database User**:
   - Database Access → Add New User
   - Choose password authentication
   - Save username and password

3. **Whitelist IP**:
   - Network Access → Add IP Address
   - For development: Add your IP
   - For production: Add `0.0.0.0/0` (allow from anywhere)

4. **Get Connection String**:
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your actual password
   - Replace `<database>` with `gharu-hiraa` or your preferred name

---

## Security Checklist

Before going to production:

### Environment Variables
- [ ] Change all default passwords
- [ ] Generate new `NEXTAUTH_SECRET`
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Secure MongoDB connection string

### Database Security
- [ ] Create strong database password
- [ ] Enable IP whitelist on MongoDB Atlas
- [ ] Enable MongoDB authentication
- [ ] Backup database regularly

### Application Security
- [ ] Review and update default user passwords
- [ ] Test all authentication flows
- [ ] Verify role-based access control
- [ ] Test file upload security

### Server Security (Self-Hosted)
- [ ] Enable firewall (UFW)
- [ ] Setup SSL certificate
- [ ] Configure automatic security updates
- [ ] Setup monitoring and logging

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MongoDB connection string | `mongodb+srv://...` |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Random 32-char string |
| `NEXTAUTH_URL` | Application URL | `https://your-domain.com` |
| `PORT` | Server port (optional) | `8001` |

---

## Post-Deployment Tasks

After successful deployment:

### 1. Change Default Passwords
```
Login as each default user and change passwords:
- Director (management)
- Accounts (accounts)
- Teacher (teacher)
```

### 2. Create Real Users
```
- Add actual teacher accounts
- Assign teachers to Halaqas
- Configure Halaqas for school structure
```

### 3. Test Features
- [ ] User authentication
- [ ] Student registration
- [ ] Teacher management
- [ ] Halaqa assignment
- [ ] Learning records
- [ ] Transactions (payments/withdrawals)
- [ ] Report generation
- [ ] Receipt printing

### 4. Setup Backups
```
- Configure automated database backups
- Test restore procedures
- Document backup locations
```

---

## Continuous Deployment

### Auto-Deploy from GitHub

**Vercel/Railway**:
- Automatic deployment on git push to main branch
- Preview deployments for pull requests

**Manual Deployment**:
```bash
# On your server
cd /var/www/Gharu-Hiraa
git pull origin main
npm install
npm run build
pm2 restart gharu-hiraa
```

---

## Monitoring and Maintenance

### Application Monitoring
- Monitor server uptime
- Track error logs
- Monitor database performance
- Setup alerts for critical issues

### Regular Maintenance
- Keep dependencies updated: `npm update`
- Monitor disk space (especially for uploads)
- Review and archive old records
- Backup database regularly

---

## Troubleshooting

### Build Errors

**Issue**: Prisma client not generated
```bash
npx prisma generate
```

**Issue**: Database connection failed
```bash
# Test connection
npx prisma db push
```

### Runtime Errors

**Issue**: Session errors
```bash
# Clear cookies and login again
# Verify NEXTAUTH_SECRET is set
```

**Issue**: File upload errors
```bash
# Ensure uploads directory exists
mkdir -p public/uploads/checks
chmod 755 public/uploads/checks
```

---

## Support and Documentation

### Resources
- **Main README**: [README.md](./README.md)
- **Features Guide**: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
- **Reports System**: [REPORTS_SYSTEM_COMPLETE.md](./REPORTS_SYSTEM_COMPLETE.md)
- **Currency Info**: [CURRENCY_UPDATE_COMPLETE.md](./CURRENCY_UPDATE_COMPLETE.md)

### GitHub Repository
- Repository: https://github.com/ubaidtra/Gharu-Hiraa.git
- Issues: Report bugs and request features
- Discussions: Community support

---

## License

Proprietary - Gharu Hiraa School for Quranic Memorization

---

## Quick Deployment Checklist

- [ ] Clone repository
- [ ] Install dependencies (`npm install`)
- [ ] Configure `.env` file
- [ ] Setup MongoDB Atlas
- [ ] Run `npx prisma db push`
- [ ] Seed database (`npm run db:seed`)
- [ ] Build application (`npm run build`)
- [ ] Deploy to hosting platform
- [ ] Configure environment variables
- [ ] Test deployment
- [ ] Change default passwords
- [ ] Setup backups
- [ ] Monitor application

---

**Your Gharu Hiraa School Management System is ready for deployment!**

