# API Gateway再ビルド手順

## 🔴 現在の状況

`curl: (52) Empty reply from server` エラーが発生しています。
これは、API Gatewayが古いビルドで起動しているためです。

## ✅ 解決手順

修正は既に適用されていますが、**コンテナを再ビルドする必要があります**。

### ステップ1: Docker Desktopを起動

1. **Docker Desktopが起動しているか確認**
   - タスクバーにDockerアイコンがあるか確認
   - 起動していない場合は、Docker Desktopを起動
   - 起動完了まで1-3分待つ（アイコンが緑色になるまで）

### ステップ2: PowerShellを管理者として実行

1. Windowsキーを押す
2. 「PowerShell」と入力
3. 「Windows PowerShell」を右クリック
4. 「管理者として実行」を選択

### ステップ3: API Gatewayを再ビルド

```powershell
cd C:\devlop\production_control_system

# 方法1: 修正スクリプトを実行（推奨）
.\fix-api-gateway.ps1
```

または、手動で実行：

```powershell
cd C:\devlop\production_control_system

# 1. API Gatewayコンテナを停止・削除
docker-compose stop api-gateway
docker-compose rm -f api-gateway

# 2. API Gatewayイメージを削除
docker rmi production_control_system-api-gateway

# 3. データベースとRedisが起動していることを確認
docker-compose ps postgres redis

# データベースとRedisが起動していない場合
docker-compose up -d postgres redis
Start-Sleep -Seconds 15

# 4. API Gatewayを再ビルド（キャッシュなし）
docker-compose build --no-cache api-gateway

# 5. API Gatewayを起動
docker-compose up -d api-gateway

# 6. 起動を待つ（15-20秒）
Write-Host "API Gatewayの起動を待機中（20秒）..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

# 7. ログを確認
docker-compose logs --tail=50 api-gateway
```

### ステップ4: 確認

```powershell
# 1. コンテナの状態確認
docker-compose ps api-gateway

# 2. ヘルスチェック
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

## 🔍 ログの確認ポイント

再ビルド後、ログに以下が表示されていないことを確認してください：

- ❌ `APPLICATION FAILED TO START`
- ❌ `Spring MVC found on classpath`
- ❌ `incompatible with Spring Cloud Gateway`

正常な起動ログには以下が含まれます：

- ✅ `Started ApiGatewayApplication`
- ✅ `Netty started on port 8080`
- ✅ `Routes added`

## ⚠️ 重要な注意事項

1. **必ず再ビルドが必要**: コードを修正しただけでは不十分です
2. **キャッシュなしでビルド**: `--no-cache`オプションを使用してください
3. **起動に時間がかかる**: 15-20秒待ってからヘルスチェックを実行してください
4. **データベースとRedisが必要**: これらが起動している必要があります

## 🆘 それでも解決しない場合

### 完全にクリーンアップ

```powershell
# 全コンテナを停止・削除
docker-compose down -v

# API Gatewayイメージを削除
docker rmi production_control_system-api-gateway

# 全サービスを再ビルドして起動
docker-compose up -d --build
```

### ログを保存して確認

```powershell
# ログをファイルに保存
docker-compose logs api-gateway > api-gateway-error.log

# エラーを検索
Select-String -Path api-gateway-error.log -Pattern "FAILED|ERROR|MVC"
```
