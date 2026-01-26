/**
 * 環境変数ユーティリティ
 * Vercel環境変数の取得を一元管理
 */

/**
 * OpenAI APIキーを取得
 * @returns OpenAI APIキー（設定されていない場合は空文字列）
 */
export const getOpenAIApiKey = (): string => {
  return import.meta.env.VITE_OPENAI_API_KEY || ''
}

/**
 * OpenAI APIキーが設定されているか確認
 * @returns APIキーが設定されている場合はtrue
 */
export const isOpenAIApiKeySet = (): boolean => {
  const apiKey = getOpenAIApiKey()
  return apiKey.length > 0 && apiKey !== 'your-openai-api-key-here'
}

/**
 * 環境変数のデバッグ情報を取得（開発環境のみ）
 * @returns 環境変数の状態情報
 */
export const getEnvDebugInfo = (): {
  apiKeySet: boolean
  apiKeyLength: number
  apiKeyPrefix: string
  mode: string
  isProduction: boolean
  isDevelopment: boolean
} => {
  const apiKey = getOpenAIApiKey()
  return {
    apiKeySet: isOpenAIApiKeySet(),
    apiKeyLength: apiKey.length,
    apiKeyPrefix: apiKey.length > 0 ? `${apiKey.substring(0, 7)}...` : '未設定',
    mode: import.meta.env.MODE || 'unknown',
    isProduction: isProduction(),
    isDevelopment: isDevelopment()
  }
}

/**
 * APIベースURLを取得
 * @returns APIベースURL
 */
export const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api'
}

/**
 * 環境が本番環境かどうかを確認
 * @returns 本番環境の場合はtrue
 */
export const isProduction = (): boolean => {
  return import.meta.env.MODE === 'production' || import.meta.env.PROD === true
}

/**
 * 環境が開発環境かどうかを確認
 * @returns 開発環境の場合はtrue
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.MODE === 'development' || import.meta.env.DEV === true
}
