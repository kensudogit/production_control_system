# 今すぐ起動する方法

## 🔴 現在の状況

Dockerコマンドが実行できない状態です。以下の手順で解決してください。

## ✅ 解決手順

### ステップ1: Docker Desktopの確認

1. **Docker Desktopが起動しているか確認**
   - タスクバーにDockerアイコンがあるか確認
   - アイコンをクリックしてDocker Desktopが開くか確認
   - 起動していない場合は、**Docker Desktopを起動**

2. **Docker Desktopが完全に起動するまで待つ**
   - 起動には1-3分かかることがあります
   - タスクバーのDockerアイコンが緑色になるまで待つ

### ステップ2: PowerShellを管理者として実行

1. Windowsキーを押す
2. 「PowerShell」と入力
3. 「Windows PowerShell」を右クリック
4. 「管理者として実行」を選択

### ステップ3: 修正スクリプトを実行

```powershell
# プロジェクトディレクトリに移動
cd C:\devlop\production_control_system

# 修正スクリプトを実行
.\fix-frontend.ps1
```

### ステップ4: 確認

スクリプト実行後、以下を確認：

```powershell
# コンテナの状態確認
docker-compose ps frontend

# ログ確認
docker-compose logs --tail=20 frontend
```

正常に起動していれば、`http://localhost:3000` にアクセスできます。

## 🚀 代替方法: 開発モードで起動

Dockerに問題がある場合、フロントエンドのみ開発モードで起動できます：

```powershell
# フロントエンドディレクトリに移動
cd C:\devlop\production_control_system\frontend

# 依存関係をインストール（初回のみ）
npm install

# 開発サーバーを起動
npm run dev
```

これで **http://localhost:5173** でアクセスできます（Viteのデフォルトポート）

**注意**: この方法では、バックエンドAPI（http://localhost:8080）が起動している必要があります。

## 🛠️ 手動で修正する場合

```powershell
# 1. Docker Desktopを起動（重要！）

# 2. PowerShellを管理者として実行

# 3. プロジェクトディレクトリに移動
cd C:\devlop\production_control_system

# 4. フロントエンドコンテナを停止・削除
docker-compose stop frontend
docker-compose rm -f frontend

# 5. フロントエンドイメージを削除
docker rmi production_control_system-frontend

# 6. フロントエンドを再ビルド
docker-compose build --no-cache frontend

# 7. フロントエンドを起動
docker-compose up -d frontend

# 8. 状態を確認
docker-compose ps frontend

# 9. ログを確認
docker-compose logs -f frontend
```

## ⚠️ よくある問題

### 問題1: "Access is denied" エラー

**解決策**:
- PowerShellを**管理者として実行**
- Docker Desktopを再起動

### 問題2: Docker Desktopが起動しない

**解決策**:
1. タスクマネージャーで `Docker Desktop` プロセスを終了
2. Docker Desktopを再起動
3. それでも起動しない場合は、Docker Desktopを再インストール

### 問題3: ポート3000が使用されている

**解決策**:
```powershell
# ポート3000を使用しているプロセスを確認
netstat -ano | findstr :3000

# プロセスIDを確認して、タスクマネージャーで終了
```

## 📋 チェックリスト

- [ ] Docker Desktopが起動している
- [ ] PowerShellを管理者として実行している
- [ ] `docker --version` コマンドが正常に動作する
- [ ] `docker ps` コマンドが正常に動作する
- [ ] 修正スクリプトを実行した
- [ ] コンテナが正常に起動している（`docker-compose ps`）
- [ ] ログにエラーがない（`docker-compose logs frontend`）

## 🆘 それでも解決しない場合

1. **Docker Desktopを完全に再起動**
   - Docker Desktopを終了
   - タスクマネージャーで残っているプロセスを終了
   - Docker Desktopを再起動

2. **完全にクリーンアップ**
   ```powershell
   docker-compose down -v
   docker system prune -a
   docker-compose up -d --build
   ```

3. **開発モードで起動**（上記の代替方法を参照）
