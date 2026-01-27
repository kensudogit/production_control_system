# API Gateway起動エラー修正スクリプト

Write-Host "=== API Gateway起動エラー修正 ===" -ForegroundColor Cyan
Write-Host ""

# プロジェクトディレクトリに移動
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Dockerの確認
Write-Host "Dockerの状態を確認中..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "✓ Dockerが利用可能" -ForegroundColor Green
} catch {
    Write-Host "✗ Dockerが利用できません" -ForegroundColor Red
    Write-Host "Docker Desktopを起動してから再度実行してください" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# API Gatewayコンテナを停止・削除
Write-Host "API Gatewayコンテナを停止・削除中..." -ForegroundColor Yellow
docker-compose stop api-gateway 2>&1 | Out-Null
docker-compose rm -f api-gateway 2>&1 | Out-Null
Write-Host "✓ 完了" -ForegroundColor Green

Write-Host ""

# API Gatewayイメージを削除（強制再ビルドのため）
Write-Host "API Gatewayイメージを削除中..." -ForegroundColor Yellow
docker rmi production_control_system-api-gateway 2>&1 | Out-Null
Write-Host "✓ 完了" -ForegroundColor Green

Write-Host ""

# API Gatewayを再ビルド
Write-Host "API Gatewayを再ビルド中..." -ForegroundColor Yellow
Write-Host "（時間がかかります）" -ForegroundColor Gray
Write-Host ""

docker-compose build --no-cache api-gateway

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ ビルド完了" -ForegroundColor Green
    Write-Host ""
    
    # データベースとRedisが起動しているか確認
    Write-Host "データベースとRedisの状態を確認中..." -ForegroundColor Yellow
    $postgresStatus = docker ps --filter "name=production-control-postgres" --format "{{.Status}}"
    $redisStatus = docker ps --filter "name=production-control-redis" --format "{{.Status}}"
    
    if (-not $postgresStatus -or -not ($postgresStatus -match "Up")) {
        Write-Host "⚠ PostgreSQLが起動していません。起動中..." -ForegroundColor Yellow
        docker-compose up -d postgres
        Write-Host "データベースの準備を待機中（15秒）..." -ForegroundColor Gray
        Start-Sleep -Seconds 15
    } else {
        Write-Host "✓ PostgreSQLは起動中" -ForegroundColor Green
    }
    
    if (-not $redisStatus -or -not ($redisStatus -match "Up")) {
        Write-Host "⚠ Redisが起動していません。起動中..." -ForegroundColor Yellow
        docker-compose up -d redis
        Start-Sleep -Seconds 5
    } else {
        Write-Host "✓ Redisは起動中" -ForegroundColor Green
    }
    
    Write-Host ""
    
    # API Gatewayを起動
    Write-Host "API Gatewayを起動中..." -ForegroundColor Yellow
    docker-compose up -d api-gateway
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "=== 起動完了 ===" -ForegroundColor Green
        Write-Host ""
        
        # 少し待ってから状態を確認
        Write-Host "API Gatewayの準備を待機中（10秒）..." -ForegroundColor Gray
        Start-Sleep -Seconds 10
        
        Write-Host "コンテナの状態を確認中..." -ForegroundColor Yellow
        docker-compose ps api-gateway
        
        Write-Host ""
        Write-Host "=== ログ確認 ===" -ForegroundColor Cyan
        Write-Host "最新30行のログを表示します..." -ForegroundColor Gray
        Write-Host ""
        docker-compose logs --tail=30 api-gateway
        
        Write-Host ""
        Write-Host "=== アクセス情報 ===" -ForegroundColor Cyan
        Write-Host "API Gateway: http://localhost:8080" -ForegroundColor White
        Write-Host "ヘルスチェック: http://localhost:8080/actuator/health" -ForegroundColor White
        Write-Host ""
        Write-Host "ログをリアルタイムで確認するには: docker-compose logs -f api-gateway" -ForegroundColor Gray
        
        Write-Host ""
        Write-Host "=== ヘルスチェック ===" -ForegroundColor Cyan
        Write-Host "ヘルスチェックを実行中..." -ForegroundColor Gray
        Start-Sleep -Seconds 3
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -UseBasicParsing -TimeoutSec 5
            if ($response.StatusCode -eq 200) {
                Write-Host "✓ API Gatewayは正常に起動しています" -ForegroundColor Green
                Write-Host "レスポンス: $($response.Content)" -ForegroundColor Gray
            }
        } catch {
            Write-Host "⚠ ヘルスチェックに失敗しました（起動中かもしれません）" -ForegroundColor Yellow
            Write-Host "数秒待ってから再度確認してください: curl http://localhost:8080/actuator/health" -ForegroundColor Gray
        }
    } else {
        Write-Host ""
        Write-Host "✗ 起動に失敗しました" -ForegroundColor Red
        Write-Host "ログを確認してください: docker-compose logs api-gateway" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "✗ ビルドに失敗しました" -ForegroundColor Red
    Write-Host "エラーを確認してください" -ForegroundColor Yellow
}
