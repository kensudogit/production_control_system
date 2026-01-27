# 全サービス起動スクリプト

Write-Host "=== 生産管理システム 全サービス起動 ===" -ForegroundColor Cyan
Write-Host ""

# プロジェクトディレクトリに移動
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Dockerの確認
Write-Host "1. Dockerの状態を確認中..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Dockerが利用可能: $dockerVersion" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Dockerが利用できません" -ForegroundColor Red
        Write-Host "   → Docker Desktopを起動してください" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "   ✗ Dockerコマンドが実行できません" -ForegroundColor Red
    Write-Host "   → Docker Desktopを起動してください" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# ポートの確認
Write-Host "2. ポートの使用状況を確認中..." -ForegroundColor Yellow
$port8080 = netstat -ano | findstr ":8080"
$port5173 = netstat -ano | findstr ":5173"
$port3000 = netstat -ano | findstr ":3000"

if ($port8080) {
    Write-Host "   ⚠ ポート8080が使用されています" -ForegroundColor Yellow
    $port8080 | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
} else {
    Write-Host "   ✓ ポート8080は空いています" -ForegroundColor Green
}

if ($port5173) {
    Write-Host "   ⚠ ポート5173が使用されています" -ForegroundColor Yellow
    $port5173 | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
} else {
    Write-Host "   ✓ ポート5173は空いています" -ForegroundColor Green
}

if ($port3000) {
    Write-Host "   ⚠ ポート3000が使用されています" -ForegroundColor Yellow
    $port3000 | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
} else {
    Write-Host "   ✓ ポート3000は空いています" -ForegroundColor Green
}

Write-Host ""

# 既存のコンテナを停止・削除
Write-Host "3. 既存のコンテナを停止・削除中..." -ForegroundColor Yellow
docker-compose down 2>&1 | Out-Null
Write-Host "   ✓ 完了" -ForegroundColor Green

Write-Host ""

# データベースとRedisを先に起動
Write-Host "4. データベースとRedisを起動中..." -ForegroundColor Yellow
docker-compose up -d postgres redis 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ データベースとRedisが起動しました" -ForegroundColor Green
    Write-Host "   データベースの準備を待機中（15秒）..." -ForegroundColor Gray
    Start-Sleep -Seconds 15
} else {
    Write-Host "   ✗ データベースとRedisの起動に失敗しました" -ForegroundColor Red
    exit 1
}

Write-Host ""

# API Gatewayを起動
Write-Host "5. API Gatewayを起動中..." -ForegroundColor Yellow
docker-compose up -d api-gateway 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ API Gatewayが起動しました" -ForegroundColor Green
    Write-Host "   API Gatewayの準備を待機中（10秒）..." -ForegroundColor Gray
    Start-Sleep -Seconds 10
} else {
    Write-Host "   ✗ API Gatewayの起動に失敗しました" -ForegroundColor Red
}

Write-Host ""

# Auth Serviceを起動
Write-Host "6. Auth Serviceを起動中..." -ForegroundColor Yellow
docker-compose up -d auth-service 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Auth Serviceが起動しました" -ForegroundColor Green
} else {
    Write-Host "   ✗ Auth Serviceの起動に失敗しました" -ForegroundColor Red
}

Write-Host ""

# フロントエンドを起動
Write-Host "7. フロントエンドを起動中..." -ForegroundColor Yellow
docker-compose up -d --build frontend 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ フロントエンドが起動しました" -ForegroundColor Green
} else {
    Write-Host "   ✗ フロントエンドの起動に失敗しました" -ForegroundColor Red
}

Write-Host ""

# 状態確認
Write-Host "8. コンテナの状態を確認中..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
docker-compose ps

Write-Host ""
Write-Host "=== 起動完了 ===" -ForegroundColor Green
Write-Host ""
Write-Host "=== アクセス情報 ===" -ForegroundColor Cyan
Write-Host "フロントエンド (Docker): http://localhost:3000" -ForegroundColor White
Write-Host "API Gateway: http://localhost:8080" -ForegroundColor White
Write-Host "Auth Service: http://localhost:8087" -ForegroundColor White
Write-Host ""
Write-Host "=== 開発モードで起動する場合 ===" -ForegroundColor Cyan
Write-Host "フロントエンド開発サーバー: http://localhost:5173" -ForegroundColor White
Write-Host "（別のPowerShellで以下を実行）" -ForegroundColor Gray
Write-Host "cd frontend" -ForegroundColor Gray
Write-Host "npm install" -ForegroundColor Gray
Write-Host "npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "=== ログ確認 ===" -ForegroundColor Cyan
Write-Host "docker-compose logs -f frontend" -ForegroundColor Gray
Write-Host "docker-compose logs -f api-gateway" -ForegroundColor Gray
