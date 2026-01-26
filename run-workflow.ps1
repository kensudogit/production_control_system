# GitHub Actionsワークフローディスパッチを実行
$owner = "kensudogit"
$repo = "production_control_system"
$workflowFile = "vercel-production-deploy.yml"
$branch = "main"
$environment = "production"

Write-Host "GitHub Personal Access Tokenが必要です" -ForegroundColor Yellow
Write-Host "トークンを取得: https://github.com/settings/tokens" -ForegroundColor Cyan
$token = Read-Host "GitHub Personal Access Tokenを入力"

if ([string]::IsNullOrEmpty($token)) {
    Write-Host "トークンが入力されていません" -ForegroundColor Red
    exit 1
}

# ワークフローIDを取得
Write-Host "ワークフローIDを取得中..." -ForegroundColor Cyan
$workflowUrl = "https://api.github.com/repos/$owner/$repo/actions/workflows/$workflowFile"
$headers = @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/vnd.github.v3+json"
}

try {
    $workflow = Invoke-RestMethod -Uri $workflowUrl -Method Get -Headers $headers
    $workflowId = $workflow.id
    Write-Host "ワークフローID: $workflowId" -ForegroundColor Green
} catch {
    Write-Host "エラー: $_" -ForegroundColor Red
    exit 1
}

# ワークフローをトリガー
Write-Host "ワークフローをトリガー中..." -ForegroundColor Cyan
$dispatchUrl = "https://api.github.com/repos/$owner/$repo/actions/workflows/$workflowId/dispatches"
$body = @{
    ref = $branch
    inputs = @{
        environment = $environment
    }
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri $dispatchUrl -Method Post -Headers $headers -Body $body -ContentType "application/json"
    Write-Host "ワークフローが正常にトリガーされました！" -ForegroundColor Green
    Write-Host ""
    Write-Host "デプロイ状況: https://github.com/$owner/$repo/actions" -ForegroundColor Yellow
} catch {
    Write-Host "エラー: $_" -ForegroundColor Red
    exit 1
}
