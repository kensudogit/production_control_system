import React, { memo, useMemo, useCallback, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  Package, 
  CheckCircle, 
  AlertTriangle,
  DollarSign,
  Users,
  Clock,
  Target,
  RefreshCw
} from 'lucide-react'
import StatsCard from '../components/UI/StatsCard'
import ChartCard from '../components/Charts/ChartCard'
import RecentActivity from '../components/UI/RecentActivity'
import QuickActions from '../components/UI/QuickActions'
import { useQuery, useQueryClient } from 'react-query'
import { dashboardApi } from '../services/api'

// メモ化されたコンポーネント
const MemoizedStatsCard = memo(StatsCard)
const MemoizedChartCard = memo(ChartCard)
const MemoizedRecentActivity = memo(RecentActivity)
const MemoizedQuickActions = memo(QuickActions)

const Dashboard: React.FC = memo(() => {
  const queryClient = useQueryClient()
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // データフェッチング（React Query使用）
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery(
    'dashboard-stats',
    dashboardApi.getStats,
    {
      staleTime: 30000, // 30秒間キャッシュ
      cacheTime: 300000, // 5分間キャッシュ
      refetchInterval: 60000, // 1分ごとに自動更新
      refetchOnWindowFocus: false,
    }
  )

  const { data: chartData, isLoading: chartLoading } = useQuery(
    'dashboard-charts',
    dashboardApi.getChartData,
    {
      staleTime: 60000, // 1分間キャッシュ
      cacheTime: 600000, // 10分間キャッシュ
    }
  )

  const { data: activities, isLoading: activitiesLoading } = useQuery(
    'dashboard-activities',
    dashboardApi.getRecentActivities,
    {
      staleTime: 15000, // 15秒間キャッシュ
      cacheTime: 300000, // 5分間キャッシュ
      refetchInterval: 30000, // 30秒ごとに自動更新
    }
  )

  // メモ化された統計データ
  const memoizedStats = useMemo(() => {
    if (!stats) return []
    
    return [
      {
        title: '生産計画',
        value: stats.productionPlans.toString(),
        change: `+${stats.productionPlansChange}%`,
        changeType: 'positive' as const,
        icon: TrendingUp,
        color: 'text-primary-600',
        bgColor: 'bg-primary-50'
      },
      {
        title: '在庫レベル',
        value: stats.inventoryLevel.toLocaleString(),
        change: `${stats.inventoryChange > 0 ? '+' : ''}${stats.inventoryChange}%`,
        changeType: stats.inventoryChange > 0 ? 'negative' : 'positive' as const,
        icon: Package,
        color: 'text-warning-600',
        bgColor: 'bg-warning-50'
      },
      {
        title: '品質合格率',
        value: `${stats.qualityRate}%`,
        change: `+${stats.qualityChange}%`,
        changeType: 'positive' as const,
        icon: CheckCircle,
        color: 'text-success-600',
        bgColor: 'bg-success-50'
      },
      {
        title: '原価効率',
        value: `¥${stats.costEfficiency.toLocaleString()}`,
        change: `-${stats.costChange}%`,
        changeType: 'positive' as const,
        icon: DollarSign,
        color: 'text-danger-600',
        bgColor: 'bg-danger-50'
      }
    ]
  }, [stats])

  // メモ化されたチャートデータ
  const memoizedChartData = useMemo(() => {
    if (!chartData) return { production: [], quality: [] }
    return chartData
  }, [chartData])

  // 手動更新関数
  const handleRefresh = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries('dashboard-stats'),
      queryClient.invalidateQueries('dashboard-charts'),
      queryClient.invalidateQueries('dashboard-activities')
    ])
    setLastUpdated(new Date())
  }, [queryClient])

  // エラーハンドリング
  if (statsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-danger-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">データの読み込みに失敗しました</h3>
          <button onClick={handleRefresh} className="btn-primary">
            <RefreshCw className="h-4 w-4 mr-2" />
            再試行
          </button>
        </div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05 // より高速なアニメーション
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">ダッシュボード</h1>
          <p className="mt-2 text-secondary-600">
            生産管理システムの概要と主要指標
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm text-secondary-500">最終更新</p>
            <p className="text-sm font-medium text-secondary-900">
              {lastUpdated.toLocaleString('ja-JP')}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={statsLoading || chartLoading || activitiesLoading}
            className="p-2 rounded-lg hover:bg-secondary-100 disabled:opacity-50 transition-colors duration-200"
          >
            <RefreshCw className={`h-5 w-5 text-secondary-600 ${(statsLoading || chartLoading || activitiesLoading) ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {memoizedStats.map((stat, index) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <MemoizedStatsCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts and Activities */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        <motion.div variants={itemVariants}>
          <MemoizedChartCard
            title="生産実績トレンド"
            subtitle="過去30日間の生産実績"
            type="line"
            data={memoizedChartData.production}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <MemoizedChartCard
            title="品質検査結果"
            subtitle="今月の品質検査状況"
            type="pie"
            data={memoizedChartData.quality}
          />
        </motion.div>
      </motion.div>

      {/* Bottom Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <MemoizedRecentActivity />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MemoizedQuickActions />
        </motion.div>
      </motion.div>
    </div>
  )
})

Dashboard.displayName = 'Dashboard'

export default Dashboard