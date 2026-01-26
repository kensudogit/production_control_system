# 🔧 Gitロックファイルエラーの解決方法

## ⚠️ 問題

`.git/index.lock`ファイルが存在し、Git操作ができない状態です。

## 🔍 原因

- 別のGitプロセスが実行中
- Cursor/VSCodeのGit拡張機能がGit操作を実行中
- 以前のGit操作がクラッシュしてロックファイルが残っている

## 🛠️ 解決方法

### 方法1: すべてのGitプロセスを終了してから削除

**PowerShellを管理者として実行**してから：

```powershell
cd C:\devlop\production_control_system

# すべてのGit関連プロセスを終了
Get-Process | Where-Object {$_.ProcessName -like "*git*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Cursor/VSCodeを一時的に閉じる（推奨）

# ロックファイルを削除
Remove-Item -Force .git\index.lock -ErrorAction SilentlyContinue
Remove-Item -Force .git\objects\*\tmp_obj_* -ErrorAction SilentlyContinue

# 確認
git status
```

### 方法2: 手動でロックファイルを削除

1. **Cursor/VSCodeを完全に閉じる**
2. **エクスプローラーで以下を開く**:
   ```
   C:\devlop\production_control_system\.git
   ```
3. **`index.lock`ファイルを削除**（存在する場合）
4. **PowerShellを開いて**:
   ```powershell
   cd C:\devlop\production_control_system
   git status
   ```

### 方法3: Git操作をスキップしてデプロイ環境を変更

Git操作ができない場合は、デプロイ環境の変更を先に進めます：

1. **`vercel.json`を直接編集**してデプロイ環境を変更
2. **Vercel Dashboardから直接デプロイ**（Git操作不要）
3. 後でGit操作を実行

## 📋 次のステップ

1. ✅ ロックファイルを削除（上記の方法を使用）
2. ✅ Git操作を実行:
   ```powershell
   git add .
   git commit -m "デプロイ環境の変更とドキュメント追加"
   git push origin main
   ```
3. ✅ または、Git操作をスキップしてVercel Dashboardから直接デプロイ

## ⚠️ 注意事項

- ロックファイルを削除する前に、他のGit操作が実行中でないことを確認してください
- Cursor/VSCodeを閉じると、進行中の作業が失われる可能性があるため、保存を確認してください
