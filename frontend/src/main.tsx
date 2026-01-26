import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { suppressExtensionErrors, handleFaviconError } from './utils/errorHandler'

// ブラウザ拡張機能のエラーを抑制
suppressExtensionErrors()

// Faviconエラーを処理
handleFaviconError()

// Service Workerの登録（オプション、エラーハンドリング付き）
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration.scope)
        
        // 更新チェック
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New service worker available')
              }
            })
          }
        })
      })
      .catch((error) => {
        // Service Worker登録エラーは無視（オフライン機能が必須でない場合）
        console.debug('Service Worker registration failed:', error.message)
      })
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
