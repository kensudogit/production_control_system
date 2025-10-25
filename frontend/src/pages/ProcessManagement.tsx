import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Settings, 
  Play, 
  Pause, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Users,
  TrendingUp,
  BarChart3,
  Zap,
  X,
  Plus,
  FileText
} from 'lucide-react'

const ProcessManagement: React.FC = () => {
  const [showProcessSettingsModal, setShowProcessSettingsModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [newProcess, setNewProcess] = useState({
    name: '',
    workers: '',
    estimatedDuration: '',
    priority: 'medium'
  })

  const processData = [
    { 
      id: 'PROC-001', 
      name: '製品A組立工程', 
      status: 'running', 
      progress: 75, 
      workers: 8, 
      efficiency: 92.5, 
      startTime: '08:00', 
      estimatedEnd: '16:00',
      currentStep: '組立作業',
      nextStep: '品質検査'
    },
    { 
      id: 'PROC-002', 
      name: '製品B塗装工程', 
      status: 'paused', 
      progress: 45, 
      workers: 5, 
      efficiency: 88.2, 
      startTime: '09:30', 
      estimatedEnd: '17:30',
      currentStep: '下地処理',
      nextStep: '塗装作業'
    },
    { 
      id: 'PROC-003', 
      name: '製品C検査工程', 
      status: 'completed', 
      progress: 100, 
      workers: 3, 
      efficiency: 95.8, 
      startTime: '10:00', 
      estimatedEnd: '14:00',
      currentStep: '完了',
      nextStep: '出荷準備'
    },
    { 
      id: 'PROC-004', 
      name: '製品D包装工程', 
      status: 'scheduled', 
      progress: 0, 
      workers: 6, 
      efficiency: 0, 
      startTime: '13:00', 
      estimatedEnd: '18:00',
      currentStep: '待機中',
      nextStep: '包装作業'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-success-600 bg-success-50'
      case 'paused': return 'text-warning-600 bg-warning-50'
      case 'completed': return 'text-primary-600 bg-primary-50'
      case 'scheduled': return 'text-secondary-600 bg-secondary-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return '実行中'
      case 'paused': return '一時停止'
      case 'completed': return '完了'
      case 'scheduled': return '予定'
      default: return '不明'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="w-4 h-4" />
      case 'paused': return <Pause className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'scheduled': return <Clock className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const handleProcessSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('工程設定保存:', newProcess)
    setShowProcessSettingsModal(false)
    setNewProcess({ name: '', workers: '', estimatedDuration: '', priority: 'medium' })
  }

  const handleReportGenerate = () => {
    console.log('レポート生成')
    setShowReportModal(false)
  }

  return (
    <div className="min-h-screen gradient-bg-light">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 p-6"
      >
        {/* ヘッダー */}
        <div className="card-gradient-primary">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white">工程管理</h1>
                <p className="text-white/80 mt-2 text-lg">生産工程の監視と制御</p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowProcessSettingsModal(true)}
                  className="btn-secondary"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  工程設定
                </button>
                <button 
                  onClick={() => setShowReportModal(true)}
                  className="btn-secondary"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  レポート
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
            className="card-gradient-success"
          >
            <div className="card-body">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/80">実行中工程</p>
                  <p className="text-2xl font-bold text-white">3</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card-gradient-warning"
          >
            <div className="card-body">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Pause className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/80">一時停止</p>
                  <p className="text-2xl font-bold text-white">1</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="card-gradient-primary"
          >
            <div className="card-body">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/80">稼働人数</p>
                  <p className="text-2xl font-bold text-white">22</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="card-gradient-secondary"
          >
            <div className="card-body">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/80">平均効率</p>
                  <p className="text-2xl font-bold text-white">91.2%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 工程一覧 */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-800">工程一覧</h3>
          </div>
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>工程ID</th>
                    <th>工程名</th>
                    <th>ステータス</th>
                    <th>進捗</th>
                    <th>作業員数</th>
                    <th>効率</th>
                    <th>開始時間</th>
                    <th>予定終了</th>
                    <th>現在のステップ</th>
                    <th>次のステップ</th>
                    <th>アクション</th>
                  </tr>
                </thead>
                <tbody>
                  {processData.map((process, index) => (
                    <motion.tr
                      key={process.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <td className="font-mono text-sm">{process.id}</td>
                      <td className="font-medium">{process.name}</td>
                      <td>
                        <span className={`badge ${getStatusColor(process.status)} flex items-center`}>
                          {getStatusIcon(process.status)}
                          <span className="ml-1">{getStatusText(process.status)}</span>
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${process.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{process.progress}%</span>
                        </div>
                      </td>
                      <td className="font-semibold">{process.workers}人</td>
                      <td className="font-semibold">{process.efficiency}%</td>
                      <td className="font-mono text-sm">{process.startTime}</td>
                      <td className="font-mono text-sm">{process.estimatedEnd}</td>
                      <td className="text-sm">{process.currentStep}</td>
                      <td className="text-sm">{process.nextStep}</td>
                      <td>
                        <div className="flex space-x-2">
                          {process.status === 'running' && (
                            <button className="btn-sm btn-warning">
                              <Pause className="w-3 h-3 mr-1" />
                              停止
                            </button>
                          )}
                          {process.status === 'paused' && (
                            <button className="btn-sm btn-success">
                              <Play className="w-3 h-3 mr-1" />
                              再開
                            </button>
                          )}
                          {process.status === 'scheduled' && (
                            <button className="btn-sm btn-primary">
                              <Play className="w-3 h-3 mr-1" />
                              開始
                            </button>
                          )}
                          <button className="btn-sm btn-secondary">
                            <Settings className="w-3 h-3 mr-1" />
                            設定
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

        {/* 工程フロー図 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-800">工程フロー</h3>
            </div>
            <div className="card-body">
              <div className="h-64 flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="text-center">
                  <Zap className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <p className="text-gray-600">工程フロー図</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-800">効率トレンド</h3>
            </div>
            <div className="card-body">
              <div className="h-64 flex items-center justify-center bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-success-600 mx-auto mb-4" />
                  <p className="text-gray-600">効率トレンドチャート</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 工程設定モーダル */}
      <AnimatePresence>
        {showProcessSettingsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowProcessSettingsModal(false)}
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
                  <h3 className="text-lg font-semibold text-gray-800">工程設定</h3>
                  <button
                    onClick={() => setShowProcessSettingsModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleProcessSettingsSubmit} className="card-body">
                <div className="space-y-4">
                  <div>
                    <label className="label">工程名</label>
                    <input
                      type="text"
                      className="input"
                      value={newProcess.name}
                      onChange={(e) => setNewProcess({ ...newProcess, name: e.target.value })}
                      placeholder="工程名を入力"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">作業員数</label>
                    <input
                      type="number"
                      className="input"
                      value={newProcess.workers}
                      onChange={(e) => setNewProcess({ ...newProcess, workers: e.target.value })}
                      placeholder="作業員数"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">予定時間（時間）</label>
                    <input
                      type="number"
                      className="input"
                      value={newProcess.estimatedDuration}
                      onChange={(e) => setNewProcess({ ...newProcess, estimatedDuration: e.target.value })}
                      placeholder="予定時間"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">優先度</label>
                    <select
                      className="input"
                      value={newProcess.priority}
                      onChange={(e) => setNewProcess({ ...newProcess, priority: e.target.value })}
                    >
                      <option value="low">低</option>
                      <option value="medium">中</option>
                      <option value="high">高</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowProcessSettingsModal(false)}
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
                  <h3 className="text-lg font-semibold text-gray-800">工程レポート</h3>
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
                      <option value="today">今日</option>
                      <option value="week">今週</option>
                      <option value="month">今月</option>
                      <option value="quarter">四半期</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">レポート形式</label>
                    <select className="input">
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                      <option value="csv">CSV</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">含める項目</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        工程効率
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        作業員稼働状況
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        進捗状況
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        詳細ログ
                      </label>
                    </div>
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
                  <button
                    onClick={handleReportGenerate}
                    className="btn-primary"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    レポート生成
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProcessManagement

