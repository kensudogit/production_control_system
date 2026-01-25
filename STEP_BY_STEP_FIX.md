# ステップバイステップ修正ガイド

## 現在の状況

- ✅ コードは修正済み（APIキーは環境変数から読み込み）
- ❌ 過去のコミット（78e44daa679b286ef234d465a414fcd300f398c3）にAPIキーが含まれている
- ❌ GitHubのPush Protectionがブロックしている

## 解決方法（2つの選択肢）

### 方法A: GitHubで一時的に許可（最も簡単・推奨）

**ステップ1**: 以下のURLにアクセス
```
https://github.com/kensudogit/production_control_system/security/secret-scanning/unblock-secret/38kX7kSyxymwNayYfIkOl4RCoYS
```

**ステップ2**: 「Allow secret」をクリック

**ステップ3**: プッシュを再実行
```bash
git push origin main
```

**ステップ4**: APIキーを無効化（重要！）
- https://platform.openai.com/api-keys にアクセス
- 該当するAPIキーを削除

**ステップ5**: 後で履歴を書き換える（オプション）
- 詳細は `REMOVE_SECRET_FROM_HISTORY.md` を参照

---

### 方法B: コミット履歴を書き換える（永続的解決）

#### Windows PowerShellで実行：

**ステップ1**: バックアップを作成（推奨）
```powershell
cd C:\devlop
git clone --mirror https://github.com/kensudogit/production_control_system.git production_control_system-backup.git
```

**ステップ2**: スクリプトを実行
```powershell
cd C:\devlop\production_control_system
.\remove_api_key_from_history.ps1
```

または、手動で実行：

```powershell
# コミット履歴から該当ファイルを削除
git filter-branch --force --index-filter `
    "git rm --cached --ignore-unmatch frontend/src/pages/DemandForecasting.tsx" `
    --prune-empty --tag-name-filter cat -- --all

# クリーンアップ
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 強制プッシュ
git push origin --force --all
git push origin --force --tags
```

**ステップ3**: APIキーを無効化
- https://platform.openai.com/api-keys で該当キーを削除

---

## 推奨される手順

1. **まず方法Aを実行**（最も簡単）
2. **APIキーを無効化**（必須）
3. **後で方法Bを実行**（履歴を完全にクリーンにする）

## 検証

修正後、以下のコマンドで確認：

```powershell
# コード内にAPIキーが残っていないか確認
Select-String -Path "frontend\src\**\*.tsx" -Pattern "sk-proj-" -Recurse

# コミット履歴を確認
git log --all --full-history -p -- frontend/src/pages/DemandForecasting.tsx | Select-String "sk-proj-"
```

何も出力されなければOKです。

## トラブルシューティング

### エラー: "fatal: ambiguous argument"

```powershell
# リモートの最新情報を取得
git fetch --all

# 再度実行
```

### エラー: "Updates were rejected"

```powershell
# 強制プッシュが必要
git push origin --force --all
```

### 履歴が書き換えられない場合

方法A（GitHubの「Allow secret」）を使用してください。これは一時的ですが、APIキーを無効化すれば問題ありません。
