# Railway完全公開デプロイスクリプト
# すべてのサービスを完全公開モードでデプロイします

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

# プロジェクトパス
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

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
Write-Success "Railwayログイン確認完了: $loginCheck"

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

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "デプロイ設定" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Info "デプロイするサービスを選択してください:"
Write-Host "1. フロントエンドのみ" -ForegroundColor Yellow
Write-Host "2. API Gatewayのみ" -ForegroundColor Yellow
Write-Host "3. Auth Serviceのみ" -ForegroundColor Yellow
Write-Host "4. すべてのサービス（推奨）" -ForegroundColor Yellow
Write-Host ""
$choice = Read-Host "選択 (1-4)"

$servicesToDeploy = @()

switch ($choice) {
    "1" { $servicesToDeploy = @("frontend") }
    "2" { $servicesToDeploy = @("api-gateway") }
    "3" { $servicesToDeploy = @("auth-service") }
    "4" { $servicesToDeploy = @("api-gateway", "auth-service", "frontend") }
    default {
        Write-Error "無効な選択です"
        exit 1
    }
}

Write-Host ""
Write-Info "デプロイするサービス: $($servicesToDeploy -join ', ')"
Write-Host ""

# 環境変数の確認
Write-Info "環境変数の設定を確認してください"
Write-Host "Railway Dashboard → 各サービス → Variables で設定" -ForegroundColor Yellow
Write-Host ""
$continue = Read-Host "環境変数を設定しましたか？ (Y/N)"
if ($continue -ne "Y" -and $continue -ne "y") {
    Write-Warning "環境変数を設定してから再実行してください"
    Write-Info "参考: railway.env.example を確認してください"
    exit 1
}

# デプロイ実行
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "デプロイ開始" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

foreach ($service in $servicesToDeploy) {
    Write-Host ""
    Write-Info "=========================================="
    Write-Info "$service をデプロイ中..."
    Write-Info "=========================================="
    
    $servicePath = Join-Path $projectPath $service
    
    if (!(Test-Path $servicePath)) {
        Write-Warning "$service ディレクトリが見つかりません。スキップします。"
        continue
    }
    
    Set-Location $servicePath
    
    # Railway設定ファイルの確認
    $railwayJson = Join-Path $servicePath "railway.json"
    if (Test-Path $railwayJson) {
        Write-Info "Railway設定ファイルを確認: $railwayJson"
    }
    
    # デプロイ実行
    Write-Info "デプロイコマンドを実行中..."
    railway up --detach
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "$service のデプロイが開始されました"
    } else {
        Write-Error "$service のデプロイに失敗しました"
        Write-Info "ログを確認してください: railway logs"
    }
    
    # 少し待機
    Start-Sleep -Seconds 2
}

Set-Location $projectPath

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "デプロイ完了" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Write-Info "次のステップ:"
Write-Host ""
Write-Host "1. Railway Dashboardでデプロイ状況を確認:" -ForegroundColor Yellow
Write-Host "   https://railway.app/dashboard" -ForegroundColor White
Write-Host ""
Write-Host "2. 公開URLを生成:" -ForegroundColor Yellow
Write-Host "   Railway Dashboard → 各サービス → Settings → Networking → Generate Domain" -ForegroundColor White
Write-Host ""
Write-Host "3. 環境変数を更新:" -ForegroundColor Yellow
Write-Host "   フロントエンドの VITE_API_BASE_URL をAPI Gatewayの公開URLに設定" -ForegroundColor White
Write-Host ""
Write-Host "4. デプロイログを確認:" -ForegroundColor Yellow
Write-Host "   railway logs" -ForegroundColor White
Write-Host ""
Write-Host "5. ヘルスチェック:" -ForegroundColor Yellow
Write-Host "   curl https://your-service.railway.app/actuator/health" -ForegroundColor White
Write-Host ""

Write-Success "デプロイプロセスが完了しました！"
Write-Info "Railway Dashboardでデプロイ状況とログを確認してください"
