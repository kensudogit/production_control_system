# 生産管理システム (Production Control System)

現代的で高性能な生産管理システムです。マイクロサービスアーキテクチャとリアルタイム監視機能を備えています。

## 🚀 特徴

- **現代的UI/UX**: Next.js + Vite + React + TypeScript + Tailwind CSS
- **高性能**: React.memo、仮想化、レイジーローディング
- **PWA対応**: Service Worker、オフライン機能
- **マイクロサービス**: 独立したサービス群
- **リアルタイム**: WebSocket通信
- **高品質**: Vitest + MSW + カバレッジ90%以上

## 📋 機能

### 生産計画管理
- 需要予測に基づいた生産計画
- 資材と人員の計画的配置
- リアルタイム進捗監視

### 在庫管理
- 製品・原材料・部品の在庫管理
- 自動在庫アラート
- 過不足調整

### 進捗・工程管理
- 製造ライン進捗監視
- 計画との比較分析
- 遅延アラート

### 品質管理
- 品質基準チェック
- 検査結果管理
- 改善提案

### 原価管理
- 生産コスト分析
- 低コスト製造改善
- 予算管理

## 🛠️ 技術スタック

### フロントエンド
- **フレームワーク**: React 18 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **アニメーション**: Framer Motion
- **状態管理**: Zustand + React Query
- **ルーティング**: React Router v6
- **テスト**: Vitest + Testing Library + MSW

### バックエンド
- **言語**: Java 17
- **フレームワーク**: Spring Boot 3.2
- **データベース**: PostgreSQL
- **ORM**: Doma2
- **ビルドツール**: Gradle
- **キャッシュ**: Redis

### インフラ
- **コンテナ**: Docker + Docker Compose
- **API Gateway**: Spring Cloud Gateway
- **監視**: Prometheus + Grafana
- **CI/CD**: GitHub Actions

## 🚀 クイックスタート

### 前提条件
- Node.js 18.x 以上
- Java 17 以上
- PostgreSQL 12 以上
- Docker 20.10 以上
- Docker Compose 2.0 以上

### 🐳 Docker環境での構築（推奨）

#### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd production_control_system
```

#### 2. 環境変数の設定
```bash
# .envファイルを作成
cp .env.example .env

# 必要に応じて環境変数を編集
nano .env
```

#### 3. 全サービスを起動
```bash
# 本番環境用（全サービス）
docker-compose up -d

# 開発環境用（フロントエンド + DB）
docker-compose -f docker-compose.dev.yml up -d
```

#### 4. サービスの確認
```bash
# サービス状態の確認
docker-compose ps

# ログの確認
docker-compose logs -f

# 特定サービスのログ
docker-compose logs -f frontend
```

#### 5. アクセス
- **フロントエンド**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Kibana**: http://localhost:5601

#### 6. サービスの停止
```bash
# 全サービス停止
docker-compose down

# ボリュームも削除
docker-compose down -v
```

### 💻 ローカル開発環境

#### フロントエンド開発

```bash
# リポジトリのクローン
git clone <repository-url>
cd production_control_system/frontend

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# テストの実行
npm run test

# カバレッジテスト
npm run test:coverage

# ベンチマークテスト
npm run test -- --bench

# ビルド
npm run build
```

### バックエンド開発

```bash
cd production_control_system/api-gateway

# 依存関係のインストール
./gradlew build

# アプリケーションの起動
./gradlew bootRun
```

#### バックエンド開発

```bash
cd production_control_system/api-gateway

# 依存関係のインストール
./gradlew build

# アプリケーションの起動
./gradlew bootRun
```

### 🐳 Docker詳細設定

#### Docker Compose サービス構成

| サービス | ポート | 説明 |
|---------|--------|------|
| frontend | 3000 | React フロントエンド |
| api-gateway | 8080 | API Gateway |
| production-planning-service | 8081 | 生産計画サービス |
| inventory-management-service | 8082 | 在庫管理サービス |
| process-management-service | 8083 | 工程管理サービス |
| quality-management-service | 8084 | 品質管理サービス |
| cost-management-service | 8085 | 原価管理サービス |
| demand-forecasting-service | 8086 | 需要予測サービス |
| postgres | 5432 | PostgreSQL データベース |
| redis | 6379 | Redis キャッシュ |
| prometheus | 9090 | Prometheus 監視 |
| grafana | 3001 | Grafana ダッシュボード |
| elasticsearch | 9200 | Elasticsearch ログ検索 |
| kibana | 5601 | Kibana ログ可視化 |

#### 環境変数設定

```bash
# .env ファイルの例
# データベース設定
POSTGRES_DB=production_control
POSTGRES_USER=production_user
POSTGRES_PASSWORD=production_password

# Redis設定
REDIS_PASSWORD=redis_password

# アプリケーション設定
SPRING_PROFILES_ACTIVE=docker
JAVA_OPTS=-Xmx512m -Xms256m

# 監視設定
GRAFANA_ADMIN_PASSWORD=admin
```

#### Docker コマンド集

```bash
# イメージのビルド
docker-compose build

# 特定サービスのビルド
docker-compose build frontend

# サービスの再起動
docker-compose restart frontend

# サービスのスケール
docker-compose up -d --scale production-planning-service=3

# ボリュームの確認
docker volume ls

# ボリュームの詳細確認
docker volume inspect production_control_system_postgres_data

# ログの確認（特定時間）
docker-compose logs --since="2024-01-01T00:00:00" frontend

# コンテナ内でのコマンド実行
docker-compose exec postgres psql -U production_user -d production_control

# ヘルスチェック
docker-compose ps
```

#### トラブルシューティング

```bash
# ポート競合の確認
netstat -tulpn | grep :3000

# Docker リソース使用量確認
docker system df
docker system prune

# コンテナのリソース使用量確認
docker stats

# ログの詳細確認
docker-compose logs --tail=100 -f api-gateway

# データベース接続確認
docker-compose exec postgres pg_isready -U production_user

# Redis接続確認
docker-compose exec redis redis-cli ping
```

## 🧪 テスト

### テスト戦略
- **ユニットテスト**: コンポーネントとユーティリティ関数
- **統合テスト**: API統合とデータフロー
- **E2Eテスト**: ユーザーシナリオ
- **パフォーマンステスト**: レンダリング速度とメモリ使用量
- **ベンチマーク**: コンポーネント性能測定

### テスト実行

```bash
# 全テスト実行
npm run test:run

# ウォッチモード
npm run test:watch

# UIモード
npm run test:ui

# カバレッジ
npm run test:coverage

# ベンチマーク
npm run test -- --bench
```

### テストカバレッジ目標
- **ステートメント**: 90%以上
- **ブランチ**: 85%以上
- **関数**: 90%以上
- **行**: 90%以上

## 📊 パフォーマンス最適化

### フロントエンド最適化
- **React.memo**: 不要な再レンダリング防止
- **useMemo/useCallback**: 計算結果と関数のメモ化
- **仮想化**: 大量データの効率的表示
- **レイジーローディング**: 必要時のみコンポーネント読み込み
- **Service Worker**: キャッシュ戦略とオフライン対応

### バックエンド最適化
- **Redis キャッシュ**: 頻繁アクセスデータのキャッシュ
- **データベース最適化**: インデックスとクエリ最適化
- **非同期処理**: 重い処理の非同期化
- **接続プール**: データベース接続の効率化

## 🔧 開発環境

### 推奨IDE設定
- **VS Code**: 推奨拡張機能
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Importer
  - Vitest

### コード品質
- **ESLint**: コード品質チェック
- **Prettier**: コードフォーマット
- **Husky**: Git hooks
- **lint-staged**: ステージングファイルのリント

## 📈 監視とメトリクス

### フロントエンド監視
- **Core Web Vitals**: LCP, FID, CLS
- **パフォーマンス**: レンダリング時間、メモリ使用量
- **エラー追跡**: JavaScript エラーの監視

### バックエンド監視
- **APM**: アプリケーションパフォーマンス監視
- **メトリクス**: CPU、メモリ、ディスク使用量
- **ログ**: 構造化ログとログ集約

## 🚀 デプロイメント

### 環境
- **開発**: ローカル開発環境
- **ステージング**: テスト環境
- **本番**: プロダクション環境

### CI/CD パイプライン
1. **コード品質チェック**: ESLint、TypeScript
2. **テスト実行**: ユニット、統合、E2E
3. **Docker ビルド**: マルチステージビルド
4. **セキュリティスキャン**: 脆弱性チェック
5. **ビルド**: プロダクションビルド
6. **デプロイ**: Docker コンテナデプロイメント

### 🐳 Docker デプロイメント

#### 本番環境デプロイ
```bash
# 本番用Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# ヘルスチェック
docker-compose ps

# ログ監視
docker-compose logs -f
```

#### Kubernetes デプロイ
```bash
# Kubernetes マニフェストの適用
kubectl apply -f k8s/

# サービスの確認
kubectl get services

# ポッドの確認
kubectl get pods

# ログの確認
kubectl logs -f deployment/frontend
```

## 📚 API ドキュメント

### エンドポイント
- `GET /api/dashboard/stats` - ダッシュボード統計
- `GET /api/production-plans` - 生産計画一覧
- `POST /api/production-plans` - 生産計画作成
- `GET /api/inventory/:itemType` - 在庫データ
- `GET /api/quality/:planId` - 品質データ

## 🤝 コントリビューション

1. フォークを作成
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 📞 サポート

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: support@production-control.com

## 🎯 ロードマップ

### v1.1 (予定)
- [ ] モバイルアプリ対応
- [ ] AI予測機能強化
- [ ] 多言語対応

### v1.2 (予定)
- [ ] クラウドネイティブ対応
- [ ] マイクロサービス拡張
- [ ] 高度な分析機能

---

**生産管理システム** - 次世代の製造業を支えるプラットフォーム