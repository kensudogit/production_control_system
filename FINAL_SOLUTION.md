# 最終解決方法

## 🎯 現在の状況

- ✅ コードは修正済み（APIキーは環境変数から読み込み）
- ❌ 過去のコミット（78e44daa679b286ef234d465a414fcd300f398c3）にAPIキーが含まれている
- ❌ GitHubのPush Protectionがブロックしている

## 🚀 解決方法（2つの選択肢）

### 方法1: GitHubで一時的に許可（最も簡単・推奨）

**所要時間: 30秒**

1. ブラウザで以下のURLを開く：
   ```
   https://github.com/kensudogit/production_control_system/security/secret-scanning/unblock-secret/38kX7kSyxymwNayYfIkOl4RCoYS
   ```

2. 「Allow secret」をクリック

3. プッシュを再実行：
   ```powershell
   git push origin main
   ```

4. **重要**: APIキーを無効化
   - https://platform.openai.com/api-keys で該当キーを削除

**これで完了です！** 履歴の書き換えは後で実行できます。

---

### 方法2: コミット履歴を書き換える（永続的解決）

**所要時間: 5-10分**

#### PowerShellで実行：

```powershell
cd C:\devlop\production_control_system

# スクリプトを実行
.\rewrite_history.ps1
```

スクリプトが以下を実行します：
1. コミット履歴から該当ファイルを削除
2. 修正版のファイルを追加
3. クリーンアップ
4. （オプション）強制プッシュ

#### 手動で実行する場合：

```powershell
# 1. コミット履歴から該当ファイルを削除
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch frontend/src/pages/DemandForecasting.tsx" --prune-empty --tag-name-filter cat -- --all

# 2. 修正版のファイルを追加（既に存在する場合は不要）
git add frontend/src/pages/DemandForecasting.tsx
git commit -m "fix: Add corrected DemandForecasting.tsx without hardcoded API key"

# 3. クリーンアップ
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 4. 強制プッシュ
git push origin --force --all
git push origin --force --tags
```

---

## ✅ 推奨される手順

1. **まず方法1を実行** ← これだけでプッシュできます
2. **APIキーを無効化** ← 必須
3. **（オプション）後で方法2を実行** ← 履歴を完全にクリーンにしたい場合

---

## 📝 重要な注意事項

- **APIキーの無効化は必須です** - 過去のコミットに含まれていても、無効化すれば安全です
- 強制プッシュ（--force）は履歴を書き換えるため、共有リポジトリの場合は慎重に実行してください
- 履歴を書き換えた後、他の開発者は `git fetch --all` と `git reset --hard origin/main` を実行する必要があります

---

## 🔍 検証

修正後、以下のコマンドで確認：

```powershell
# コード内にAPIキーが残っていないか確認
Select-String -Path "frontend\src\**\*.tsx" -Pattern "sk-proj-" -Recurse

# コミット履歴を確認
git log --all --full-history -p -- frontend/src/pages/DemandForecasting.tsx | Select-String "sk-proj-"
```

何も出力されなければOKです。
