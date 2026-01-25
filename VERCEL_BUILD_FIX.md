# Vercelビルドエラー修正

## 現在のエラー
```
sh: line 1: /vercel/path0/frontend/node_modules/.bin/tsc: Permission denied
Error: Command "npm run vercel-build" exited with 126
```

## 原因
Vercelが古い`package.json`を使用しており、`vercel-build`スクリプトが`npm run build`を呼び出して`tsc`を実行しようとしています。

## 対応状況
✅ ローカルファイルは修正済み（`vercel-build: "vite build"`）
❌ 変更がまだGitHubにプッシュされていない可能性

## 解決方法

### ステップ1: 変更を確認

```powershell
cd C:\devlop\production_control_system
git status
```

### ステップ2: 変更をコミット・プッシュ

```powershell
# frontend/package.jsonの変更を確認
git diff frontend/package.json

# 変更をステージング
git add frontend/package.json

# コミット
git commit -m "fix: Use vite build directly in vercel-build to avoid tsc permission error"

# プッシュ（GitHub Push Protectionエラーが発生する場合は、先に「Allow secret」を実行）
git push origin main
```

### ステップ3: Vercelで再デプロイ

変更がプッシュされると、Vercelが自動的に再デプロイを開始します。

または、Vercel Dashboardで手動で再デプロイ：
- Deployments → 最新のデプロイの「...」メニュー → 「Redeploy」

## 確認事項

ビルドログで以下が表示されることを確認：
```
Running "npm run vercel-build"
> production-control-frontend@0.0.0 vercel-build
> vite build
```

`npm run build`や`tsc`が実行されていないことを確認してください。
