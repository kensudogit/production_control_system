# 🚂 Railway完全公開デプロイ手順

## ✅ 準備完了

Railwayへの完全公開デプロイの設定が完了しました。

## 📋 Railwayデプロイの概要

Railwayは、Dockerコンテナベースのクラウドプラットフォームです。以下のサービスをデプロイできます：

1. **フロントエンド** (React + Vite)
2. **API Gateway** (Spring Boot)
3. **Auth Service** (Spring Boot)
4. **その他のマイクロサービス**

## 🚀 デプロイ手順

### 方法1: Railway Dashboardからデプロイ（推奨・最も簡単）

#### ステップ1: Railwayアカウントの作成

1. **Railwayにアクセス**
   - https://railway.app にアクセス
   - 「Start a New Project」をクリック
   - GitHubアカウントでログイン

#### ステップ2: プロジェクトの作成

1. **「New Project」をクリック**
2. **「Deploy from GitHub repo」を選択**
3. **リポジトリを選択**: `kensudogit/production_control_system`
4. **「Deploy Now」をクリック**

#### ステップ3: サービスごとにデプロイ設定

Railwayは各サービスを個別にデプロイする必要があります。

##### 3-1. フロントエンドのデプロイ

1. **「New Service」をクリック**
2. **「GitHub Repo」を選択**
3. **リポジトリ**: `kensudogit/production_control_system`
4. **Root Directory**: `/frontend` を設定（重要！）
5. **Dockerfile Path**: `Dockerfile` を設定（`frontend/Dockerfile`ではない）
6. **または、Root Directoryを設定せず、Dockerfile Path**: `frontend/Dockerfile` を設定

**重要**: Root Directoryを`/frontend`に設定する場合、Dockerfile Pathは`Dockerfile`（`frontend/Dockerfile`ではない）を指定してください。ビルドコンテキストが`frontend`ディレクトリになるためです。

##### 3-2. API Gatewayのデプロイ

1. **「New Service」をクリック**
2. **「GitHub Repo」を選択**
3. **リポジトリ**: `kensudogit/production_control_system`
4. **Root Directory**: `/api-gateway` を設定
5. **Dockerfile Path**: `api-gateway/Dockerfile` を設定

##### 3-3. Auth Serviceのデプロイ

1. **「New Service」をクリック**
2. **「GitHub Repo」を選択**
3. **リポジトリ**: `kensudogit/production_control_system`
4. **Root Directory**: `/auth-service` を設定
5. **Dockerfile Path**: `auth-service/Dockerfile` を設定

#### ステップ4: 環境変数の設定

各サービスで以下の環境変数を設定：

**フロントエンド**:
```
VITE_API_BASE_URL=https://your-api-gateway.railway.app
VITE_OPENAI_API_KEY=your-openai-api-key
NODE_ENV=production
```

**API Gateway**:
```
SPRING_PROFILES_ACTIVE=production
SPRING_DATASOURCE_URL=jdbc:postgresql://your-postgres.railway.app:5432/production_control
SPRING_DATASOURCE_USERNAME=production_user
SPRING_DATASOURCE_PASSWORD=your-database-password
SPRING_REDIS_HOST=your-redis.railway.app
SPRING_REDIS_PORT=6379
SPRING_REDIS_PASSWORD=your-redis-password
PORT=8080
```

**Auth Service**:
```
SPRING_PROFILES_ACTIVE=production
SPRING_DATASOURCE_URL=jdbc:postgresql://your-postgres.railway.app:5432/production_control
SPRING_DATASOURCE_USERNAME=production_user
SPRING_DATASOURCE_PASSWORD=your-database-password
SPRING_REDIS_HOST=your-redis.railway.app
SPRING_REDIS_PORT=6379
SPRING_REDIS_PASSWORD=your-redis-password
JWT_SECRET=your-256-bit-secret-key-change-this-in-production
PORT=8087
```

#### ステップ5: データベースの設定

1. **「New」→「Database」→「PostgreSQL」を選択**
2. データベースが作成されます
3. **接続情報をコピー**して、各サービスの環境変数に設定

#### ステップ6: Redisの設定

1. **「New」→「Database」→「Redis」を選択**
2. Redisが作成されます
3. **接続情報をコピー**して、各サービスの環境変数に設定

#### ステップ7: 公開設定

1. **各サービスの「Settings」タブを開く**
2. **「Generate Domain」をクリック**して公開URLを生成
3. **または、カスタムドメインを設定**

### 方法2: Railway CLIを使用

#### ステップ1: Railway CLIのインストール

```powershell
# Windows (PowerShell)
iwr https://railway.app/install.ps1 | iex

# または npm経由
npm install -g @railway/cli
```

#### ステップ2: ログイン

```powershell
railway login
```

#### ステップ3: プロジェクトの初期化

```powershell
cd C:\devlop\production_control_system

# プロジェクトを初期化
railway init

# プロジェクトをリンク
railway link
```

#### ステップ4: 環境変数の設定

```powershell
# フロントエンドの環境変数を設定
railway variables set VITE_API_BASE_URL=https://your-api-gateway.railway.app
railway variables set VITE_OPENAI_API_KEY=your-openai-api-key
railway variables set NODE_ENV=production

# API Gatewayの環境変数を設定
railway variables set SPRING_PROFILES_ACTIVE=production
railway variables set SPRING_DATASOURCE_URL=jdbc:postgresql://your-postgres.railway.app:5432/production_control
# ... 他の環境変数も同様に設定
```

#### ステップ5: デプロイ

```powershell
# フロントエンドをデプロイ
cd frontend
railway up

# API Gatewayをデプロイ
cd ../api-gateway
railway up

# Auth Serviceをデプロイ
cd ../auth-service
railway up
```

## 🔧 Railway設定ファイル

### railway.json（ルート）

各サービス用の設定ファイルを作成できます：

**`frontend/railway.json`**:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "nginx -g 'daemon off;'",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**`api-gateway/railway.json`**:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "java $JAVA_OPTS -jar app.jar",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## 📊 デプロイ後の確認

### 1. デプロイURLにアクセス

Railway Dashboardで各サービスのURLを確認：
- フロントエンド: `https://your-frontend.railway.app`
- API Gateway: `https://your-api-gateway.railway.app`
- Auth Service: `https://your-auth-service.railway.app`

### 2. ヘルスチェック

```bash
# API Gateway
curl https://your-api-gateway.railway.app/actuator/health

# Auth Service
curl https://your-auth-service.railway.app/actuator/health
```

### 3. フロントエンドの動作確認

1. **ブラウザでフロントエンドURLにアクセス**
2. **開発者ツール（F12）でエラーを確認**
3. **API接続が正常に動作することを確認**

## 🔒 セキュリティ設定

### 1. 環境変数の保護

- Railway Dashboardで環境変数を設定（暗号化保存）
- 機密情報（APIキー、パスワード）は絶対にコードに含めない

### 2. HTTPSの有効化

- Railwayは自動的にHTTPSを提供
- カスタムドメインを設定する場合もHTTPSが自動有効化

### 3. CORS設定

API Gatewayの`application.yml`でCORSを設定：

```yaml
spring:
  cloud:
    gateway:
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins:
              - https://your-frontend.railway.app
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
              - OPTIONS
            allowedHeaders: "*"
            allowCredentials: true
```

## 💰 Railway料金

- **無料プラン**: $5/月のクレジット（開発・テスト用）
- **Proプラン**: $20/月（本番環境推奨）
- **詳細**: https://railway.app/pricing

## 🔧 トラブルシューティング

### ビルドエラー

**問題**: Dockerビルドが失敗する

**解決方法**:
1. Railway Dashboardの「Deployments」タブでログを確認
2. ローカルでDockerビルドをテスト：
   ```powershell
   docker build -t test -f frontend/Dockerfile .
   ```
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
3. データベースが起動しているか確認

## 📚 関連ドキュメント

- `DOCKER_BUILD_FIX.md` - Dockerビルドエラーの修正
- `docker-compose.yml` - ローカル開発環境の設定
- Railway公式ドキュメント: https://docs.railway.app

## 🎯 次のステップ

1. ✅ Railwayアカウントを作成
2. ✅ プロジェクトを作成してGitHubリポジトリを接続
3. ✅ 各サービスをデプロイ
4. ✅ 環境変数を設定
5. ✅ データベースとRedisを設定
6. ✅ 公開URLを確認
7. ✅ 動作確認

## ⚠️ 注意事項

- Railwayの無料プランには制限があります（月間$5のクレジット）
- 本番環境ではProプランの使用を推奨
- 環境変数はRailway Dashboardで管理してください（コードに含めない）
- データベースのバックアップを定期的に取得してください
