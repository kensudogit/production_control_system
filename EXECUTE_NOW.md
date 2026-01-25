# 今すぐ実行する手順

## ⚡ 最も簡単で確実な方法（推奨）

### 1. GitHubで一時的に許可（30秒）

ブラウザで以下のURLを開いて「Allow secret」をクリック：
```
https://github.com/kensudogit/production_control_system/security/secret-scanning/unblock-secret/38kX7kSyxymwNayYfIkOl4RCoYS
```

### 2. プッシュを実行

```powershell
cd C:\devlop\production_control_system
git push origin main
```

### 3. APIキーを無効化（重要！）

1. https://platform.openai.com/api-keys にアクセス
2. 該当するAPIキーを削除
3. 新しいAPIキーを生成（必要に応じて）

---

## 🔧 履歴を完全に書き換える方法（後で実行）

プッシュが成功した後、以下のコマンドで履歴を書き換えます：

```powershell
cd C:\devlop\production_control_system

# スクリプトを実行
.\remove_api_key_from_history.ps1
```

または、手動で実行：

```powershell
# コミット履歴から該当ファイルを削除
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch frontend/src/pages/DemandForecasting.tsx" --prune-empty --tag-name-filter cat -- --all

# クリーンアップ
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 強制プッシュ
git push origin --force --all
git push origin --force --tags
```

---

## ✅ 完了チェックリスト

- [ ] GitHubで「Allow secret」をクリック
- [ ] `git push origin main` を実行
- [ ] プッシュが成功したことを確認
- [ ] OpenAI APIキーを無効化
- [ ] （オプション）履歴を書き換え

---

## 📝 注意事項

- **APIキーの無効化は必須です** - 過去のコミットに含まれていても、無効化すれば安全です
- 履歴の書き換えはオプションですが、完全にクリーンにしたい場合は実行してください
- 強制プッシュ（--force）は履歴を書き換えるため、共有リポジトリの場合は慎重に実行してください
