// Service Worker for Production Control System
const CACHE_NAME = 'production-control-v1'
const STATIC_CACHE = 'static-v1'
const DYNAMIC_CACHE = 'dynamic-v1'

// キャッシュするリソース
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  // 重要なアイコンとアセット
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// API エンドポイントのキャッシュ戦略
const API_CACHE_STRATEGIES = {
  // 短時間キャッシュ（30秒）
  'short': ['/api/dashboard/stats', '/api/dashboard/activities'],
  // 中時間キャッシュ（5分）
  'medium': ['/api/production-plans', '/api/inventory', '/api/quality'],
  // 長時間キャッシュ（1時間）
  'long': ['/api/products', '/api/materials', '/api/suppliers']
}

// インストール時の処理
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    Promise.all([
      // 静的アセットのキャッシュ
      caches.open(STATIC_CACHE).then(cache => {
        return cache.addAll(STATIC_ASSETS)
      }),
      // 動的キャッシュの初期化
      caches.open(DYNAMIC_CACHE)
    ]).then(() => {
      // 即座にアクティベート
      return self.skipWaiting()
    })
  )
})

// アクティベート時の処理
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    Promise.all([
      // 古いキャッシュの削除
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName)
            }
          })
        )
      }),
      // すべてのクライアントを制御下に
      self.clients.claim()
    ])
  )
})

// フェッチイベントの処理
self.addEventListener('fetch', (event) => {
  const { request } = event
  
  try {
    const url = new URL(request.url)

    // API リクエストの処理
    if (url.pathname.startsWith('/api/')) {
      event.respondWith(handleApiRequest(request).catch((error) => {
        console.debug('API request failed:', error)
        // エラー時は空レスポンスを返す
        return new Response(
          JSON.stringify({ error: 'Service unavailable' }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }))
      return
    }

    // 静的アセットの処理
    if (request.method === 'GET') {
      event.respondWith(handleStaticRequest(request).catch((error) => {
        console.debug('Static request failed:', error)
        // エラー時は204を返す
        return new Response('', {
          status: 204,
          statusText: 'No Content'
        })
      }))
      return
    }
  } catch (error) {
    // URL解析エラーなど、予期しないエラーを処理
    console.debug('Fetch event error:', error)
    event.respondWith(new Response('', {
      status: 204,
      statusText: 'No Content'
    }))
  }
})

// API リクエストのキャッシュ戦略
async function handleApiRequest(request) {
  const url = new URL(request.url)
  const pathname = url.pathname

  // キャッシュ戦略の決定
  let cacheStrategy = 'medium' // デフォルト
  for (const [strategy, endpoints] of Object.entries(API_CACHE_STRATEGIES)) {
    if (endpoints.some(endpoint => pathname.startsWith(endpoint))) {
      cacheStrategy = strategy
      break
    }
  }

  try {
    // ネットワークファースト戦略
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // レスポンスをキャッシュに保存
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
      
      return networkResponse
    }
    
    throw new Error('Network response not ok')
  } catch (error) {
    // ネットワークエラーの場合、キャッシュから取得
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // キャッシュにもない場合はエラーレスポンス
    return new Response(
      JSON.stringify({ error: 'Offline - No cached data available' }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// 静的アセットのキャッシュ戦略
async function handleStaticRequest(request) {
  const url = new URL(request.url)
  
  // Faviconのエラーを特別に処理
  if (url.pathname === '/favicon.ico' || url.pathname.includes('favicon')) {
    try {
      // キャッシュから取得を試みる
      const cachedResponse = await caches.match(request)
      if (cachedResponse) {
        return cachedResponse
      }
      
      // ネットワークから取得を試みる
      const networkResponse = await fetch(request)
      if (networkResponse.ok) {
        const cache = await caches.open(STATIC_CACHE)
        cache.put(request, networkResponse.clone())
        return networkResponse
      }
      
      // 502エラーなどの場合、SVGフォールバックを返す
      return new Response('', {
        status: 204,
        statusText: 'No Content'
      })
    } catch (error) {
      // エラー時は204を返してエラーを抑制
      return new Response('', {
        status: 204,
        statusText: 'No Content'
      })
    }
  }
  
  // その他の静的アセット
  // キャッシュファースト戦略
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // オフライン時のフォールバック
    if (request.destination === 'document') {
      return caches.match('/')
    }
    
    // その他のエラーは空レスポンスを返す（エラーを抑制）
    return new Response('', {
      status: 204,
      statusText: 'No Content'
    })
  }
}

// バックグラウンド同期
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  try {
    // オフライン中に蓄積されたデータを同期
    const pendingData = await getPendingData()
    
    for (const data of pendingData) {
      await syncData(data)
    }
    
    console.log('Background sync completed')
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// プッシュ通知の処理
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: '詳細を見る',
          icon: '/icons/checkmark.png'
        },
        {
          action: 'close',
          title: '閉じる',
          icon: '/icons/xmark.png'
        }
      ]
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// 通知クリックの処理
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    )
  }
})

// ユーティリティ関数
async function getPendingData() {
  // IndexedDB から未同期データを取得
  return []
}

async function syncData(data) {
  // データをサーバーに送信
  try {
    await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  } catch (error) {
    console.error('Sync failed:', error)
    throw error
  }
}

