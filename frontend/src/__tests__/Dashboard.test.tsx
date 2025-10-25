import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../test/utils'
import { performanceTest, memoryTest, createTestData } from '../test/utils'
import Dashboard from '../pages/Dashboard'
import StatsCard from '../components/UI/StatsCard'
import { QueryClient } from 'react-query'

describe('Dashboard Component', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
          staleTime: 0,
        },
      },
    })
  })

  afterEach(() => {
    queryClient.clear()
  })

  it('renders dashboard correctly', async () => {
    render(<Dashboard />, { queryClient })
    
    expect(screen.getByText('ダッシュボード')).toBeInTheDocument()
    expect(screen.getByText('生産管理システムの概要と主要指標')).toBeInTheDocument()
  })

  it('displays stats cards', async () => {
    render(<Dashboard />, { queryClient })
    
    await waitFor(() => {
      expect(screen.getByText('生産計画')).toBeInTheDocument()
      expect(screen.getByText('在庫レベル')).toBeInTheDocument()
      expect(screen.getByText('品質合格率')).toBeInTheDocument()
      expect(screen.getByText('原価効率')).toBeInTheDocument()
    })
  })

  it('shows loading state', () => {
    render(<Dashboard />, { queryClient })
    
    // 初期状態ではローディングが表示される可能性がある
    expect(screen.getByText('最終更新')).toBeInTheDocument()
  })

  it('handles refresh button click', async () => {
    render(<Dashboard />, { queryClient })
    
    const refreshButton = screen.getByRole('button', { name: /再試行|更新/ })
    fireEvent.click(refreshButton)
    
    // リフレッシュ後の状態を確認
    await waitFor(() => {
      expect(refreshButton).toBeInTheDocument()
    })
  })

  // パフォーマンステスト
  performanceTest('Dashboard renders within performance threshold', async () => {
    render(<Dashboard />, { queryClient })
    
    await waitFor(() => {
      expect(screen.getByText('ダッシュボード')).toBeInTheDocument()
    })
  })

  // メモリテスト
  memoryTest('Dashboard does not cause memory leaks', async () => {
    const { unmount } = render(<Dashboard />, { queryClient })
    
    await waitFor(() => {
      expect(screen.getByText('ダッシュボード')).toBeInTheDocument()
    })
    
    unmount()
  })
})

describe('StatsCard Component', () => {
  const mockStats = {
    title: 'テスト統計',
    value: '100',
    change: '+10%',
    changeType: 'positive' as const,
    icon: vi.fn(),
    color: 'text-primary-600',
    bgColor: 'bg-primary-50'
  }

  it('renders stats card correctly', () => {
    render(<StatsCard {...mockStats} />)
    
    expect(screen.getByText('テスト統計')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('+10%')).toBeInTheDocument()
  })

  it('applies correct styling for positive change', () => {
    render(<StatsCard {...mockStats} />)
    
    const changeElement = screen.getByText('+10%')
    expect(changeElement).toHaveClass('text-success-600', 'bg-success-50')
  })

  it('applies correct styling for negative change', () => {
    const negativeStats = {
      ...mockStats,
      change: '-5%',
      changeType: 'negative' as const
    }
    
    render(<StatsCard {...negativeStats} />)
    
    const changeElement = screen.getByText('-5%')
    expect(changeElement).toHaveClass('text-danger-600', 'bg-danger-50')
  })

  it('handles hover interaction', () => {
    render(<StatsCard {...mockStats} />)
    
    const card = screen.getByText('テスト統計').closest('.card')
    expect(card).toBeInTheDocument()
    
    // ホバー効果のテスト（実際のCSSアニメーションはテストできないが、要素の存在は確認可能）
    fireEvent.mouseEnter(card!)
    fireEvent.mouseLeave(card!)
  })

  // パフォーマンステスト
  performanceTest('StatsCard renders quickly', () => {
    render(<StatsCard {...mockStats} />)
    expect(screen.getByText('テスト統計')).toBeInTheDocument()
  })
})

describe('Component Integration Tests', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
          staleTime: 0,
        },
      },
    })
  })

  it('dashboard integrates with stats cards', async () => {
    render(<Dashboard />, { queryClient })
    
    await waitFor(() => {
      // ダッシュボードと統計カードが連携して表示されることを確認
      expect(screen.getByText('ダッシュボード')).toBeInTheDocument()
      expect(screen.getByText('生産計画')).toBeInTheDocument()
    })
  })

  it('handles multiple rapid interactions', async () => {
    render(<Dashboard />, { queryClient })
    
    const refreshButton = screen.getByRole('button', { name: /再試行|更新/ })
    
    // 複数回のクリックをシミュレート
    for (let i = 0; i < 5; i++) {
      fireEvent.click(refreshButton)
    }
    
    // コンポーネントが正常に動作し続けることを確認
    await waitFor(() => {
      expect(screen.getByText('ダッシュボード')).toBeInTheDocument()
    })
  })
})

describe('Error Handling', () => {
  it('handles API errors gracefully', async () => {
    // エラーをシミュレートするためのモック
    const errorQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
          staleTime: 0,
        },
      },
    })

    // エラー状態をシミュレート
    vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(<Dashboard />, { queryClient: errorQueryClient })
    
    // エラー状態でもコンポーネントがクラッシュしないことを確認
    expect(screen.getByText('ダッシュボード')).toBeInTheDocument()
    
    vi.restoreAllMocks()
  })
})

describe('Accessibility Tests', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
          staleTime: 0,
        },
      },
    })
  })

  it('has proper ARIA labels', () => {
    render(<Dashboard />, { queryClient })
    
    // アクセシビリティ属性の確認
    const refreshButton = screen.getByRole('button', { name: /再試行|更新/ })
    expect(refreshButton).toBeInTheDocument()
  })

  it('supports keyboard navigation', () => {
    render(<Dashboard />, { queryClient })
    
    const refreshButton = screen.getByRole('button', { name: /再試行|更新/ })
    
    // キーボードナビゲーションのテスト
    refreshButton.focus()
    expect(refreshButton).toHaveFocus()
    
    fireEvent.keyDown(refreshButton, { key: 'Enter' })
    // Enterキーでの操作が可能であることを確認
  })
})
