# Git Push with Approval Script
# Use this script to review changes before pushing to GitHub

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  GIT PUSH APPROVAL WORKFLOW" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if there are uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "📝 You have uncommitted changes:" -ForegroundColor Yellow
    Write-Host ""
    git status --short
    Write-Host ""
    
    $commit = Read-Host "Do you want to commit these changes? (y/n)"
    
    if ($commit -eq 'y' -or $commit -eq 'Y') {
        Write-Host "`nEnter commit message:" -ForegroundColor Green
        $message = Read-Host
        
        git add -A
        git commit -m $message
        Write-Host "✓ Changes committed" -ForegroundColor Green
    } else {
        Write-Host "❌ Cancelled. No changes committed." -ForegroundColor Red
        exit
    }
}

# Show what will be pushed
Write-Host "`n📊 Changes to be pushed:" -ForegroundColor Cyan
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray
git log origin/main..HEAD --oneline --decorate
Write-Host "─────────────────────────────────────────`n" -ForegroundColor Gray

# Show detailed diff
Write-Host "📄 Detailed changes:" -ForegroundColor Cyan
$showDiff = Read-Host "Show detailed file changes? (y/n)"
if ($showDiff -eq 'y' -or $showDiff -eq 'Y') {
    git diff origin/main..HEAD --stat
    Write-Host ""
}

# Test local site
Write-Host "`n🧪 Testing local site..." -ForegroundColor Cyan
$testLocal = Read-Host "Open local site to test? (y/n)"
if ($testLocal -eq 'y' -or $testLocal -eq 'Y') {
    Start-Process "file://$PSScriptRoot/index.html"
    Write-Host "✓ Local site opened in browser" -ForegroundColor Green
    Write-Host "   Please test the site before continuing..." -ForegroundColor Yellow
    Read-Host "`nPress ENTER when testing is complete"
}

# Final confirmation
Write-Host "`n⚠️  FINAL CONFIRMATION" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray
Write-Host "This will push changes to GitHub and trigger Azure deployment." -ForegroundColor White
Write-Host "─────────────────────────────────────────" -ForegroundColor Gray

$confirm = Read-Host "`nProceed with push to GitHub? (yes/no)"

if ($confirm -eq 'yes') {
    Write-Host "`n🚀 Pushing to GitHub..." -ForegroundColor Green
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
        Write-Host "   Azure deployment will begin in a few seconds..." -ForegroundColor Cyan
        Write-Host "   Monitor at: https://github.com/Ofiya/Website/actions`n" -ForegroundColor Cyan
    } else {
        Write-Host "`n❌ Push failed! Check error message above." -ForegroundColor Red
    }
} else {
    Write-Host "`n❌ Push cancelled. Changes remain local only." -ForegroundColor Red
}

Write-Host "`n========================================`n" -ForegroundColor Cyan
