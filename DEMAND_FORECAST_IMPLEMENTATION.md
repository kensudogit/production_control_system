# 需要予測画面の実装

## ✅ 実装完了

需要予測画面でDBから需要予測と予測精度のデータを取得して表示できるように実装しました。

## 📝 実装内容

### 1. データベースサンプルデータ追加

**ファイル**: `database/init/06_demand_forecast_data.sql`

- 豊富な需要予測サンプルデータを追加
- 月次、週次、四半期、年間の予測データ
- 予測精度データ（実績がある場合は精度が計算済み）
- 複数の予測手法（MLモデル、移動平均、指数平滑法）

### 2. APIエンドポイント作成

**ファイル**: `api/demand-forecasts.js`

- Vercel Serverless Functionとして実装
- DBから需要予測データを取得
- フィルタリング機能（製品ID、期間、日付範囲）
- 統計情報の計算
- DB接続が利用できない場合はモックデータを返す

### 3. フロントエンド更新

**ファイル**: `frontend/src/pages/DemandForecasting.tsx`

- React Queryを使用してDBからデータを取得
- 予測精度の表示を追加
- ローディング状態とエラーハンドリングを実装
- 予測精度チャートの実装
- 統計カードに平均予測精度を追加

**ファイル**: `frontend/src/services/api.ts`

- `getDemandForecasts()`メソッドを追加
- `DemandForecast`型定義を追加

## 🗄️ データベース構造

### demand_forecasts テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| `id` | UUID | 主キー |
| `product_id` | UUID | 製品ID（外部キー） |
| `forecast_date` | DATE | 予測日 |
| `forecast_period` | VARCHAR | 予測期間（daily/weekly/monthly/quarterly/yearly） |
| `forecasted_quantity` | INTEGER | 予測数量 |
| `confidence_level` | DECIMAL | 信頼度（0-100） |
| `forecast_method` | VARCHAR | 予測手法 |
| `actual_quantity` | INTEGER | 実績数量（NULL可） |
| `accuracy` | DECIMAL | 予測精度（0-100、NULL可） |
| `created_at` | TIMESTAMP | 作成日時 |
| `updated_at` | TIMESTAMP | 更新日時 |
| `created_by` | UUID | 作成者ID（外部キー） |

## 📊 表示内容

### 統計カード
- **現在需要**: 全製品の現在需要の合計
- **予測需要**: 全製品の予測需要の合計
- **平均信頼度**: 全予測の平均信頼度
- **平均予測精度**: 実績がある予測の平均精度
- **成長率**: 予測需要と現在需要の比較

### 予測一覧テーブル
- 製品コード
- 製品名
- 現在需要
- 予測需要
- 前月
- 来月予測
- トレンド（上昇/下降/安定）
- 信頼度（プログレスバー付き）
- **予測精度**（プログレスバー付き、色分け）
- 予測手法
- 季節性
- 成長率
- アクション（詳細、再予測）

### 予測精度チャート
- 各製品の予測精度をバーチャートで表示
- 精度に応じて色分け（95%以上: 緑、90-95%: 青、85-90%: 黄、85%未満: 赤）
- 平均予測精度を表示

## 🚀 使用方法

### 1. データベースにサンプルデータを追加

```bash
# Docker Composeを使用している場合
docker-compose exec postgres psql -U production_user -d production_control -f /docker-entrypoint-initdb.d/06_demand_forecast_data.sql

# または直接実行
psql -U production_user -d production_control -f database/init/06_demand_forecast_data.sql
```

### 2. APIエンドポイントの確認

```
GET /api/demand-forecasts
```

**クエリパラメータ**:
- `productId` (optional): 製品IDでフィルタ
- `period` (optional): 予測期間でフィルタ（daily/weekly/monthly/quarterly/yearly）
- `startDate` (optional): 開始日（YYYY-MM-DD）
- `endDate` (optional): 終了日（YYYY-MM-DD）
- `limit` (optional): 取得件数（デフォルト: 100）

**レスポンス例**:
```json
{
  "data": [
    {
      "id": "uuid",
      "productId": "uuid",
      "productCode": "PROD-001",
      "productName": "スマートフォン Pro Max",
      "forecastDate": "2024-03-01",
      "forecastPeriod": "monthly",
      "forecastedQuantity": 6000,
      "confidenceLevel": 88.5,
      "forecastMethod": "ml_model",
      "actualQuantity": null,
      "accuracy": null
    }
  ],
  "stats": {
    "totalForecasts": 10,
    "averageConfidence": 87.2,
    "averageAccuracy": 97.5,
    "totalForecastedQuantity": 50000,
    "totalActualQuantity": 51000,
    "productsCount": 5,
    "periodsCount": 3
  },
  "total": 10
}
```

### 3. フロントエンドでの使用

```typescript
import { useQuery } from 'react-query'
import { dashboardApi } from '../services/api'

const { data, isLoading, error } = useQuery(
  'demandForecasts',
  () => dashboardApi.getDemandForecasts({ period: 'monthly' })
)
```

## 📋 サンプルデータの内容

### 予測データ
- **製品A（スマートフォン Pro Max）**: 月次・週次予測、実績あり
- **製品B（スマートフォン Pro）**: 月次・週次予測、実績あり
- **製品C（ノートPC ビジネス）**: 月次予測、実績あり
- **製品D（ワイヤレスイヤホン Pro）**: 月次予測、実績あり
- **製品E（スマートウォッチ Pro）**: 月次予測、実績あり
- **製品F（ワイヤレスイヤホン Standard）**: 月次予測、実績あり

### 予測精度
- 実績がある予測には精度が計算済み
- 精度範囲: 90-98%
- 高精度な予測データを用意

## ✅ 動作確認

1. **データベースにサンプルデータを追加**
   ```bash
   psql -U production_user -d production_control -f database/init/06_demand_forecast_data.sql
   ```

2. **フロントエンドを起動**
   ```bash
   cd frontend
   npm run dev
   ```

3. **需要予測画面にアクセス**
   - ブラウザで `/demand-forecasting` にアクセス
   - DBからデータが読み込まれ、予測精度が表示されることを確認

## 🔧 トラブルシューティング

### データが表示されない

1. **データベースにサンプルデータが登録されているか確認**
   ```sql
   SELECT COUNT(*) FROM demand_forecasts;
   ```

2. **APIエンドポイントが正しく動作しているか確認**
   ```bash
   curl http://localhost:3000/api/demand-forecasts
   ```

3. **ブラウザのコンソールでエラーを確認**

### 予測精度が表示されない

- 実績データ（`actual_quantity`）がある予測のみ精度が表示されます
- 実績がない予測は「未測定」と表示されます

## 📚 関連ファイル

- `database/init/06_demand_forecast_data.sql` - サンプルデータ
- `api/demand-forecasts.js` - APIエンドポイント
- `frontend/src/pages/DemandForecasting.tsx` - フロントエンド画面
- `frontend/src/services/api.ts` - APIクライアント
