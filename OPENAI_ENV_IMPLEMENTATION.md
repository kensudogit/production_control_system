# OpenAI APIキー環境変数実装

## ✅ 実装完了

`VITE_OPENAI_API_KEY`環境変数からOpenAI APIキーを取得するように実装しました。

## 📝 変更内容

### 1. `frontend/src/services/openai.ts`
- `getOpenAIApiKey()`関数を追加（環境変数からAPIキーを取得）
- `getAdvancedOpenAIService()`関数を改善：
  - APIキーが引数で渡されない場合、自動的に環境変数から取得
  - シングルトンインスタンスの管理を改善

### 2. `frontend/src/pages/DemandForecasting.tsx`
- `handleAIExecute()`関数を改善：
  - `getAdvancedOpenAIService()`を引数なしで呼び出し
  - 環境変数が設定されていない場合のエラーハンドリングを追加

### 3. `frontend/src/utils/env.ts`（新規作成）
- 環境変数ユーティリティ関数を追加：
  - `getOpenAIApiKey()`: OpenAI APIキーを取得
  - `isOpenAIApiKeySet()`: APIキーが設定されているか確認
  - `getApiBaseUrl()`: APIベースURLを取得
  - `isProduction()`: 本番環境かどうかを確認
  - `isDevelopment()`: 開発環境かどうかを確認

## 🚀 使用方法

### コードでの使用

```typescript
import { getAdvancedOpenAIService } from '../services/openai'

// 環境変数から自動的にAPIキーを取得
const openAIService = getAdvancedOpenAIService()

// または、明示的にAPIキーを渡すことも可能
const openAIService = getAdvancedOpenAIService(apiKey)
```

### 環境変数の設定

#### Vercel Dashboard
1. Settings → Environment Variables
2. Key: `VITE_OPENAI_API_KEY`
3. Value: `sk-proj-...`（あなたのAPIキー）
4. Environment: Production にチェック
5. Save

#### ローカル開発環境
`frontend/.env.local`ファイルを作成：

```env
VITE_OPENAI_API_KEY=sk-proj-...
```

## ✅ 動作確認

1. **環境変数が設定されている場合**
   - `getAdvancedOpenAIService()`が正常に動作
   - AI予測機能が正常に実行される

2. **環境変数が設定されていない場合**
   - エラーメッセージが表示される
   - ユーザーに環境変数の設定を促すメッセージが表示される

## 🔒 セキュリティ

- ✅ APIキーは環境変数から取得（コードにハードコードされていない）
- ✅ `.env`ファイルは`.gitignore`に含まれている
- ✅ Vercelの環境変数は暗号化されて保存される

## 📋 次のステップ

1. **Vercel Dashboardで環境変数を設定**
   - `VITE_OPENAI_API_KEY`を設定

2. **再デプロイ**
   - 環境変数を設定した後、再デプロイが必要

3. **動作確認**
   - デプロイ後、AI予測機能をテスト

## 🐛 トラブルシューティング

### エラー: "OpenAI APIキーが設定されていません"

**原因**: 環境変数`VITE_OPENAI_API_KEY`が設定されていない

**解決方法**:
1. Vercel Dashboardで環境変数を確認
2. 環境変数が正しく設定されているか確認
3. 再デプロイを実行

### エラー: "OpenAI API error: 401"

**原因**: APIキーが無効または期限切れ

**解決方法**:
1. OpenAI DashboardでAPIキーを確認
2. 新しいAPIキーを生成
3. Vercel Dashboardで環境変数を更新
4. 再デプロイ
