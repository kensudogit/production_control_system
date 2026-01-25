# データベース初期化スクリプト

## 実行順序

データベース初期化時、以下の順序でスクリプトが実行されます：

1. `01_schema.sql` - データベーススキーマ定義（テーブル、制約、インデックス）
2. `02_indexes.sql` - 追加インデックスとパフォーマンス最適化
3. `03_views.sql` - ビュー定義（ダッシュボード、サマリー）
4. `04_functions.sql` - ストアドプロシージャと関数
5. `05_sample_data.sql` - **顧客プレゼン用の豊富なサンプルデータ**

## サンプルデータの内容

`05_sample_data.sql` には以下のサンプルデータが含まれています：

### ユーザー
- 管理者: 1名
- マネージャー: 4名（各部署）
- オペレーター: 5名（各部門）
- ビューアー: 2名（経営企画部）

### 製品マスタ
- 18種類の製品（スマートフォン、ノートPC、タブレット、イヤホン、スマートウォッチ、アクセサリー）

### 原材料マスタ
- 20種類の原材料（電子部品、金属材料、プラスチック材料、包装材料）

### 仕入先マスタ
- 5社の仕入先

### 生産計画
- 進行中: 4件
- 計画中: 4件
- 完了: 3件
- 保留: 1件

### 在庫データ
- 製品在庫: 18アイテム
- 原材料在庫: 20アイテム
- 在庫トランザクション履歴

### 品質検査
- 複数の品質検査データ
- 品質不良詳細

### 原価計算
- 各生産計画の原価計算データ

### 需要予測
- 月次予測データ
- 四半期予測データ

### アクティビティログ
- 各種操作のログ

## 使用方法

### 新規データベース作成時

Docker Composeを使用する場合、自動的にすべてのスクリプトが実行されます：

```bash
docker-compose up -d postgres
```

### 既存データベースにサンプルデータを追加

```bash
docker-compose exec postgres psql -U production_user -d production_control -f /docker-entrypoint-initdb.d/05_sample_data.sql
```

### サンプルデータのみ再投入

```bash
# 既存のサンプルデータを削除（注意：本番環境では実行しないでください）
docker-compose exec postgres psql -U production_user -d production_control -c "
  TRUNCATE TABLE activity_logs, demand_forecasts, cost_calculations, quality_defects, 
  quality_inspections, production_plan_processes, production_plan_progress, 
  inventory_transactions, inventory, product_materials, processes, 
  production_plans, materials, suppliers, products CASCADE;
"

# サンプルデータを再投入
docker-compose exec postgres psql -U production_user -d production_control -f /docker-entrypoint-initdb.d/05_sample_data.sql
```

## デモ用アカウント

以下のアカウントでログインできます（パスワード: admin123）：

- **admin** - システム管理者（全権限）
- **manager** - マネージャー（管理権限）
- **tanaka_manager** - 生産管理部マネージャー
- **suzuki_manager** - 品質管理部マネージャー
- **yamada_manager** - 在庫管理部マネージャー
- **sato_operator** - 製造部オペレーター
- **kobayashi_operator** - 品質管理部オペレーター
- **kato_operator** - 在庫管理部オペレーター

## 注意事項

- サンプルデータは顧客プレゼン・デモンストレーション用です
- 本番環境では使用しないでください
- パスワードはすべて `admin123` です（本番環境では必ず変更してください）
