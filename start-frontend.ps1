# フロントエンド起動スクリプト

Write-Host "=== フロントエンド起動 ===" -ForegroundColor Cyan
Write-Host ""

# プロジェクトディレクトリに移動
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Dockerの確認
Write-Host "[1/4] Dockerの状態を確認中..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Dockerが利用可能" -ForegroundColor Green
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

# フロントエンドコンテナの状態確認
Write-Host "[2/4] フロントエンドコンテナの状態確認中..." -ForegroundColor Yellow
$frontendStatus = docker ps -a --filter "name=production-control-frontend" --format "{{.Status}}" 2>&1

if ($frontendStatus -match "Up") {
    Write-Host "   ✓ フロントエンドは既に起動しています" -ForegroundColor Green
    Write-Host "   → http://localhost:3000 にアクセスしてください" -ForegroundColor Cyan
    exit 0
} elseif ($frontendStatus) {
    Write-Host "   ⚠ フロントエンドコンテナが見つかりましたが、停止しています" -ForegroundColor Yellow
    Write-Host "   コンテナを削除して再ビルドします..." -ForegroundColor Gray
    docker-compose rm -f frontend 2>&1 | Out-Null
}

Write-Host ""

# フロントエンドをビルド・起動
Write-Host "[3/4] フロントエンドをビルド・起動中..." -ForegroundColor Yellow
Write-Host "   （時間がかかります。2-5分程度）" -ForegroundColor Gray
Write-Host ""

docker-compose up -d --build frontend

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "   ✗ ビルド・起動に失敗しました" -ForegroundColor Red
    Write-Host "   エラーログを確認してください" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "   ✓ ビルド・起動コマンドを実行しました" -ForegroundColor Green
Write-Host ""

# 起動を待つ
Write-Host "[4/4] フロントエンドの起動を確認中..." -ForegroundColor Yellow
Write-Host "   起動を待機中（最大30秒）..." -ForegroundColor Gray

$maxWait = 30
$waited = 0
$started = $false

while ($waited -lt $maxWait) {
    Start-Sleep -Seconds 3
    $waited += 3
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✓ フロントエンドが起動しました！" -ForegroundColor Green
            $started = $true
            break
        }
    } catch {
        # 接続エラーは正常（まだ起動中）
    }
    
    Write-Host "   待機中... ($waited/$maxWait秒)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== 完了 ===" -ForegroundColor Cyan

if ($started) {
    Write-Host "✓ フロントエンドは正常に動作しています！" -ForegroundColor Green
    Write-Host ""
    Write-Host "=== アクセス情報 ===" -ForegroundColor Cyan
    Write-Host "   フロントエンド: http://localhost:3000" -ForegroundColor White
    Write-Host "   API Gateway: http://localhost:8080" -ForegroundColor White
    Write-Host "   ヘルスチェック: http://localhost:8080/actuator/health" -ForegroundColor White
} else {
    Write-Host "⚠ 起動確認に時間がかかっています" -ForegroundColor Yellow
    Write-Host "   ログを確認してください: docker-compose logs -f frontend" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   手動で確認:" -ForegroundColor Yellow
    Write-Host "   http://localhost:3000 にアクセスしてください" -ForegroundColor White
}

Write-Host ""
Write-Host "ログを確認するには: docker-compose logs -f frontend" -ForegroundColor Gray
