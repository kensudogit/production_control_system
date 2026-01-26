# 🚀 Vercel完全公開デプロイ手順

## 現在の状況

OpenAI APIキー読み取りエラーの修正が完了しました。以下の手順でVercelにデプロイしてください。

## 📋 デプロイ手順

### 方法1: GitHub経由（推奨・自動デプロイ）

#### ステップ1: PowerShellを管理者として実行

1. Windowsキーを押す
2. 「PowerShell」と入力
3. 「Windows PowerShell」を右クリック
4. **「管理者として実行」を選択**

#### ステップ2: プロジェクトディレクトリに移動

```powershell
cd C:\devlop\production_control_system
```

#### ステップ3: Gitのロックファイルを削除

```powershell
Remove-Item -Force .git\index.lock -ErrorAction SilentlyContinue
Remove-Item -Force .git\objects\*\tmp_obj_* -ErrorAction SilentlyContinue
```

#### ステップ4: 変更をコミット・プッシュ

```powershell
# 変更をステージング
git add .

# コミット
git commit -m "OpenAI APIキー読み取りエラーの修正とデプロイ準備"

# プッシュ（GitHub Actionsで自動デプロイ）
git push origin main
```

#### ステップ5: デプロイ状況を確認

1. **GitHub Actionsで確認**
   - https://github.com/kensudogit/production_control_system/actions
   - 「Vercel Production Deployment」ワークフローが実行中であることを確認
   - 完了まで5-10分待つ

2. **Vercel Dashboardで確認**
   - https://vercel.com/dashboard
   - プロジェクト `production-control-system` を選択
   - 「Deployments」タブで最新のデプロイを確認

### 方法2: GitHub Actionsのワークフローディスパッチ（手動トリガー）

GitHubにプッシュせずに、手動でデプロイをトリガーできます。

1. **GitHubリポジトリにアクセス**
   - https://github.com/kensudogit/production_control_system

2. **Actionsタブを開く**
   - リポジトリページの上部タブから「Actions」をクリック

3. **ワークフローを選択**
   - 左サイドバーから「Vercel Production Deployment」を選択

4. **手動実行**
   - 「Run workflow」ボタンをクリック
   - Branch: `main`
   - Environment: `production`
   - 「Run workflow」をクリック

5. **デプロイ完了を待つ**
   - ワークフローの実行状況を確認
   - 完了まで5-10分

### 方法3: Vercel Dashboardから直接デプロイ

1. **Vercel Dashboardにアクセス**
   - https://vercel.com/dashboard
   - ログイン

2. **プロジェクトを選択**
   - `production-control-system` をクリック

3. **環境変数を設定（未設定の場合）**
   - Settings → Environment Variables
   - 以下の環境変数を追加：

   | 変数名 | 値 | 環境 |
   |--------|-----|------|
   | `VITE_OPENAI_API_KEY` | あなたのOpenAI APIキー | Production, Preview, Development |
   | `NODE_ENV` | `production` | Production |

4. **再デプロイ**
   - Deployments タブに移動
   - 最新のデプロイの「...」メニューから「Redeploy」を選択
   - または、GitHubに接続されていれば、GitHubにプッシュすると自動デプロイ

## ✅ デプロイ後の確認

### 1. デプロイURLにアクセス

デプロイが完了すると、以下のようなURLでアクセスできます：
```
https://production-control-system-[hash].vercel.app
```

または、カスタムドメインが設定されている場合：
```
https://production-control-system.vercel.app
```

### 2. 環境変数の確認

1. **ブラウザでアプリケーションにアクセス**
2. **開発者ツール（F12）を開く**
3. **コンソールタブを開く**
4. **需要予測画面にアクセス**
5. **以下のメッセージが表示されることを確認**：

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

   ⚠️ `apiKeySet: false` の場合は、環境変数が設定されていないか、再デプロイが必要です。

### 3. AI予測機能のテスト

1. **需要予測画面で「AI予測実行」ボタンをクリック**
2. **エラーが表示されないことを確認**
3. **予測結果が表示されることを確認**

## 🔧 トラブルシューティング

### Gitの権限エラーが発生する場合

**解決方法**:
1. PowerShellを**管理者として実行**
2. ロックファイルを削除：
   ```powershell
   Remove-Item -Force .git\index.lock -ErrorAction SilentlyContinue
   ```
3. 再度 `git add .` を実行

### 環境変数が読み取れない場合

**原因**: Viteでは環境変数はビルド時に静的に置き換えられます。

**解決方法**:
1. Vercel Dashboardで環境変数が正しく設定されているか確認
2. **再デプロイを実行**（重要！）
   - Vercel Dashboard → Deployments → 「Redeploy」

### デプロイが失敗する場合

1. **GitHub Actionsのログを確認**
   - https://github.com/kensudogit/production_control_system/actions
   - 失敗したワークフローをクリック
   - エラーメッセージを確認

2. **ビルドエラーの場合**
   - エラーメッセージに従って修正
   - ローカルで `cd frontend && npm run build` を実行して確認

3. **環境変数のエラーの場合**
   - Vercel Dashboardで環境変数を確認
   - `VITE_OPENAI_API_KEY` が設定されているか確認

## 📚 関連ドキュメント

- `VERCEL_ENV_SETUP.md` - 環境変数の設定方法（詳細）
- `OPENAI_API_KEY_FIX.md` - OpenAI APIキーの修正内容
- `DEPLOY_NOW_MANUAL.md` - 手動デプロイ手順（詳細）

## 🔒 セキュリティ注意事項

⚠️ **重要**: 

- APIキーは絶対にコードに含めないでください
- `.env`ファイルは`.gitignore`に含まれていることを確認
- GitHubにプッシュする前に、コード内にAPIキーが含まれていないか確認

## 🎯 次のステップ

デプロイが完了したら：

1. ✅ アプリケーションが正常に動作することを確認
2. ✅ AI予測機能が正常に動作することを確認
3. ✅ 環境変数が正しく読み込まれていることを確認
4. ✅ カスタムドメインを設定（オプション）
