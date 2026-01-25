# 即座に解決する方法

## 現在の状況

- ✅ 現在のコードは修正済み（APIキーは環境変数から読み込み）
- ❌ 過去のコミット履歴にAPIキーが残っている
- ❌ GitHubのPush Protectionがブロックしている

## 最も簡単な解決方法（推奨）

### ステップ1: GitHubで一時的に許可

1. 以下のURLにアクセス：
   ```
   https://github.com/kensudogit/production_control_system/security/secret-scanning/unblock-secret/38kX7kSyxymwNayYfIkOl4RCoYS
   ```

2. 「Allow secret」をクリック

3. 再度プッシュ：
   ```bash
   git push origin main
   ```

### ステップ2: APIキーを無効化（重要）

1. https://platform.openai.com/api-keys にアクセス
2. 該当するAPIキーを削除または無効化
3. 新しいAPIキーを生成（必要に応じて）

### ステップ3: コミット履歴を書き換える（後で実行）

プッシュが成功した後、以下のコマンドで履歴を書き換えます：

```bash
# Windows PowerShell
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch frontend/src/pages/DemandForecasting.tsx" --prune-empty --tag-name-filter cat -- --all

# クリーンアップ
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 強制プッシュ
git push origin --force --all
git push origin --force --tags
```

## 代替方法: 新しいブランチから開始

もし上記の方法がうまくいかない場合：

```bash
# 1. 新しいブランチを作成
git checkout -b fix/security-remove-api-key

# 2. 変更をコミット（既に完了済み）
git add .
git commit -m "fix: Remove hardcoded OpenAI API key and use environment variable"

# 3. プッシュ
git push origin fix/security-remove-api-key

# 4. GitHubでプルリクエストを作成
# 5. マージ後、メインブランチの履歴を書き換え
```

## 検証

修正後、以下のコマンドで確認：

```bash
# コード内にAPIキーが残っていないか確認
grep -r "sk-proj-" frontend/src/

# コミット履歴を確認
git log --all --full-history -p -- frontend/src/pages/DemandForecasting.tsx | grep "sk-proj-"
```
