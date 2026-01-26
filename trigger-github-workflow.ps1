# GitHub Actionsワークフローディスパッチを実行するスクリプト
# GitHub Personal Access Tokenが必要です

param(
    [string]$GitHubToken = "",
    [string]$Owner = "kensudogit",
    [string]$Repo = "production_control_system",
    [string]$WorkflowFile = "vercel-production-deploy.yml",
    [string]$Branch = "main",
    [string]$Environment = "production"
)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Stop"

function Write-Info { Write-Host "[INFO] $args" -ForegroundColor Cyan }
function Write-Success { Write-Host "[SUCCESS] $args" -ForegroundColor Green }
function Write-Warning { Write-Host "[WARNING] $args" -ForegroundColor Yellow }
function Write-Error { Write-Host "[ERROR] $args" -ForegroundColor Red }

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "GitHub Actionsワークフローディスパッチ" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# GitHubトークンの確認
if ([string]::IsNullOrEmpty($GitHubToken)) {
    Write-Warning "GitHub Personal Access Tokenが必要です"
    Write-Info "トークンを取得する方法:"
    Write-Host "1. https://github.com/settings/tokens にアクセス" -ForegroundColor Yellow
    Write-Host "2. 「Generate new token (classic)」をクリック" -ForegroundColor Yellow
    Write-Host "3. スコープ: repo (すべてのチェック)" -ForegroundColor Yellow
    Write-Host "4. トークンを生成してコピー" -ForegroundColor Yellow
    Write-Host ""
    $GitHubToken = Read-Host "GitHub Personal Access Tokenを入力してください"
    
    if ([string]::IsNullOrEmpty($GitHubToken)) {
        Write-Error "トークンが入力されていません"
        exit 1
    }
}

# ワークフローIDを取得
Write-Info "ワークフローIDを取得中..."
$workflowUrl = "https://api.github.com/repos/$Owner/$Repo/actions/workflows/$WorkflowFile"
$headers = @{
    "Authorization" = "Bearer $GitHubToken"
    "Accept" = "application/vnd.github.v3+json"
}

try {
    $workflowResponse = Invoke-RestMethod -Uri $workflowUrl -Method Get -Headers $headers
    $workflowId = $workflowResponse.id
    Write-Success "ワークフローID: $workflowId"
} catch {
    Write-Error "ワークフローIDの取得に失敗しました: $_"
    Write-Info "ワークフローファイル名を確認してください: $WorkflowFile"
    exit 1
}

# ワークフローをトリガー
Write-Info "ワークフローをトリガー中..."
$dispatchUrl = "https://api.github.com/repos/$Owner/$Repo/actions/workflows/$workflowId/dispatches"
$body = @{
    ref = $Branch
    inputs = @{
        environment = $Environment
    }
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $dispatchUrl -Method Post -Headers $headers -Body $body -ContentType "application/json"
    Write-Success "ワークフローが正常にトリガーされました！"
    Write-Host ""
    Write-Info "デプロイ状況を確認:"
    Write-Host "https://github.com/$Owner/$Repo/actions" -ForegroundColor Yellow
    Write-Host ""
    Write-Info "デプロイが完了するまで5-10分かかります"
} catch {
    Write-Error "ワークフローのトリガーに失敗しました: $_"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "エラーレスポンス: $responseBody" -ForegroundColor Red
    }
    exit 1
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "次のステップ" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Info "1. GitHub Actionsでデプロイ状況を確認:"
Write-Host "   https://github.com/$Owner/$Repo/actions" -ForegroundColor Yellow
Write-Host ""
Write-Info "2. Vercel Dashboardでデプロイを確認:"
Write-Host "   https://vercel.com/dashboard" -ForegroundColor Yellow
Write-Host ""
Write-Info "3. デプロイが完了したら、アプリケーションで動作確認"
