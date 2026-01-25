# GitHub Push Protectionエラー対応

## 問題
`VERCEL_ENV_SETUP.md`ファイルにAPIキーが含まれていたため、GitHub Push Protectionがブロックしています。

## 対応完了
✅ `VERCEL_ENV_SETUP.md`からAPIキーを削除済み

## 次のステップ

### 方法1: GitHubの「Allow secret」機能を使用（推奨・最も簡単）

1. 以下のURLにアクセス：
   ```
   https://github.com/kensudogit/production_control_system/security/secret-scanning/unblock-secret/38kmcAR8XzTQIZuMZshNUJLJOiz
   ```

2. 「Allow secret」をクリック

3. 変更をコミット・プッシュ：
   ```powershell
   git add VERCEL_ENV_SETUP.md
   git commit -m "fix: Remove API key from VERCEL_ENV_SETUP.md"
   git push origin main
   ```

### 方法2: コミット履歴を書き換える（完全に削除したい場合）

```powershell
# コミット履歴から該当ファイルを削除
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch VERCEL_ENV_SETUP.md" --prune-empty --tag-name-filter cat -- --all

# 修正版のファイルを追加
git add VERCEL_ENV_SETUP.md
git commit -m "fix: Remove API key from VERCEL_ENV_SETUP.md"

# クリーンアップ
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 強制プッシュ
git push origin --force --all
git push origin --force --tags
```

## 推奨手順

1. **まず方法1を試す** ← これだけでプッシュできます
2. **APIキーを無効化** ← 必須（https://platform.openai.com/api-keys）
3. **（オプション）後で方法2を実行** ← 履歴を完全にクリーンにしたい場合

## 重要な注意事項

- **APIキーの無効化は必須です** - 過去のコミットに含まれていても、無効化すれば安全です
- GitHubの「Allow secret」は一時的な対応ですが、APIキーを無効化すれば問題ありません
- 履歴の書き換えはオプションです
