# 🚂 Railway完全公開デプロイガイド

## 📋 概要

このガイドでは、Production Control SystemをRailwayに完全公開モードでデプロイする手順を説明します。

## ✅ 前提条件

1. **Railwayアカウント**: https://railway.app でアカウント作成
2. **GitHubリポジトリ**: コードがGitHubにプッシュされていること
3. **Railway CLI** (オプション): コマンドラインからデプロイする場合

## 🚀 デプロイ手順

### ステップ1: Railwayプロジェクトの作成

1. **Railway Dashboardにアクセス**
   - https://railway.app/dashboard にアクセス
   - 「New Project」をクリック

2. **GitHubリポジトリを選択**
   - 「Deploy from GitHub repo」を選択
   - リポジトリ `kensudogit/production_control_system` を選択
   - 「Deploy Now」をクリック

### ステップ2: データベースとRedisの設定

#### 2-1. PostgreSQLの追加

1. **「New」→「Database」→「PostgreSQL」を選択**
2. PostgreSQLサービスが作成されます
3. **接続情報をコピー**:
   - Railway Dashboard → PostgreSQL Service → Variables
   - `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` を確認

#### 2-2. Redisの追加

1. **「New」→「Database」→「Redis」を選択**
2. Redisサービスが作成されます
3. **接続情報をコピー**:
   - Railway Dashboard → Redis Service → Variables
   - `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` を確認

### ステップ3: サービスのデプロイ

#### 3-1. API Gatewayのデプロイ

1. **「New Service」→「GitHub Repo」を選択**
2. **リポジトリ**: `kensudogit/production_control_system`
3. **設定**:
   - **Root Directory**: `/api-gateway` を設定
   - **Dockerfile Path**: `Dockerfile` を設定（Root Directoryが`/api-gateway`の場合）
   - または、Root Directoryを設定せず、**Dockerfile Path**: `api-gateway/Dockerfile` を設定

4. **環境変数の設定** (Settings → Variables):
   ```
   SPRING_PROFILES_ACTIVE=production
   SPRING_DATASOURCE_URL=jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
   SPRING_DATASOURCE_USERNAME=${{Postgres.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{Postgres.PGPASSWORD}}
   SPRING_REDIS_HOST=${{Redis.REDIS_HOST}}
   SPRING_REDIS_PORT=${{Redis.REDIS_PORT}}
   SPRING_REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}
   PORT=8080
   JAVA_OPTS=-Xmx512m -Xms256m -XX:+UseG1GC -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0
   ```

5. **公開設定**:
   - **Settings** → **Networking** → **Generate Domain** をクリック
   - 公開URLが生成されます（例: `api-gateway-production.up.railway.app`）

#### 3-2. Auth Serviceのデプロイ

1. **「New Service」→「GitHub Repo」を選択**
2. **リポジトリ**: `kensudogit/production_control_system`
3. **設定**:
   - **Root Directory**: `/auth-service`
   - **Dockerfile Path**: `Dockerfile`

4. **環境変数の設定**:
   ```
   SPRING_PROFILES_ACTIVE=production
   SPRING_DATASOURCE_URL=jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
   SPRING_DATASOURCE_USERNAME=${{Postgres.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{Postgres.PGPASSWORD}}
   SPRING_REDIS_HOST=${{Redis.REDIS_HOST}}
   SPRING_REDIS_PORT=${{Redis.REDIS_PORT}}
   SPRING_REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}
   JWT_SECRET=your-256-bit-secret-key-change-this-in-production-environment-minimum-32-characters
   PORT=8087
   JAVA_OPTS=-Xmx512m -Xms256m -XX:+UseG1GC -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0
   ```

5. **公開設定**:
   - **Settings** → **Networking** → **Generate Domain** をクリック

#### 3-3. フロントエンドのデプロイ

1. **「New Service」→「GitHub Repo」を選択**
2. **リポジトリ**: `kensudogit/production_control_system`
3. **設定**:
   - **Root Directory**: `/frontend`
   - **Dockerfile Path**: `Dockerfile.root` を設定
   - **または**: Root Directoryを設定せず、**Dockerfile Path**: `frontend/Dockerfile.root` を設定

4. **環境変数の設定**:
   ```
   VITE_API_BASE_URL=https://your-api-gateway.railway.app
   VITE_OPENAI_API_KEY=your-openai-api-key-here
   NODE_ENV=production
   PORT=80
   ```

   **重要**: `VITE_API_BASE_URL`は、API Gatewayの公開URLに設定してください。

5. **公開設定**:
   - **Settings** → **Networking** → **Generate Domain** をクリック
   - 公開URLが生成されます（例: `frontend-production.up.railway.app`）

### ステップ4: サービス間の接続設定

#### 4-1. サービス変数の設定

Railwayでは、サービス間の接続に`${{ServiceName.VariableName}}`構文を使用します。

**API Gateway**の環境変数で、Auth ServiceのURLを設定:
```
AUTH_SERVICE_URL=https://your-auth-service.railway.app
```

**フロントエンド**の環境変数で、API GatewayのURLを設定:
```
VITE_API_BASE_URL=https://your-api-gateway.railway.app
```

### ステップ5: データベースの初期化

PostgreSQLにスキーマを適用する必要があります。

1. **Railway CLIを使用**:
   ```powershell
   railway run psql -h $PGHOST -U $PGUSER -d $PGDATABASE -f database/init/01_schema.sql
   ```

2. **または、Railway Dashboardから**:
   - PostgreSQL Service → **Connect** → **Query** タブ
   - `database/init/01_schema.sql` の内容を実行

### ステップ6: CORS設定の更新

API Gatewayの`application.yml`で、フロントエンドのURLを許可する必要があります。

**Railway Dashboard → API Gateway Service → Variables** に追加:
```
CORS_ALLOWED_ORIGINS=https://your-frontend.railway.app
```

または、`application.yml`を更新して、Railwayのドメインを許可:
```yaml
spring:
  cloud:
    gateway:
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins:
              - https://your-frontend.railway.app
              - https://*.railway.app  # Railwayのすべてのドメインを許可
```

## 🔧 Railway CLIを使用したデプロイ

### CLIのインストール

```powershell
# npm経由
npm install -g @railway/cli

# またはPowerShell経由
iwr https://railway.app/install.ps1 | iex
```

### ログインとプロジェクトのリンク

```powershell
# ログイン
railway login

# プロジェクトディレクトリに移動
cd C:\devlop\production_control_system

# プロジェクトをリンク
railway link
```

### デプロイスクリプトの実行

```powershell
.\deploy-railway.ps1
```

または、個別にデプロイ:

```powershell
# API Gateway
cd api-gateway
railway up

# Auth Service
cd ../auth-service
railway up

# Frontend
cd ../frontend
railway up
```

## 🌐 完全公開モードの設定

### 公開ドメインの生成

各サービスで以下を実行:

1. **Railway Dashboard** → **サービス** → **Settings** → **Networking**
2. **「Generate Domain」**をクリック
3. 公開URLが生成されます（例: `service-name-production.up.railway.app`）

### カスタムドメインの設定（オプション）

1. **Settings** → **Networking** → **Custom Domain**
2. カスタムドメインを入力
3. DNS設定をRailwayの指示に従って設定

## 📊 デプロイ後の確認

### 1. ヘルスチェック

```bash
# API Gateway
curl https://your-api-gateway.railway.app/actuator/health

# Auth Service
curl https://your-auth-service.railway.app/actuator/health

# Frontend
curl https://your-frontend.railway.app/health
```

### 2. ログの確認

```powershell
# Railway CLIでログを確認
railway logs

# または、Railway Dashboard → サービス → Deployments → ログを確認
```

### 3. 動作確認

1. **フロントエンドURLにアクセス**
2. **開発者ツール（F12）でエラーを確認**
3. **API接続が正常に動作することを確認**

## 🔒 セキュリティ設定

### 1. 環境変数の保護

- Railway Dashboardで環境変数を設定（暗号化保存）
- 機密情報（APIキー、パスワード）は絶対にコードに含めない
- `railway.env.example`を参考に設定

### 2. HTTPSの有効化

- Railwayは自動的にHTTPSを提供
- カスタムドメインを設定する場合もHTTPSが自動有効化

### 3. データベースのセキュリティ

- 強力なパスワードを使用
- 接続をRailwayネットワーク内に制限（可能な場合）

## 💰 Railway料金

- **無料プラン**: $5/月のクレジット（開発・テスト用）
- **Proプラン**: $20/月（本番環境推奨）
- **詳細**: https://railway.app/pricing

## 🔧 トラブルシューティング

### ビルドエラー

**問題**: Dockerビルドが失敗する

**解決方法**:
1. Railway Dashboardの「Deployments」タブでログを確認
2. ローカルでDockerビルドをテスト
3. エラーメッセージに従って修正

### 環境変数のエラー

**問題**: 環境変数が読み込まれない

**解決方法**:
1. Railway Dashboardで環境変数が正しく設定されているか確認
2. サービスを再デプロイ
3. 環境変数の名前が正しいか確認（大文字小文字に注意）

### データベース接続エラー

**問題**: データベースに接続できない

**解決方法**:
1. Railway DashboardでPostgreSQLサービスの接続情報を確認
2. 環境変数`SPRING_DATASOURCE_URL`が正しいか確認
3. `${{Postgres.PGHOST}}`などの変数参照が正しいか確認

### サービス間の接続エラー

**問題**: サービス間で通信できない

**解決方法**:
1. 各サービスの公開URLが正しく設定されているか確認
2. 環境変数で正しいURLが設定されているか確認
3. CORS設定が正しいか確認

## 📚 関連ドキュメント

- `railway.env.example` - 環境変数のテンプレート
- `railway.json` - Railway設定ファイル
- Railway公式ドキュメント: https://docs.railway.app

## 🎯 クイックスタート

```powershell
# 1. Railway CLIをインストール
npm install -g @railway/cli

# 2. ログイン
railway login

# 3. プロジェクトをリンク
cd C:\devlop\production_control_system
railway link

# 4. デプロイスクリプトを実行
.\deploy-railway.ps1

# 5. Railway Dashboardで環境変数を設定
# 6. 公開URLを生成
# 7. 動作確認
```

## ⚠️ 注意事項

- Railwayの無料プランには制限があります（月間$5のクレジット）
- 本番環境ではProプランの使用を推奨
- 環境変数はRailway Dashboardで管理してください（コードに含めない）
- データベースのバックアップを定期的に取得してください
- 公開URLは自動生成されますが、カスタムドメインも設定可能です
