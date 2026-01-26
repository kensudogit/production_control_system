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
     - **Value**: `your-openai-api-key-here`（実際のAPIキーを入力）
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
# 値を入力: your-openai-api-key-here（実際のAPIキーを入力）

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
   - `VITE_OPENAI_API_KEY` が表示されることを確認
   - 値の最初の数文字（例: `sk-proj-...`）が表示されることを確認

2. **再デプロイを実行（重要！）**
   ```powershell
   vercel --prod --yes
   ```
   ⚠️ **重要**: Viteでは環境変数はビルド時に静的に置き換えられます。
   環境変数を設定した後は、**必ず再デプロイが必要**です。

3. **アプリケーションで確認**
   - デプロイが完了したら、アプリケーションのAI予測機能をテスト
   - ブラウザのコンソール（F12）を開いて、以下のメッセージを確認：
     - ✅ `🔍 環境変数の状態:` が表示され、`apiKeySet: true` になっている
     - ❌ `⚠️ OpenAI APIキーが設定されていません` が表示される場合は、再デプロイが必要

## 🔧 トラブルシューティング

### 問題: APIキーを設定したのに「APIキーが設定されていません」と表示される

**原因**: Viteでは環境変数はビルド時に静的に置き換えられるため、環境変数を設定した後は再デプロイが必要です。

**解決方法**:
1. Vercel Dashboardで環境変数が正しく設定されているか確認
2. **再デプロイを実行**:
   - Vercel Dashboard → Deployments → 最新のデプロイの「...」メニュー → 「Redeploy」
   - または CLI: `vercel --prod --yes`

### 問題: 「OpenAI APIキーが無効です」と表示される

**原因**: APIキーが間違っている、または無効化されている

**解決方法**:
1. OpenAI Platform (https://platform.openai.com/api-keys) でAPIキーが有効か確認
2. APIキーをコピーして、Vercel Dashboardで再設定
3. 再デプロイを実行

### 問題: 開発環境では動作するが、本番環境で動作しない

**原因**: 環境変数が本番環境（Production）に設定されていない

**解決方法**:
1. Vercel Dashboard → Settings → Environment Variables
2. `VITE_OPENAI_API_KEY` の「Environment」で「Production」にチェックが入っているか確認
3. チェックが入っていない場合は追加して保存
4. 再デプロイを実行

### デバッグ方法

ブラウザのコンソール（F12）で以下のコマンドを実行して、環境変数の状態を確認できます：

```javascript
// 環境変数の状態を確認
console.log('環境変数:', import.meta.env.VITE_OPENAI_API_KEY ? '設定済み' : '未設定')
console.log('環境変数の長さ:', import.meta.env.VITE_OPENAI_API_KEY?.length || 0)
console.log('環境モード:', import.meta.env.MODE)
```

または、アプリケーションの需要予測画面を開くと、コンソールに自動的に環境変数の状態が表示されます。

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
4. Value: `your-openai-api-key-here`（実際のAPIキーを入力）
5. Environment: Production にチェック
6. Save
7. 再デプロイ
