# Railway Deployment Script
# Railway完全公開デプロイスクリプト

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Stop"

function Write-Info { Write-Host "[INFO] $args" -ForegroundColor Cyan }
function Write-Success { Write-Host "[SUCCESS] $args" -ForegroundColor Green }
function Write-Warning { Write-Host "[WARNING] $args" -ForegroundColor Yellow }
function Write-Error { Write-Host "[ERROR] $args" -ForegroundColor Red }

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Railway完全公開デプロイ" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Railway CLIの確認
Write-Info "Railway CLIを確認中..."
if (!(Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Warning "Railway CLIがインストールされていません"
    Write-Info "インストール方法:"
    Write-Host "1. npm経由: npm install -g @railway/cli" -ForegroundColor Yellow
    Write-Host "2. PowerShell経由: iwr https://railway.app/install.ps1 | iex" -ForegroundColor Yellow
    Write-Host ""
    $install = Read-Host "Railway CLIをインストールしますか？ (Y/N)"
    if ($install -eq "Y" -or $install -eq "y") {
        npm install -g @railway/cli
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Railway CLIのインストールに失敗しました"
            exit 1
        }
    } else {
        Write-Error "Railway CLIが必要です"
        exit 1
    }
}
Write-Success "Railway CLIの確認完了"

# Railwayログイン確認
Write-Info "Railwayログイン状態を確認中..."
$loginCheck = railway whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Railwayにログインしていません"
    Write-Info "ログイン中..."
    railway login
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Railwayログインに失敗しました"
        exit 1
    }
}
Write-Success "Railwayログイン確認完了"

# プロジェクトの準備
Write-Info "プロジェクトを準備中..."
$projectPath = "C:\devlop\production_control_system"
Set-Location $projectPath

# プロジェクトのリンク確認
Write-Info "Railwayプロジェクトのリンクを確認中..."
$linked = railway status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Railwayプロジェクトにリンクされていません"
    Write-Info "プロジェクトをリンク中..."
    railway link
    if ($LASTEXITCODE -ne 0) {
        Write-Error "プロジェクトのリンクに失敗しました"
        Write-Info "Railway Dashboardでプロジェクトを作成してから再実行してください"
        exit 1
    }
}
Write-Success "プロジェクトのリンク確認完了"

# デプロイするサービスを選択
Write-Host ""
Write-Host "デプロイするサービスを選択してください:" -ForegroundColor Cyan
Write-Host "1. フロントエンド" -ForegroundColor Yellow
Write-Host "2. API Gateway" -ForegroundColor Yellow
Write-Host "3. Auth Service" -ForegroundColor Yellow
Write-Host "4. すべて" -ForegroundColor Yellow
Write-Host ""
$choice = Read-Host "選択 (1-4)"

switch ($choice) {
    "1" {
        Write-Info "フロントエンドをデプロイ中..."
        Set-Location "$projectPath\frontend"
        railway up
        if ($LASTEXITCODE -eq 0) {
            Write-Success "フロントエンドのデプロイが完了しました"
        } else {
            Write-Error "フロントエンドのデプロイに失敗しました"
        }
    }
    "2" {
        Write-Info "API Gatewayをデプロイ中..."
        Set-Location "$projectPath\api-gateway"
        railway up
        if ($LASTEXITCODE -eq 0) {
            Write-Success "API Gatewayのデプロイが完了しました"
        } else {
            Write-Error "API Gatewayのデプロイに失敗しました"
        }
    }
    "3" {
        Write-Info "Auth Serviceをデプロイ中..."
        Set-Location "$projectPath\auth-service"
        railway up
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Auth Serviceのデプロイが完了しました"
        } else {
            Write-Error "Auth Serviceのデプロイに失敗しました"
        }
    }
    "4" {
        Write-Info "すべてのサービスをデプロイ中..."
        
        # フロントエンド
        Write-Info "フロントエンドをデプロイ中..."
        Set-Location "$projectPath\frontend"
        railway up
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "フロントエンドのデプロイに失敗しました"
        }
        
        # API Gateway
        Write-Info "API Gatewayをデプロイ中..."
        Set-Location "$projectPath\api-gateway"
        railway up
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "API Gatewayのデプロイに失敗しました"
        }
        
        # Auth Service
        Write-Info "Auth Serviceをデプロイ中..."
        Set-Location "$projectPath\auth-service"
        railway up
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "Auth Serviceのデプロイに失敗しました"
        }
        
        Write-Success "すべてのサービスのデプロイが完了しました"
    }
    default {
        Write-Error "無効な選択です"
        exit 1
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "次のステップ" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Info "1. Railway Dashboardでデプロイ状況を確認:"
Write-Host "   https://railway.app/dashboard" -ForegroundColor Yellow
Write-Host ""
Write-Info "2. 環境変数を設定:"
Write-Host "   Railway Dashboard → 各サービス → Variables" -ForegroundColor Yellow
Write-Host ""
Write-Info "3. 公開URLを確認:"
Write-Host "   Railway Dashboard → 各サービス → Settings → Generate Domain" -ForegroundColor Yellow
Write-Host ""
Write-Info "4. データベースとRedisを設定:"
Write-Host "   Railway Dashboard → New → Database" -ForegroundColor Yellow
Write-Host ""
