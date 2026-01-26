# Git権限エラーを修正してデプロイするスクリプト
# PowerShellを管理者として実行してください

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Continue"

function Write-Info { Write-Host "[INFO] $args" -ForegroundColor Cyan }
function Write-Success { Write-Host "[SUCCESS] $args" -ForegroundColor Green }
function Write-Warning { Write-Host "[WARNING] $args" -ForegroundColor Yellow }
function Write-Error { Write-Host "[ERROR] $args" -ForegroundColor Red }

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Git権限エラー修正とデプロイ" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# プロジェクトディレクトリに移動
$projectPath = "C:\devlop\production_control_system"
Set-Location $projectPath
Write-Info "プロジェクトディレクトリ: $projectPath"

# Gitのロックファイルを削除
Write-Info "Gitのロックファイルを削除中..."
try {
    Remove-Item -Force "$projectPath\.git\index.lock" -ErrorAction SilentlyContinue
    Remove-Item -Force "$projectPath\.git\objects\*\tmp_obj_*" -ErrorAction SilentlyContinue
    Write-Success "ロックファイルの削除完了"
} catch {
    Write-Warning "ロックファイルの削除でエラー: $_"
}

# Gitの状態を確認
Write-Info "Gitの状態を確認中..."
git status

# 変更をステージング
Write-Info "変更をステージング中..."
try {
    git add .
    Write-Success "ステージング完了"
} catch {
    Write-Error "ステージングエラー: $_"
    Write-Warning "手動で git add . を実行してください"
    exit 1
}

# コミット
Write-Info "コミット中..."
$commitMessage = "OpenAI APIキー読み取りエラーの修正とデプロイ準備"
try {
    git commit -m $commitMessage
    Write-Success "コミット完了"
} catch {
    Write-Warning "コミットエラー（変更がない可能性）: $_"
}

# プッシュ
Write-Info "GitHubにプッシュ中..."
Write-Warning "GitHubにプッシュすると、自動的にVercelにデプロイされます"
$confirm = Read-Host "プッシュを実行しますか？ (Y/N)"
if ($confirm -eq "Y" -or $confirm -eq "y") {
    try {
        git push origin main
        Write-Success "プッシュ完了"
        Write-Info "GitHub Actionsで自動デプロイが開始されます"
        Write-Info "デプロイ状況: https://github.com/kensudogit/production_control_system/actions"
    } catch {
        Write-Error "プッシュエラー: $_"
        Write-Warning "手動で git push origin main を実行してください"
    }
} else {
    Write-Info "プッシュをスキップしました"
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "次のステップ" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Info "1. GitHub Actionsでデプロイ状況を確認:"
Write-Host "   https://github.com/kensudogit/production_control_system/actions" -ForegroundColor Yellow
Write-Host ""
Write-Info "2. Vercel Dashboardで環境変数を確認:"
Write-Host "   https://vercel.com/dashboard" -ForegroundColor Yellow
Write-Host "   Settings → Environment Variables → VITE_OPENAI_API_KEY" -ForegroundColor Yellow
Write-Host ""
Write-Info "3. デプロイが完了したら、アプリケーションで動作確認"
Write-Host ""
