# Exit Code 137 の対処

## 問題
`production-control-api-gateway exited with code 137`

## Exit Code 137 とは
- **137 = 128 + 9 (SIGKILL)**
- 通常は以下の原因で発生：
  1. **メモリ不足（OOM Killer）** - 最も一般的
  2. Dockerのメモリ制限に達した
  3. 手動での強制終了

## 現在の状況
ログを見ると、API Gatewayは正常に起動しています：
- `Started ApiGatewayApplication in 4.99 seconds`
- `Netty started on port 8080`
- 7つのルートが正常に読み込まれている

exit code 137は一時的な問題の可能性が高いです。`restart: unless-stopped`が設定されているため、自動的に再起動されています。

## 対処方法

### 1. メモリ使用量を確認
```powershell
docker stats production-control-api-gateway
```

### 2. Docker Desktopのメモリ設定を確認
- Docker Desktop → Settings → Resources → Memory
- 推奨: 4GB以上

### 3. API Gatewayのメモリ制限を設定（必要に応じて）
`docker-compose.yml`に以下を追加：
```yaml
api-gateway:
  # ... 既存の設定 ...
  deploy:
    resources:
      limits:
        memory: 1G
      reservations:
        memory: 512M
```

### 4. JVMのメモリ設定を調整（必要に応じて）
`api-gateway/Dockerfile`または環境変数で：
```dockerfile
ENV JAVA_OPTS="-Xms512m -Xmx1g"
```

## 現在の状態
API Gatewayは正常に動作しているため、特別な対応は不要です。もし頻繁にexit code 137が発生する場合は、上記の対処方法を試してください。
