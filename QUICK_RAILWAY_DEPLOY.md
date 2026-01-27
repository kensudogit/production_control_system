# 🚀 Railway完全公開デプロイ - クイックスタート

## ⚡ 5分でデプロイ

### ステップ1: Railway CLIのインストール（初回のみ）

```powershell
npm install -g @railway/cli
railway login
```

### ステップ2: プロジェクトのリンク

```powershell
cd C:\devlop\production_control_system
railway link
```

### ステップ3: デプロイスクリプトの実行

```powershell
.\deploy-railway-public.ps1
```

スクリプトが以下を実行します：
1. Railway CLIの確認
2. ログイン確認
3. プロジェクトのリンク確認
4. サービス選択（フロントエンド、API Gateway、Auth Service、またはすべて）
5. デプロイ実行

### ステップ4: Railway Dashboardで設定

1. **データベースとRedisを追加**:
   - Railway Dashboard → **New** → **Database** → **PostgreSQL**
   - Railway Dashboard → **New** → **Database** → **Redis**

2. **環境変数を設定**:
   - 各サービス → **Settings** → **Variables**
   - `railway.env.example`を参考に設定

3. **公開URLを生成**:
   - 各サービス → **Settings** → **Networking** → **Generate Domain**

4. **フロントエンドの環境変数を更新**:
   - `VITE_API_BASE_URL`をAPI Gatewayの公開URLに設定

## 📋 詳細な手順

詳細は `RAILWAY_PUBLIC_DEPLOY.md` を参照してください。

## ✅ デプロイ後の確認

```bash
# API Gateway
curl https://your-api-gateway.railway.app/actuator/health

# Frontend
curl https://your-frontend.railway.app/health
```

## 🔧 トラブルシューティング

- **ビルドエラー**: Railway Dashboard → Deployments → ログを確認
- **環境変数エラー**: Settings → Variables で設定を確認
- **接続エラー**: 公開URLが正しく設定されているか確認
