# コミット履歴からAPIキーを削除する方法

## 重要: 既にコミットされたAPIキーの削除

GitHubのPush Protectionが検出したAPIキーは、既にコミット履歴に含まれています。
このAPIキーを無効化し、履歴から削除する必要があります。

## 手順

### 1. OpenAI APIキーの無効化（最優先）

1. https://platform.openai.com/api-keys にアクセス
2. 該当するAPIキーを削除または無効化
3. 新しいAPIキーを生成（必要に応じて）

### 2. コミット履歴からの削除

#### 方法A: git filter-branchを使用（共有リポジトリの場合）

```bash
# バックアップを作成
git clone --mirror https://github.com/kensudogit/production_control_system.git backup-repo.git

# APIキーを含むファイルを履歴から削除
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch frontend/src/pages/DemandForecasting.tsx" \
  --prune-empty --tag-name-filter cat -- --all

# 強制プッシュ（注意: 共有リポジトリの場合はチームと相談）
git push origin --force --all
git push origin --force --tags
```

#### 方法B: BFG Repo-Cleanerを使用（推奨、より高速）

```bash
# BFGをダウンロード
# https://rtyley.github.io/bfg-repo-cleaner/

# リポジトリのミラーを作成
git clone --mirror https://github.com/kensudogit/production_control_system.git

# APIキーを削除
java -jar bfg.jar --replace-text passwords.txt production_control_system.git

# passwords.txtの内容:
# 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==>***REMOVED***

# クリーンアップ
cd production_control_system.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 強制プッシュ
git push --force
```

#### 方法C: 新しいコミットで上書き（最も簡単、ただし履歴は残る）

既に修正済みのコードをコミット・プッシュすれば、最新のコミットにはAPIキーが含まれません。
ただし、過去のコミット履歴には残ります。

```bash
git add .
git commit -m "fix: Remove hardcoded OpenAI API key and use environment variable"
git push origin main
```

### 3. GitHubのSecret Scanningの確認

1. GitHubリポジトリの「Security」タブを確認
2. 「Secret scanning」セクションで検出されたシークレットを確認
3. 必要に応じて、GitHubの「Allow secret」機能を使用して一時的に許可

## 推奨される対応

**個人リポジトリの場合:**
- 方法C（新しいコミットで上書き）を推奨
- APIキーを無効化すれば、過去のコミットに含まれていても問題ありません

**共有リポジトリの場合:**
- 方法B（BFG Repo-Cleaner）を推奨
- チームメンバーと相談してから履歴を書き換え

## 今後の対策

1. ✅ `.env`ファイルを`.gitignore`に追加済み
2. ✅ `.env.example`ファイルを作成済み
3. ✅ コードレビューでAPIキーのハードコードをチェック
4. ✅ GitHub Actionsでシークレットスキャンを有効化（既に有効）

## 検証

修正後、以下のコマンドで確認：

```bash
# コード内にAPIキーが残っていないか確認
grep -r "sk-proj-" frontend/src/
grep -r "sk-[a-zA-Z0-9]\{32,\}" frontend/src/

# 何も出力されなければOK
```
