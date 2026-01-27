# フロントエンドNginxログ権限エラー修正

## 🔴 エラー内容

```
nginx: [alert] could not open error log file: open() "/var/log/nginx/error.log" failed (13: Permission denied)
2026/01/27 01:55:02 [emerg] 1#1: open() "/tmp/nginx_error.log" failed (13: Permission denied)
```

## 🔍 原因

Nginxが`nginx`ユーザーで実行されているが、ログファイル（`/tmp/nginx_error.log`、`/tmp/nginx_access.log`）への書き込み権限がないため、起動に失敗していました。

## ✅ 修正内容

### 1. `nginx.conf`の修正
- ログファイルのパスを`/tmp/nginx_error.log`と`/tmp/nginx_access.log`から`/dev/stderr`と`/dev/stdout`に変更
- これにより、ログがDockerコンテナの標準出力/標準エラー出力に出力され、`docker logs`で確認できます
- これはDockerのベストプラクティスです

**変更前:**
```nginx
error_log /tmp/nginx_error.log warn;
access_log /tmp/nginx_access.log main;
```

**変更後:**
```nginx
error_log /dev/stderr warn;
access_log /dev/stdout main;
```

### 2. `docker-entrypoint.sh`の修正
- PIDファイル（`/tmp/nginx.pid`）のみを作成し、適切な権限を設定
- ログファイルの作成処理を削除（stdout/stderrを使用するため不要）

## 🚀 再ビルド手順

修正後、フロントエンドを再ビルドしてください：

```powershell
.\start-frontend.ps1
```

または手動で：

```powershell
# フロントエンドコンテナを停止・削除
docker-compose stop frontend
docker-compose rm -f frontend

# フロントエンドを再ビルド
docker-compose build --no-cache frontend

# フロントエンドを起動
docker-compose up -d frontend

# ログ確認
docker-compose logs -f frontend
```

## 🔍 確認方法

再ビルド後、以下を確認してください：

1. **コンテナが正常に起動しているか:**
   ```powershell
   docker-compose ps frontend
   ```

2. **ログにエラーがないか:**
   ```powershell
   docker-compose logs --tail=50 frontend
   ```

3. **フロントエンドにアクセスできるか:**
   - ブラウザで `http://localhost:3000` にアクセス

## 📝 注意事項

- ログは`docker logs`コマンドで確認できます
- `/dev/stdout`と`/dev/stderr`は常に書き込み可能なので、権限エラーは発生しません
- PIDファイル（`/tmp/nginx.pid`）は引き続き`/tmp`に作成されますが、エントリーポイントスクリプトで適切な権限が設定されます
