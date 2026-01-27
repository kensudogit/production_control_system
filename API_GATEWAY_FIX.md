# API Gateway起動エラー修正

## 🔴 エラー内容

```
APPLICATION FAILED TO START

Description:
Spring MVC found on classpath, which is incompatible with Spring Cloud Gateway.

Action:
Please set spring.main.web-application-type=reactive or remove spring-boot-starter-web dependency.
```

## 🔍 原因

Spring Cloud Gatewayは**リアクティブ**なアプリケーションタイプを必要としますが、`build.gradle`に`spring-boot-starter-web`（Spring MVC）が含まれているため、競合が発生しています。

## ✅ 修正内容

### 1. build.gradleの修正

`spring-boot-starter-web`を削除しました。Spring Cloud GatewayはWebFluxベースなので、`spring-boot-starter-webflux`のみを使用します。

**変更前:**
```gradle
implementation 'org.springframework.boot:spring-boot-starter-web'
implementation 'org.springframework.boot:spring-boot-starter-webflux'
```

**変更後:**
```gradle
// spring-boot-starter-web は削除（Spring Cloud Gatewayと競合するため）
implementation 'org.springframework.boot:spring-boot-starter-webflux'
```

### 2. application.ymlの修正

明示的に`spring.main.web-application-type=reactive`を設定しました。

**追加:**
```yaml
spring:
  main:
    web-application-type: reactive
```

## 🚀 再起動手順

修正後、API Gatewayを再ビルドして起動してください：

```powershell
cd C:\devlop\production_control_system

# API Gatewayコンテナを停止・削除
docker-compose stop api-gateway
docker-compose rm -f api-gateway

# API Gatewayイメージを削除
docker rmi production_control_system-api-gateway

# API Gatewayを再ビルド
docker-compose build --no-cache api-gateway

# API Gatewayを起動
docker-compose up -d api-gateway

# ログを確認
docker-compose logs -f api-gateway
```

または、全サービスを再起動：

```powershell
docker-compose down
docker-compose up -d --build
```

## 🔍 確認方法

起動後、以下で確認してください：

```powershell
# API Gatewayの状態確認
docker-compose ps api-gateway

# ログ確認（エラーがないことを確認）
docker-compose logs --tail=50 api-gateway

# ヘルスチェック
curl http://localhost:8080/actuator/health

# またはブラウザで
# http://localhost:8080/actuator/health
```

正常に起動していれば、以下のようなレスポンスが返ります：

```json
{
  "status": "UP"
}
```

## 📝 注意事項

- Spring Cloud Gatewayは**リアクティブ**なアプリケーションタイプのみをサポートします
- `spring-boot-starter-web`（Spring MVC）は使用できません
- `spring-boot-starter-webflux`を使用してください
- コントローラーではなく、**ルーティング設定**（`application.yml`）でAPI Gatewayを設定します

## 🆘 それでも解決しない場合

1. **完全にクリーンアップして再ビルド**:
   ```powershell
   docker-compose down -v
   docker rmi production_control_system-api-gateway
   docker-compose build --no-cache api-gateway
   docker-compose up -d api-gateway
   ```

2. **ログを確認**:
   ```powershell
   docker-compose logs api-gateway > api-gateway-error.log
   ```

3. **Gradleキャッシュをクリア**（ローカルでビルドする場合）:
   ```powershell
   cd api-gateway
   ./gradlew clean build
   ```
