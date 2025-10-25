import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { rest } from 'msw'
import { server } from '../test/mocks/server'
import { dashboardApi } from '../services/api'

describe('Dashboard API', () => {
  beforeEach(() => {
    // テスト前にサーバーをリセット
    server.resetHandlers()
  })

  afterEach(() => {
    // テスト後にクリーンアップ
    vi.clearAllMocks()
  })

  it('fetches dashboard stats successfully', async () => {
    const stats = await dashboardApi.getStats()
    
    expect(stats).toEqual({
      productionPlans: 24,
      productionPlansChange: 12,
      inventoryLevel: 1234,
      inventoryChange: -5,
      qualityRate: 98.5,
      qualityChange: 2.1,
      costEfficiency: 45230,
      costChange: 8
    })
  })

  it('fetches chart data successfully', async () => {
    const chartData = await dashboardApi.getChartData()
    
    expect(chartData).toHaveProperty('production')
    expect(chartData).toHaveProperty('quality')
    expect(chartData.production).toHaveLength(6)
    expect(chartData.quality).toHaveLength(3)
  })

  it('fetches recent activities successfully', async () => {
    const activities = await dashboardApi.getRecentActivities()
    
    expect(Array.isArray(activities)).toBe(true)
    expect(activities).toHaveLength(2)
    expect(activities[0]).toHaveProperty('id')
    expect(activities[0]).toHaveProperty('title')
    expect(activities[0]).toHaveProperty('description')
  })

  it('handles API errors gracefully', async () => {
    // エラーレスポンスをモック
    server.use(
      rest.get('/api/dashboard/stats', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Internal Server Error' }))
      })
    )

    await expect(dashboardApi.getStats()).rejects.toThrow()
  })

  it('handles network timeout', async () => {
    // タイムアウトをシミュレート
    server.use(
      rest.get('/api/dashboard/stats', (req, res, ctx) => {
        return res(ctx.delay(10000), ctx.json({}))
      })
    )

    // タイムアウトエラーをテスト
    await expect(dashboardApi.getStats()).rejects.toThrow()
  })

  it('caches API responses correctly', async () => {
    // 最初のリクエスト
    const stats1 = await dashboardApi.getStats()
    
    // 2回目のリクエスト（キャッシュから取得される可能性）
    const stats2 = await dashboardApi.getStats()
    
    expect(stats1).toEqual(stats2)
  })

  it('handles empty responses', async () => {
    server.use(
      rest.get('/api/dashboard/stats', (req, res, ctx) => {
        return res(ctx.json({}))
      })
    )

    const stats = await dashboardApi.getStats()
    expect(stats).toEqual({})
  })

  it('validates response data structure', async () => {
    const stats = await dashboardApi.getStats()
    
    // 必要なプロパティが存在することを確認
    expect(stats).toHaveProperty('productionPlans')
    expect(stats).toHaveProperty('inventoryLevel')
    expect(stats).toHaveProperty('qualityRate')
    expect(stats).toHaveProperty('costEfficiency')
    
    // データ型の確認
    expect(typeof stats.productionPlans).toBe('number')
    expect(typeof stats.inventoryLevel).toBe('number')
    expect(typeof stats.qualityRate).toBe('number')
    expect(typeof stats.costEfficiency).toBe('number')
  })
})

describe('Production Planning API', () => {
  it('fetches production plans with pagination', async () => {
    const response = await dashboardApi.getProductionPlans(0, 20, 'all')
    
    expect(response).toHaveProperty('data')
    expect(response).toHaveProperty('hasMore')
    expect(response).toHaveProperty('total')
    expect(response).toHaveProperty('page')
    expect(response).toHaveProperty('limit')
    
    expect(Array.isArray(response.data)).toBe(true)
    expect(response.page).toBe(0)
    expect(response.limit).toBe(20)
  })

  it('filters production plans by status', async () => {
    const response = await dashboardApi.getProductionPlans(0, 20, 'in_progress')
    
    expect(response.data.every((plan: any) => plan.status === 'in_progress')).toBe(true)
  })

  it('handles pagination correctly', async () => {
    const page1 = await dashboardApi.getProductionPlans(0, 1, 'all')
    const page2 = await dashboardApi.getProductionPlans(1, 1, 'all')
    
    expect(page1.page).toBe(0)
    expect(page2.page).toBe(1)
    expect(page1.data).not.toEqual(page2.data)
  })
})

describe('API Performance Tests', () => {
  it('API response time is within acceptable limits', async () => {
    const start = performance.now()
    await dashboardApi.getStats()
    const end = performance.now()
    
    const responseTime = end - start
    expect(responseTime).toBeLessThan(1000) // 1秒以内
  })

  it('handles concurrent requests efficiently', async () => {
    const promises = [
      dashboardApi.getStats(),
      dashboardApi.getChartData(),
      dashboardApi.getRecentActivities()
    ]
    
    const start = performance.now()
    const results = await Promise.all(promises)
    const end = performance.now()
    
    expect(results).toHaveLength(3)
    expect(end - start).toBeLessThan(2000) // 2秒以内
  })

  it('memory usage remains stable during multiple requests', async () => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0
    
    // 複数回のリクエストを実行
    for (let i = 0; i < 10; i++) {
      await dashboardApi.getStats()
    }
    
    const finalMemory = performance.memory?.usedJSHeapSize || 0
    const memoryIncrease = finalMemory - initialMemory
    
    // メモリ増加が10MB以内であることを確認
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
  })
})
