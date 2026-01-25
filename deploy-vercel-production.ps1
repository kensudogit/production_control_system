# PowerShell script for Vercel Production Deployment
# Vercel本番環境への完全公開デプロイスクリプト
# Encoding: UTF-8

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Stop"

# カラー定義
function Write-Info { Write-Host "[INFO] $args" -ForegroundColor Cyan }
function Write-Success { Write-Host "[SUCCESS] $args" -ForegroundColor Green }
function Write-Warning { Write-Host "[WARNING] $args" -ForegroundColor Yellow }
function Write-Error { Write-Host "[ERROR] $args" -ForegroundColor Red }

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Vercel本番環境への完全公開デプロイ" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Vercel CLIの確認
Write-Info "Vercel CLIを確認中..."
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Warning "Vercel CLIがインストールされていません"
    Write-Info "インストール中..."
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Vercel CLIのインストールに失敗しました"
        exit 1
    }
}
Write-Success "Vercel CLIの確認完了"

# Vercelログイン確認
Write-Info "Vercelログイン状態を確認中..."
$loginCheck = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Vercelにログインしていません"
    Write-Info "ログイン中..."
    vercel login
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Vercelログインに失敗しました"
        exit 1
    }
}
Write-Success "Vercelログイン確認完了: $loginCheck"

# プロジェクトの準備
Write-Info "プロジェクトを準備中..."

# フロントエンドの依存関係をインストール
Write-Info "フロントエンドの依存関係をインストール中..."
Set-Location frontend
npm ci
if ($LASTEXITCODE -ne 0) {
    Write-Error "依存関係のインストールに失敗しました"
    exit 1
}
Write-Success "依存関係のインストール完了"

# テストの実行（オプション）
$runTests = Read-Host "テストを実行しますか？ (y/N)"
if ($runTests -eq "y" -or $runTests -eq "Y") {
    Write-Info "テストを実行中..."
    npm run test:run
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "テストが失敗しましたが、続行しますか？ (y/N)"
        $continue = Read-Host
        if ($continue -ne "y" -and $continue -ne "Y") {
            exit 1
        }
    } else {
        Write-Success "テスト完了"
    }
}

# ビルドの実行
Write-Info "フロントエンドをビルド中..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "ビルドに失敗しました"
    exit 1
}
Write-Success "ビルド完了"

Set-Location ..

# Vercelプロジェクトの確認・初期化
Write-Info "Vercelプロジェクトを確認中..."
if (!(Test-Path ".vercel/project.json")) {
    Write-Info "Vercelプロジェクトを初期化中..."
    vercel --yes
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Vercelプロジェクトの初期化に失敗しました"
        exit 1
    }
    Write-Success "Vercelプロジェクトの初期化完了"
} else {
    Write-Success "既存のVercelプロジェクトが見つかりました"
}

# 環境変数の設定
Write-Info "環境変数を設定中..."
if (Test-Path "vercel.env.production") {
    Write-Info "環境変数ファイルから設定を読み込み中..."
    
    Get-Content "vercel.env.production" | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            
            if ($key -and $value -and $value -ne "your-*-here") {
                Write-Info "環境変数を設定: $key"
                echo $value | vercel env add $key production
            }
        }
    }
    Write-Success "環境変数の設定完了"
} else {
    Write-Warning "環境変数ファイルが見つかりません"
}

# 本番デプロイの実行
Write-Info "Vercel本番環境にデプロイ中..."
Write-Warning "これは本番環境へのデプロイです。続行しますか？ (y/N)"
$confirm = Read-Host
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Info "デプロイをキャンセルしました"
    exit 0
}

vercel --prod --yes
if ($LASTEXITCODE -ne 0) {
    Write-Error "デプロイに失敗しました"
    exit 1
}

Write-Success "デプロイが完了しました！"

# デプロイ情報の表示
Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "デプロイ情報" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# デプロイURLを取得
$deploymentInfo = vercel ls --json | ConvertFrom-Json
if ($deploymentInfo) {
    $latestDeployment = $deploymentInfo[0]
    Write-Host "🌐 デプロイURL: https://$($latestDeployment.url)" -ForegroundColor Cyan
    Write-Host "📊 Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor Cyan
    Write-Host "📈 Analytics: https://vercel.com/analytics" -ForegroundColor Cyan
    Write-Host "🔍 Speed Insights: https://vercel.com/speed-insights" -ForegroundColor Cyan
    Write-Host ""
    
    # ブラウザで開く
    Start-Process "https://$($latestDeployment.url)"
}

# 監視の設定
Write-Info "監視を設定中..."
vercel analytics enable 2>&1 | Out-Null
Write-Success "監視の設定完了"

Write-Host ""
Write-Success "✅ 本番環境へのデプロイが完了しました！"
Write-Host ""
Write-Host "次のステップ:" -ForegroundColor Cyan
Write-Host "1. デプロイURLで動作確認" -ForegroundColor White
Write-Host "2. Vercel Dashboardでログを確認" -ForegroundColor White
Write-Host "3. パフォーマンスメトリクスを確認" -ForegroundColor White
Write-Host "4. エラー監視を設定" -ForegroundColor White
Write-Host ""
