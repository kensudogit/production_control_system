# フロントエンドコンテナの権限エラー修正スクリプト

Write-Host "=== フロントエンドコンテナの修正 ===" -ForegroundColor Cyan
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

# フロントエンドコンテナを停止・削除
Write-Host "フロントエンドコンテナを停止・削除中..." -ForegroundColor Yellow
docker-compose stop frontend 2>&1 | Out-Null
docker-compose rm -f frontend 2>&1 | Out-Null
Write-Host "✓ 完了" -ForegroundColor Green

Write-Host ""

# フロントエンドイメージを削除（強制再ビルドのため）
Write-Host "フロントエンドイメージを削除中..." -ForegroundColor Yellow
docker rmi production_control_system-frontend 2>&1 | Out-Null
Write-Host "✓ 完了" -ForegroundColor Green

Write-Host ""

# フロントエンドを再ビルド
Write-Host "フロントエンドを再ビルド中..." -ForegroundColor Yellow
Write-Host "（時間がかかります）" -ForegroundColor Gray
Write-Host ""

docker-compose build --no-cache frontend

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ ビルド完了" -ForegroundColor Green
    Write-Host ""
    
    # フロントエンドを起動
    Write-Host "フロントエンドを起動中..." -ForegroundColor Yellow
    docker-compose up -d frontend
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "=== 起動完了 ===" -ForegroundColor Green
        Write-Host ""
        
        # 少し待ってから状態を確認
        Write-Host "コンテナの状態を確認中..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
        
        docker-compose ps frontend
        
        Write-Host ""
        Write-Host "=== ログ確認 ===" -ForegroundColor Cyan
        Write-Host "最新20行のログを表示します..." -ForegroundColor Gray
        Write-Host ""
        docker-compose logs --tail=20 frontend
        
        Write-Host ""
        Write-Host "=== アクセス情報 ===" -ForegroundColor Cyan
        Write-Host "フロントエンド: http://localhost:3000" -ForegroundColor White
        Write-Host ""
        Write-Host "ログをリアルタイムで確認するには: docker-compose logs -f frontend" -ForegroundColor Gray
    } else {
        Write-Host ""
        Write-Host "✗ 起動に失敗しました" -ForegroundColor Red
        Write-Host "ログを確認してください: docker-compose logs frontend" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "✗ ビルドに失敗しました" -ForegroundColor Red
    Write-Host "エラーを確認してください" -ForegroundColor Yellow
}
