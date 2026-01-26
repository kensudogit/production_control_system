# Vercel完全公開デプロイ手順（手動）

## 🚀 デプロイ方法

現在、Gitの権限エラーが発生しているため、以下のいずれかの方法でデプロイしてください。

### 方法1: GitHub Actions経由（推奨）

GitHubにプッシュすると、自動的にVercelにデプロイされます。

#### ステップ1: 変更をコミット・プッシュ

**PowerShellを管理者として実行**してから、以下を実行：

```powershell
cd C:\devlop\production_control_system

# 変更をステージング
git add .

# コミット
git commit -m "OpenAI APIキー読み取りエラーの修正とデプロイ"

# プッシュ（mainブランチに）
git push origin main
```

#### ステップ2: GitHub Actionsでデプロイ確認

1. https://github.com/kensudogit/production_control_system にアクセス
2. 「Actions」タブをクリック
3. 「Vercel Production Deployment」ワークフローが実行されていることを確認
4. デプロイが完了するまで待つ（通常5-10分）

#### ステップ3: デプロイURLを確認

- GitHub ActionsのログにデプロイURLが表示されます
- または、Vercel Dashboard (https://vercel.com/dashboard) で確認

### 方法2: Vercel Dashboardから手動デプロイ

#### ステップ1: Vercel Dashboardにアクセス

1. https://vercel.com/dashboard にアクセス
2. `production-control-system` プロジェクトを選択

#### ステップ2: GitHubリポジトリを接続（未接続の場合）

1. Settings → Git
2. GitHubリポジトリを接続
3. ブランチ: `main`
4. ルートディレクトリ: `/`（ルート）

#### ステップ3: 環境変数を設定

1. Settings → Environment Variables
2. 以下の環境変数を追加：

| 変数名 | 値 | 環境 |
|--------|-----|------|
| `VITE_OPENAI_API_KEY` | あなたのOpenAI APIキー | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |
| `VITE_API_BASE_URL` | `https://production-control-system.vercel.app/api` | Production |

#### ステップ4: デプロイをトリガー

1. Deployments タブに移動
2. 「Redeploy」ボタンをクリック
3. または、GitHubにプッシュすると自動デプロイ

### 方法3: GitHub Actionsのワークフローディスパッチ

GitHubにプッシュせずに、手動でデプロイをトリガーできます。

1. https://github.com/kensudogit/production_control_system にアクセス
2. 「Actions」タブをクリック
3. 左サイドバーから「Vercel Production Deployment」を選択
4. 「Run workflow」ボタンをクリック
5. Branch: `main`、Environment: `production` を選択
6. 「Run workflow」をクリック

## ✅ デプロイ後の確認

### 1. デプロイURLにアクセス

デプロイが完了すると、以下のようなURLでアクセスできます：
```
https://production-control-system-[hash].vercel.app
```

### 2. 環境変数の確認

1. ブラウザでアプリケーションにアクセス
2. 開発者ツール（F12）を開く
3. コンソールタブを開く
4. 需要予測画面にアクセス
5. 以下のメッセージが表示されることを確認：
   ```
   🔍 環境変数の状態: {
     apiKeySet: true,
     apiKeyLength: 51,
     apiKeyPrefix: "sk-proj...",
     mode: "production",
     isProduction: true,
     isDevelopment: false
   }
   ```

### 3. AI予測機能のテスト

1. 需要予測画面で「AI予測実行」ボタンをクリック
2. エラーが表示されないことを確認
3. 予測結果が表示されることを確認

## 🔧 トラブルシューティング

### Gitの権限エラーが発生する場合

**解決方法1: PowerShellを管理者として実行**

1. Windowsキーを押す
2. 「PowerShell」と入力
3. 「Windows PowerShell」を右クリック
4. 「管理者として実行」を選択
5. 再度 `git add .` を実行

**解決方法2: Gitのロックファイルを削除**

```powershell
cd C:\devlop\production_control_system
Remove-Item -Force .git\index.lock -ErrorAction SilentlyContinue
Remove-Item -Force .git\objects\*\tmp_obj_* -ErrorAction SilentlyContinue
git add .
```

### Vercel CLIの権限エラーが発生する場合

**解決方法: Vercel Dashboardを使用**

Vercel CLIの代わりに、Vercel Dashboardから手動でデプロイしてください（方法2を参照）。

### デプロイが失敗する場合

1. **ビルドエラーの確認**
   - GitHub Actionsのログを確認
   - エラーメッセージを確認して修正

2. **環境変数の確認**
   - Vercel Dashboardで環境変数が正しく設定されているか確認
   - `VITE_OPENAI_API_KEY` が設定されているか確認

3. **再デプロイ**
   - Vercel Dashboard → Deployments → 「Redeploy」

## 📚 関連ドキュメント

- `VERCEL_ENV_SETUP.md` - 環境変数の設定方法（詳細）
- `OPENAI_API_KEY_FIX.md` - OpenAI APIキーの修正内容
- `QUICK_DEPLOY.md` - クイックデプロイ手順

## 🔒 セキュリティ注意事項

⚠️ **重要**: 

- APIキーは絶対にコードに含めないでください
- `.env`ファイルは`.gitignore`に含まれていることを確認
- GitHubにプッシュする前に、コード内にAPIキーが含まれていないか確認
