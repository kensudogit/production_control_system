# API Gateway 最終修正スクリプト

Write-Host "=== API Gateway 最終修正 ===" -ForegroundColor Cyan
Write-Host "接続エラーを完全に解決します" -ForegroundColor Yellow
Write-Host ""

# プロジェクトディレクトリに移動
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Dockerの確認
Write-Host "[1/8] Dockerの状態を確認中..." -ForegroundColor Yellow
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

# 現在の状態を確認
Write-Host "[2/8] 現在の状態を確認中..." -ForegroundColor Yellow
$apiGatewayStatus = docker ps -a --filter "name=production-control-api-gateway" --format "{{.Status}}" 2>&1
if ($apiGatewayStatus) {
    Write-Host "   現在の状態: $apiGatewayStatus" -ForegroundColor Cyan
} else {
    Write-Host "   API Gatewayコンテナが見つかりません" -ForegroundColor Yellow
}

Write-Host ""

# API Gatewayコンテナを完全に停止・削除
Write-Host "[3/8] API Gatewayコンテナを完全に停止・削除中..." -ForegroundColor Yellow
docker-compose stop api-gateway 2>&1 | Out-Null
docker-compose rm -f api-gateway 2>&1 | Out-Null
# 念のため、直接dockerコマンドでも削除
docker rm -f production-control-api-gateway 2>&1 | Out-Null
Write-Host "   ✓ 完了" -ForegroundColor Green

Write-Host ""

# API Gatewayイメージを完全に削除
Write-Host "[4/8] API Gatewayイメージを完全に削除中..." -ForegroundColor Yellow
docker rmi -f production_control_system-api-gateway 2>&1 | Out-Null
# 関連するイメージも削除
docker images | Select-String "api-gateway" | ForEach-Object {
    $imageId = ($_ -split '\s+')[2]
    if ($imageId) {
        docker rmi -f $imageId 2>&1 | Out-Null
    }
}
Write-Host "   ✓ 完了" -ForegroundColor Green

Write-Host ""

# データベースとRedisの確認と起動
Write-Host "[5/8] データベースとRedisの確認・起動中..." -ForegroundColor Yellow
$postgresStatus = docker ps --filter "name=production-control-postgres" --format "{{.Status}}" 2>&1
$redisStatus = docker ps --filter "name=production-control-redis" --format "{{.Status}}" 2>&1

if (-not $postgresStatus -or -not ($postgresStatus -match "Up")) {
    Write-Host "   PostgreSQLを起動中..." -ForegroundColor Yellow
    docker-compose up -d postgres 2>&1 | Out-Null
    Write-Host "   データベースの準備を待機中（20秒）..." -ForegroundColor Gray
    Start-Sleep -Seconds 20
    Write-Host "   ✓ PostgreSQLを起動しました" -ForegroundColor Green
} else {
    Write-Host "   ✓ PostgreSQLは起動中" -ForegroundColor Green
}

if (-not $redisStatus -or -not ($redisStatus -match "Up")) {
    Write-Host "   Redisを起動中..." -ForegroundColor Yellow
    docker-compose up -d redis 2>&1 | Out-Null
    Start-Sleep -Seconds 5
    Write-Host "   ✓ Redisを起動しました" -ForegroundColor Green
} else {
    Write-Host "   ✓ Redisは起動中" -ForegroundColor Green
}

Write-Host ""

# API Gatewayを再ビルド
Write-Host "[6/8] API Gatewayを再ビルド中..." -ForegroundColor Yellow
Write-Host "   （時間がかかります。5-10分程度）" -ForegroundColor Gray
Write-Host "   ビルドログを表示します..." -ForegroundColor Gray
Write-Host ""

docker-compose build --no-cache api-gateway

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "   ✓ ビルド完了" -ForegroundColor Green
    Write-Host ""
    
    # API Gatewayを起動
    Write-Host "[7/8] API Gatewayを起動中..." -ForegroundColor Yellow
    docker-compose up -d api-gateway 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ 起動コマンドを実行しました" -ForegroundColor Green
        Write-Host ""
        
        # 起動を待つ（段階的に確認）
        Write-Host "[8/8] API Gatewayの起動を確認中..." -ForegroundColor Yellow
        Write-Host "   起動を待機中（30秒）..." -ForegroundColor Gray
        
        $maxWait = 30
        $waited = 0
        $started = $false
        
        while ($waited -lt $maxWait) {
            Start-Sleep -Seconds 5
            $waited += 5
            
            # ログを確認
            $logs = docker-compose logs --tail=10 api-gateway 2>&1
            
            if ($logs -match "Started ApiGatewayApplication" -or $logs -match "Netty started on port") {
                Write-Host "   ✓ API Gatewayが起動しました！" -ForegroundColor Green
                $started = $true
                break
            } elseif ($logs -match "APPLICATION FAILED TO START" -or $logs -match "Spring MVC found") {
                Write-Host ""
                Write-Host "   ✗ 起動エラーが検出されました" -ForegroundColor Red
                Write-Host "   エラーログ:" -ForegroundColor Yellow
                docker-compose logs --tail=50 api-gateway | Select-String -Pattern "FAILED|ERROR|MVC" | ForEach-Object {
                    Write-Host "   $_" -ForegroundColor Red
                }
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
        Write-Host "コンテナの状態:" -ForegroundColor Yellow
        docker-compose ps api-gateway
        
        Write-Host ""
        Write-Host "最新のログ（50行）:" -ForegroundColor Yellow
        docker-compose logs --tail=50 api-gateway
        
        Write-Host ""
        Write-Host "=== ヘルスチェック ===" -ForegroundColor Cyan
        
        # 複数回ヘルスチェックを試行
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
                    Write-Host "   $($response.Content)" -ForegroundColor White
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
                    Write-Host "   3. ポート8080が使用されているか確認: netstat -ano | findstr :8080" -ForegroundColor White
                    Write-Host "   4. もう少し待ってから再度試してください" -ForegroundColor White
                }
            }
        }
        
        Write-Host ""
        Write-Host "=== 完了 ===" -ForegroundColor Cyan
        
        if ($healthCheckSuccess) {
            Write-Host "✓ API Gatewayは正常に動作しています！" -ForegroundColor Green
        } else {
            Write-Host "⚠ ヘルスチェックに失敗しましたが、コンテナは起動しています" -ForegroundColor Yellow
            Write-Host "ログを確認して問題を特定してください" -ForegroundColor Yellow
        }
        
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

Write-Host ""
Write-Host "ログをリアルタイムで確認するには: docker-compose logs -f api-gateway" -ForegroundColor Gray
