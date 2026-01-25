# デプロイメントガイド

## 前提条件

- Docker 20.10以上
- Docker Compose 2.0以上
- 最低8GB RAM
- 最低20GB ディスク容量

## 環境変数の設定

### 必須環境変数

```bash
# データベース
POSTGRES_PASSWORD=<強力なパスワード>

# Redis
REDIS_PASSWORD=<強力なパスワード>

# JWT
JWT_SECRET=<256ビット以上のランダム文字列>

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### 推奨環境変数

```bash
# メール設定（通知用）
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password

# Slack（アラート用）
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

## デプロイ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd production_control_system
```

### 2. 環境変数ファイルの作成

```bash
cp .env.example .env
# .envファイルを編集して環境変数を設定
```

### 3. データベースの初期化

```bash
# データベーススキーマの適用
docker-compose up -d postgres
sleep 10
docker-compose exec postgres psql -U production_user -d production_control -f /docker-entrypoint-initdb.d/01_schema.sql
```

### 4. 全サービスの起動

```bash
docker-compose up -d
```

### 5. ヘルスチェック

```bash
# 全サービスの状態確認
docker-compose ps

# 各サービスのヘルスチェック
curl http://localhost:8080/actuator/health  # API Gateway
curl http://localhost:8087/actuator/health  # Auth Service
curl http://localhost:3000/health            # Frontend
```

## 本番環境デプロイ

### Kubernetesデプロイ

```bash
# 名前空間の作成
kubectl create namespace production-control

# シークレットの作成
kubectl create secret generic production-control-secrets \
  --from-env-file=.env \
  -n production-control

# デプロイ
kubectl apply -f k8s/ -n production-control

# ロールアウトの確認
kubectl rollout status deployment/api-gateway -n production-control
```

### Docker Swarmデプロイ

```bash
# Swarmの初期化
docker swarm init

# スタックのデプロイ
docker stack deploy -c docker-compose.prod.yml production-control

# サービスの確認
docker service ls
```

## バックアップとリストア

### データベースバックアップ

```bash
# バックアップ
docker-compose exec postgres pg_dump -U production_user production_control > backup_$(date +%Y%m%d_%H%M%S).sql

# リストア
docker-compose exec -T postgres psql -U production_user production_control < backup_20240101_120000.sql
```

### Redisバックアップ

```bash
# バックアップ
docker-compose exec redis redis-cli --rdb /data/dump.rdb
docker cp production-control-redis:/data/dump.rdb ./redis_backup_$(date +%Y%m%d_%H%M%S).rdb
```

## ロールバック手順

```bash
# 前のバージョンのイメージにロールバック
docker-compose pull
docker-compose up -d --force-recreate <service-name>

# または、特定のタグを使用
docker-compose up -d --force-recreate --no-deps <service-name>
```

## モニタリングとログ

### ログの確認

```bash
# 全サービスのログ
docker-compose logs -f

# 特定のサービスのログ
docker-compose logs -f api-gateway

# 最新100行のログ
docker-compose logs --tail=100 api-gateway
```

### メトリクスの確認

- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (admin/admin)
- Kibana: http://localhost:5601

## トラブルシューティング

### サービスが起動しない

```bash
# ログを確認
docker-compose logs <service-name>

# コンテナの状態を確認
docker-compose ps

# コンテナを再起動
docker-compose restart <service-name>
```

### データベース接続エラー

```bash
# データベースの状態確認
docker-compose exec postgres pg_isready -U production_user

# 接続テスト
docker-compose exec postgres psql -U production_user -d production_control -c "SELECT 1;"
```

### メモリ不足

```bash
# リソース使用量の確認
docker stats

# 不要なコンテナ・イメージの削除
docker system prune -a
```

## パフォーマンスチューニング

### データベース

- 接続プールサイズの調整
- インデックスの最適化
- クエリの最適化

### アプリケーション

- JVMヒープサイズの調整
- キャッシュ設定の最適化
- スレッドプールサイズの調整

## セキュリティチェックリスト

- [ ] 強力なパスワードを使用
- [ ] JWTシークレットを変更
- [ ] HTTPSを有効化
- [ ] CORS設定を適切に構成
- [ ] ファイアウォールルールを設定
- [ ] 定期的なバックアップを設定
- [ ] セキュリティパッチを適用
- [ ] ログ監視を設定
