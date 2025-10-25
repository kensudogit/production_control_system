import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { ReactElement, ReactNode } from 'react'
import { vi } from 'vitest'

// テスト用のQueryClient
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
      staleTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
})

// カスタムレンダー関数
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
}

const AllTheProviders = ({ children, queryClient }: { children: ReactNode; queryClient?: QueryClient }) => {
  const client = queryClient || createTestQueryClient()
  
  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { queryClient, ...renderOptions } = options
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders queryClient={queryClient}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  })
}

// パフォーマンステスト用のヘルパー
export const performanceTest = (name: string, fn: () => void | Promise<void>) => {
  return async () => {
    const start = performance.now()
    await fn()
    const end = performance.now()
    const duration = end - start
    
    // パフォーマンス閾値のチェック
    if (duration > 1000) {
      console.warn(`⚠️  ${name} took ${duration.toFixed(2)}ms (threshold: 1000ms)`)
    } else {
      console.log(`✅ ${name} completed in ${duration.toFixed(2)}ms`)
    }
  }
}

// メモリ使用量テスト
export const memoryTest = (_name: string, fn: () => void | Promise<void>) => {
  return async () => {
    if (!(performance as any).memory) {
      console.warn('Memory API not available')
      return
    }
    
    const beforeMemory = (performance as any).memory.usedJSHeapSize
    await fn()
    const afterMemory = (performance as any).memory.usedJSHeapSize
    const memoryDiff = afterMemory - beforeMemory
    
    console.log(`Memory usage: ${(memoryDiff / 1024 / 1024).toFixed(2)}MB`)
  }
}

// 非同期操作のテストヘルパー
export const waitForAsync = (ms: number = 0) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// モック関数のヘルパー
export const createMockFunction = <T extends (...args: any[]) => any>(
  implementation?: T
) => {
  return vi.fn(implementation || (() => {}))
}

// タイマーのモック
export const mockTimers = () => {
  vi.useFakeTimers()
  
  return {
    advanceTimersByTime: vi.advanceTimersByTime,
    runAllTimers: vi.runAllTimers,
    restore: () => vi.useRealTimers()
  }
}

// ネットワークのモック
export const mockNetwork = () => {
  const originalFetch = global.fetch
  const mockFetch = vi.fn()
  
  global.fetch = mockFetch
  
  return {
    mockFetch,
    restore: () => {
      global.fetch = originalFetch
    }
  }
}

// ローカルストレージのモック
export const mockLocalStorage = () => {
  const store: Record<string, string> = {}
  
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key]
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach(key => delete store[key])
      }),
      length: Object.keys(store).length,
      key: vi.fn((index: number) => Object.keys(store)[index] || null)
    },
    writable: true
  })
  
  return store
}

// セッションストレージのモック
export const mockSessionStorage = () => {
  const store: Record<string, string> = {}
  
  Object.defineProperty(window, 'sessionStorage', {
    value: {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key]
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach(key => delete store[key])
      }),
      length: Object.keys(store).length,
      key: vi.fn((index: number) => Object.keys(store)[index] || null)
    },
    writable: true
  })
  
  return store
}

// テストデータファクトリー
export const createTestData = {
  productionPlan: (overrides = {}) => ({
    id: 'P-2024-001',
    name: 'テスト生産計画',
    product: 'テスト製品',
    quantity: 100,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'planned',
    progress: 0,
    priority: 'medium',
    ...overrides
  }),
  
  inventoryItem: (overrides = {}) => ({
    id: 'INV-001',
    name: 'テスト在庫',
    type: 'material',
    quantity: 50,
    minLevel: 10,
    maxLevel: 100,
    unitCost: 1000,
    ...overrides
  }),
  
  qualityInspection: (overrides = {}) => ({
    id: 'QI-001',
    planId: 'P-2024-001',
    inspectionDate: '2024-01-15',
    inspector: 'テスト検査員',
    sampleSize: 10,
    passedQuantity: 9,
    failedQuantity: 1,
    result: 'PASS',
    ...overrides
  })
}

// 再エクスポート
export * from '@testing-library/react'
export { customRender as render }
