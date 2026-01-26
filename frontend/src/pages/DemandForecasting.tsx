import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from 'react-query'
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
  X,
  Loader2
} from 'lucide-react'
import { getAdvancedOpenAIService, AIForecastRequest } from '../services/openai'
import { dashboardApi, DemandForecast } from '../services/api'
import { isOpenAIApiKeySet, getEnvDebugInfo } from '../utils/env'

const DemandForecasting: React.FC = () => {
  const [showAIModal, setShowAIModal] = useState(false)
  const [showPeriodModal, setShowPeriodModal] = useState(false)
  const [showTrendModal, setShowTrendModal] = useState(false)
  const [isAILoading, setIsAILoading] = useState(false)
  const [aiSettings, setAiSettings] = useState({
    product: '製品A',
    period: '3',
    algorithm: 'arima',
    confidenceThreshold: 80,
    economicIndex: 105,
    seasonality: 'high',
    competitorActivity: 'stable',
    marketTrend: 'growing',
    productionCapacity: 2000,
    inventoryLevel: 500,
    leadTime: 14,
    supplierReliability: 95
  })

  // 環境変数の状態確認（開発環境のみ）
  useEffect(() => {
    const debugInfo = getEnvDebugInfo()
    console.log('🔍 環境変数の状態:', debugInfo)
    
    if (!isOpenAIApiKeySet()) {
      console.warn(
        '⚠️ OpenAI APIキーが設定されていません。\n' +
        'Vercel Dashboardで環境変数 VITE_OPENAI_API_KEY を設定してください。\n' +
        '設定後、再デプロイが必要です。'
      )
    }
  }, [])

  // DBから需要予測データを取得
  const { data: forecastResponse, isLoading: isLoadingForecasts, error: forecastError } = useQuery(
    'demandForecasts',
    () => dashboardApi.getDemandForecasts({ period: 'monthly', limit: 50 }),
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    }
  )

  // DBデータをフロントエンド用の形式に変換
  const [forecastData, setForecastData] = useState<Array<{
    id: string
    product: string
    productCode: string
    currentDemand: number
    forecastedDemand: number
    trend: 'up' | 'down' | 'stable'
    confidence: number
    accuracy: number | null
    seasonality: 'high' | 'medium' | 'low'
    lastMonth: number
    nextMonth: number
    forecastDate: string
    forecastMethod: string
  }>>([])

  // DBデータを処理して表示用データに変換
  useEffect(() => {
    if (forecastResponse?.data) {
      // 製品ごとにグループ化して最新の予測を取得
      const productMap = new Map<string, DemandForecast[]>()
      
      forecastResponse.data.forEach((forecast: DemandForecast) => {
        const key = forecast.productId
        if (!productMap.has(key)) {
          productMap.set(key, [])
        }
        productMap.get(key)!.push(forecast)
      })

      // 各製品の最新予測と前月・来月の予測を計算
      const processedData = Array.from(productMap.entries()).map(([_productId, forecasts]) => {
        // 日付順にソート
        forecasts.sort((a, b) => new Date(b.forecastDate).getTime() - new Date(a.forecastDate).getTime())
        
        const latest = forecasts[0]
        const previous = forecasts.find(f => 
          new Date(f.forecastDate).getTime() < new Date(latest.forecastDate).getTime()
        )
        const next = forecasts.find(f => 
          new Date(f.forecastDate).getTime() > new Date(latest.forecastDate).getTime()
        )

        // トレンドを計算
        let trend: 'up' | 'down' | 'stable' = 'stable'
        if (previous) {
          const change = latest.forecastedQuantity - previous.forecastedQuantity
          const changePercent = (change / previous.forecastedQuantity) * 100
          if (changePercent > 5) trend = 'up'
          else if (changePercent < -5) trend = 'down'
        }

        // 季節性を信頼度から推定
        const seasonality: 'high' | 'medium' | 'low' = 
          latest.confidenceLevel >= 88 ? 'high' : 
          latest.confidenceLevel >= 80 ? 'medium' : 'low'

        return {
          id: latest.id,
          product: latest.productName,
          productCode: latest.productCode,
          currentDemand: previous?.forecastedQuantity || latest.forecastedQuantity,
          forecastedDemand: latest.forecastedQuantity,
          trend,
          confidence: Math.round(latest.confidenceLevel),
          accuracy: latest.accuracy ? Math.round(latest.accuracy) : null,
          seasonality,
          lastMonth: previous?.forecastedQuantity || latest.forecastedQuantity,
          nextMonth: next?.forecastedQuantity || latest.forecastedQuantity,
          forecastDate: latest.forecastDate,
          forecastMethod: latest.forecastMethod
        }
      })

      setForecastData(processedData)
    }
  }, [forecastResponse])

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

  const handleAIExecute = async () => {
    setIsAILoading(true)
    try {
      // 環境変数からAPIキーを取得（getAdvancedOpenAIServiceが自動的に環境変数から取得）
      let openAIService
      try {
        openAIService = getAdvancedOpenAIService()
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました'
        alert(`OpenAI APIキーの設定エラー:\n${errorMessage}\n\nVercel Dashboardで環境変数 VITE_OPENAI_API_KEY を設定してください。`)
        setIsAILoading(false)
        return
      }
      
      const request: AIForecastRequest = {
        product: aiSettings.product,
        period: `${aiSettings.period}ヶ月`,
        algorithm: aiSettings.algorithm,
        confidenceThreshold: aiSettings.confidenceThreshold,
        historicalData: [
          { date: '2024-01-01', demand: 1200, price: 1500, season: '冬', promotion: false, competitor: 'A社' },
          { date: '2024-01-15', demand: 1350, price: 1500, season: '冬', promotion: true, competitor: 'A社' },
          { date: '2024-02-01', demand: 1100, price: 1600, season: '冬', promotion: false, competitor: 'B社' },
          { date: '2024-02-15', demand: 1400, price: 1600, season: '春', promotion: true, competitor: 'B社' },
          { date: '2024-03-01', demand: 1300, price: 1550, season: '春', promotion: false, competitor: 'A社' }
        ],
        marketFactors: {
          economicIndex: aiSettings.economicIndex,
          seasonality: aiSettings.seasonality,
          competitorActivity: aiSettings.competitorActivity,
          marketTrend: aiSettings.marketTrend
        },
        businessContext: {
          productionCapacity: aiSettings.productionCapacity,
          inventoryLevel: aiSettings.inventoryLevel,
          leadTime: aiSettings.leadTime,
          supplierReliability: aiSettings.supplierReliability
        }
      }

      const result = await openAIService.generateAdvancedForecast(request)
      console.log('高度なAI予測結果:', result)
      
      // 詳細な結果表示
      const message = `AI予測が完了しました！

【予測精度】
- MAPE: ${result.accuracyMetrics.mape.toFixed(1)}%
- RMSE: ${result.accuracyMetrics.rmse.toFixed(1)}
- 方向性精度: ${result.accuracyMetrics.directionalAccuracy.toFixed(1)}%

【リスク分析】
- 総合リスク: ${result.riskAnalysis.overallRisk}%
- 供給リスク: ${result.riskAnalysis.supplyRisk}%
- 需要リスク: ${result.riskAnalysis.demandRisk}%
- 市場リスク: ${result.riskAnalysis.marketRisk}%

詳細な結果はコンソールで確認してください。`
      
      alert(message)
      
    } catch (error) {
      console.error('高度なAI予測エラー:', error)
      
      // エラーメッセージを詳細に表示
      const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました'
      
      // APIキー関連のエラーの場合は詳細なメッセージを表示
      if (errorMessage.includes('APIキー') || errorMessage.includes('VITE_OPENAI_API_KEY')) {
        alert(`❌ OpenAI APIキーの設定エラー\n\n${errorMessage}\n\n【解決方法】\n1. Vercel Dashboardにログイン\n2. プロジェクト → Settings → Environment Variables\n3. VITE_OPENAI_API_KEY を追加\n4. 再デプロイを実行`)
      } else {
        alert(`❌ AI予測の実行中にエラーが発生しました\n\n${errorMessage}\n\n詳細はブラウザのコンソール（F12）で確認してください。`)
      }
    } finally {
      setIsAILoading(false)
      setShowAIModal(false)
    }
  }

  const handlePeriodSet = () => {
    console.log('期間設定保存')
    setShowPeriodModal(false)
  }

  const handleTrendAnalyze = () => {
    console.log('トレンド分析実行')
    setShowTrendModal(false)
  }

  const totalCurrentDemand = forecastData.length > 0 
    ? forecastData.reduce((sum, item) => sum + item.currentDemand, 0)
    : 0
  const totalForecastedDemand = forecastData.length > 0
    ? forecastData.reduce((sum, item) => sum + item.forecastedDemand, 0)
    : 0
  const averageConfidence = forecastData.length > 0
    ? forecastData.reduce((sum, item) => sum + item.confidence, 0) / forecastData.length
    : 0
  const averageAccuracy = forecastData.length > 0
    ? forecastData
        .filter(item => item.accuracy !== null)
        .reduce((sum, item) => sum + (item.accuracy || 0), 0) / 
        forecastData.filter(item => item.accuracy !== null).length
    : null

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
            transition={{ delay: 0.35 }}
            className="card-gradient-info"
          >
            <div className="card-body">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-lg">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/80">平均予測精度</p>
                  <p className="text-2xl font-bold text-white">
                    {averageAccuracy !== null ? `${averageAccuracy.toFixed(1)}%` : '未測定'}
                  </p>
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
                    {totalCurrentDemand > 0 
                      ? `${((totalForecastedDemand - totalCurrentDemand) / totalCurrentDemand * 100) >= 0 ? '+' : ''}${((totalForecastedDemand - totalCurrentDemand) / totalCurrentDemand * 100).toFixed(1)}%`
                      : '0%'}
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
                    <th>製品コード</th>
                    <th>製品名</th>
                    <th>現在需要</th>
                    <th>予測需要</th>
                    <th>前月</th>
                    <th>来月予測</th>
                    <th>トレンド</th>
                    <th>信頼度</th>
                    <th>予測精度</th>
                    <th>予測手法</th>
                    <th>季節性</th>
                    <th>成長率</th>
                    <th>アクション</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingForecasts ? (
                    <tr>
                      <td colSpan={13} className="text-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600" />
                        <p className="mt-2 text-gray-600">需要予測データを読み込み中...</p>
                      </td>
                    </tr>
                  ) : forecastError ? (
                    <tr>
                      <td colSpan={13} className="text-center py-8">
                        <AlertTriangle className="w-8 h-8 mx-auto text-danger-600" />
                        <p className="mt-2 text-danger-600">データの読み込みに失敗しました</p>
                        <p className="text-sm text-gray-500 mt-1">{forecastError instanceof Error ? forecastError.message : '不明なエラー'}</p>
                      </td>
                    </tr>
                  ) : forecastData.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="text-center py-8">
                        <p className="text-gray-600">需要予測データがありません</p>
                      </td>
                    </tr>
                  ) : (
                    forecastData.map((forecast, index) => {
                      const growthRate = ((forecast.forecastedDemand - forecast.currentDemand) / forecast.currentDemand * 100)
                      return (
                        <motion.tr
                          key={forecast.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <td className="font-mono text-sm">{forecast.productCode}</td>
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
                            {forecast.accuracy !== null ? (
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      forecast.accuracy >= 95 ? 'bg-success-600' :
                                      forecast.accuracy >= 90 ? 'bg-primary-600' :
                                      forecast.accuracy >= 85 ? 'bg-warning-600' :
                                      'bg-danger-600'
                                    }`}
                                    style={{ width: `${forecast.accuracy}%` }}
                                  />
                                </div>
                                <span className={`text-sm font-medium ${
                                  forecast.accuracy >= 95 ? 'text-success-600' :
                                  forecast.accuracy >= 90 ? 'text-primary-600' :
                                  forecast.accuracy >= 85 ? 'text-warning-600' :
                                  'text-danger-600'
                                }`}>
                                  {forecast.accuracy}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">未測定</span>
                            )}
                          </td>
                          <td>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {forecast.forecastMethod === 'ml_model' ? 'ML' :
                               forecast.forecastMethod === 'moving_average' ? '移動平均' :
                               forecast.forecastMethod === 'exponential_smoothing' ? '指数平滑' :
                               forecast.forecastMethod}
                            </span>
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
                    })
                  )}
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
              {forecastData.filter(f => f.accuracy !== null).length > 0 ? (
                <div className="space-y-4">
                  {forecastData
                    .filter(f => f.accuracy !== null)
                    .slice(0, 5)
                    .map((forecast) => (
                      <div key={forecast.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{forecast.product}</span>
                            <span className={`text-sm font-semibold ${
                              forecast.accuracy! >= 95 ? 'text-success-600' :
                              forecast.accuracy! >= 90 ? 'text-primary-600' :
                              forecast.accuracy! >= 85 ? 'text-warning-600' :
                              'text-danger-600'
                            }`}>
                              {forecast.accuracy}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                forecast.accuracy! >= 95 ? 'bg-success-600' :
                                forecast.accuracy! >= 90 ? 'bg-primary-600' :
                                forecast.accuracy! >= 85 ? 'bg-warning-600' :
                                'bg-danger-600'
                              }`}
                              style={{ width: `${forecast.accuracy}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  {averageAccuracy !== null && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">平均予測精度</span>
                        <span className={`text-lg font-bold ${
                          averageAccuracy >= 95 ? 'text-success-600' :
                          averageAccuracy >= 90 ? 'text-primary-600' :
                          averageAccuracy >= 85 ? 'text-warning-600' :
                          'text-danger-600'
                        }`}>
                          {averageAccuracy.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 text-success-600 mx-auto mb-4" />
                    <p className="text-gray-600">予測精度データがありません</p>
                    <p className="text-sm text-gray-500 mt-1">実績データが蓄積されると表示されます</p>
                  </div>
                </div>
              )}
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
                      <label className="label">製品</label>
                      <select 
                        className="input"
                        value={aiSettings.product}
                        onChange={(e) => setAiSettings({ ...aiSettings, product: e.target.value })}
                      >
                        <option value="製品A">製品A</option>
                        <option value="製品B">製品B</option>
                        <option value="製品C">製品C</option>
                        <option value="製品D">製品D</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">予測期間</label>
                      <select 
                        className="input"
                        value={aiSettings.period}
                        onChange={(e) => setAiSettings({ ...aiSettings, period: e.target.value })}
                      >
                        <option value="1">1ヶ月</option>
                        <option value="3">3ヶ月</option>
                        <option value="6">6ヶ月</option>
                        <option value="12">12ヶ月</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">アルゴリズム</label>
                      <select 
                        className="input"
                        value={aiSettings.algorithm}
                        onChange={(e) => setAiSettings({ ...aiSettings, algorithm: e.target.value })}
                      >
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
                        value={aiSettings.confidenceThreshold}
                        onChange={(e) => setAiSettings({ ...aiSettings, confidenceThreshold: parseInt(e.target.value) })}
                        min="50"
                        max="99"
                      />
                    </div>
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">市場要因</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label">経済指標</label>
                          <input 
                            type="number" 
                            className="input" 
                            value={aiSettings.economicIndex}
                            onChange={(e) => setAiSettings({ ...aiSettings, economicIndex: parseInt(e.target.value) })}
                            placeholder="105"
                          />
                        </div>
                        <div>
                          <label className="label">季節性</label>
                          <select 
                            className="input"
                            value={aiSettings.seasonality}
                            onChange={(e) => setAiSettings({ ...aiSettings, seasonality: e.target.value })}
                          >
                            <option value="high">高</option>
                            <option value="medium">中</option>
                            <option value="low">低</option>
                          </select>
                        </div>
                        <div>
                          <label className="label">競合動向</label>
                          <select 
                            className="input"
                            value={aiSettings.competitorActivity}
                            onChange={(e) => setAiSettings({ ...aiSettings, competitorActivity: e.target.value })}
                          >
                            <option value="stable">安定</option>
                            <option value="increasing">増加</option>
                            <option value="decreasing">減少</option>
                          </select>
                        </div>
                        <div>
                          <label className="label">市場トレンド</label>
                          <select 
                            className="input"
                            value={aiSettings.marketTrend}
                            onChange={(e) => setAiSettings({ ...aiSettings, marketTrend: e.target.value })}
                          >
                            <option value="growing">成長</option>
                            <option value="stable">安定</option>
                            <option value="declining">減少</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">ビジネスコンテキスト</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label">生産能力 (個/月)</label>
                          <input 
                            type="number" 
                            className="input" 
                            value={aiSettings.productionCapacity}
                            onChange={(e) => setAiSettings({ ...aiSettings, productionCapacity: parseInt(e.target.value) })}
                            placeholder="2000"
                          />
                        </div>
                        <div>
                          <label className="label">在庫レベル (個)</label>
                          <input 
                            type="number" 
                            className="input" 
                            value={aiSettings.inventoryLevel}
                            onChange={(e) => setAiSettings({ ...aiSettings, inventoryLevel: parseInt(e.target.value) })}
                            placeholder="500"
                          />
                        </div>
                        <div>
                          <label className="label">リードタイム (日)</label>
                          <input 
                            type="number" 
                            className="input" 
                            value={aiSettings.leadTime}
                            onChange={(e) => setAiSettings({ ...aiSettings, leadTime: parseInt(e.target.value) })}
                            placeholder="14"
                          />
                        </div>
                        <div>
                          <label className="label">サプライヤー信頼性 (%)</label>
                          <input 
                            type="number" 
                            className="input" 
                            value={aiSettings.supplierReliability}
                            onChange={(e) => setAiSettings({ ...aiSettings, supplierReliability: parseInt(e.target.value) })}
                            placeholder="95"
                            min="0"
                            max="100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAIModal(false)}
                      className="btn-secondary"
                      disabled={isAILoading}
                    >
                      キャンセル
                    </button>
                    <button 
                      onClick={handleAIExecute} 
                      className="btn-primary"
                      disabled={isAILoading}
                    >
                      {isAILoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          AI予測実行中...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          AI予測実行
                        </>
                      )}
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

