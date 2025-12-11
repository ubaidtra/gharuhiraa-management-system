# Fix NEXTAUTH_URL in Vercel

Write-Host "Fixing NEXTAUTH_URL..." -ForegroundColor Yellow

# Remove old NEXTAUTH_URL
Write-Host "Removing old NEXTAUTH_URL..." -ForegroundColor Cyan
vercel env rm NEXTAUTH_URL production --yes
vercel env rm NEXTAUTH_URL preview --yes
vercel env rm NEXTAUTH_URL development --yes

# Add correct NEXTAUTH_URL
Write-Host "Adding correct NEXTAUTH_URL..." -ForegroundColor Cyan
$nextAuthUrl = "https://gharuhiraa-management-system-5tdiztd5x.vercel.app"

# Add for each environment
Write-Host "Adding for Production..." -ForegroundColor Green
echo $nextAuthUrl | vercel env add NEXTAUTH_URL production

Write-Host "Adding for Preview..." -ForegroundColor Green
echo $nextAuthUrl | vercel env add NEXTAUTH_URL preview

Write-Host "Adding for Development..." -ForegroundColor Green
echo $nextAuthUrl | vercel env add NEXTAUTH_URL development

Write-Host "`n✅ NEXTAUTH_URL updated successfully!" -ForegroundColor Green
Write-Host "`nNext step: Redeploy your application" -ForegroundColor Yellow
Write-Host "Run: vercel --prod" -ForegroundColor Cyan

