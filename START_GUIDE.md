# 起動手順ガイド

## 🚀 簡単な起動方法（推奨）

### ステップ1: 前提条件の確認

```powershell
# Dockerが起動しているか確認
docker --version
docker-compose --version

# Docker Desktopが起動していることを確認
```

### ステップ2: 既存のコンテナを停止・削除（初回または再起動時）

```powershell
# プロジェクトディレクトリに移動
cd C:\devlop\production_control_system

# 既存のコンテナとネットワークを停止・削除
docker-compose down
```

### ステップ3: 全サービスを起動

```powershell
# 全サービスをビルドして起動（バックグラウンド）
docker-compose up -d --build

# または、ログを確認しながら起動したい場合
docker-compose up --build
```

### ステップ4: 起動確認

```powershell
# コンテナの状態を確認
docker-compose ps

# ログを確認（Ctrl+Cで終了）
docker-compose logs -f

# 特定のサービスのログを確認
docker-compose logs -f frontend
docker-compose logs -f api-gateway
docker-compose logs -f postgres
```

### ステップ5: アクセス

起動が完了したら、以下のURLにアクセスできます：

- **フロントエンド**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Grafana（監視）**: http://localhost:3001 (admin/admin)
- **Prometheus（メトリクス）**: http://localhost:9090
- **Kibana（ログ）**: http://localhost:5601

## 📋 詳細な起動手順

### 方法1: 一括起動（最も簡単）

```powershell
cd C:\devlop\production_control_system
docker-compose down
docker-compose up -d --build
```

### 方法2: 段階的起動（推奨：問題の特定が容易）

```powershell
# 1. データベースとRedisを先に起動
docker-compose up -d postgres redis

# 2. データベースが準備できるまで待機（約10-15秒）
Start-Sleep -Seconds 15

# 3. バックエンドサービスを起動
docker-compose up -d api-gateway auth-service

# 4. フロントエンドを起動
docker-compose up -d frontend

# 5. 監視ツールを起動（オプション）
docker-compose up -d prometheus grafana
```

### 方法3: 開発モード（フロントエンドのみ）

```powershell
# バックエンドサービス（DB、Redis、API）のみ起動
docker-compose up -d postgres redis api-gateway auth-service

# フロントエンドを開発モードで起動
cd frontend
npm install
npm run dev
```

## 🔍 起動確認コマンド

### コンテナの状態確認

```powershell
# 全コンテナの状態
docker-compose ps

# 実行中のコンテナのみ
docker ps

# 詳細な状態（リソース使用量含む）
docker stats
```

### ヘルスチェック

```powershell
# API Gateway
curl http://localhost:8080/actuator/health

# Auth Service
curl http://localhost:8087/actuator/health

# Frontend
curl http://localhost:3000/health

# PostgreSQL
docker-compose exec postgres pg_isready -U production_user
```

### ログ確認

```powershell
# 全サービスのログ
docker-compose logs -f

# 特定のサービスのログ
docker-compose logs -f frontend
docker-compose logs -f api-gateway
docker-compose logs -f postgres

# 最新100行のログ
docker-compose logs --tail=100 frontend
```

## 🛠️ トラブルシューティング

### ポートが既に使用されている

```powershell
# 使用中のポートを確認
netstat -ano | findstr :3000
netstat -ano | findstr :8080
netstat -ano | findstr :5432

# プロセスを終了する必要がある場合
# タスクマネージャーで該当プロセスを終了
```

### ネットワークエラーが発生する

```powershell
# 既存のネットワークを削除
docker network prune -f

# コンテナを停止・削除して再起動
docker-compose down
docker-compose up -d --build
```

### データベース接続エラー

```powershell
# データベースコンテナの状態確認
docker-compose ps postgres

# データベースのログ確認
docker-compose logs postgres

# データベースを再起動
docker-compose restart postgres

# データベースに接続して確認
docker-compose exec postgres psql -U production_user -d production_control
```

### ビルドエラーが発生する

```powershell
# キャッシュなしで再ビルド
docker-compose build --no-cache

# 特定のサービスのみ再ビルド
docker-compose build --no-cache frontend
```

### メモリ不足

```powershell
# Dockerのリソース使用量を確認
docker stats

# 不要なコンテナ・イメージ・ボリュームを削除
docker system prune -a --volumes
```

## 📝 よく使うコマンド

```powershell
# 起動
docker-compose up -d

# 停止
docker-compose stop

# 停止して削除
docker-compose down

# 再起動
docker-compose restart

# 特定のサービスのみ再起動
docker-compose restart frontend

# ログをリアルタイムで確認
docker-compose logs -f

# コンテナ内でコマンド実行
docker-compose exec postgres psql -U production_user -d production_control
docker-compose exec frontend sh

# 環境変数の確認
docker-compose config
```

## ⚠️ 注意事項

1. **初回起動時**: データベースの初期化に時間がかかることがあります（1-2分）
2. **メモリ**: 全サービスを起動する場合、最低4GB以上のメモリを推奨
3. **ポート**: 必要なポート（3000, 5432, 6379, 8080, 8087など）が空いていることを確認
4. **Docker Desktop**: WindowsではDocker Desktopが起動している必要があります

## 🎯 次のステップ

- システムが正常に起動したら、[DEMO_GUIDE.md](DEMO_GUIDE.md) を参照してデモデータを確認
- 開発を始める場合は、[QUICKSTART.md](QUICKSTART.md) の開発モードセクションを参照
- 本番環境へのデプロイは、[DEPLOYMENT.md](DEPLOYMENT.md) を参照
