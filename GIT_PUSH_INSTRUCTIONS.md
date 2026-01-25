# GitHubプッシュ手順

## 現在の状況

✅ APIキーを環境変数に変更済み
✅ `.env.example`ファイル作成済み
✅ `.gitignore`更新済み
✅ コード内にAPIキーは残っていません

## プッシュ手順

### 1. 変更をステージング

```bash
git add .
```

### 2. コミット

```bash
git commit -m "fix: Remove hardcoded OpenAI API key and use environment variable

- Replace hardcoded API key with environment variable VITE_OPENAI_API_KEY
- Add .env.example file for environment variable configuration
- Update .gitignore to ensure .env files are not committed
- Add security documentation"
```

### 3. プッシュ

```bash
git push origin main
```

## もしプッシュがブロックされた場合

GitHubのPush Protectionが過去のコミット履歴に含まれるAPIキーを検出する可能性があります。

### 対応方法

#### オプション1: GitHubの「Allow secret」を使用（一時的な対応）

1. GitHubのエラーメッセージに表示されたURLにアクセス
2. 「Allow secret」をクリックして一時的に許可
3. 再度プッシュ

**注意**: これは一時的な対応です。APIキーは無効化してください。

#### オプション2: コミット履歴を書き換える（推奨）

詳細は `REMOVE_SECRET_FROM_HISTORY.md` を参照してください。

#### オプション3: 新しいブランチから開始

```bash
# 新しいブランチを作成
git checkout -b fix/remove-api-key

# 変更をコミット
git add .
git commit -m "fix: Remove hardcoded OpenAI API key"

# プッシュ
git push origin fix/remove-api-key

# プルリクエストを作成してマージ
```

## 重要な注意事項

1. **APIキーを無効化**
   - https://platform.openai.com/api-keys で該当キーを削除
   - 新しいAPIキーを生成（必要に応じて）

2. **環境変数の設定**
   - `frontend/.env`ファイルを作成
   - `VITE_OPENAI_API_KEY`を設定

3. **今後の対策**
   - APIキーは絶対にコードに直接記述しない
   - `.env`ファイルはコミットしない
   - コードレビューで確認

## 検証

プッシュ前に、コード内にAPIキーが残っていないか確認：

```bash
# Windows PowerShell
Select-String -Path "frontend\src\**\*.tsx" -Pattern "sk-proj-" -Recurse
Select-String -Path "frontend\src\**\*.ts" -Pattern "sk-proj-" -Recurse

# または Git Bash
grep -r "sk-proj-" frontend/src/
```

何も出力されなければOKです。
