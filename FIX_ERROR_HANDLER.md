# エラーハンドラー修正

## 問題
- `GlobalExceptionHandler`が`@RestControllerAdvice`を使用していたが、これはSpring MVC用
- Spring Cloud Gateway（WebFlux）では`WebExceptionHandler`インターフェースを実装する必要がある
- 404エラー（`NoResourceFoundException`）が正常な動作なのに、ログに大量に出力されていた

## 修正内容

### 1. `GlobalExceptionHandler.java`
- `@RestControllerAdvice`から`ErrorWebExceptionHandler`インターフェース実装に変更
- `@Order(-2)`を追加してデフォルトのエラーハンドラーより優先度を高く設定
- 404エラー（`NoResourceFoundException`）は`DEBUG`レベルでログ出力（正常な動作）
- その他のエラーは適切に処理してJSONレスポンスを返す

### 2. `application.yml`
- `management.endpoint.health.show-details: when-authorized` → `always`に変更
- 開発環境では常にヘルスチェックの詳細を表示

## 再ビルド手順

```powershell
.\REBUILD_NOW.ps1
```

または手動で：

```powershell
# 1. API Gatewayコンテナを停止・削除
docker-compose stop api-gateway
docker-compose rm -f api-gateway

# 2. イメージを削除
docker rmi -f production_control_system-api-gateway

# 3. 再ビルド
docker-compose build --no-cache api-gateway

# 4. 起動
docker-compose up -d api-gateway

# 5. ログ確認
docker-compose logs -f api-gateway
```

## 期待される動作

1. `/actuator/health`にアクセス → 正常なJSONレスポンス（200 OK）
2. `/`にアクセス → 404エラー（JSON形式、正常な動作）
3. `/favicon.ico`にアクセス → 404エラー（JSON形式、正常な動作）
4. エラーログが適切に出力される（404はDEBUGレベル）
