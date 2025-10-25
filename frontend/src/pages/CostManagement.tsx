import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  PieChart, 
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle,
  FileText,
  Download,
  Upload,
  X,
  Plus
} from 'lucide-react'

const CostManagement: React.FC = () => {
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [newBudget, setNewBudget] = useState({
    category: 'materials',
    amount: '',
    period: 'monthly'
  })

  const costData = [
    { 
      id: 'COST-001', 
      category: '材料費', 
      budget: 500000, 
      actual: 485000, 
      variance: -15000, 
      variancePercent: -3.0,
      status: 'under'
    },
    { 
      id: 'COST-002', 
      category: '人件費', 
      budget: 300000, 
      actual: 315000, 
      variance: 15000, 
      variancePercent: 5.0,
      status: 'over'
    },
    { 
      id: 'COST-003', 
      category: '設備費', 
      budget: 200000, 
      actual: 195000, 
      variance: -5000, 
      variancePercent: -2.5,
      status: 'under'
    },
    { 
      id: 'COST-004', 
      category: '間接費', 
      budget: 100000, 
      actual: 105000, 
      variance: 5000, 
      variancePercent: 5.0,
      status: 'over'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'under': return 'text-success-600 bg-success-50'
      case 'over': return 'text-danger-600 bg-danger-50'
      case 'on-target': return 'text-primary-600 bg-primary-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'under': return '予算内'
      case 'over': return '予算超過'
      case 'on-target': return '予算通り'
      default: return '不明'
    }
  }

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('予算設定保存:', newBudget)
    setShowBudgetModal(false)
    setNewBudget({ category: 'materials', amount: '', period: 'monthly' })
  }

  const handleReportGenerate = () => {
    console.log('コストレポート生成')
    setShowReportModal(false)
  }

  const handleExport = () => {
    console.log('データエクスポート')
    setShowExportModal(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'under': return <TrendingDown className="w-4 h-4" />
      case 'over': return <TrendingUp className="w-4 h-4" />
      case 'on-target': return <Target className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const totalBudget = costData.reduce((sum, item) => sum + item.budget, 0)
  const totalActual = costData.reduce((sum, item) => sum + item.actual, 0)
  const totalVariance = totalActual - totalBudget
  const totalVariancePercent = (totalVariance / totalBudget) * 100

  return (
    <div className="min-h-screen gradient-bg-light">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 p-6"
      >
        {/* ヘッダー */}
        <div className="card-gradient-danger">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white">原価管理</h1>
                <p className="text-white/80 mt-2 text-lg">コスト分析と予算管理</p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowBudgetModal(true)}
                  className="btn-secondary"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  予算設定
                </button>
                <button 
                  onClick={() => setShowReportModal(true)}
                  className="btn-secondary"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  レポート
                </button>
                <button 
                  onClick={() => setShowExportModal(true)}
                  className="btn-secondary"
                >
                  <Download className="w-5 h-5 mr-2" />
                  エクスポート
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
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/80">総予算</p>
                  <p className="text-2xl font-bold text-white">¥{totalBudget.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card-gradient-secondary"
          >
            <div className="card-body">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/80">実績額</p>
                  <p className="text-2xl font-bold text-white">¥{totalActual.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`${totalVariance >= 0 ? 'card-gradient-danger' : 'card-gradient-success'}`}
          >
            <div className="card-body">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-lg">
                  {totalVariance >= 0 ? (
                    <TrendingUp className="w-6 h-6 text-white" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/80">差異</p>
                  <p className="text-2xl font-bold text-white">
                    {totalVariance >= 0 ? '+' : ''}¥{totalVariance.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className={`${totalVariancePercent >= 0 ? 'card-gradient-warning' : 'card-gradient-success'}`}
          >
            <div className="card-body">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/80">差異率</p>
                  <p className="text-2xl font-bold text-white">
                    {totalVariancePercent >= 0 ? '+' : ''}{totalVariancePercent.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 原価一覧 */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-800">原価分析</h3>
          </div>
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>カテゴリ</th>
                    <th>予算</th>
                    <th>実績</th>
                    <th>差異</th>
                    <th>差異率</th>
                    <th>ステータス</th>
                    <th>進捗</th>
                    <th>アクション</th>
                  </tr>
                </thead>
                <tbody>
                  {costData.map((cost, index) => (
                    <motion.tr
                      key={cost.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <td className="font-medium">{cost.category}</td>
                      <td className="font-mono">¥{cost.budget.toLocaleString()}</td>
                      <td className="font-mono">¥{cost.actual.toLocaleString()}</td>
                      <td className={`font-mono ${cost.variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {cost.variance >= 0 ? '+' : ''}¥{cost.variance.toLocaleString()}
                      </td>
                      <td className={`font-semibold ${cost.variancePercent >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {cost.variancePercent >= 0 ? '+' : ''}{cost.variancePercent}%
                      </td>
                      <td>
                        <span className={`badge ${getStatusColor(cost.status)} flex items-center`}>
                          {getStatusIcon(cost.status)}
                          <span className="ml-1">{getStatusText(cost.status)}</span>
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                cost.variancePercent <= 0 ? 'bg-green-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(Math.abs(cost.variancePercent) * 10, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {Math.min(Math.abs(cost.variancePercent) * 10, 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <button className="btn-sm btn-secondary">
                            <Calculator className="w-3 h-3 mr-1" />
                            詳細
                          </button>
                          <button className="btn-sm btn-primary">
                            <FileText className="w-3 h-3 mr-1" />
                            レポート
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* チャートエリア */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-800">予算 vs 実績</h3>
            </div>
            <div className="card-body">
              <div className="h-64 flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <p className="text-gray-600">予算 vs 実績チャート</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-800">コスト構成</h3>
            </div>
            <div className="card-body">
              <div className="h-64 flex items-center justify-center bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <div className="text-center">
                  <PieChart className="w-12 h-12 text-success-600 mx-auto mb-4" />
                  <p className="text-gray-600">コスト構成円グラフ</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 予算設定フォーム */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-800">予算設定</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">材料費予算</label>
                <input 
                  type="number" 
                  className="input" 
                  placeholder="500000"
                  defaultValue="500000"
                />
              </div>
              <div>
                <label className="label">人件費予算</label>
                <input 
                  type="number" 
                  className="input" 
                  placeholder="300000"
                  defaultValue="300000"
                />
              </div>
              <div>
                <label className="label">設備費予算</label>
                <input 
                  type="number" 
                  className="input" 
                  placeholder="200000"
                  defaultValue="200000"
                />
              </div>
              <div>
                <label className="label">間接費予算</label>
                <input 
                  type="number" 
                  className="input" 
                  placeholder="100000"
                  defaultValue="100000"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button className="btn-secondary">
                <Upload className="w-4 h-4 mr-2" />
                インポート
              </button>
              <button className="btn-primary">
                <CheckCircle className="w-4 h-4 mr-2" />
                保存
              </button>
            </div>
          </div>
        </div>

        {/* 予算設定モーダル */}
        <AnimatePresence>
          {showBudgetModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowBudgetModal(false)}
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
                    <h3 className="text-lg font-semibold text-gray-800">予算設定</h3>
                    <button
                      onClick={() => setShowBudgetModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <form onSubmit={handleBudgetSubmit} className="card-body">
                  <div className="space-y-4">
                    <div>
                      <label className="label">カテゴリ</label>
                      <select
                        className="input"
                        value={newBudget.category}
                        onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                      >
                        <option value="materials">材料費</option>
                        <option value="labor">人件費</option>
                        <option value="equipment">設備費</option>
                        <option value="indirect">間接費</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">予算額</label>
                      <input
                        type="number"
                        className="input"
                        value={newBudget.amount}
                        onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                        placeholder="予算額を入力"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">期間</label>
                      <select
                        className="input"
                        value={newBudget.period}
                        onChange={(e) => setNewBudget({ ...newBudget, period: e.target.value })}
                      >
                        <option value="monthly">月次</option>
                        <option value="quarterly">四半期</option>
                        <option value="yearly">年次</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowBudgetModal(false)}
                      className="btn-secondary"
                    >
                      キャンセル
                    </button>
                    <button type="submit" className="btn-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      保存
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* レポートモーダル */}
        <AnimatePresence>
          {showReportModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowReportModal(false)}
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
                    <h3 className="text-lg font-semibold text-gray-800">コストレポート生成</h3>
                    <button
                      onClick={() => setShowReportModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div>
                      <label className="label">レポート期間</label>
                      <select className="input">
                        <option value="monthly">月次</option>
                        <option value="quarterly">四半期</option>
                        <option value="yearly">年次</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">カテゴリ</label>
                      <select className="input">
                        <option value="all">全てのカテゴリ</option>
                        <option value="materials">材料費</option>
                        <option value="labor">人件費</option>
                        <option value="equipment">設備費</option>
                        <option value="indirect">間接費</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowReportModal(false)}
                      className="btn-secondary"
                    >
                      キャンセル
                    </button>
                    <button onClick={handleReportGenerate} className="btn-primary">
                      <FileText className="w-4 h-4 mr-2" />
                      レポート生成
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* エクスポートモーダル */}
        <AnimatePresence>
          {showExportModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowExportModal(false)}
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
                    <h3 className="text-lg font-semibold text-gray-800">データエクスポート</h3>
                    <button
                      onClick={() => setShowExportModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div>
                      <label className="label">エクスポート形式</label>
                      <select className="input">
                        <option value="csv">CSV</option>
                        <option value="excel">Excel</option>
                        <option value="pdf">PDF</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">対象データ</label>
                      <select className="input">
                        <option value="all">全てのコストデータ</option>
                        <option value="budget">予算データ</option>
                        <option value="actual">実績データ</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowExportModal(false)}
                      className="btn-secondary"
                    >
                      キャンセル
                    </button>
                    <button onClick={handleExport} className="btn-primary">
                      <Download className="w-4 h-4 mr-2" />
                      エクスポート実行
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

export default CostManagement