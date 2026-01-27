# システム状態確認スクリプト

Write-Host "=== 生産管理システム 状態確認 ===" -ForegroundColor Cyan
Write-Host ""

# 1. Docker Desktopの確認
Write-Host "1. Docker Desktopの状態確認..." -ForegroundColor Yellow
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

# 2. コンテナの状態確認
Write-Host "2. コンテナの状態確認..." -ForegroundColor Yellow
try {
    $containers = docker ps -a --filter "name=production-control" --format "{{.Names}}\t{{.Status}}\t{{.Ports}}"
    if ($containers) {
        Write-Host "   コンテナ一覧:" -ForegroundColor Cyan
        $containers | ForEach-Object {
            if ($_ -match "Up") {
                Write-Host "   ✓ $_" -ForegroundColor Green
            } else {
                Write-Host "   ✗ $_" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "   ⚠ コンテナが見つかりません" -ForegroundColor Yellow
        Write-Host "   → docker-compose up -d で起動してください" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ✗ コンテナ情報を取得できません" -ForegroundColor Red
}

Write-Host ""

# 3. フロントエンドコンテナの詳細確認
Write-Host "3. フロントエンドコンテナの確認..." -ForegroundColor Yellow
try {
    $frontend = docker ps -a --filter "name=production-control-frontend" --format "{{.Names}}\t{{.Status}}\t{{.Ports}}"
    if ($frontend) {
        Write-Host "   $frontend" -ForegroundColor Cyan
        if ($frontend -match "Up") {
            Write-Host "   ✓ フロントエンドコンテナは起動中" -ForegroundColor Green
        } else {
            Write-Host "   ✗ フロントエンドコンテナが停止しています" -ForegroundColor Red
            Write-Host "   → docker-compose restart frontend で再起動してください" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ✗ フロントエンドコンテナが見つかりません" -ForegroundColor Red
        Write-Host "   → docker-compose up -d --build frontend で起動してください" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ✗ フロントエンドコンテナ情報を取得できません" -ForegroundColor Red
}

Write-Host ""

# 4. ポートの確認
Write-Host "4. ポート3000の確認..." -ForegroundColor Yellow
$port3000 = netstat -ano | findstr ":3000"
if ($port3000) {
    Write-Host "   ポート3000の使用状況:" -ForegroundColor Cyan
    $port3000 | ForEach-Object { Write-Host "   $_" -ForegroundColor Cyan }
} else {
    Write-Host "   ⚠ ポート3000は使用されていません" -ForegroundColor Yellow
    Write-Host "   → コンテナが起動していない可能性があります" -ForegroundColor Yellow
}

Write-Host ""

# 5. フロントエンドのログ確認（最新10行）
Write-Host "5. フロントエンドのログ（最新10行）..." -ForegroundColor Yellow
try {
    $logs = docker logs production-control-frontend --tail 10 2>&1
    if ($logs) {
        Write-Host "   ログ:" -ForegroundColor Cyan
        $logs | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
    } else {
        Write-Host "   ⚠ ログが取得できません" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ✗ ログを取得できません" -ForegroundColor Red
}

Write-Host ""

# 6. ネットワークの確認
Write-Host "6. Dockerネットワークの確認..." -ForegroundColor Yellow
try {
    $networks = docker network ls --filter "name=production" --format "{{.Name}}\t{{.Driver}}"
    if ($networks) {
        Write-Host "   ネットワーク:" -ForegroundColor Cyan
        $networks | ForEach-Object { Write-Host "   ✓ $_" -ForegroundColor Green }
    } else {
        Write-Host "   ⚠ ネットワークが見つかりません" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ✗ ネットワーク情報を取得できません" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== 確認完了 ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "次のステップ:" -ForegroundColor Yellow
Write-Host "1. Docker Desktopが起動していることを確認" -ForegroundColor White
Write-Host "2. docker-compose up -d --build でコンテナを起動" -ForegroundColor White
Write-Host "3. docker-compose logs -f frontend でログを確認" -ForegroundColor White
Write-Host "4. http://localhost:3000 にアクセス" -ForegroundColor White
