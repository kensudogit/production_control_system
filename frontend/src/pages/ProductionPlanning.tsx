import React, { memo, useMemo, useCallback, useState, useEffect, useRef } from 'react'
import { FixedSizeList as List, FixedSizeGrid as Grid } from 'react-window'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Filter, Download, Calendar, Target, Users, Clock } from 'lucide-react'
import ProductionPlanCard from '../components/UI/ProductionPlanCard'
import ProductionPlanModal from '../components/Forms/ProductionPlanModal'
import { useQuery, useInfiniteQuery } from 'react-query'
import { productionPlanningApi } from '../services/api'

// 仮想化されたリストアイテム
const VirtualizedItem = memo(({ index, style, data }: { index: number; style: React.CSSProperties; data: any[] }) => {
  const plan = data[index]
  if (!plan) return null

  return (
    <div style={style} className="p-2">
      <ProductionPlanCard plan={plan} />
    </div>
  )
})

VirtualizedItem.displayName = 'VirtualizedItem'

const ProductionPlanning: React.FC = memo(() => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const listRef = useRef<List>(null)

  // 無限スクロールクエリ
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery(
    ['production-plans', searchTerm, filterStatus],
    ({ pageParam = 0 }) => productionPlanningApi.getPlans({
      page: pageParam,
      limit: 20,
      search: searchTerm,
      status: filterStatus
    }),
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.hasMore ? pages.length : undefined
      },
      staleTime: 30000,
      cacheTime: 300000,
      refetchOnWindowFocus: false,
    }
  )

  // フラット化されたデータ
  const allPlans = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? []
  }, [data])

  // 検索とフィルタリングのデバウンス
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // 統計データ
  const stats = useMemo(() => [
    { label: '進行中', value: '12', icon: Clock, color: 'text-primary-600' },
    { label: '計画済み', value: '8', icon: Calendar, color: 'text-warning-600' },
    { label: '完了', value: '24', icon: Target, color: 'text-success-600' },
    { label: '総生産数', value: '15,420', icon: Users, color: 'text-secondary-600' }
  ], [])

  // 無限スクロールハンドラー
  const handleScroll = useCallback(({ scrollTop, scrollHeight, clientHeight }: any) => {
    if (scrollHeight - scrollTop - clientHeight < 100 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // エラーハンドリング
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-secondary-900 mb-2">データの読み込みに失敗しました</h3>
          <button onClick={() => window.location.reload()} className="btn-primary">
            再読み込み
          </button>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold text-secondary-900">生産計画</h1>
          <p className="mt-2 text-secondary-600">
            需要予測に基づいた生産計画の管理
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>新規計画</span>
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="card"
            >
              <div className="card-body">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-secondary-50">
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-secondary-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="card"
      >
        <div className="card-body">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
                <input
                  type="text"
                  placeholder="計画を検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 w-64"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input w-40"
              >
                <option value="all">すべて</option>
                <option value="planned">計画済み</option>
                <option value="in_progress">進行中</option>
                <option value="completed">完了</option>
                <option value="cancelled">キャンセル</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex rounded-lg border border-secondary-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm font-medium rounded-l-lg transition-colors duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-white text-secondary-700 hover:bg-secondary-50'
                  }`}
                >
                  グリッド
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm font-medium rounded-r-lg transition-colors duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-white text-secondary-700 hover:bg-secondary-50'
                  }`}
                >
                  リスト
                </button>
              </div>
              <button className="btn-secondary flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>フィルター</span>
              </button>
              <button className="btn-secondary flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>エクスポート</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Virtualized Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="card"
      >
        <div className="card-body p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="loading-spinner h-8 w-8"></div>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="h-[600px]">
                  <Grid
                    columnCount={3}
                    columnWidth={400}
                    height={600}
                    rowCount={Math.ceil(allPlans.length / 3)}
                    rowHeight={300}
                    width={1200}
                    onScroll={handleScroll}
                  >
                    {({ columnIndex, rowIndex, style }) => {
                      const index = rowIndex * 3 + columnIndex
                      const plan = allPlans[index]
                      if (!plan) return null
                      
                      return (
                        <div style={style} className="p-2">
                          <ProductionPlanCard plan={plan} />
                        </div>
                      )
                    }}
                  </Grid>
                </div>
              ) : (
                <div className="h-[600px]">
                  <List
                    ref={listRef}
                    height={600}
                    itemCount={allPlans.length}
                    itemSize={200}
                    onScroll={handleScroll}
                    itemData={allPlans}
                  >
                    {VirtualizedItem}
                  </List>
                </div>
              )}
              
              {/* Loading indicator */}
              {isFetchingNextPage && (
                <div className="flex items-center justify-center py-4">
                  <div className="loading-spinner h-6 w-6"></div>
                  <span className="ml-2 text-sm text-secondary-600">読み込み中...</span>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* Modal */}
      <ProductionPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(plan) => {
          console.log('Saving plan:', plan)
          setIsModalOpen(false)
        }}
      />
    </div>
  )
})

ProductionPlanning.displayName = 'ProductionPlanning'

export default ProductionPlanning