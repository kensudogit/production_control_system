# Dockerネットワークエラー修正

## エラー内容

```
failed to create network production_control_system_production-network: Error response from daemon: invalid pool request: Pool overlaps with other one on this address space
```

## 原因

`docker-compose.yml`で指定されたサブネット `172.20.0.0/16` が既存のDockerネットワークと重複しているため、新しいネットワークを作成できません。

## 対応方法

### 方法1: IPAM設定を削除（推奨）

IPAM設定を削除して、Docker Composeに自動的に利用可能なサブネットを選択させます。これが最も簡単で確実な方法です。

**変更内容:**
- `docker-compose.yml`の`networks`セクションから`ipam`設定を削除

### 方法2: サブネットを変更

別のサブネットを使用する場合は、以下のいずれかを指定できます：

- `172.21.0.0/16`
- `172.22.0.0/16`
- `172.25.0.0/16`
- その他の未使用のサブネット

**変更例:**
```yaml
networks:
  production-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.25.0.0/16
```

### 方法3: 既存のネットワークを削除

既存の競合しているネットワークを削除する場合：

```bash
# 使用されていないネットワークを削除
docker network prune -f

# 特定のネットワークを削除（使用されていない場合）
docker network rm production_control_system_production-network
```

## 実行手順

1. `docker-compose.yml`を修正（方法1を推奨）
2. 既存のコンテナとネットワークを停止・削除：
   ```bash
   docker-compose down
   ```
3. 再度起動：
   ```bash
   docker-compose up -d --build
   ```

## 注意事項

- ネットワーク設定を変更した場合、既存のコンテナは再作成する必要があります
- データベースなどの永続化されたデータは`volumes`に保存されているため、影響を受けません
- 本番環境で使用する場合は、IPアドレス範囲を明確に管理することを推奨します
