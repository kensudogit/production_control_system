import { describe, bench } from 'vitest'
import { render } from '../test/utils'
import Dashboard from '../pages/Dashboard'
import StatsCard from '../components/UI/StatsCard'
import ProductionPlanning from '../pages/ProductionPlanning'
import { QueryClient } from 'react-query'

describe('Performance Benchmarks', () => {
  const createQueryClient = () => new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
        staleTime: 0,
      },
    },
  })

  bench('Dashboard component render', () => {
    const queryClient = createQueryClient()
    render(<Dashboard />, { queryClient })
  })

  bench('StatsCard component render', () => {
    const mockStats = {
      title: 'テスト統計',
      value: '100',
      change: '+10%',
      changeType: 'positive' as const,
      icon: () => null,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    }
    
    render(<StatsCard {...mockStats} />)
  })

  bench('ProductionPlanning component render', () => {
    const queryClient = createQueryClient()
    render(<ProductionPlanning />, { queryClient })
  })

  bench('Multiple StatsCard renders', () => {
    const stats = [
      {
        title: '統計1',
        value: '100',
        change: '+10%',
        changeType: 'positive' as const,
        icon: () => null,
        color: 'text-primary-600',
        bgColor: 'bg-primary-50'
      },
      {
        title: '統計2',
        value: '200',
        change: '-5%',
        changeType: 'negative' as const,
        icon: () => null,
        color: 'text-danger-600',
        bgColor: 'bg-danger-50'
      },
      {
        title: '統計3',
        value: '300',
        change: '0%',
        changeType: 'neutral' as const,
        icon: () => null,
        color: 'text-secondary-600',
        bgColor: 'bg-secondary-50'
      }
    ]

    stats.forEach(stat => {
      render(<StatsCard {...stat} />)
    })
  })
})

describe('Memory Usage Benchmarks', () => {
  bench('Memory allocation for Dashboard', () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
          staleTime: 0,
        },
      },
    })
    
    const { unmount } = render(<Dashboard />, { queryClient })
    unmount()
  })

  bench('Memory allocation for StatsCard', () => {
    const mockStats = {
      title: 'メモリテスト',
      value: '100',
      change: '+10%',
      changeType: 'positive' as const,
      icon: () => null,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    }
    
    const { unmount } = render(<StatsCard {...mockStats} />)
    unmount()
  })
})

describe('Rendering Performance', () => {
  bench('Large list rendering', () => {
    const items = Array.from({ length: 1000 }, (_, i) => ({
      id: `item-${i}`,
      name: `アイテム ${i}`,
      value: i * 10
    }))

    // 大量のアイテムをレンダリングするテスト
    items.forEach(item => {
      const mockStats = {
        title: item.name,
        value: item.value.toString(),
        change: '+10%',
        changeType: 'positive' as const,
        icon: () => null,
        color: 'text-primary-600',
        bgColor: 'bg-primary-50'
      }
      
      render(<StatsCard {...mockStats} />)
    })
  })

  bench('Rapid re-renders', () => {
    const mockStats = {
      title: '高速再レンダリングテスト',
      value: '100',
      change: '+10%',
      changeType: 'positive' as const,
      icon: () => null,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    }

    // 短時間で複数回レンダリング
    for (let i = 0; i < 100; i++) {
      render(<StatsCard {...mockStats} />)
    }
  })
})
