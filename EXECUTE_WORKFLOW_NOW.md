# 🚀 GitHub Actionsワークフローディスパッチを実行

## ⚡ 最も簡単な方法（ブラウザから実行）

### ステップ1: GitHubリポジトリにアクセス

以下のURLをブラウザで開いてください：

```
https://github.com/kensudogit/production_control_system/actions/workflows/vercel-production-deploy.yml
```

### ステップ2: ワークフローを実行

1. ページの右上にある **「Run workflow」** ボタンをクリック
2. **Branch**: `main` が選択されていることを確認
3. **Environment**: `production` が選択されていることを確認（表示されない場合はそのまま）
4. **「Run workflow」** ボタンをクリック

### ステップ3: デプロイ状況を確認

1. ワークフローの実行が開始されます
2. 実行状況がリアルタイムで表示されます
3. **完了まで5-10分** 待ちます
4. 緑色のチェックマークが表示されたら完了です

### ステップ4: デプロイURLを確認

1. ワークフローのログを開く
2. 「Deploy to Vercel Production」ステップを展開
3. デプロイURLが表示されます
4. または、Vercel Dashboard (https://vercel.com/dashboard) で確認

## 🔧 代替方法: PowerShellスクリプトを使用

GitHub Personal Access Tokenをお持ちの場合は、スクリプトを使用できます。

### ステップ1: GitHub Personal Access Tokenを取得

1. https://github.com/settings/tokens にアクセス
2. 「Generate new token (classic)」をクリック
3. Note: `Vercel Deployment` など任意の名前を入力
4. Expiration: お好みの期間を選択
5. **スコープ**: `repo` にチェック（すべてのサブスコープも自動的にチェックされます）
6. 「Generate token」をクリック
7. トークンをコピー（**この画面を閉じると二度と表示されません**）

### ステップ2: スクリプトを実行

PowerShellで以下を実行：

```powershell
cd C:\devlop\production_control_system
powershell -ExecutionPolicy Bypass -File .\trigger-workflow.ps1
```

プロンプトが表示されたら、コピーしたトークンを貼り付けてEnterキーを押します。

## ✅ デプロイ後の確認

### 1. デプロイURLにアクセス

デプロイが完了すると、以下のようなURLでアクセスできます：
```
https://production-control-system-[hash].vercel.app
```

### 2. 環境変数の確認

1. **ブラウザでアプリケーションにアクセス**
2. **開発者ツール（F12）を開く**
3. **コンソールタブを開く**
4. **需要予測画面にアクセス**
5. **以下のメッセージが表示されることを確認**：

   ```javascript
   🔍 環境変数の状態: {
     apiKeySet: true,
     apiKeyLength: 51,
     apiKeyPrefix: "sk-proj...",
     mode: "production",
     isProduction: true,
     isDevelopment: false
   }
   ```

   ⚠️ `apiKeySet: false` の場合は、Vercel Dashboardで環境変数 `VITE_OPENAI_API_KEY` が設定されているか確認し、再デプロイが必要です。

### 3. AI予測機能のテスト

1. **需要予測画面で「AI予測実行」ボタンをクリック**
2. **エラーが表示されないことを確認**
3. **予測結果が表示されることを確認**

## 🎯 推奨手順

**最も簡単で確実な方法**:

1. ✅ **ブラウザでGitHub Actionsのワークフローディスパッチを実行**（上記のステップ1-2）
2. ✅ デプロイ完了を待つ（5-10分）
3. ✅ デプロイURLにアクセスして動作確認
4. ✅ 環境変数が正しく読み込まれているか確認（コンソールで確認）
5. ✅ AI予測機能をテスト

## 📚 関連ドキュメント

- `DEPLOY_STEPS.md` - 詳細なデプロイ手順
- `DEPLOY_IMMEDIATE.md` - 即座にデプロイする方法
- `VERCEL_ENV_SETUP.md` - 環境変数の設定方法
- `OPENAI_API_KEY_FIX.md` - OpenAI APIキーの修正内容
