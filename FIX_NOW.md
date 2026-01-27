# API Gateway 空の応答エラー修正

## 🔴 現在のエラー

```
curl: (52) Empty reply from server
```

これは、API Gatewayが古いビルド（`spring-boot-starter-web`が含まれている）で起動している可能性があります。

## ✅ 解決方法

修正は既に適用されていますが、**コンテナを再ビルドする必要があります**。

### 方法1: 修正スクリプトを実行（推奨）

```powershell
cd C:\devlop\production_control_system

# 修正スクリプトを実行
.\fix-api-gateway.ps1
```

### 方法2: 手動で再ビルド

```powershell
cd C:\devlop\production_control_system

# 1. API Gatewayコンテナを停止・削除
docker-compose stop api-gateway
docker-compose rm -f api-gateway

# 2. API Gatewayイメージを削除
docker rmi production_control_system-api-gateway

# 3. API Gatewayを再ビルド（キャッシュなし）
docker-compose build --no-cache api-gateway

# 4. データベースとRedisが起動していることを確認
docker-compose ps postgres redis

# 5. API Gatewayを起動
docker-compose up -d api-gateway

# 6. ログを確認（エラーがないことを確認）
docker-compose logs -f api-gateway
```

### 方法3: 全サービスを再起動

```powershell
cd C:\devlop\production_control_system

# 全コンテナを停止・削除
docker-compose down

# 全サービスを再ビルドして起動
docker-compose up -d --build
```

## 🔍 確認方法

再ビルド後、以下で確認してください：

```powershell
# 1. コンテナの状態確認
docker-compose ps api-gateway

# 2. ログ確認（"APPLICATION FAILED TO START"がないことを確認）
docker-compose logs --tail=50 api-gateway

# 3. ヘルスチェック（10-20秒待ってから）
Start-Sleep -Seconds 15
curl http://localhost:8080/actuator/health

# または、PowerShellで
Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -UseBasicParsing
```

正常なレスポンス例：
```json
{
  "status": "UP"
}
```

## ⚠️ 重要なポイント

1. **必ず再ビルドが必要**: 修正を適用しただけでは不十分です。コンテナイメージを再ビルドする必要があります。

2. **キャッシュなしでビルド**: `--no-cache`オプションを使用して、確実に新しいビルドを作成します。

3. **起動に時間がかかる**: API Gatewayの起動には10-20秒かかることがあります。すぐにヘルスチェックを実行すると失敗する可能性があります。

4. **データベースとRedisが必要**: API GatewayはデータベースとRedisに接続するため、これらが起動している必要があります。

## 🛠️ トラブルシューティング

### 問題1: まだエラーが発生する

**確認事項**:
- ログに`APPLICATION FAILED TO START`が表示されていないか
- `Spring MVC found on classpath`というエラーが表示されていないか

**解決策**:
```powershell
# ログを確認
docker-compose logs api-gateway | Select-String -Pattern "FAILED|ERROR|MVC"

# 完全にクリーンアップして再ビルド
docker-compose down -v
docker rmi production_control_system-api-gateway
docker-compose build --no-cache api-gateway
docker-compose up -d api-gateway
```

### 問題2: ビルドに時間がかかる

**原因**: 初回ビルドや依存関係のダウンロードに時間がかかります。

**対処**: ビルドが完了するまで待ちます（5-10分かかる場合があります）。

### 問題3: ポート8080が使用されている

**確認**:
```powershell
netstat -ano | findstr :8080
```

**解決策**: 他のプロセスがポート8080を使用している場合は、そのプロセスを終了するか、docker-compose.ymlでポートを変更します。

## 📋 チェックリスト

- [ ] `build.gradle`から`spring-boot-starter-web`が削除されている
- [ ] `application.yml`に`spring.main.web-application-type: reactive`が追加されている
- [ ] API Gatewayコンテナを停止・削除した
- [ ] API Gatewayイメージを削除した
- [ ] `--no-cache`オプションで再ビルドした
- [ ] データベースとRedisが起動している
- [ ] API Gatewayが正常に起動している（ログにエラーがない）
- [ ] ヘルスチェックが成功している
