# 生産管理システム起動スクリプト

Write-Host "=== 生産管理システム 起動スクリプト ===" -ForegroundColor Cyan
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

# 既存のコンテナを停止・削除
Write-Host "既存のコンテナを停止・削除中..." -ForegroundColor Yellow
docker-compose down 2>&1 | Out-Null
Write-Host "✓ 完了" -ForegroundColor Green

Write-Host ""

# コンテナをビルドして起動
Write-Host "コンテナをビルドして起動中..." -ForegroundColor Yellow
Write-Host "（初回は時間がかかります）" -ForegroundColor Gray
Write-Host ""

docker-compose up -d --build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== 起動完了 ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "コンテナの状態を確認中..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    docker-compose ps
    
    Write-Host ""
    Write-Host "=== アクセス情報 ===" -ForegroundColor Cyan
    Write-Host "フロントエンド: http://localhost:3000" -ForegroundColor White
    Write-Host "API Gateway: http://localhost:8080" -ForegroundColor White
    Write-Host "Grafana: http://localhost:3001 (admin/admin)" -ForegroundColor White
    Write-Host ""
    Write-Host "ログを確認するには: docker-compose logs -f frontend" -ForegroundColor Gray
    Write-Host "停止するには: docker-compose stop" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "=== 起動エラー ===" -ForegroundColor Red
    Write-Host ""
    Write-Host "エラーが発生しました。以下を確認してください:" -ForegroundColor Yellow
    Write-Host "1. Docker Desktopが起動しているか" -ForegroundColor White
    Write-Host "2. ポート3000, 8080, 5432が空いているか" -ForegroundColor White
    Write-Host "3. ログを確認: docker-compose logs" -ForegroundColor White
    Write-Host ""
    Write-Host "詳細は TROUBLESHOOTING.md を参照してください" -ForegroundColor Gray
}
