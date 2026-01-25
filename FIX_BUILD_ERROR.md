# Vercelビルドエラー修正手順

## 現在のエラー
```
sh: line 1: /vercel/path0/frontend/node_modules/.bin/tsc: Permission denied
Error: Command "npm run vercel-build" exited with 126
```

## 原因
Vercelが古い`package.json`を使用しており、`vercel-build`スクリプトが`npm run build`を呼び出して`tsc`を実行しようとしています。

## 解決方法

### ステップ1: 変更を確認
ローカルファイルは既に修正済みです：
- `frontend/package.json`の`vercel-build`は`vite build`に設定済み

### ステップ2: 変更をコミット・プッシュ

```powershell
cd C:\devlop\production_control_system

# 変更を確認
git status

# 変更をステージング
git add frontend/package.json

# コミット
git commit -m "fix: Use vite build directly in vercel-build script"

# プッシュ
git push origin main
```

### ステップ3: Vercelで再デプロイ

Vercel Dashboardで「Redeploy」ボタンをクリックするか、以下のコマンドを実行：

```powershell
vercel --prod --yes
```

## 確認事項

ビルドログで以下が表示されることを確認：
```
Running "npm run vercel-build"
> production-control-frontend@0.0.0 vercel-build
> vite build
```

`npm run build`が呼び出されていないことを確認してください。
