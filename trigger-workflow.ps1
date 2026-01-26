# Trigger GitHub Actions workflow dispatch
$owner = "kensudogit"
$repo = "production_control_system"
$workflowFile = "vercel-production-deploy.yml"
$branch = "main"
$environment = "production"

Write-Host "GitHub Personal Access Token required" -ForegroundColor Yellow
Write-Host "Get token: https://github.com/settings/tokens" -ForegroundColor Cyan
$token = Read-Host "Enter GitHub Personal Access Token"

if ([string]::IsNullOrEmpty($token)) {
    Write-Host "Token not provided" -ForegroundColor Red
    exit 1
}

# Get workflow ID
Write-Host "Getting workflow ID..." -ForegroundColor Cyan
$workflowUrl = "https://api.github.com/repos/$owner/$repo/actions/workflows/$workflowFile"
$headers = @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/vnd.github.v3+json"
}

try {
    $workflow = Invoke-RestMethod -Uri $workflowUrl -Method Get -Headers $headers
    $workflowId = $workflow.id
    Write-Host "Workflow ID: $workflowId" -ForegroundColor Green
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Trigger workflow
Write-Host "Triggering workflow..." -ForegroundColor Cyan
$dispatchUrl = "https://api.github.com/repos/$owner/$repo/actions/workflows/$workflowId/dispatches"
$body = @{
    ref = $branch
    inputs = @{
        environment = $environment
    }
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri $dispatchUrl -Method Post -Headers $headers -Body $body -ContentType "application/json"
    Write-Host "Workflow triggered successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Check deployment: https://github.com/$owner/$repo/actions" -ForegroundColor Yellow
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}
