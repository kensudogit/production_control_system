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
  production: Array<{ name: string; value: number }>
  quality: Array<{ name: string; value: number; color?: string }>
}

export interface Activity {
  id: number
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  description: string
  time: string
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
    const response = await apiClient.get('/dashboard/stats')
    return response.data
  }

  async getChartData(): Promise<ChartData> {
    const response = await apiClient.get('/dashboard/charts')
    return response.data
  }

  async getRecentActivities(): Promise<Activity[]> {
    const response = await apiClient.get('/dashboard/activities')
    return response.data
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
  private handleError(error: any): never {
    if (error.response) {
      // サーバーからのエラーレスポンス
      const { status, data } = error.response
      throw new Error(`API Error ${status}: ${data.message || 'Unknown error'}`)
    } else if (error.request) {
      // ネットワークエラー
      throw new Error('Network Error: Unable to connect to server')
    } else {
      // その他のエラー
      throw new Error(`Request Error: ${error.message}`)
    }
  }
}

// シングルトンインスタンス
export const dashboardApi = new ApiService()

// 個別のAPI関数（React Query用）
export const api = {
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
