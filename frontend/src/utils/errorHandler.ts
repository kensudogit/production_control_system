/**
 * エラーハンドリングユーティリティ
 * ブラウザ拡張機能との競合やメッセージポートエラーを処理
 */

/**
 * ブラウザ拡張機能のメッセージポートエラーを抑制
 * content.jsやbackground.jsとの競合を防ぐ
 */
export function suppressExtensionErrors() {
  // グローバルエラーハンドラーで拡張機能エラーを抑制
  const originalErrorHandler = window.onerror
  const originalUnhandledRejection = window.onunhandledrejection

  window.onerror = (message, source, lineno, colno, error) => {
    // ブラウザ拡張機能関連のエラーを無視
    if (
      typeof message === 'string' &&
      (message.includes('message port closed') ||
        message.includes('message channel closed') ||
        message.includes('content.js') ||
        message.includes('Extension context invalidated'))
    ) {
      console.debug('Suppressed extension error:', message)
      return true // エラーを抑制
    }

    // その他のエラーは通常通り処理
    if (originalErrorHandler) {
      return originalErrorHandler(message, source, lineno, colno, error)
    }
    return false
  }

  window.onunhandledrejection = (event) => {
    const reason = event.reason

    // Promise rejectionで拡張機能エラーを抑制
    if (
      reason &&
      typeof reason === 'object' &&
      'message' in reason &&
      typeof reason.message === 'string' &&
      (reason.message.includes('message port closed') ||
        reason.message.includes('message channel closed') ||
        reason.message.includes('Extension context invalidated'))
    ) {
      console.debug('Suppressed extension promise rejection:', reason.message)
      event.preventDefault() // エラーを抑制
      return
    }

    // その他のrejectionは通常通り処理
    if (originalUnhandledRejection) {
      originalUnhandledRejection(event)
    }
  }

  // クリーンアップ関数を返す
  return () => {
    window.onerror = originalErrorHandler
    window.onunhandledrejection = originalUnhandledRejection
  }
}

/**
 * Chrome拡張機能のメッセージAPIが利用可能かチェック
 */
export function isExtensionContextValid(): boolean {
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      // 拡張機能コンテキストが有効かチェック
      return !!chrome.runtime.id
    }
  } catch (e) {
    // 拡張機能コンテキストが無効
    return false
  }
  return false
}

/**
 * 安全にメッセージを送信（拡張機能API使用時）
 */
export async function safeSendMessage(
  message: any,
  callback?: (response: any) => void
): Promise<any> {
  if (!isExtensionContextValid()) {
    console.debug('Extension context not available, skipping message')
    return Promise.resolve(null)
  }

  try {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      return new Promise((resolve, reject) => {
        try {
          chrome.runtime.sendMessage(message, (response) => {
            if (chrome.runtime.lastError) {
              // 拡張機能エラーは無視
              console.debug('Extension message error:', chrome.runtime.lastError.message)
              resolve(null)
              return
            }
            if (callback) callback(response)
            resolve(response)
          })
        } catch (e) {
          console.debug('Extension message failed:', e)
          resolve(null)
        }
      })
    }
  } catch (e) {
    console.debug('Extension API not available:', e)
    return Promise.resolve(null)
  }
}

/**
 * Favicon読み込みエラーを処理
 */
export function handleFaviconError() {
  const faviconLinks = document.querySelectorAll('link[rel*="icon"]')
  
  faviconLinks.forEach((link) => {
    const linkElement = link as HTMLLinkElement
    linkElement.onerror = () => {
      // エラー時はSVGフォールバックを使用
      if (!linkElement.href.includes('favicon.svg')) {
        const svgLink = document.querySelector('link[rel="icon"][href*="favicon.svg"]')
        if (svgLink) {
          linkElement.href = (svgLink as HTMLLinkElement).href
        } else {
          // SVGもない場合はdata URIを使用
          linkElement.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="%233b82f6"/></svg>'
        }
      }
    }
  })
}
