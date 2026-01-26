# 🔧 デプロイ環境の変更手順

## 📋 現在のデプロイ設定

### Vercel設定 (`vercel.json`)
- **リージョン**: `hnd1` (東京)
- **環境**: `production`
- **ビルドコマンド**: `cd frontend && npm install && npm run vercel-build`

### GitHub Actions設定
- **デプロイ環境**: `production` または `preview`
- **トリガー**: `main`ブランチへのプッシュ、または手動実行

## 🔄 デプロイ環境の変更方法

### 方法1: Vercelリージョンの変更

現在は東京リージョン（`hnd1`）が設定されています。他のリージョンに変更する場合：

**ファイル**: `vercel.json`

```json
{
  "regions": ["hnd1"]  // 現在: 東京
}
```

**利用可能なリージョン**:
- `hnd1` - 東京（日本）
- `sfo1` - サンフランシスコ（米国）
- `iad1` - ワシントンD.C.（米国）
- `cle1` - クリーブランド（米国）
- `pdx1` - ポートランド（米国）
- `iad1` - バージニア（米国）
- `fra1` - フランクフルト（ドイツ）
- `cdg1` - パリ（フランス）
- `lhr1` - ロンドン（英国）
- `syd1` - シドニー（オーストラリア）
- `sin1` - シンガポール
- `icn1` - ソウル（韓国）

**複数リージョンの指定**:
```json
{
  "regions": ["hnd1", "sfo1"]  // 東京とサンフランシスコ
}
```

### 方法2: デプロイ環境の変更（Production → Preview）

GitHub Actionsのワークフローディスパッチで環境を選択できます：

1. https://github.com/kensudogit/production_control_system/actions/workflows/vercel-production-deploy.yml にアクセス
2. 「Run workflow」をクリック
3. **Environment**: `preview` を選択
4. 「Run workflow」をクリック

### 方法3: Vercel Dashboardから環境を変更

1. https://vercel.com/dashboard にアクセス
2. プロジェクト `production-control-system` を選択
3. **Settings** → **General**
4. **Region** セクションでリージョンを変更
5. **Save** をクリック

### 方法4: ビルドコマンドの変更

**ファイル**: `vercel.json`

```json
{
  "buildCommand": "cd frontend && npm install && npm run vercel-build"
}
```

**変更例**:
```json
{
  "buildCommand": "cd frontend && npm ci && npm run build"
}
```

## 🛠️ デプロイエラーの対処

### エラーの種類と対処法

#### 1. ビルドエラー

**原因**: ビルドコマンドの実行に失敗

**対処法**:
1. ローカルでビルドをテスト：
   ```powershell
   cd frontend
   npm install
   npm run build
   ```
2. エラーメッセージを確認して修正
3. `vercel.json`の`buildCommand`を確認

#### 2. 環境変数のエラー

**原因**: 必要な環境変数が設定されていない

**対処法**:
1. Vercel Dashboard → Settings → Environment Variables
2. 必要な環境変数を追加
3. 再デプロイ

#### 3. リージョンのエラー

**原因**: 指定したリージョンが利用できない

**対処法**:
1. `vercel.json`の`regions`を確認
2. 利用可能なリージョンに変更
3. 再デプロイ

#### 4. タイムアウトエラー

**原因**: ビルド時間が長すぎる

**対処法**:
1. `vercel.json`の`functions`セクションで`maxDuration`を増やす：
   ```json
   {
     "functions": {
       "api/**/*.js": {
         "maxDuration": 30  // 10秒から30秒に増やす
       }
     }
   }
   ```

## 📝 デプロイ環境変更のチェックリスト

変更を適用する前に：

- [ ] ローカルでビルドが成功することを確認
- [ ] 環境変数が正しく設定されていることを確認
- [ ] `vercel.json`の設定を確認
- [ ] GitHub Actionsワークフローの設定を確認
- [ ] 変更をコミット・プッシュ
- [ ] デプロイを実行
- [ ] デプロイ後の動作確認

## 🚀 変更後のデプロイ手順

1. **設定ファイルを変更**
   - `vercel.json`を編集
   - 必要に応じてGitHub Actionsワークフローを編集

2. **変更をコミット・プッシュ**
   ```powershell
   git add .
   git commit -m "デプロイ環境を変更"
   git push origin main
   ```

3. **デプロイを実行**
   - GitHub Actionsのワークフローディスパッチを実行
   - または、Vercel Dashboardから再デプロイ

4. **動作確認**
   - デプロイURLにアクセス
   - アプリケーションが正常に動作することを確認

## 📚 関連ドキュメント

- `vercel.json` - Vercel設定ファイル
- `.github/workflows/vercel-production-deploy.yml` - GitHub Actionsワークフロー
- `DEPLOY_STEPS.md` - デプロイ手順
- `VERCEL_ENV_SETUP.md` - 環境変数の設定方法

## ⚠️ 注意事項

- リージョンを変更すると、デプロイ先のサーバーの場所が変わるため、レイテンシーに影響があります
- 環境変数は環境ごと（Production/Preview/Development）に設定する必要があります
- 変更後は必ず動作確認を行ってください
