# PowerShell script to remove API key from git history
# コミット履歴からAPIキーを削除するスクリプト

Write-Host "コミット履歴からAPIキーを削除します..." -ForegroundColor Yellow
Write-Host ""

# 現在のブランチを確認
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "現在のブランチ: $currentBranch" -ForegroundColor Cyan

# バックアップの確認
Write-Host ""
Write-Host "警告: この操作はコミット履歴を書き換えます。" -ForegroundColor Red
Write-Host "続行する前に、リポジトリのバックアップを推奨します。" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "続行しますか？ (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "操作をキャンセルしました。" -ForegroundColor Yellow
    exit
}

# APIキーを含むファイルの履歴を修正
Write-Host ""
Write-Host "コミット履歴を修正しています..." -ForegroundColor Cyan

# git filter-branchを使用してAPIキーを含むコミットを修正
git filter-branch --force --index-filter `
    "git rm --cached --ignore-unmatch frontend/src/pages/DemandForecasting.tsx" `
    --prune-empty --tag-name-filter cat -- --all

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "コミット履歴の修正が完了しました。" -ForegroundColor Green
    Write-Host ""
    Write-Host "次のステップ:" -ForegroundColor Cyan
    Write-Host "1. git push origin --force --all を実行してプッシュします" -ForegroundColor White
    Write-Host "2. git push origin --force --tags を実行してタグをプッシュします" -ForegroundColor White
    Write-Host ""
    Write-Host "注意: 強制プッシュは履歴を書き換えるため、共有リポジトリの場合は慎重に実行してください。" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "エラーが発生しました。" -ForegroundColor Red
    Write-Host "別の方法を試してください。" -ForegroundColor Yellow
}
