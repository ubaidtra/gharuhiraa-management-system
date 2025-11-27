# Setup Script for MongoDB Migration
Write-Host "Setting up MongoDB for Cave of Hiraa Management System..." -ForegroundColor Cyan

# Set environment variables
Write-Host "`nSetting environment variables..." -ForegroundColor Yellow
$env:DATABASE_URL = 'mongodb+srv://traubaid:ubaid281986@cluster0.cevggcp.mongodb.net/ubaitech_portio?retryWrites=true&w=majority'
$env:NEXTAUTH_URL = 'http://localhost:8001'
$env:NEXTAUTH_SECRET = 'cave-of-hiraa-secret-key-change-in-production'
$env:PORT = '8001'

# Create .env file
Write-Host "`nCreating .env file..." -ForegroundColor Yellow
$envContent = @'
DATABASE_URL="mongodb+srv://traubaid:ubaid281986@cluster0.cevggcp.mongodb.net/ubaitech_portio?retryWrites=true&w=majority"
NEXTAUTH_URL=http://localhost:8001
NEXTAUTH_SECRET=cave-of-hiraa-secret-key-change-in-production
PORT=8001
'@

$envContent | Out-File -FilePath ".env" -Encoding UTF8 -Force

Write-Host ".env file created successfully" -ForegroundColor Green

# Remove old Prisma client
Write-Host "`nRemoving old Prisma client..." -ForegroundColor Yellow
if (Test-Path "node_modules\.prisma") {
    Remove-Item -Recurse -Force "node_modules\.prisma" -ErrorAction SilentlyContinue
}
Write-Host "Old client removed" -ForegroundColor Green

# Regenerate Prisma client
Write-Host "`nGenerating Prisma client for MongoDB..." -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "Prisma client generated successfully" -ForegroundColor Green
    
    # Push schema to MongoDB
    Write-Host "`nPushing schema to MongoDB..." -ForegroundColor Yellow
    npx prisma db push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Schema pushed to MongoDB successfully" -ForegroundColor Green
        
        # Seed database
        Write-Host "`nSeeding database with test data..." -ForegroundColor Yellow
        npx tsx prisma/seed.ts
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`nDatabase seeded successfully!" -ForegroundColor Green
            Write-Host "`nSetup complete!" -ForegroundColor Cyan
            Write-Host "`nTest Credentials:" -ForegroundColor Yellow
            Write-Host "  Management: username=management, password=management123"
            Write-Host "  Accounts:   username=accounts, password=accounts123"
            Write-Host "  Teacher:    username=teacher, password=teacher123"
            Write-Host "`nStart the server with: npm run dev" -ForegroundColor Cyan
            Write-Host "Access at: http://localhost:8001" -ForegroundColor Cyan
        } else {
            Write-Host "Failed to seed database" -ForegroundColor Red
        }
    } else {
        Write-Host "Failed to push schema" -ForegroundColor Red
    }
} else {
    Write-Host "Failed to generate Prisma client" -ForegroundColor Red
}

