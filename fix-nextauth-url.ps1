$envFile = ".env.local"
if (Test-Path $envFile) {
    $content = Get-Content $envFile -Raw
    $content = $content -replace "NEXTAUTH_URL=http://localhost:8001", "NEXTAUTH_URL=http://localhost:5008"
    $content = $content -replace "PORT=8001", "PORT=5008"
    Set-Content -Path $envFile -Value $content -NoNewline
    Write-Host "✅ Updated NEXTAUTH_URL and PORT to 5008 in .env.local"
    Write-Host "⚠️  Please restart your server (Ctrl+C, then 'npm run dev')"
} else {
    Write-Host "❌ .env.local file not found"
}
