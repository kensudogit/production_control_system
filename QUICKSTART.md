# クイックスタートガイド

## 5分で始める

### 1. 前提条件の確認

```bash
# Dockerの確認
docker --version
docker-compose --version

# 必要なポートが空いているか確認
# 3000, 5432, 6379, 8080, 8081-8087, 9090, 3001, 5601
```

### 2. 環境変数の設定

```bash
# .envファイルを作成
cp env.example .env

# 最低限の設定（開発環境）
# .envファイルを編集して以下を設定:
# POSTGRES_PASSWORD=your_password
# REDIS_PASSWORD=your_password
# JWT_SECRET=your-256-bit-secret-key
```

### 3. データベースの初期化

```bash
# PostgreSQLコンテナを起動
docker-compose up -d postgres

# データベースが準備できるまで待機（約10秒）
sleep 10

# スキーマの適用
docker-compose exec postgres psql -U production_user -d production_control -f /docker-entrypoint-initdb.d/01_schema.sql
docker-compose exec postgres psql -U production_user -d production_control -f /docker-entrypoint-initdb.d/02_indexes.sql
docker-compose exec postgres psql -U production_user -d production_control -f /docker-entrypoint-initdb.d/03_views.sql
docker-compose exec postgres psql -U production_user -d production_control -f /docker-entrypoint-initdb.d/04_functions.sql
```

### 4. 全サービスの起動

```bash
# 全サービスを起動
docker-compose up -d

# ログを確認
docker-compose logs -f
```

### 5. 動作確認

```bash
# ヘルスチェック
curl http://localhost:8080/actuator/health  # API Gateway
curl http://localhost:8087/actuator/health   # Auth Service
curl http://localhost:3000                   # Frontend

# ブラウザでアクセス
# Frontend: http://localhost:3000
# Grafana: http://localhost:3001 (admin/admin)
# Prometheus: http://localhost:9090
# Kibana: http://localhost:5601
```

### 6. 初回ログイン

デフォルトの管理者アカウント:
- **Username**: admin
- **Password**: admin123

**重要**: 本番環境では必ずパスワードを変更してください。

### 7. サンプルデータの確認

システムには顧客プレゼン用の豊富なサンプルデータが含まれています：
- 18種類の製品
- 20種類の原材料
- 12件の生産計画（進行中、計画中、完了）
- 38アイテムの在庫データ
- 複数の品質検査データ
- 詳細な原価計算データ

詳細は [DEMO_GUIDE.md](DEMO_GUIDE.md) を参照してください。

## 開発モード

### フロントエンドのみ開発

```bash
cd frontend
npm install
npm run dev
```

### バックエンドのみ開発

```bash
# データベースとRedisのみ起動
docker-compose up -d postgres redis

# 各サービスを個別に起動
cd api-gateway
./gradlew bootRun
```

## よくある問題

### ポートが既に使用されている

```bash
# 使用中のポートを確認
netstat -ano | findstr :3000

# docker-compose.ymlでポートを変更
```

### データベース接続エラー

```bash
# データベースの状態確認
docker-compose exec postgres pg_isready -U production_user

# データベースを再起動
docker-compose restart postgres
```

### メモリ不足

```bash
# Dockerのリソース使用量を確認
docker stats

# 不要なコンテナを削除
docker system prune -a
```

## 次のステップ

1. [README.md](README.md) - 詳細なドキュメント
2. [DEMO_GUIDE.md](DEMO_GUIDE.md) - 顧客プレゼン・デモンストレーションガイド
3. [DEPLOYMENT.md](DEPLOYMENT.md) - デプロイメントガイド
4. [SECURITY.md](SECURITY.md) - セキュリティポリシー
5. [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) - 本番環境チェックリスト
