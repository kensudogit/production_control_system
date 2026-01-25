# クイック修正: コミット履歴からAPIキーを削除

## 問題

GitHubのPush Protectionが、過去のコミット（78e44daa679b286ef234d465a414fcd300f398c3）に含まれるAPIキーを検出しています。

## 解決方法（3つのオプション）

### オプション1: GitHubの「Allow secret」を使用（最も簡単、一時的）

1. 以下のURLにアクセス：
   ```
   https://github.com/kensudogit/production_control_system/security/secret-scanning/unblock-secret/38kX7kSyxymwNayYfIkOl4RCoYS
   ```

2. 「Allow secret」をクリック

3. 再度プッシュ：
   ```bash
   git push origin main
   ```

**注意**: これは一時的な対応です。APIキーは無効化してください。

### オプション2: コミット履歴を書き換える（推奨、永続的）

#### Windows PowerShellで実行：

```powershell
# 1. バックアップ（推奨）
git clone --mirror https://github.com/kensudogit/production_control_system.git backup-repo.git

# 2. コミット履歴からAPIキーを含むファイルを削除
git filter-branch --force --index-filter `
    "git rm --cached --ignore-unmatch frontend/src/pages/DemandForecasting.tsx" `
    --prune-empty --tag-name-filter cat -- --all

# 3. クリーンアップ
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 4. 強制プッシュ
git push origin --force --all
git push origin --force --tags
```

#### または、fix_history.ps1スクリプトを使用：

```powershell
.\fix_history.ps1
```

### オプション3: 新しいブランチから開始（最も安全）

```bash
# 1. 新しいブランチを作成
git checkout -b fix/remove-api-key-from-history

# 2. 変更をコミット（既に完了済み）
git add .
git commit -m "fix: Remove hardcoded OpenAI API key and use environment variable"

# 3. 新しいブランチをプッシュ
git push origin fix/remove-api-key-from-history

# 4. GitHubでプルリクエストを作成してマージ
```

その後、メインブランチの履歴を書き換えます。

## 推奨される手順

1. **まず、APIキーを無効化**
   - https://platform.openai.com/api-keys で該当キーを削除

2. **オプション1で一時的に許可してプッシュ**

3. **その後、オプション2で履歴を書き換える**

## 検証

履歴を書き換えた後、APIキーが削除されたか確認：

```bash
# コミット履歴を検索
git log --all --full-history -- frontend/src/pages/DemandForecasting.tsx

# 特定のコミットの内容を確認
git show 78e44daa679b286ef234d465a414fcd300f398c3:frontend/src/pages/DemandForecasting.tsx | grep "sk-proj-"
```

## 重要な注意事項

- **強制プッシュ（--force）は履歴を書き換えます**
- 共有リポジトリの場合は、チームメンバーと相談してください
- 履歴を書き換えた後、他の開発者は `git fetch --all` と `git reset --hard origin/main` を実行する必要があります
