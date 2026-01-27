# API Gateway クイック再ビルドスクリプト

Write-Host "=== API Gateway クイック再ビルド ===" -ForegroundColor Cyan
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

# API Gatewayコンテナを停止・削除
Write-Host "2. API Gatewayコンテナを停止・削除中..." -ForegroundColor Yellow
docker-compose stop api-gateway 2>&1 | Out-Null
docker-compose rm -f api-gateway 2>&1 | Out-Null
Write-Host "   ✓ 完了" -ForegroundColor Green

Write-Host ""

# API Gatewayイメージを削除
Write-Host "3. API Gatewayイメージを削除中..." -ForegroundColor Yellow
docker rmi production_control_system-api-gateway 2>&1 | Out-Null
Write-Host "   ✓ 完了" -ForegroundColor Green

Write-Host ""

# データベースとRedisの確認
Write-Host "4. データベースとRedisの状態を確認中..." -ForegroundColor Yellow
$postgresStatus = docker ps --filter "name=production-control-postgres" --format "{{.Status}}"
$redisStatus = docker ps --filter "name=production-control-redis" --format "{{.Status}}"

if (-not $postgresStatus -or -not ($postgresStatus -match "Up")) {
    Write-Host "   ⚠ PostgreSQLが起動していません。起動中..." -ForegroundColor Yellow
    docker-compose up -d postgres 2>&1 | Out-Null
    Write-Host "   データベースの準備を待機中（15秒）..." -ForegroundColor Gray
    Start-Sleep -Seconds 15
    Write-Host "   ✓ PostgreSQLを起動しました" -ForegroundColor Green
} else {
    Write-Host "   ✓ PostgreSQLは起動中" -ForegroundColor Green
}

if (-not $redisStatus -or -not ($redisStatus -match "Up")) {
    Write-Host "   ⚠ Redisが起動していません。起動中..." -ForegroundColor Yellow
    docker-compose up -d redis 2>&1 | Out-Null
    Start-Sleep -Seconds 5
    Write-Host "   ✓ Redisを起動しました" -ForegroundColor Green
} else {
    Write-Host "   ✓ Redisは起動中" -ForegroundColor Green
}

Write-Host ""

# API Gatewayを再ビルド
Write-Host "5. API Gatewayを再ビルド中..." -ForegroundColor Yellow
Write-Host "   （時間がかかります。5-10分程度）" -ForegroundColor Gray
Write-Host ""

docker-compose build --no-cache api-gateway

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "   ✓ ビルド完了" -ForegroundColor Green
    Write-Host ""
    
    # API Gatewayを起動
    Write-Host "6. API Gatewayを起動中..." -ForegroundColor Yellow
    docker-compose up -d api-gateway 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ 起動コマンドを実行しました" -ForegroundColor Green
        Write-Host ""
        
        # 起動を待つ
        Write-Host "7. API Gatewayの起動を待機中（20秒）..." -ForegroundColor Yellow
        Start-Sleep -Seconds 20
        
        # 状態確認
        Write-Host ""
        Write-Host "8. コンテナの状態を確認中..." -ForegroundColor Yellow
        docker-compose ps api-gateway
        
        Write-Host ""
        Write-Host "9. ログを確認中..." -ForegroundColor Yellow
        $logs = docker-compose logs --tail=30 api-gateway 2>&1
        
        # エラーチェック
        if ($logs -match "APPLICATION FAILED TO START" -or $logs -match "Spring MVC found") {
            Write-Host ""
            Write-Host "   ✗ エラーが検出されました" -ForegroundColor Red
            Write-Host "   ログ:" -ForegroundColor Yellow
            $logs | Select-String -Pattern "FAILED|ERROR|MVC" | ForEach-Object { Write-Host "   $_" -ForegroundColor Red }
        } elseif ($logs -match "Started ApiGatewayApplication" -or $logs -match "Netty started") {
            Write-Host "   ✓ API Gatewayは正常に起動しているようです" -ForegroundColor Green
        } else {
            Write-Host "   ⚠ 起動ログを確認してください" -ForegroundColor Yellow
        }
        
        Write-Host ""
        Write-Host "=== ヘルスチェック ===" -ForegroundColor Cyan
        Write-Host "ヘルスチェックを実行中..." -ForegroundColor Gray
        
        Start-Sleep -Seconds 3
        
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host ""
                Write-Host "   ✓ API Gatewayは正常に動作しています！" -ForegroundColor Green
                Write-Host "   レスポンス:" -ForegroundColor Cyan
                Write-Host "   $($response.Content)" -ForegroundColor White
                Write-Host ""
                Write-Host "=== アクセス情報 ===" -ForegroundColor Cyan
                Write-Host "API Gateway: http://localhost:8080" -ForegroundColor White
                Write-Host "ヘルスチェック: http://localhost:8080/actuator/health" -ForegroundColor White
            }
        } catch {
            Write-Host ""
            Write-Host "   ⚠ ヘルスチェックに失敗しました" -ForegroundColor Yellow
            Write-Host "   エラー: $($_.Exception.Message)" -ForegroundColor Gray
            Write-Host ""
            Write-Host "   対処方法:" -ForegroundColor Yellow
            Write-Host "   1. もう少し待ってから再度試してください（起動に時間がかかることがあります）" -ForegroundColor White
            Write-Host "   2. ログを確認: docker-compose logs -f api-gateway" -ForegroundColor White
            Write-Host "   3. コンテナの状態を確認: docker-compose ps api-gateway" -ForegroundColor White
        }
        
        Write-Host ""
        Write-Host "=== 完了 ===" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "ログを確認するには: docker-compose logs -f api-gateway" -ForegroundColor Gray
        
    } else {
        Write-Host ""
        Write-Host "   ✗ 起動に失敗しました" -ForegroundColor Red
        Write-Host "   ログを確認してください: docker-compose logs api-gateway" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "   ✗ ビルドに失敗しました" -ForegroundColor Red
    Write-Host "   エラーを確認してください" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   ビルドログを確認するには:" -ForegroundColor Yellow
    Write-Host "   docker-compose build --no-cache api-gateway" -ForegroundColor Gray
}
