# セキュリティ修正: OpenAI APIキーの環境変数化

## 問題

GitHubのPush Protectionが、`frontend/src/pages/DemandForecasting.tsx`にハードコードされたOpenAI APIキーを検出してプッシュをブロックしました。

## 修正内容

1. **APIキーの環境変数化**
   - `DemandForecasting.tsx`の135行目にあったハードコードされたAPIキーを削除
   - 環境変数 `VITE_OPENAI_API_KEY` から読み込むように変更

2. **環境変数設定ファイルの追加**
   - `frontend/.env.example` を作成
   - 環境変数の設定方法を記載

3. **.gitignoreの更新**
   - `.env` ファイルが確実に無視されるように設定を追加

## 使用方法

### 1. 環境変数ファイルの作成

```bash
cd frontend
cp .env.example .env
```

### 2. APIキーの設定

`.env`ファイルを編集して、OpenAI APIキーを設定：

```env
VITE_OPENAI_API_KEY=your-actual-api-key-here
```

### 3. アプリケーションの再起動

環境変数を変更した場合は、開発サーバーを再起動してください：

```bash
npm run dev
```

## 注意事項

- **`.env`ファイルは絶対にコミットしないでください**
- APIキーは機密情報です。GitHubやその他の公開リポジトリにプッシュしないでください
- 本番環境では、環境変数管理サービス（Vercel、AWS Secrets Manager等）を使用してください

## コミット履歴からの削除

既にコミットされたAPIキーを履歴から削除する場合は、以下のコマンドを実行してください：

```bash
# 注意: これは履歴を書き換えるため、共有リポジトリでは慎重に実行してください
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch frontend/src/pages/DemandForecasting.tsx" \
  --prune-empty --tag-name-filter cat -- --all

# または、BFG Repo-Cleanerを使用（推奨）
# https://rtyley.github.io/bfg-repo-cleaner/
```

## 検証

修正後、以下のコマンドでAPIキーがコード内に残っていないか確認してください：

```bash
# コード内のAPIキーパターンを検索
grep -r "sk-proj-" frontend/src/
grep -r "sk-[a-zA-Z0-9]" frontend/src/

# 何も出力されなければOK
```
