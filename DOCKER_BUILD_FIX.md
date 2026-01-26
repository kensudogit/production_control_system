# Dockerビルドエラーの修正

## ✅ 修正完了

Dockerビルドエラーを修正しました。

## 🔍 問題

ログファイル `logs.1769388748905.log` に以下のエラーが記録されていました：

```
ERROR: failed to build: failed to solve: openjdk:17-jre-slim: failed to resolve source metadata for docker.io/library/openjdk:17-jre-slim: docker.io/library/openjdk:17-jre-slim: not found
```

**原因**: `openjdk:17-jre-slim` イメージがDocker Hubから削除され、利用できなくなりました。OpenJDKの公式イメージは非推奨となり、Eclipse Temurinに移行されました。

## 🔧 修正内容

以下の3つのDockerfileを修正しました：

1. **`auth-service/Dockerfile`**
2. **`production-planning-service/Dockerfile`**
3. **`api-gateway/Dockerfile`**

### 変更内容

**変更前**:
```dockerfile
FROM openjdk:17-jre-slim
```

**変更後**:
```dockerfile
FROM eclipse-temurin:17-jre
```

## 📋 Eclipse Temurinについて

- **Eclipse Temurin** は、OpenJDKの公式代替イメージです
- Adoptiumプロジェクトによってメンテナンスされています
- OpenJDKと完全に互換性があります
- セキュリティアップデートが定期的に提供されます

## ✅ 次のステップ

1. **変更をコミット・プッシュ**
   ```powershell
   git add auth-service/Dockerfile production-planning-service/Dockerfile api-gateway/Dockerfile
   git commit -m "fix: Replace deprecated openjdk image with eclipse-temurin"
   git push origin main
   ```

2. **Dockerビルドを再実行**
   - Vercel/Cloud Runなどのデプロイプラットフォームで再デプロイ
   - または、ローカルでビルドをテスト：
     ```powershell
     docker build -t auth-service:latest -f auth-service/Dockerfile .
     ```

3. **動作確認**
   - ビルドが成功することを確認
   - アプリケーションが正常に起動することを確認

## 🔍 検証

修正後、以下のコマンドでビルドをテストできます：

```powershell
# auth-serviceのビルドテスト
docker build -t auth-service:test -f auth-service/Dockerfile .

# production-planning-serviceのビルドテスト
docker build -t planning-service:test -f production-planning-service/Dockerfile .

# api-gatewayのビルドテスト
docker build -t api-gateway:test -f api-gateway/Dockerfile .
```

## 📚 参考情報

- [Eclipse Temurin Docker Hub](https://hub.docker.com/_/eclipse-temurin)
- [OpenJDKからEclipse Temurinへの移行ガイド](https://adoptium.net/)

## ⚠️ 注意事項

- `eclipse-temurin:17-jre` は `openjdk:17-jre-slim` と互換性があります
- イメージサイズは若干大きくなる可能性がありますが、機能は同じです
- セキュリティアップデートが定期的に提供されます
