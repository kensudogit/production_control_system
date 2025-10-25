import { setupServer } from 'msw/node'
import { rest } from 'msw'

// モックデータ
const mockDashboardStats = {
  productionPlans: 24,
  productionPlansChange: 12,
  inventoryLevel: 1234,
  inventoryChange: -5,
  qualityRate: 98.5,
  qualityChange: 2.1,
  costEfficiency: 45230,
  costChange: 8
}

const mockChartData = {
  production: [
    { name: '1月', value: 400 },
    { name: '2月', value: 300 },
    { name: '3月', value: 500 },
    { name: '4月', value: 450 },
    { name: '5月', value: 600 },
    { name: '6月', value: 550 }
  ],
  quality: [
    { name: '合格', value: 85, color: '#22c55e' },
    { name: '不合格', value: 10, color: '#ef4444' },
    { name: '再検査', value: 5, color: '#f59e0b' }
  ]
}

const mockActivities = [
  {
    id: 1,
    type: 'success',
    title: '生産計画 #P-2024-001 完了',
    description: 'スマートフォン生産計画が予定通り完了しました',
    time: '2分前'
  },
  {
    id: 2,
    type: 'warning',
    title: '在庫アラート',
    description: '液晶ディスプレイの在庫が最低レベルを下回りました',
    time: '15分前'
  }
]

const mockProductionPlans = [
  {
    id: 'P-2024-001',
    name: 'スマートフォン生産計画',
    product: '高品質スマートフォン',
    quantity: 1000,
    startDate: '2024-01-15',
    endDate: '2024-01-29',
    status: 'in_progress',
    progress: 65,
    priority: 'high'
  },
  {
    id: 'P-2024-002',
    name: 'ノートPC生産計画',
    product: '高性能ノートPC',
    quantity: 500,
    startDate: '2024-01-20',
    endDate: '2024-02-10',
    status: 'planned',
    progress: 0,
    priority: 'medium'
  }
]

// APIハンドラー
export const handlers = [
  // ダッシュボード統計
  rest.get('/api/dashboard/stats', (req, res, ctx) => {
    return res(
      ctx.delay(100), // リアルな遅延をシミュレート
      ctx.json(mockDashboardStats)
    )
  }),

  // チャートデータ
  rest.get('/api/dashboard/charts', (req, res, ctx) => {
    return res(
      ctx.delay(150),
      ctx.json(mockChartData)
    )
  }),

  // 最近のアクティビティ
  rest.get('/api/dashboard/activities', (req, res, ctx) => {
    return res(
      ctx.delay(200),
      ctx.json(mockActivities)
    )
  }),

  // 生産計画
  rest.get('/api/production-plans', (req, res, ctx) => {
    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '0')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const status = url.searchParams.get('status') || 'all'

    let filteredPlans = mockProductionPlans
    if (status !== 'all') {
      filteredPlans = mockProductionPlans.filter(plan => plan.status === status)
    }

    const startIndex = page * limit
    const endIndex = startIndex + limit
    const paginatedPlans = filteredPlans.slice(startIndex, endIndex)

    return res(
      ctx.delay(300),
      ctx.json({
        data: paginatedPlans,
        hasMore: endIndex < filteredPlans.length,
        total: filteredPlans.length,
        page,
        limit
      })
    )
  }),

  // 在庫データ
  rest.get('/api/inventory/:itemType', (req, res, ctx) => {
    const { itemType } = req.params
    return res(
      ctx.delay(250),
      ctx.json({
        itemType,
        currentQuantity: 150,
        reservedQuantity: 25,
        availableQuantity: 125,
        minStockLevel: 50,
        maxStockLevel: 500
      })
    )
  }),

  // 品質データ
  rest.get('/api/quality/:planId', (req, res, ctx) => {
    const { planId } = req.params
    return res(
      ctx.delay(200),
      ctx.json({
        planId,
        inspectionDate: '2024-01-20',
        inspector: '田中太郎',
        sampleSize: 100,
        passedQuantity: 95,
        failedQuantity: 5,
        inspectionResult: 'PASS'
      })
    )
  }),

  // 原価分析
  rest.get('/api/cost-analysis/:period', (req, res, ctx) => {
    const { period } = req.params
    return res(
      ctx.delay(400),
      ctx.json({
        period,
        totalCost: 1250000,
        materialCost: 750000,
        laborCost: 350000,
        overheadCost: 150000,
        variance: -50000
      })
    )
  }),

  // 需要予測
  rest.get('/api/forecast', (req, res, ctx) => {
    const url = new URL(req.url)
    const productId = url.searchParams.get('productId')
    const period = url.searchParams.get('period')
    
    return res(
      ctx.delay(500),
      ctx.json({
        productId,
        period,
        forecastedQuantity: 1200,
        confidenceLevel: 0.85,
        forecastMethod: 'ARIMA',
        actualQuantity: null
      })
    )
  }),

  // エラーテスト用
  rest.get('/api/error-test', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ error: 'Internal Server Error' })
    )
  }),

  // タイムアウトテスト用
  rest.get('/api/timeout-test', (req, res, ctx) => {
    return res(
      ctx.delay(10000), // 10秒の遅延
      ctx.json({ message: 'This should timeout' })
    )
  })
]

// MSWサーバーのセットアップ
export const server = setupServer(...handlers)
