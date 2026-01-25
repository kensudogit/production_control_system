# 🚀 Vercel本番デプロイ実行手順

## 現在の状態
- ✅ Vercel CLIインストール済み (v48.12.0)
- ✅ Vercelログイン済み (kensudogit)
- ✅ プロジェクト初期化済み

## デプロイ実行

### 方法1: 直接デプロイ（推奨）

```powershell
cd C:\devlop\production_control_system

# 本番環境にデプロイ
vercel --prod --yes
```

### 方法2: ビルド確認後にデプロイ

```powershell
cd C:\devlop\production_control_system\frontend

# 依存関係をインストール
npm ci

# ビルドを確認
npm run build

# ルートディレクトリに戻る
cd ..

# 本番デプロイ
vercel --prod --yes
```

## デプロイ後の確認

デプロイが完了すると、以下のようなURLが表示されます：
```
https://production-control-system-xxxxx.vercel.app
```

## 環境変数の設定

デプロイ後、Vercel Dashboardで環境変数を設定：

1. https://vercel.com/dashboard にアクセス
2. プロジェクトを選択
3. Settings → Environment Variables
4. 以下の変数を追加：

| 変数名 | 値 | 環境 |
|--------|-----|------|
| `NODE_ENV` | `production` | Production |
| `VITE_API_BASE_URL` | `https://production-control-system.vercel.app/api` | Production |

## トラブルシューティング

### ビルドエラーが発生する場合

```powershell
cd frontend
npm ci
npm run build
# エラーを確認して修正
```

### デプロイが失敗する場合

1. Vercel Dashboardでログを確認
2. ビルドログを確認
3. 環境変数を確認
