# 🛑 デプロイの中断方法

## ⚠️ 現在実行中のデプロイを中断する

### 方法1: GitHub Actionsでワークフローをキャンセル

1. **GitHub Actionsにアクセス**
   ```
   https://github.com/kensudogit/production_control_system/actions
   ```

2. **実行中のワークフローを選択**
   - 実行中のワークフロー（黄色のアイコン）をクリック

3. **ワークフローをキャンセル**
   - 右上の「Cancel workflow」ボタンをクリック
   - 確認ダイアログで「Cancel workflow」をクリック

### 方法2: Vercel Dashboardでデプロイをキャンセル

1. **Vercel Dashboardにアクセス**
   ```
   https://vercel.com/dashboard
   ```

2. **プロジェクトを選択**
   - `production-control-system` をクリック

3. **実行中のデプロイを確認**
   - 「Deployments」タブで実行中のデプロイを確認

4. **デプロイをキャンセル**
   - 実行中のデプロイの「...」メニューをクリック
   - 「Cancel」を選択（表示されない場合は、デプロイが完了している可能性があります）

## 🔧 デプロイ環境の変更

デプロイを中断した後、環境を変更して再デプロイしてください。

詳細は `CHANGE_DEPLOYMENT_ENV.md` を参照してください。

## 📋 次のステップ

1. ✅ 現在のデプロイを中断（上記の方法を使用）
2. ✅ デプロイ環境を変更（`CHANGE_DEPLOYMENT_ENV.md`を参照）
3. ✅ 変更をコミット・プッシュ
4. ✅ 新しい環境で再デプロイ
