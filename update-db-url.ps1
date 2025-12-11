# PowerShell script to update DATABASE_URL in Vercel

Write-Host "Updating DATABASE_URL in Vercel..." -ForegroundColor Yellow

# Remove existing DATABASE_URL
Write-Host "Removing old DATABASE_URL..." -ForegroundColor Cyan
vercel env rm DATABASE_URL production --yes
vercel env rm DATABASE_URL preview --yes
vercel env rm DATABASE_URL development --yes

# Add new DATABASE_URL with correct format
Write-Host "Adding new DATABASE_URL..." -ForegroundColor Cyan
$dbUrl = "mongodb+srv://ubaidtrawally:ubaidtrawally.281986@cluster0.lxszwnk.mongodb.net/gharu-hiraa?retryWrites=true&w=majority"

# Add for each environment
Write-Host "Adding for Production..." -ForegroundColor Green
echo $dbUrl | vercel env add DATABASE_URL production

Write-Host "Adding for Preview..." -ForegroundColor Green
echo $dbUrl | vercel env add DATABASE_URL preview

Write-Host "Adding for Development..." -ForegroundColor Green
echo $dbUrl | vercel env add DATABASE_URL development

Write-Host "`n✅ DATABASE_URL updated successfully!" -ForegroundColor Green
Write-Host "`nNext step: Redeploy your application" -ForegroundColor Yellow
Write-Host "Run: vercel --prod" -ForegroundColor Cyan

