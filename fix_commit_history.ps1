# PowerShell script to fix commit history by removing API key
# コミット履歴を修正してAPIキーを削除するスクリプト

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "コミット履歴からAPIキーを削除します" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 問題のあるコミット
$problematicCommit = "78e44daa679b286ef234d465a414fcd300f398c3"
$targetFile = "frontend/src/pages/DemandForecasting.tsx"

Write-Host "問題のあるコミット: $problematicCommit" -ForegroundColor Yellow
Write-Host "対象ファイル: $targetFile" -ForegroundColor Yellow
Write-Host ""

# 現在の状態を確認
Write-Host "現在のブランチ: $(git rev-parse --abbrev-ref HEAD)" -ForegroundColor Cyan
Write-Host ""

# バックアップの確認
Write-Host "警告: この操作はコミット履歴を書き換えます。" -ForegroundColor Red
Write-Host "続行する前に、リポジトリのバックアップを推奨します。" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "続行しますか？ (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "操作をキャンセルしました。" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "コミット履歴を修正しています..." -ForegroundColor Cyan
Write-Host "（この処理には数分かかる場合があります）" -ForegroundColor Yellow
Write-Host ""

# git filter-branchを使用して該当ファイルを履歴から削除
# その後、修正版のファイルを追加する必要がある
git filter-branch --force --index-filter `
    "git rm --cached --ignore-unmatch $targetFile" `
    --prune-empty --tag-name-filter cat -- --all

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "コミット履歴の修正が完了しました。" -ForegroundColor Green
    Write-Host ""
    
    # 修正版のファイルを追加
    Write-Host "修正版のファイルを追加しています..." -ForegroundColor Cyan
    git add $targetFile
    git commit -m "fix: Add corrected DemandForecasting.tsx without API key"
    
    Write-Host ""
    Write-Host "次のステップ:" -ForegroundColor Cyan
    Write-Host "1. git push origin --force --all" -ForegroundColor White
    Write-Host "2. git push origin --force --tags" -ForegroundColor White
    Write-Host ""
    Write-Host "注意: 強制プッシュは履歴を書き換えるため、共有リポジトリの場合は慎重に実行してください。" -ForegroundColor Yellow
    
    # クリーンアップの提案
    Write-Host ""
    Write-Host "クリーンアップを実行しますか？ (y/N)" -ForegroundColor Cyan
    $cleanup = Read-Host
    if ($cleanup -eq "y" -or $cleanup -eq "Y") {
        Write-Host "クリーンアップを実行中..." -ForegroundColor Cyan
        git reflog expire --expire=now --all
        git gc --prune=now --aggressive
        Write-Host "クリーンアップが完了しました。" -ForegroundColor Green
    }
} else {
    Write-Host ""
    Write-Host "エラーが発生しました。" -ForegroundColor Red
    Write-Host ""
    Write-Host "代替方法: GitHubの「Allow secret」機能を使用してください" -ForegroundColor Yellow
    Write-Host "URL: https://github.com/kensudogit/production_control_system/security/secret-scanning/unblock-secret/38kX7kSyxymwNayYfIkOl4RCoYS" -ForegroundColor Cyan
}
