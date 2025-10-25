import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  LineChart, 
  Target,
  Calendar,
  AlertTriangle,
  Brain,
  Zap,
  Activity,
  PieChart,
  X
} from 'lucide-react'

const DemandForecasting: React.FC = () => {
  const [showAIModal, setShowAIModal] = useState(false)
  const [showPeriodModal, setShowPeriodModal] = useState(false)
  const [showTrendModal, setShowTrendModal] = useState(false)

  const forecastData = [
    { 
      id: 'FC-001', 
      product: '製品A', 
      currentDemand: 1200, 
      forecastedDemand: 1350, 
      trend: 'up', 
      confidence: 85,
      seasonality: 'high',
      lastMonth: 1100,
      nextMonth: 1400
    },
    { 
      id: 'FC-002', 
      product: '製品B', 
      currentDemand: 800, 
      forecastedDemand: 750, 
      trend: 'down', 
      confidence: 78,
      seasonality: 'medium',
      lastMonth: 850,
      nextMonth: 720
    },
    { 
      id: 'FC-003', 
      product: '製品C', 
      currentDemand: 950, 
      forecastedDemand: 980, 
      trend: 'stable', 
      confidence: 92,
      seasonality: 'low',
      lastMonth: 940,
      nextMonth: 990
    },
    { 
      id: 'FC-004', 
      product: '製品D', 
      currentDemand: 600, 
      forecastedDemand: 720, 
      trend: 'up', 
      confidence: 88,
      seasonality: 'high',
      lastMonth: 580,
      nextMonth: 750
    }
  ]

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-success-600 bg-success-50'
      case 'down': return 'text-danger-600 bg-danger-50'
      case 'stable': return 'text-primary-600 bg-primary-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'up': return '上昇'
      case 'down': return '下降'
      case 'stable': return '安定'
      default: return '不明'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4" />
      case 'down': return <TrendingDown className="w-4 h-4" />
      case 'stable': return <Target className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getSeasonalityColor = (seasonality: string) => {
    switch (seasonality) {
      case 'high': return 'text-warning-600 bg-warning-50'
      case 'medium': return 'text-primary-600 bg-primary-50'
      case 'low': return 'text-success-600 bg-success-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getSeasonalityText = (seasonality: string) => {
    switch (seasonality) {
      case 'high': return '高'
      case 'medium': return '中'
      case 'low': return '低'
      default: return '不明'
    }
  }

  const handleAIExecute = () => {
    console.log('AI予測実行')
    setShowAIModal(false)
  }

  const handlePeriodSet = () => {
    console.log('期間設定保存')
    setShowPeriodModal(false)
  }

  const handleTrendAnalyze = () => {
    console.log('トレンド分析実行')
    setShowTrendModal(false)
  }

  const totalCurrentDemand = forecastData.reduce((sum, item) => sum + item.currentDemand, 0)
  const totalForecastedDemand = forecastData.reduce((sum, item) => sum + item.forecastedDemand, 0)
  const averageConfidence = forecastData.reduce((sum, item) => sum + item.confidence, 0) / forecastData.length

  return (
    <div className="min-h-screen gradient-bg-light">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 p-6"
      >
        {/* ヘッダー */}
        <div className="card-gradient-warning">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white">需要予測</h1>
                <p className="text-white/80 mt-2 text-lg">AI予測とトレンド分析</p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowAIModal(true)}
                  className="btn-secondary"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  AI予測
                </button>
                <button 
                  onClick={() => setShowPeriodModal(true)}
                  className="btn-secondary"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  期間設定
                </button>
                <button 
                  onClick={() => setShowTrendModal(true)}
                  className="btn-secondary"
                >
                  <Activity className="w-5 h-5 mr-2" />
                  トレンド分析
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="card-gradient-primary"
          >
            <div className="card-body">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/80">現在需要</p>
                  <p className="text-2xl font-bold text-white">{totalCurrentDemand.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card-gradient-success"
          >
            <div className="card-body">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/80">予測需要</p>
                  <p className="text-2xl font-bold text-white">{totalForecastedDemand.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="card-gradient-secondary"
          >
            <div className="card-body">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/80">平均信頼度</p>
                  <p className="text-2xl font-bold text-white">{averageConfidence.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="card-gradient-warning"
          >
            <div className="card-body">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/80">成長率</p>
                  <p className="text-2xl font-bold text-white">
                    +{((totalForecastedDemand - totalCurrentDemand) / totalCurrentDemand * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 予測一覧 */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-800">需要予測分析</h3>
          </div>
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>製品</th>
                    <th>現在需要</th>
                    <th>予測需要</th>
                    <th>前月</th>
                    <th>来月予測</th>
                    <th>トレンド</th>
                    <th>信頼度</th>
                    <th>季節性</th>
                    <th>成長率</th>
                    <th>アクション</th>
                  </tr>
                </thead>
                <tbody>
                  {forecastData.map((forecast, index) => {
                    const growthRate = ((forecast.forecastedDemand - forecast.currentDemand) / forecast.currentDemand * 100)
                    return (
                      <motion.tr
                        key={forecast.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <td className="font-medium">{forecast.product}</td>
                        <td className="font-semibold">{forecast.currentDemand.toLocaleString()}</td>
                        <td className="font-semibold">{forecast.forecastedDemand.toLocaleString()}</td>
                        <td className="text-sm">{forecast.lastMonth.toLocaleString()}</td>
                        <td className="text-sm">{forecast.nextMonth.toLocaleString()}</td>
                        <td>
                          <span className={`badge ${getTrendColor(forecast.trend)} flex items-center`}>
                            {getTrendIcon(forecast.trend)}
                            <span className="ml-1">{getTrendText(forecast.trend)}</span>
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${forecast.confidence}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{forecast.confidence}%</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${getSeasonalityColor(forecast.seasonality)}`}>
                            {getSeasonalityText(forecast.seasonality)}
                          </span>
                        </td>
                        <td className={`font-semibold ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
                        </td>
                        <td>
                          <div className="flex space-x-2">
                            <button className="btn-sm btn-secondary">
                              <LineChart className="w-3 h-3 mr-1" />
                              詳細
                            </button>
                            <button className="btn-sm btn-primary">
                              <Brain className="w-3 h-3 mr-1" />
                              再予測
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* チャートエリア */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-800">需要トレンド</h3>
            </div>
            <div className="card-body">
              <div className="h-64 flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="text-center">
                  <LineChart className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <p className="text-gray-600">需要トレンドチャート</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-800">予測精度</h3>
            </div>
            <div className="card-body">
              <div className="h-64 flex items-center justify-center bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <div className="text-center">
                  <PieChart className="w-12 h-12 text-success-600 mx-auto mb-4" />
                  <p className="text-gray-600">予測精度分析</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI予測設定 */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-800">AI予測設定</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="label">予測期間</label>
                <select className="input">
                  <option value="1">1ヶ月</option>
                  <option value="3">3ヶ月</option>
                  <option value="6">6ヶ月</option>
                  <option value="12">12ヶ月</option>
                </select>
              </div>
              <div>
                <label className="label">アルゴリズム</label>
                <select className="input">
                  <option value="arima">ARIMA</option>
                  <option value="lstm">LSTM</option>
                  <option value="prophet">Prophet</option>
                  <option value="ensemble">アンサンブル</option>
                </select>
              </div>
              <div>
                <label className="label">信頼度閾値</label>
                <input 
                  type="number" 
                  className="input" 
                  placeholder="80"
                  defaultValue="80"
                  min="50"
                  max="99"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button className="btn-secondary">
                <Activity className="w-4 h-4 mr-2" />
                トレンド分析
              </button>
              <button className="btn-primary">
                <Brain className="w-4 h-4 mr-2" />
                AI予測実行
              </button>
            </div>
          </div>
        </div>

        {/* AI予測モーダル */}
        <AnimatePresence>
          {showAIModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowAIModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="card max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="card-header">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">AI予測設定</h3>
                    <button
                      onClick={() => setShowAIModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div>
                      <label className="label">予測期間</label>
                      <select className="input">
                        <option value="1">1ヶ月</option>
                        <option value="3">3ヶ月</option>
                        <option value="6">6ヶ月</option>
                        <option value="12">12ヶ月</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">アルゴリズム</label>
                      <select className="input">
                        <option value="arima">ARIMA</option>
                        <option value="lstm">LSTM</option>
                        <option value="prophet">Prophet</option>
                        <option value="ensemble">アンサンブル</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">信頼度閾値</label>
                      <input 
                        type="number" 
                        className="input" 
                        placeholder="80"
                        defaultValue="80"
                        min="50"
                        max="99"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAIModal(false)}
                      className="btn-secondary"
                    >
                      キャンセル
                    </button>
                    <button onClick={handleAIExecute} className="btn-primary">
                      <Brain className="w-4 h-4 mr-2" />
                      AI予測実行
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 期間設定モーダル */}
        <AnimatePresence>
          {showPeriodModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowPeriodModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="card max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="card-header">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">期間設定</h3>
                    <button
                      onClick={() => setShowPeriodModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div>
                      <label className="label">開始日</label>
                      <input type="date" className="input" required />
                    </div>
                    <div>
                      <label className="label">終了日</label>
                      <input type="date" className="input" required />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowPeriodModal(false)}
                      className="btn-secondary"
                    >
                      キャンセル
                    </button>
                    <button onClick={handlePeriodSet} className="btn-primary">
                      <Calendar className="w-4 h-4 mr-2" />
                      期間設定保存
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* トレンド分析モーダル */}
        <AnimatePresence>
          {showTrendModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowTrendModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="card max-w-lg w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="card-header">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">トレンド分析</h3>
                    <button
                      onClick={() => setShowTrendModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div>
                      <label className="label">分析対象製品</label>
                      <select className="input">
                        <option value="all">全ての製品</option>
                        {forecastData.map((forecast) => (
                          <option key={forecast.id} value={forecast.id}>
                            {forecast.product}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label">分析タイプ</label>
                      <select className="input">
                        <option value="short">短期トレンド</option>
                        <option value="long">長期トレンド</option>
                        <option value="seasonal">季節性トレンド</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowTrendModal(false)}
                      className="btn-secondary"
                    >
                      キャンセル
                    </button>
                    <button onClick={handleTrendAnalyze} className="btn-primary">
                      <Activity className="w-4 h-4 mr-2" />
                      分析実行
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default DemandForecasting

