import axios, { AxiosInstance, AxiosResponse } from 'axios'

// API クライアントの設定
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // リクエストインターセプター
  client.interceptors.request.use(
    (config) => {
      // リクエストログ
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
      return config
    },
    (error) => {
      console.error('❌ Request Error:', error)
      return Promise.reject(error)
    }
  )

  // レスポンスインターセプター
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // レスポンスログ
      console.log(`✅ API Response: ${response.status} ${response.config.url}`)
      return response
    },
    (error) => {
      console.error('❌ Response Error:', error.response?.status, error.message)
      return Promise.reject(error)
    }
  )

  return client
}

const apiClient = createApiClient()

// 型定義
export interface DashboardStats {
  productionPlans: number
  productionPlansChange: number
  inventoryLevel: number
  inventoryChange: number
  qualityRate: number
  qualityChange: number
  costEfficiency: number
  costChange: number
}

export interface ChartData {
  productionTrend: Array<{ month: string; value: number }>
  qualityMetrics: Array<{ category: string; value: number; color?: string }>
  costAnalysis: Array<{ category: string; value: number; color?: string }>
}

export interface Activity {
  id: string
  type: 'production' | 'quality' | 'inventory' | 'cost'
  message: string
  timestamp: string
  user: string
}

export interface ProductionPlan {
  id: string
  name: string
  product: string
  quantity: number
  startDate: string
  endDate: string
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
  progress: number
  priority: 'low' | 'medium' | 'high'
}

export interface PaginatedResponse<T> {
  data: T[]
  hasMore: boolean
  total: number
  page: number
  limit: number
}

// API サービスクラス
class ApiService {
  // ダッシュボード関連
  async getStats(): Promise<DashboardStats> {
    // モックデータを返す
    return {
      productionPlans: 12,
      productionPlansChange: 8.5,
      inventoryLevel: 85,
      inventoryChange: -2.3,
      qualityRate: 98.2,
      qualityChange: 1.1,
      costEfficiency: 92.5,
      costChange: 3.2
    }
  }

  async getChartData(): Promise<ChartData> {
    // モックデータを返す
    return {
      productionTrend: [
        { month: '1月', value: 120 },
        { month: '2月', value: 135 },
        { month: '3月', value: 142 },
        { month: '4月', value: 158 },
        { month: '5月', value: 165 },
        { month: '6月', value: 172 }
      ],
      qualityMetrics: [
        { category: '合格品', value: 95 },
        { category: '不良品', value: 3 },
        { category: '再検査', value: 2 }
      ],
      costAnalysis: [
        { category: '材料費', value: 45 },
        { category: '人件費', value: 30 },
        { category: '設備費', value: 15 },
        { category: 'その他', value: 10 }
      ]
    }
  }

  async getRecentActivities(): Promise<Activity[]> {
    // モックデータを返す
    return [
      {
        id: '1',
        type: 'production',
        message: '生産計画「P-2024-001」が完了しました',
        timestamp: '2024-01-15T10:30:00Z',
        user: '田中太郎'
      },
      {
        id: '2',
        type: 'quality',
        message: '品質検査で不良品が検出されました',
        timestamp: '2024-01-15T09:15:00Z',
        user: '佐藤花子'
      },
      {
        id: '3',
        type: 'inventory',
        message: '在庫レベルが最低値を下回りました',
        timestamp: '2024-01-15T08:45:00Z',
        user: 'システム'
      }
    ]
  }

  // 生産計画関連
  async getProductionPlans(
    page: number = 0,
    limit: number = 20,
    status: string = 'all'
  ): Promise<PaginatedResponse<ProductionPlan>> {
    const response = await apiClient.get('/production-plans', {
      params: { page, limit, status }
    })
    return response.data
  }

  async getProductionPlan(id: string): Promise<ProductionPlan> {
    const response = await apiClient.get(`/production-plans/${id}`)
    return response.data
  }

  async createProductionPlan(plan: Partial<ProductionPlan>): Promise<ProductionPlan> {
    const response = await apiClient.post('/production-plans', plan)
    return response.data
  }

  async updateProductionPlan(id: string, plan: Partial<ProductionPlan>): Promise<ProductionPlan> {
    const response = await apiClient.put(`/production-plans/${id}`, plan)
    return response.data
  }

  async deleteProductionPlan(id: string): Promise<void> {
    await apiClient.delete(`/production-plans/${id}`)
  }

  // 在庫管理関連
  async getInventoryData(itemType: string): Promise<any> {
    const response = await apiClient.get(`/inventory/${itemType}`)
    return response.data
  }

  async updateInventory(itemId: string, quantity: number): Promise<any> {
    const response = await apiClient.put(`/inventory/${itemId}`, { quantity })
    return response.data
  }

  // 品質管理関連
  async getQualityData(planId: string): Promise<any> {
    const response = await apiClient.get(`/quality/${planId}`)
    return response.data
  }

  async createQualityInspection(inspection: any): Promise<any> {
    const response = await apiClient.post('/quality/inspections', inspection)
    return response.data
  }

  // 原価管理関連
  async getCostAnalysis(period: string): Promise<any> {
    const response = await apiClient.get(`/cost-analysis/${period}`)
    return response.data
  }

  // 需要予測関連
  async getDemandForecast(productId: string, period: string): Promise<any> {
    const response = await apiClient.get('/forecast', {
      params: { productId, period }
    })
    return response.data
  }

  // マスターデータ関連
  async getProducts(): Promise<any[]> {
    const response = await apiClient.get('/products')
    return response.data
  }

  async getMaterials(): Promise<any[]> {
    const response = await apiClient.get('/materials')
    return response.data
  }

  async getSuppliers(): Promise<any[]> {
    const response = await apiClient.get('/suppliers')
    return response.data
  }

  // ユーティリティメソッド
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await apiClient.get('/health')
    return response.data
  }

  // エラーハンドリング
  // private handleError(_error: any): never {
  //   throw new Error('API Error')
  // }
}

// API 関数
export const api = apiClient

export const productionPlanningApi = {
  getPlans: () => Promise.resolve({
    data: [
      {
        id: 'P-2024-001',
        name: '製品A生産計画',
        product: '製品A',
        quantity: 1000,
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        status: 'in_progress' as const,
        progress: 65,
        priority: 'high' as const
      },
      {
        id: 'P-2024-002',
        name: '製品B生産計画',
        product: '製品B',
        quantity: 500,
        startDate: '2024-02-01',
        endDate: '2024-02-28',
        status: 'planned' as const,
        progress: 0,
        priority: 'medium' as const
      }
    ],
    hasMore: false
  }),
  createPlan: (plan: ProductionPlan) => Promise.resolve({ data: plan }),
  updatePlan: (_id: string, plan: ProductionPlan) => Promise.resolve({ data: plan }),
  deletePlan: (_id: string) => Promise.resolve({ success: true })
}

// シングルトンインスタンス
export const dashboardApi = new ApiService()

// 個別のAPI関数（React Query用）
export const apiFunctions = {
  // ダッシュボード
  getStats: () => dashboardApi.getStats(),
  getChartData: () => dashboardApi.getChartData(),
  getRecentActivities: () => dashboardApi.getRecentActivities(),
  
  // 生産計画
  getProductionPlans: (page: number, limit: number, status: string) => 
    dashboardApi.getProductionPlans(page, limit, status),
  getProductionPlan: (id: string) => dashboardApi.getProductionPlan(id),
  createProductionPlan: (plan: Partial<ProductionPlan>) => 
    dashboardApi.createProductionPlan(plan),
  updateProductionPlan: (id: string, plan: Partial<ProductionPlan>) => 
    dashboardApi.updateProductionPlan(id, plan),
  deleteProductionPlan: (id: string) => dashboardApi.deleteProductionPlan(id),
  
  // 在庫管理
  getInventoryData: (itemType: string) => dashboardApi.getInventoryData(itemType),
  updateInventory: (itemId: string, quantity: number) => 
    dashboardApi.updateInventory(itemId, quantity),
  
  // 品質管理
  getQualityData: (planId: string) => dashboardApi.getQualityData(planId),
  createQualityInspection: (inspection: any) => 
    dashboardApi.createQualityInspection(inspection),
  
  // 原価管理
  getCostAnalysis: (period: string) => dashboardApi.getCostAnalysis(period),
  
  // 需要予測
  getDemandForecast: (productId: string, period: string) => 
    dashboardApi.getDemandForecast(productId, period),
  
  // マスターデータ
  getProducts: () => dashboardApi.getProducts(),
  getMaterials: () => dashboardApi.getMaterials(),
  getSuppliers: () => dashboardApi.getSuppliers(),
  
  // ヘルスチェック
  healthCheck: () => dashboardApi.healthCheck()
}

export default dashboardApi
