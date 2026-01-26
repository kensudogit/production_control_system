# OpenAI APIキー読み取りエラーの修正

## ✅ 修正完了

OpenAI APIキーが読み取れない問題を修正しました。

## 🔧 修正内容

### 1. APIキーの検証を強化

**ファイル**: `frontend/src/services/openai.ts`

- `generateAdvancedForecast`関数の最初でAPIキーを検証
- APIキーが空、またはプレースホルダーの場合にエラーをスロー
- より詳細なエラーメッセージを提供

### 2. エラーハンドリングの改善

**ファイル**: `frontend/src/services/openai.ts`

- OpenAI APIのエラーレスポンスを詳細に処理
- 401エラー（認証エラー）の場合に明確なメッセージを表示
- 429エラー（レート制限）の場合に適切なメッセージを表示
- ネットワークエラーの場合に適切なメッセージを表示

### 3. ユーザー向けエラーメッセージの改善

**ファイル**: `frontend/src/pages/DemandForecasting.tsx`

- APIキー関連のエラーの場合に、Vercel Dashboardでの設定手順を表示
- より詳細なエラーメッセージを表示
- コンソールにデバッグ情報を出力

### 4. 環境変数のデバッグ機能追加

**ファイル**: `frontend/src/utils/env.ts`

- `getEnvDebugInfo()`関数を追加
- 環境変数の状態を確認できる機能を追加

**ファイル**: `frontend/src/pages/DemandForecasting.tsx`

- コンポーネントマウント時に環境変数の状態を確認
- 開発環境でコンソールにデバッグ情報を出力

## 🚀 次のステップ

### 1. Vercelで環境変数を設定

1. **Vercel Dashboardにアクセス**
   - https://vercel.com/dashboard
   - プロジェクト `production-control-system` を選択

2. **環境変数を設定**
   - Settings → Environment Variables
   - Add New
   - Key: `VITE_OPENAI_API_KEY`
   - Value: あなたのOpenAI APIキー
   - Environment: **Production** にチェック（Preview、Developmentも推奨）
   - Save

3. **再デプロイ（重要！）**
   - Deployments → 最新のデプロイの「...」メニュー → 「Redeploy」
   - または CLI: `vercel --prod --yes`

   ⚠️ **重要**: Viteでは環境変数はビルド時に静的に置き換えられます。
   環境変数を設定した後は、**必ず再デプロイが必要**です。

### 2. 動作確認

1. **デプロイが完了したら、アプリケーションにアクセス**
2. **ブラウザのコンソール（F12）を開く**
3. **需要予測画面を開く**
4. **コンソールに以下のメッセージが表示されることを確認**:
   ```
   🔍 環境変数の状態: {
     apiKeySet: true,
     apiKeyLength: 51,
     apiKeyPrefix: "sk-proj...",
     mode: "production",
     isProduction: true,
     isDevelopment: false
   }
   ```

5. **AI予測機能をテスト**
   - 「AI予測実行」ボタンをクリック
   - エラーが表示されないことを確認

## 🔍 トラブルシューティング

### 問題: 環境変数を設定したのに「APIキーが設定されていません」と表示される

**原因**: 再デプロイが実行されていない

**解決方法**:
1. Vercel Dashboardで環境変数が正しく設定されているか確認
2. **再デプロイを実行**:
   - Vercel Dashboard → Deployments → 最新のデプロイの「...」メニュー → 「Redeploy」

### 問題: 「OpenAI APIキーが無効です」と表示される

**原因**: APIキーが間違っている、または無効化されている

**解決方法**:
1. OpenAI Platform (https://platform.openai.com/api-keys) でAPIキーが有効か確認
2. APIキーをコピーして、Vercel Dashboardで再設定
3. 再デプロイを実行

### 問題: 開発環境では動作するが、本番環境で動作しない

**原因**: 環境変数が本番環境（Production）に設定されていない

**解決方法**:
1. Vercel Dashboard → Settings → Environment Variables
2. `VITE_OPENAI_API_KEY` の「Environment」で「Production」にチェックが入っているか確認
3. チェックが入っていない場合は追加して保存
4. 再デプロイを実行

## 📚 関連ドキュメント

- `VERCEL_ENV_SETUP.md` - Vercel環境変数の設定方法（詳細）
- `OPENAI_ENV_IMPLEMENTATION.md` - OpenAI APIキーの実装詳細

## 🔒 セキュリティ注意事項

⚠️ **重要**: APIキーは絶対にコードに含めないでください。

- `.env`ファイルは`.gitignore`に含まれていることを確認
- GitHubにコミットする前に、コード内にAPIキーが含まれていないか確認
- 公開されたAPIキーは無効化して、新しいキーを生成してください
