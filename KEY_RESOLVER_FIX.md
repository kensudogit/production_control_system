# KeyResolver Bean競合エラー修正

## 🔴 エラー内容

```
APPLICATION FAILED TO START

Description:
Parameter 1 of method requestRateLimiterGatewayFilterFactory in org.springframework.cloud.gateway.config.GatewayAutoConfiguration required a single bean, but 2 were found:
      - ipKeyResolver: defined by method 'ipKeyResolver' in class path resource [com/production/control/gateway/config/RateLimitingConfig.class]
      - userKeyResolver: defined by method 'userKeyResolver' in class path resource [com/production/control/gateway/config/RateLimitingConfig.class]

Action:
Consider marking one of the beans as @Primary, updating the consumer to accept multiple beans, or using @Qualifier to identify the bean that should be consumed
```

## 🔍 原因

`RateLimitingConfig`クラスに2つの`KeyResolver` Bean（`ipKeyResolver`と`userKeyResolver`）が定義されていますが、Spring Cloud Gatewayの`requestRateLimiterGatewayFilterFactory`は1つの`KeyResolver` Beanのみを期待しています。

## ✅ 修正内容

`ipKeyResolver`に`@Primary`アノテーションを追加して、デフォルトの`KeyResolver`として使用するようにしました。

**変更内容:**
1. `@Primary`アノテーションのインポートを追加
2. `ipKeyResolver`メソッドに`@Primary`アノテーションを追加

**修正後のコード:**
```java
@Bean
@Primary
public KeyResolver ipKeyResolver() {
    return exchange -> {
        String ip = exchange.getRequest().getRemoteAddress() != null
            ? exchange.getRequest().getRemoteAddress().getAddress().getHostAddress()
            : "unknown";
        return Mono.just(ip);
    };
}
```

## 🚀 再ビルド手順

修正後、API Gatewayを再ビルドしてください：

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

# 起動を待つ（20秒）
Start-Sleep -Seconds 20

# ログを確認
docker-compose logs --tail=50 api-gateway

# ヘルスチェック
Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -UseBasicParsing
```

または、修正スクリプトを実行：

```powershell
.\FINAL_FIX.ps1
```

## 📝 説明

- **`@Primary`アノテーション**: 複数の同じ型のBeanが存在する場合、`@Primary`が付いたBeanが優先的に使用されます
- **`ipKeyResolver`を優先**: IPアドレスベースのレート制限が一般的で、より広範囲に適用できるため
- **`userKeyResolver`は残す**: 必要に応じて`@Qualifier`を使用して明示的に指定できます

## 🔍 確認方法

再ビルド後、ログに以下が表示されないことを確認してください：

- ❌ `APPLICATION FAILED TO START`
- ❌ `required a single bean, but 2 were found`
- ❌ `KeyResolver`

正常な起動ログには以下が含まれます：

- ✅ `Started ApiGatewayApplication`
- ✅ `Netty started on port 8080`
- ✅ `Routes added`

## 🆘 それでも解決しない場合

1. **完全にクリーンアップ**:
   ```powershell
   docker-compose down -v
   docker rmi production_control_system-api-gateway
   docker-compose build --no-cache api-gateway
   docker-compose up -d api-gateway
   ```

2. **ログを確認**:
   ```powershell
   docker-compose logs api-gateway | Select-String -Pattern "FAILED|ERROR|KeyResolver"
   ```

3. **コンパイルエラーの確認**:
   ```powershell
   cd api-gateway
   ./gradlew clean build
   ```
