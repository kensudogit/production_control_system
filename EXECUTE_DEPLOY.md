# 🚀 Vercelデプロイ実行手順

## 実行コマンド

ターミナルで以下のコマンドを実行してください：

```powershell
cd C:\devlop\production_control_system
vercel --prod --yes
```

## 実行中の処理

1. **ビルド準備**: フロントエンドの依存関係をインストール
2. **ビルド実行**: TypeScriptのコンパイルとViteビルド
3. **デプロイ**: Vercelサーバーにアップロード
4. **デプロイ完了**: デプロイURLが表示されます

## 予想される出力

```
Vercel CLI 48.12.0
🔍  Inspecting build outputs...
📦  Building...
...
✅  Production: https://production-control-system-xxxxx.vercel.app
```

## デプロイ後の確認事項

1. **デプロイURLにアクセス**: 表示されたURLでアプリケーションが動作するか確認
2. **環境変数の設定**: Vercel Dashboardで環境変数を設定
3. **ログの確認**: エラーがないか確認

## 環境変数の設定（デプロイ後）

Vercel Dashboard (https://vercel.com/dashboard) で以下を設定：

- `NODE_ENV` = `production`
- `VITE_API_BASE_URL` = `https://production-control-system.vercel.app/api`

## トラブルシューティング

### ビルドエラーが発生した場合

```powershell
cd frontend
npm ci
npm run build
```

エラーメッセージを確認して修正してください。

### デプロイが失敗した場合

1. Vercel Dashboardでログを確認
2. ビルドログを確認
3. 環境変数を確認
