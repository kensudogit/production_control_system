# 🚂 Railwayクイックスタートガイド

## ⚡ 5分でデプロイ

### ステップ1: Railwayアカウント作成

1. https://railway.app にアクセス
2. 「Start a New Project」をクリック
3. GitHubアカウントでログイン

### ステップ2: プロジェクト作成

1. 「New Project」をクリック
2. 「Deploy from GitHub repo」を選択
3. `kensudogit/production_control_system` を選択
4. 「Deploy Now」をクリック

### ステップ3: フロントエンドのデプロイ

1. 「New Service」をクリック
2. 「GitHub Repo」を選択
3. リポジトリ: `kensudogit/production_control_system`
4. **Root Directory**: `/frontend` を設定（重要！）
5. **Dockerfile Path**: `Dockerfile` を設定（`frontend/Dockerfile`ではない）
6. 「Deploy」をクリック

**重要**: Root Directoryを`/frontend`に設定する場合、Dockerfile Pathは`Dockerfile`を指定してください。ビルドコンテキストが`frontend`ディレクトリになるためです。

### ステップ4: 環境変数の設定

フロントエンドサービスの「Variables」タブで以下を設定：

```
VITE_API_BASE_URL=https://your-api-gateway.railway.app
VITE_OPENAI_API_KEY=your-openai-api-key
NODE_ENV=production
```

### ステップ5: 公開URLの生成

1. フロントエンドサービスの「Settings」タブを開く
2. 「Generate Domain」をクリック
3. 公開URLが生成されます

### ステップ6: 動作確認

1. 生成されたURLにアクセス
2. アプリケーションが正常に表示されることを確認

## 🔧 追加サービスのデプロイ

### API Gateway

1. 「New Service」→「GitHub Repo」
2. Root Directory: `/api-gateway`
3. Dockerfile Path: `api-gateway/Dockerfile`
4. 環境変数を設定（`RAILWAY_DEPLOYMENT.md`を参照）

### Auth Service

1. 「New Service」→「GitHub Repo」
2. Root Directory: `/auth-service`
3. Dockerfile Path: `auth-service/Dockerfile`
4. 環境変数を設定（`RAILWAY_DEPLOYMENT.md`を参照）

## 📚 詳細情報

詳細な手順は `RAILWAY_DEPLOYMENT.md` を参照してください。
