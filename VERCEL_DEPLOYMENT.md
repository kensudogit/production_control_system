# Vercel本番環境デプロイガイド

## 🚀 完全公開モードでのデプロイ

本システムをVercelの本番環境に完全公開モードでデプロイする手順です。

## 前提条件

1. **Vercelアカウント**
   - https://vercel.com でアカウントを作成
   - GitHubアカウントと連携推奨

2. **Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **GitHubリポジトリ**
   - コードがGitHubにプッシュされていること

## クイックデプロイ（推奨）

### 方法1: PowerShellスクリプトを使用（最も簡単）

```powershell
cd C:\devlop\production_control_system
.\deploy-vercel-production.ps1
```

スクリプトが以下を自動実行します：
1. Vercel CLIの確認・インストール
2. Vercelログイン確認
3. 依存関係のインストール
4. テスト実行（オプション）
5. ビルド
6. 環境変数の設定
7. 本番デプロイ
8. デプロイ情報の表示

### 方法2: Vercel CLIで直接デプロイ

```bash
# 1. Vercelにログイン
vercel login

# 2. プロジェクトを初期化（初回のみ）
vercel

# 3. 本番環境にデプロイ
vercel --prod
```

### 方法3: GitHub Actionsで自動デプロイ

`main`ブランチにプッシュすると自動的にデプロイされます。

## 環境変数の設定

### Vercel Dashboardで設定

1. https://vercel.com/dashboard にアクセス
2. プロジェクトを選択
3. Settings → Environment Variables
4. 以下の変数を追加：

| 変数名 | 値 | 環境 |
|--------|-----|------|
| `NODE_ENV` | `production` | Production |
| `VITE_API_BASE_URL` | `https://production-control-system.vercel.app/api` | Production |
| `VITE_OPENAI_API_KEY` | `your-api-key` | Production（オプション） |

### CLIで設定

```bash
# 環境変数を追加
vercel env add VITE_API_BASE_URL production
# 値を入力: https://production-control-system.vercel.app/api

vercel env add NODE_ENV production
# 値を入力: production
```

## デプロイ後の確認

### 1. デプロイURLにアクセス

デプロイが完了すると、以下のようなURLが表示されます：
```
https://production-control-system-xxxxx.vercel.app
```

### 2. カスタムドメインの設定（オプション）

```bash
# ドメインを追加
vercel domains add your-domain.com

# DNS設定を確認
vercel domains ls
```

### 3. パフォーマンス確認

- **Vercel Analytics**: https://vercel.com/analytics
- **Speed Insights**: https://vercel.com/speed-insights
- **Lighthouse**: デプロイ後に自動実行

## 設定ファイル

### vercel.json

本番環境用の設定が含まれています：
- セキュリティヘッダー
- キャッシュ設定
- リダイレクト設定
- リージョン設定（東京: hnd1）

### vercel.production.json

完全公開モード用の追加設定：
- CSP（Content Security Policy）
- 複数リージョン対応
- パブリックアクセス設定

## 監視とアナリティクス

### Vercel Analytics

```bash
# Analyticsを有効化
vercel analytics enable
```

### Speed Insights

Vercel Dashboardで自動的に有効化されます。

### エラー監視

Sentry等のエラー監視サービスを統合できます。

## トラブルシューティング

### ビルドエラー

```bash
# ローカルでビルドをテスト
cd frontend
npm run build
```

### 環境変数が反映されない

```bash
# 環境変数を再デプロイ
vercel env pull .env.local
vercel --prod
```

### デプロイが失敗する

1. Vercel Dashboardでログを確認
2. ビルドログを確認
3. 環境変数を確認

## セキュリティチェックリスト

- [ ] 環境変数が正しく設定されている
- [ ] APIキーが環境変数で管理されている
- [ ] セキュリティヘッダーが設定されている
- [ ] HTTPSが有効になっている
- [ ] CORS設定が適切である

## パフォーマンス最適化

Vercelは自動的に以下を最適化します：
- ✅ 画像最適化（WebP/AVIF）
- ✅ コード分割
- ✅ Edge Caching
- ✅ Gzip/Brotli圧縮
- ✅ HTTP/2

## カスタムドメイン設定

```bash
# ドメインを追加
vercel domains add production-control.example.com

# DNS設定
# Aレコード: 76.76.21.21
# CNAMEレコード: cname.vercel-dns.com
```

## ロールバック

```bash
# 以前のデプロイにロールバック
vercel rollback

# 特定のデプロイにロールバック
vercel rollback [deployment-url]
```

## 継続的デプロイ

GitHub Actionsが自動的に設定されています：
- `main`ブランチへのプッシュ → 本番デプロイ
- プルリクエスト → プレビューデプロイ

## 参考リンク

- **Vercel Dashboard**: https://vercel.com/dashboard
- **ドキュメント**: https://vercel.com/docs
- **CLIリファレンス**: https://vercel.com/docs/cli
