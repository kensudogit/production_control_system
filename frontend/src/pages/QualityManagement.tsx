import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, TrendingUp, BarChart3, X, Plus, FileText } from 'lucide-react'

const QualityManagement: React.FC = () => {
  const [showInspectionModal, setShowInspectionModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [newInspection, setNewInspection] = useState({
    planId: '',
    inspector: '',
    sampleSize: '',
    inspectionType: 'visual'
  })

  const qualityData = [
    { id: 'QI-001', planId: 'P-2024-001', inspectionDate: '2024-01-15', inspector: '田中太郎', sampleSize: 100, passedQuantity: 98, failedQuantity: 2, result: 'PASS', defectRate: 2.0 },
    { id: 'QI-002', planId: 'P-2024-002', inspectionDate: '2024-01-14', inspector: '佐藤花子', sampleSize: 50, passedQuantity: 45, failedQuantity: 5, result: 'FAIL', defectRate: 10.0 },
    { id: 'QI-003', planId: 'P-2024-003', inspectionDate: '2024-01-13', inspector: '鈴木一郎', sampleSize: 80, passedQuantity: 79, failedQuantity: 1, result: 'PASS', defectRate: 1.25 },
    { id: 'QI-004', planId: 'P-2024-004', inspectionDate: '2024-01-12', inspector: '高橋美咲', sampleSize: 120, passedQuantity: 118, failedQuantity: 2, result: 'PASS', defectRate: 1.67 }
  ]

  const getResultColor = (result: string) => {
    switch (result) {
      case 'PASS': return 'text-success-600 bg-success-50'
      case 'FAIL': return 'text-danger-600 bg-danger-50'
      case 'REVIEW': return 'text-warning-600 bg-warning-50'
      default: return 'text-secondary-600 bg-secondary-50'
    }
  }

  const getResultText = (result: string) => {
    switch (result) {
      case 'PASS': return '合格'
      case 'FAIL': return '不合格'
      case 'REVIEW': return '再検査'
      default: return '不明'
    }
  }

  const handleInspectionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('品質検査登録:', newInspection)
    setShowInspectionModal(false)
    setNewInspection({ planId: '', inspector: '', sampleSize: '', inspectionType: 'visual' })
  }

  const handleReportGenerate = () => {
    console.log('品質レポート生成')
    setShowReportModal(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* ヘッダー */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">品質管理</h1>
            <p className="text-secondary-600 mt-2">品質検査と不良品管理</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowInspectionModal(true)}
              className="btn-primary"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              新規検査
            </button>
            <button 
              onClick={() => setShowReportModal(true)}
              className="btn-secondary"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              レポート
            </button>
          </div>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 bg-success-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">合格率</p>
                <p className="text-2xl font-bold text-secondary-900">96.8%</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 bg-danger-100 rounded-lg">
                <XCircle className="w-6 h-6 text-danger-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">不良品数</p>
                <p className="text-2xl font-bold text-secondary-900">10</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 bg-warning-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">再検査</p>
                <p className="text-2xl font-bold text-secondary-900">3</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">改善率</p>
                <p className="text-2xl font-bold text-secondary-900">+2.3%</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 品質検査一覧テーブル */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-secondary-900">品質検査履歴</h3>
        </div>
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>検査ID</th>
                  <th>計画ID</th>
                  <th>検査日</th>
                  <th>検査員</th>
                  <th>サンプル数</th>
                  <th>合格数</th>
                  <th>不良数</th>
                  <th>不良率</th>
                  <th>結果</th>
                  <th>アクション</th>
                </tr>
              </thead>
              <tbody>
                {qualityData.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <td className="font-mono text-sm">{item.id}</td>
                    <td className="font-mono text-sm">{item.planId}</td>
                    <td>{item.inspectionDate}</td>
                    <td className="font-medium">{item.inspector}</td>
                    <td className="font-semibold">{item.sampleSize}</td>
                    <td className="text-success-600 font-semibold">{item.passedQuantity}</td>
                    <td className="text-danger-600 font-semibold">{item.failedQuantity}</td>
                    <td className="font-semibold">{item.defectRate}%</td>
                    <td>
                      <span className={`badge ${getResultColor(item.result)}`}>
                        {getResultText(item.result)}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button className="btn-sm btn-secondary">詳細</button>
                        <button className="btn-sm btn-primary">再検査</button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 品質トレンドチャート */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900">合格率トレンド</h3>
          </div>
          <div className="card-body">
            <div className="h-64 flex items-center justify-center bg-secondary-50 rounded-lg">
              <p className="text-secondary-500">チャート表示エリア</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900">不良品分析</h3>
          </div>
          <div className="card-body">
            <div className="h-64 flex items-center justify-center bg-secondary-50 rounded-lg">
              <p className="text-secondary-500">チャート表示エリア</p>
            </div>
          </div>
        </div>
      </div>

      {/* 新規検査モーダル */}
      <AnimatePresence>
        {showInspectionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowInspectionModal(false)}
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
                  <h3 className="text-lg font-semibold text-gray-800">新規品質検査</h3>
                  <button
                    onClick={() => setShowInspectionModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleInspectionSubmit} className="card-body">
                <div className="space-y-4">
                  <div>
                    <label className="label">生産計画ID</label>
                    <select
                      className="input"
                      value={newInspection.planId}
                      onChange={(e) => setNewInspection({ ...newInspection, planId: e.target.value })}
                      required
                    >
                      <option value="">計画を選択</option>
                      <option value="P-2024-001">P-2024-001</option>
                      <option value="P-2024-002">P-2024-002</option>
                      <option value="P-2024-003">P-2024-003</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">検査員</label>
                    <input
                      type="text"
                      className="input"
                      value={newInspection.inspector}
                      onChange={(e) => setNewInspection({ ...newInspection, inspector: e.target.value })}
                      placeholder="検査員名を入力"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">サンプル数</label>
                    <input
                      type="number"
                      className="input"
                      value={newInspection.sampleSize}
                      onChange={(e) => setNewInspection({ ...newInspection, sampleSize: e.target.value })}
                      placeholder="サンプル数"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">検査タイプ</label>
                    <select
                      className="input"
                      value={newInspection.inspectionType}
                      onChange={(e) => setNewInspection({ ...newInspection, inspectionType: e.target.value })}
                    >
                      <option value="visual">外観検査</option>
                      <option value="functional">機能検査</option>
                      <option value="dimensional">寸法検査</option>
                      <option value="material">材質検査</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowInspectionModal(false)}
                    className="btn-secondary"
                  >
                    キャンセル
                  </button>
                  <button type="submit" className="btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    検査開始
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
                  <h3 className="text-lg font-semibold text-gray-800">品質レポート生成</h3>
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
                        合格率統計
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        不良品分析
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        検査員別実績
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
    </motion.div>
  )
}

export default QualityManagement