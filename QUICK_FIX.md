# フロントエンド接続エラー修正ガイド

## 🔴 問題

`ERR_CONNECTION_REFUSED` エラーが発生し、`http://localhost:3000` にアクセスできません。

**原因**: フロントエンドコンテナが権限エラーで再起動を繰り返しています。

## ✅ 解決方法

### 方法1: 修正スクリプトを実行（推奨）

```powershell
cd C:\devlop\production_control_system
.\fix-frontend.ps1
```

このスクリプトが以下を自動実行します：
1. フロントエンドコンテナの停止・削除
2. イメージの削除
3. 再ビルド（キャッシュなし）
4. 起動と状態確認

### 方法2: 手動で修正

```powershell
cd C:\devlop\production_control_system

# 1. フロントエンドコンテナを停止・削除
docker-compose stop frontend
docker-compose rm -f frontend

# 2. フロントエンドイメージを削除（強制再ビルド）
docker rmi production_control_system-frontend

# 3. フロントエンドを再ビルド（キャッシュなし）
docker-compose build --no-cache frontend

# 4. フロントエンドを起動
docker-compose up -d frontend

# 5. 状態を確認
docker-compose ps frontend

# 6. ログを確認
docker-compose logs -f frontend
```

### 方法3: 全サービスを再起動

```powershell
cd C:\devlop\production_control_system

# 全コンテナを停止・削除
docker-compose down

# 全サービスを再ビルドして起動
docker-compose up -d --build
```

## 🔍 確認手順

### 1. コンテナの状態確認

```powershell
docker-compose ps frontend
```

**正常な状態**: `Up` と表示される

**異常な状態**: `Restarting` や `Exited` と表示される

### 2. ログの確認

```powershell
# 最新50行のログ
docker-compose logs --tail=50 frontend

# リアルタイムでログを確認
docker-compose logs -f frontend
```

**正常なログ**:
```
Setting API Gateway URL to: http://api-gateway:8080/
Verifying nginx config after replacement...
Testing nginx configuration...
Starting nginx as nginx user...
```

**エラーログ**:
```
sed: can't create temp file '/etc/nginx/nginx.confXXXXXX': Permission denied
```

### 3. ポートの確認

```powershell
netstat -ano | findstr :3000
```

ポート3000が使用されていれば、コンテナは起動しています。

### 4. ブラウザでアクセス

http://localhost:3000 にアクセスして、正常に表示されるか確認してください。

## 🛠️ 修正内容

以下の修正を適用しました：

1. **Dockerfile.root**:
   - `USER nginx` をコメントアウト（entrypointをrootで実行）
   - `su-exec` パッケージを追加

2. **docker-entrypoint.sh**:
   - nginx.conf編集後に`su-exec`でnginxユーザーに切り替えてからnginxを起動

これにより、nginx.confの編集はroot権限で行い、nginxの起動はnginxユーザーで行うため、セキュリティと権限の両立が可能になりました。

## ⚠️ 注意事項

- 再ビルドには数分かかることがあります
- Docker Desktopが起動していることを確認してください
- ポート3000が他のアプリケーションで使用されていないことを確認してください

## 🆘 それでも解決しない場合

1. **Docker Desktopを再起動**
   - Docker Desktopを完全に終了
   - 再起動してから再度試す

2. **完全にクリーンアップ**
   ```powershell
   docker-compose down -v
   docker system prune -a
   docker-compose up -d --build
   ```

3. **ログファイルを保存して確認**
   ```powershell
   docker-compose logs frontend > frontend-error.log
   ```
   エラーメッセージを確認してください。
