# API Gateway 即座に再ビルドスクリプト

Write-Host "=== API Gateway 即座に再ビルド ===" -ForegroundColor Cyan
Write-Host "KeyResolver Bean競合エラーを修正します" -ForegroundColor Yellow
Write-Host ""

# プロジェクトディレクトリに移動
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Dockerの確認
Write-Host "[1/7] Dockerの状態を確認中..." -ForegroundColor Yellow
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

# API Gatewayコンテナを停止・削除
Write-Host "[2/7] API Gatewayコンテナを停止・削除中..." -ForegroundColor Yellow
docker-compose stop api-gateway 2>&1 | Out-Null
docker-compose rm -f api-gateway 2>&1 | Out-Null
docker rm -f production-control-api-gateway 2>&1 | Out-Null
Write-Host "   ✓ 完了" -ForegroundColor Green

Write-Host ""

# API Gatewayイメージを削除
Write-Host "[3/7] API Gatewayイメージを削除中..." -ForegroundColor Yellow
docker rmi -f production_control_system-api-gateway 2>&1 | Out-Null
Write-Host "   ✓ 完了" -ForegroundColor Green

Write-Host ""

# データベースとRedisの確認
Write-Host "[4/7] データベースとRedisの確認中..." -ForegroundColor Yellow
$postgresStatus = docker ps --filter "name=production-control-postgres" --format "{{.Status}}" 2>&1
$redisStatus = docker ps --filter "name=production-control-redis" --format "{{.Status}}" 2>&1

if (-not $postgresStatus -or -not ($postgresStatus -match "Up")) {
    Write-Host "   PostgreSQLを起動中..." -ForegroundColor Yellow
    docker-compose up -d postgres 2>&1 | Out-Null
    Start-Sleep -Seconds 15
}
if (-not $redisStatus -or -not ($redisStatus -match "Up")) {
    Write-Host "   Redisを起動中..." -ForegroundColor Yellow
    docker-compose up -d redis 2>&1 | Out-Null
    Start-Sleep -Seconds 5
}
Write-Host "   ✓ データベースとRedisは準備完了" -ForegroundColor Green

Write-Host ""

# API Gatewayを再ビルド
Write-Host "[5/7] API Gatewayを再ビルド中..." -ForegroundColor Yellow
Write-Host "   （時間がかかります。5-10分程度）" -ForegroundColor Gray
Write-Host ""

docker-compose build --no-cache api-gateway

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "   ✗ ビルドに失敗しました" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "   ✓ ビルド完了" -ForegroundColor Green
Write-Host ""

# API Gatewayを起動
Write-Host "[6/7] API Gatewayを起動中..." -ForegroundColor Yellow
docker-compose up -d api-gateway 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ✗ 起動に失敗しました" -ForegroundColor Red
    exit 1
}

Write-Host "   ✓ 起動コマンドを実行しました" -ForegroundColor Green
Write-Host ""

# 起動を待つ（段階的に確認）
Write-Host "[7/7] API Gatewayの起動を確認中..." -ForegroundColor Yellow
Write-Host "   起動を待機中（最大30秒）..." -ForegroundColor Gray

$maxWait = 30
$waited = 0
$started = $false

while ($waited -lt $maxWait) {
    Start-Sleep -Seconds 5
    $waited += 5
    
    $logs = docker-compose logs --tail=20 api-gateway 2>&1
    
    if ($logs -match "Started ApiGatewayApplication") {
        Write-Host "   ✓ API Gatewayが起動しました！" -ForegroundColor Green
        $started = $true
        break
    } elseif ($logs -match "APPLICATION FAILED TO START" -or $logs -match "KeyResolver" -or $logs -match "required a single bean") {
        Write-Host ""
        Write-Host "   ✗ 起動エラーが検出されました" -ForegroundColor Red
        Write-Host "   エラーログ:" -ForegroundColor Yellow
        docker-compose logs --tail=50 api-gateway | Select-String -Pattern "FAILED|ERROR|KeyResolver|required a single bean" | ForEach-Object {
            Write-Host "   $_" -ForegroundColor Red
        }
        Write-Host ""
        Write-Host "   修正が適用されていない可能性があります" -ForegroundColor Yellow
        Write-Host "   RateLimitingConfig.javaを確認してください" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "   待機中... ($waited/$maxWait秒)" -ForegroundColor Gray
}

if (-not $started) {
    Write-Host "   ⚠ 起動確認に時間がかかっています" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== 詳細確認 ===" -ForegroundColor Cyan

# コンテナの状態確認
docker-compose ps api-gateway

Write-Host ""
Write-Host "最新のログ（30行）:" -ForegroundColor Yellow
docker-compose logs --tail=30 api-gateway

Write-Host ""
Write-Host "=== ヘルスチェック ===" -ForegroundColor Cyan

# ヘルスチェックを試行
$healthCheckSuccess = $false
for ($i = 1; $i -le 5; $i++) {
    Write-Host "ヘルスチェック試行 $i/5..." -ForegroundColor Gray
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host ""
            Write-Host "   ✓✓✓ API Gatewayは正常に動作しています！ ✓✓✓" -ForegroundColor Green
            Write-Host ""
            Write-Host "   レスポンス:" -ForegroundColor Cyan
            # レスポンスを正しく表示（バイト配列の場合は文字列に変換）
            try {
                $contentString = if ($response.Content -is [byte[]]) {
                    [System.Text.Encoding]::UTF8.GetString($response.Content)
                } else {
                    $response.Content
                }
                # JSONとして整形して表示
                $jsonContent = $contentString | ConvertFrom-Json | ConvertTo-Json -Depth 10
                Write-Host "   $jsonContent" -ForegroundColor White
            } catch {
                # JSON解析に失敗した場合はそのまま表示
                $contentString = if ($response.Content -is [byte[]]) {
                    [System.Text.Encoding]::UTF8.GetString($response.Content)
                } else {
                    $response.Content
                }
                Write-Host "   $contentString" -ForegroundColor White
            }
            Write-Host ""
            Write-Host "=== アクセス情報 ===" -ForegroundColor Cyan
            Write-Host "   API Gateway: http://localhost:8080" -ForegroundColor White
            Write-Host "   ヘルスチェック: http://localhost:8080/actuator/health" -ForegroundColor White
            $healthCheckSuccess = $true
            break
        }
    } catch {
        if ($i -lt 5) {
            Write-Host "   失敗。5秒待って再試行します..." -ForegroundColor Yellow
            Start-Sleep -Seconds 5
        } else {
            Write-Host ""
            Write-Host "   ⚠ ヘルスチェックに失敗しました" -ForegroundColor Yellow
            Write-Host "   エラー: $($_.Exception.Message)" -ForegroundColor Gray
            Write-Host ""
            Write-Host "   次のステップ:" -ForegroundColor Yellow
            Write-Host "   1. ログを確認: docker-compose logs -f api-gateway" -ForegroundColor White
            Write-Host "   2. コンテナの状態を確認: docker-compose ps api-gateway" -ForegroundColor White
        }
    }
}

Write-Host ""
Write-Host "=== 完了 ===" -ForegroundColor Cyan

if ($healthCheckSuccess) {
    Write-Host "✓ API Gatewayは正常に動作しています！" -ForegroundColor Green
} else {
    Write-Host "⚠ ヘルスチェックに失敗しました" -ForegroundColor Yellow
    Write-Host "ログを確認して問題を特定してください" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "ログをリアルタイムで確認するには: docker-compose logs -f api-gateway" -ForegroundColor Gray
