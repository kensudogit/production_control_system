# Vercel本番環境へのクイックデプロイ

## 🚀 3ステップでデプロイ

### ステップ1: Vercel CLIのインストールとログイン

```powershell
# Vercel CLIをインストール
npm install -g vercel

# Vercelにログイン
vercel login
```

### ステップ2: デプロイスクリプトを実行

```powershell
cd C:\devlop\production_control_system
.\deploy-vercel-production.ps1
```

### ステップ3: 環境変数の設定（Vercel Dashboard）

1. https://vercel.com/dashboard にアクセス
2. プロジェクトを選択
3. Settings → Environment Variables
4. 必要な環境変数を追加

## 📋 必要な環境変数

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `NODE_ENV` | `production` | ✅ |
| `VITE_API_BASE_URL` | APIのベースURL | ✅ |
| `VITE_OPENAI_API_KEY` | OpenAI APIキー（オプション） | ❌ |

## ✅ デプロイ後の確認

デプロイが完了すると、以下のURLでアクセスできます：
```
https://production-control-system-[hash].vercel.app
```

## 🔧 トラブルシューティング

### エラー: "Vercel CLI not found"
```powershell
npm install -g vercel
```

### エラー: "Not logged in"
```powershell
vercel login
```

### エラー: "Build failed"
```powershell
cd frontend
npm run build
# エラーを確認して修正
```

## 📚 詳細情報

詳細は `VERCEL_DEPLOYMENT.md` を参照してください。
