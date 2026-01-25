# Vercel環境変数の設定方法

## 🔐 OpenAI APIキーの設定

### 方法1: Vercel Dashboardで設定（推奨・最も簡単）

1. **Vercel Dashboardにアクセス**
   - https://vercel.com/dashboard にアクセス
   - ログインしてください

2. **プロジェクトを選択**
   - `production-control-system` プロジェクトをクリック

3. **Settingsに移動**
   - プロジェクトページの上部タブから「Settings」をクリック

4. **Environment Variablesを選択**
   - 左サイドバーから「Environment Variables」をクリック

5. **環境変数を追加**
   - 「Add New」ボタンをクリック
   - 以下の情報を入力：
     - **Key**: `VITE_OPENAI_API_KEY`
     - **Value**: `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`
     - **Environment**: `Production`（本番環境）にチェック
     - 必要に応じて `Preview` と `Development` にもチェック

6. **保存**
   - 「Save」ボタンをクリック

7. **再デプロイ**
   - 環境変数を追加した後、再デプロイが必要です
   - 「Deployments」タブに移動
   - 最新のデプロイの「...」メニューから「Redeploy」を選択

### 方法2: Vercel CLIで設定

```powershell
cd C:\devlop\production_control_system

# 環境変数を追加（本番環境）
vercel env add VITE_OPENAI_API_KEY production
# プロンプトが表示されたら、APIキーを貼り付けてEnter

# プレビュー環境にも追加する場合
vercel env add VITE_OPENAI_API_KEY preview

# 開発環境にも追加する場合
vercel env add VITE_OPENAI_API_KEY development
```

### 方法3: 一括設定（複数の環境変数を設定）

```powershell
# 環境変数を設定
vercel env add VITE_OPENAI_API_KEY production
# 値を入力: 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

# 他の環境変数も設定
vercel env add NODE_ENV production
# 値を入力: production

vercel env add VITE_API_BASE_URL production
# 値を入力: https://production-control-system.vercel.app/api
```

## 📋 設定すべき環境変数一覧

| 変数名 | 値 | 環境 | 必須 |
|--------|-----|------|------|
| `VITE_OPENAI_API_KEY` | `sk-proj-...` | Production | ✅ |
| `NODE_ENV` | `production` | Production | ✅ |
| `VITE_API_BASE_URL` | `https://production-control-system.vercel.app/api` | Production | ✅ |

## ✅ 設定後の確認

1. **環境変数が正しく設定されているか確認**
   ```powershell
   vercel env ls
   ```

2. **再デプロイを実行**
   ```powershell
   vercel --prod --yes
   ```

3. **アプリケーションで確認**
   - デプロイが完了したら、アプリケーションのAI予測機能をテスト
   - ブラウザのコンソールでエラーがないか確認

## 🔒 セキュリティ注意事項

⚠️ **重要**: このAPIキーは公開されてしまっています。以下の対応を推奨します：

1. **APIキーを無効化**
   - https://platform.openai.com/api-keys にアクセス
   - このAPIキーを削除または無効化

2. **新しいAPIキーを生成**
   - 新しいAPIキーを生成
   - 新しいキーをVercelの環境変数に設定

3. **GitHubにコミットしない**
   - APIキーは絶対にコードに含めない
   - `.env`ファイルは`.gitignore`に含まれていることを確認

## 🚀 クイック設定（コピー&ペースト用）

Vercel Dashboardで設定する場合：

1. Settings → Environment Variables
2. Add New
3. Key: `VITE_OPENAI_API_KEY`
4. Value: `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`
5. Environment: Production にチェック
6. Save
7. 再デプロイ
