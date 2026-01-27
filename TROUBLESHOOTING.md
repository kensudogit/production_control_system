# トラブルシューティングガイド - localhost:3000 が起動しない

## 🔍 問題の診断手順

### ステップ1: Docker Desktopの確認

1. **Docker Desktopが起動しているか確認**
   - タスクバーにDockerアイコンがあるか確認
   - アイコンをクリックしてDocker Desktopが開くか確認
   - 起動していない場合は、Docker Desktopを起動

2. **Dockerの状態確認**
   ```powershell
   docker --version
   docker ps
   ```
   - エラーが出る場合は、Docker Desktopを再起動

### ステップ2: コンテナの状態確認

```powershell
cd C:\devlop\production_control_system

# コンテナの状態を確認
docker-compose ps

# 実行中のコンテナを確認
docker ps

# フロントエンドコンテナの状態を確認
docker ps | findstr frontend
```

### ステップ3: ログの確認

```powershell
# フロントエンドのログを確認
docker-compose logs frontend

# 最新50行のログを確認
docker-compose logs --tail=50 frontend

# リアルタイムでログを確認
docker-compose logs -f frontend
```

### ステップ4: ポートの確認

```powershell
# ポート3000が使用されているか確認
netstat -ano | findstr :3000

# 他の必要なポートも確認
netstat -ano | findstr :8080
netstat -ano | findstr :5432
```

## 🛠️ 解決方法

### 方法1: Docker Desktopを再起動

1. Docker Desktopを完全に終了
2. タスクマネージャーで `Docker Desktop` プロセスが残っていないか確認
3. Docker Desktopを再起動
4. 起動を待つ（数分かかる場合があります）

### 方法2: コンテナを再起動

```powershell
cd C:\devlop\production_control_system

# 全てのコンテナを停止
docker-compose stop

# コンテナを削除
docker-compose down

# 再度起動
docker-compose up -d --build
```

### 方法3: フロントエンドのみ再起動

```powershell
# フロントエンドコンテナを再起動
docker-compose restart frontend

# または、再ビルドして起動
docker-compose up -d --build frontend
```

### 方法4: ネットワークの問題を解決

```powershell
# 既存のネットワークを削除
docker network prune -f

# コンテナを停止・削除
docker-compose down

# 再度起動
docker-compose up -d --build
```

### 方法5: フロントエンドを開発モードで起動（Dockerを使わない）

Dockerに問題がある場合、フロントエンドのみ開発モードで起動できます：

```powershell
# フロントエンドディレクトリに移動
cd C:\devlop\production_control_system\frontend

# 依存関係をインストール（初回のみ）
npm install

# 開発サーバーを起動
npm run dev
```

これで http://localhost:5173 でアクセスできます（Viteのデフォルトポート）

## 🔍 よくある問題と解決策

### 問題1: "Access is denied" エラー

**原因**: Docker Desktopが起動していない、または権限の問題

**解決策**:
1. Docker Desktopを起動
2. PowerShellを管理者として実行
3. Docker Desktopを再起動

### 問題2: ポート3000が既に使用されている

**原因**: 他のアプリケーションがポート3000を使用している

**解決策**:
```powershell
# ポート3000を使用しているプロセスを確認
netstat -ano | findstr :3000

# プロセスIDを確認して、タスクマネージャーで終了
# または、docker-compose.ymlでポートを変更
```

### 問題3: コンテナが起動しない

**原因**: ビルドエラー、リソース不足、設定エラー

**解決策**:
```powershell
# ログを確認
docker-compose logs frontend

# キャッシュなしで再ビルド
docker-compose build --no-cache frontend

# リソース使用量を確認
docker stats
```

### 問題4: ネットワークエラー

**原因**: Dockerネットワークの競合

**解決策**:
```powershell
# ネットワークをクリーンアップ
docker network prune -f

# コンテナを再起動
docker-compose down
docker-compose up -d --build
```

## 📋 チェックリスト

起動しない場合、以下を順番に確認してください：

- [ ] Docker Desktopが起動している
- [ ] `docker ps` コマンドが正常に動作する
- [ ] ポート3000が空いている
- [ ] コンテナが起動している（`docker-compose ps`）
- [ ] フロントエンドコンテナのログにエラーがない
- [ ] 十分なメモリがある（最低4GB推奨）
- [ ] ファイアウォールがブロックしていない

## 🆘 それでも解決しない場合

1. **完全にクリーンアップして再起動**:
   ```powershell
   docker-compose down -v
   docker system prune -a
   docker-compose up -d --build
   ```

2. **Docker Desktopを完全に再インストール**

3. **開発モードで起動**（上記の方法5を参照）

4. **ログファイルを確認**:
   - `docker-compose logs frontend > frontend.log`
   - エラーメッセージを確認
