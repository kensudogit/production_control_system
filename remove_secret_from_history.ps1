# PowerShell script to remove API key from git history
# コミット履歴からAPIキーを削除するスクリプト

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "コミット履歴からAPIキーを削除" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 問題のあるコミット
$problematicCommit = "53633ee006afd7f40ac9fc298122565c4880fcb8"
$targetFile = "VERCEL_ENV_SETUP.md"

Write-Host "問題のあるコミット: $problematicCommit" -ForegroundColor Yellow
Write-Host "対象ファイル: $targetFile" -ForegroundColor Yellow
Write-Host ""

# 警告
Write-Host "⚠️  警告: この操作はコミット履歴を書き換えます" -ForegroundColor Red
Write-Host "⚠️  続行する前に、リポジトリのバックアップを推奨します" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "続行しますか？ (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "操作をキャンセルしました。" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "ステップ1: コミット履歴から該当ファイルを削除..." -ForegroundColor Cyan
Write-Host "（この処理には数分かかる場合があります）" -ForegroundColor Yellow
Write-Host ""

# git filter-branchを使用して該当ファイルを履歴から削除
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch $targetFile" --prune-empty --tag-name-filter cat -- --all

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "エラー: git filter-branchの実行に失敗しました" -ForegroundColor Red
    Write-Host ""
    Write-Host "代替方法: GitHubの「Allow secret」機能を使用してください" -ForegroundColor Yellow
    Write-Host "URL: https://github.com/kensudogit/production_control_system/security/secret-scanning/unblock-secret/38kmcAR8XzTQIZuMZshNUJLJOiz" -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "ステップ2: 修正版のファイルを追加..." -ForegroundColor Cyan

# 修正版のファイルが存在するか確認
if (Test-Path $targetFile) {
    git add $targetFile
    git commit -m "fix: Remove API key from VERCEL_ENV_SETUP.md" --no-verify
    
    Write-Host "修正版のファイルを追加しました" -ForegroundColor Green
} else {
    Write-Host "警告: 修正版のファイルが見つかりません" -ForegroundColor Yellow
    Write-Host "ファイルが既に正しく修正されていることを確認してください" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "ステップ3: クリーンアップを実行..." -ForegroundColor Cyan

# クリーンアップ
git reflog expire --expire=now --all
git gc --prune=now --aggressive

Write-Host ""
Write-Host "✅ コミット履歴の書き換えが完了しました！" -ForegroundColor Green
Write-Host ""
Write-Host "次のステップ:" -ForegroundColor Cyan
Write-Host "1. git push origin --force --all" -ForegroundColor White
Write-Host "2. git push origin --force --tags" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  注意: 強制プッシュは履歴を書き換えるため、共有リポジトリの場合は慎重に実行してください" -ForegroundColor Yellow
Write-Host ""

$pushConfirm = Read-Host "今すぐ強制プッシュしますか？ (y/N)"
if ($pushConfirm -eq "y" -or $pushConfirm -eq "Y") {
    Write-Host ""
    Write-Host "強制プッシュを実行中..." -ForegroundColor Cyan
    git push origin --force --all
    git push origin --force --tags
    Write-Host ""
    Write-Host "✅ プッシュが完了しました！" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  重要: OpenAI APIキーを無効化してください" -ForegroundColor Red
    Write-Host "URL: https://platform.openai.com/api-keys" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "後で以下のコマンドを実行してください:" -ForegroundColor Yellow
    Write-Host "  git push origin --force --all" -ForegroundColor White
    Write-Host "  git push origin --force --tags" -ForegroundColor White
}
