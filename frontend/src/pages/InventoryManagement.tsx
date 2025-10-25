import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, TrendingUp, AlertTriangle, CheckCircle, X, Plus, ShoppingCart } from 'lucide-react'

const InventoryManagement: React.FC = () => {
  const [showNewItemModal, setShowNewItemModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    type: 'material',
    minLevel: '',
    maxLevel: '',
    unitCost: ''
  })

  const inventoryData = [
    { id: 'INV-001', name: '原材料A', type: 'material', quantity: 150, minLevel: 50, maxLevel: 200, unitCost: 1000, status: 'normal' },
    { id: 'INV-002', name: '原材料B', type: 'material', quantity: 25, minLevel: 30, maxLevel: 100, unitCost: 1500, status: 'low' },
    { id: 'INV-003', name: '完成品A', type: 'finished', quantity: 80, minLevel: 20, maxLevel: 150, unitCost: 5000, status: 'normal' },
    { id: 'INV-004', name: '完成品B', type: 'finished', quantity: 5, minLevel: 10, maxLevel: 50, unitCost: 8000, status: 'critical' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-success-600 bg-success-50'
      case 'low': return 'text-warning-600 bg-warning-50'
      case 'critical': return 'text-danger-600 bg-danger-50'
      default: return 'text-secondary-600 bg-secondary-50'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal': return '正常'
      case 'low': return '低在庫'
      case 'critical': return '緊急'
      default: return '不明'
    }
  }

  const handleNewItemSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ここで実際のAPI呼び出しを行う
    console.log('新規アイテム登録:', newItem)
    setShowNewItemModal(false)
    setNewItem({ name: '', type: 'material', minLevel: '', maxLevel: '', unitCost: '' })
  }

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ここで実際の発注処理を行う
    console.log('発注処理実行')
    setShowOrderModal(false)
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
            <h1 className="text-3xl font-bold text-secondary-900">在庫管理</h1>
            <p className="text-secondary-600 mt-2">在庫レベルと発注管理</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowNewItemModal(true)}
              className="btn-primary"
            >
              <Package className="w-4 h-4 mr-2" />
              新規登録
            </button>
            <button 
              onClick={() => setShowOrderModal(true)}
              className="btn-secondary"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              発注管理
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
              <div className="p-3 bg-primary-100 rounded-lg">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">総在庫アイテム</p>
                <p className="text-2xl font-bold text-secondary-900">156</p>
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
              <div className="p-3 bg-warning-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">低在庫警告</p>
                <p className="text-2xl font-bold text-secondary-900">8</p>
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
              <div className="p-3 bg-danger-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-danger-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">緊急在庫</p>
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
              <div className="p-3 bg-success-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">正常在庫</p>
                <p className="text-2xl font-bold text-secondary-900">145</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 在庫一覧テーブル */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-secondary-900">在庫一覧</h3>
        </div>
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>アイテムID</th>
                  <th>アイテム名</th>
                  <th>タイプ</th>
                  <th>在庫数量</th>
                  <th>最小レベル</th>
                  <th>最大レベル</th>
                  <th>単価</th>
                  <th>ステータス</th>
                  <th>アクション</th>
                </tr>
              </thead>
              <tbody>
                {inventoryData.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <td className="font-mono text-sm">{item.id}</td>
                    <td className="font-medium">{item.name}</td>
                    <td>
                      <span className="badge badge-secondary">
                        {item.type === 'material' ? '原材料' : '完成品'}
                      </span>
                    </td>
                    <td className="font-semibold">{item.quantity}</td>
                    <td>{item.minLevel}</td>
                    <td>{item.maxLevel}</td>
                    <td className="font-mono">¥{item.unitCost.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button className="btn-sm btn-secondary">編集</button>
                        <button className="btn-sm btn-primary">発注</button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 新規アイテム登録モーダル */}
      <AnimatePresence>
        {showNewItemModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewItemModal(false)}
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
                  <h3 className="text-lg font-semibold text-gray-800">新規アイテム登録</h3>
                  <button
                    onClick={() => setShowNewItemModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleNewItemSubmit} className="card-body">
                <div className="space-y-4">
                  <div>
                    <label className="label">アイテム名</label>
                    <input
                      type="text"
                      className="input"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="アイテム名を入力"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">タイプ</label>
                    <select
                      className="input"
                      value={newItem.type}
                      onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                    >
                      <option value="material">原材料</option>
                      <option value="finished">完成品</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">最小在庫レベル</label>
                    <input
                      type="number"
                      className="input"
                      value={newItem.minLevel}
                      onChange={(e) => setNewItem({ ...newItem, minLevel: e.target.value })}
                      placeholder="最小在庫レベル"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">最大在庫レベル</label>
                    <input
                      type="number"
                      className="input"
                      value={newItem.maxLevel}
                      onChange={(e) => setNewItem({ ...newItem, maxLevel: e.target.value })}
                      placeholder="最大在庫レベル"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">単価</label>
                    <input
                      type="number"
                      className="input"
                      value={newItem.unitCost}
                      onChange={(e) => setNewItem({ ...newItem, unitCost: e.target.value })}
                      placeholder="単価"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewItemModal(false)}
                    className="btn-secondary"
                  >
                    キャンセル
                  </button>
                  <button type="submit" className="btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    登録
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 発注管理モーダル */}
      <AnimatePresence>
        {showOrderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowOrderModal(false)}
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
                  <h3 className="text-lg font-semibold text-gray-800">発注管理</h3>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleOrderSubmit} className="card-body">
                <div className="space-y-4">
                  <div>
                    <label className="label">発注アイテム</label>
                    <select className="input">
                      <option value="">アイテムを選択</option>
                      {inventoryData.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} (現在: {item.quantity})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">発注数量</label>
                    <input
                      type="number"
                      className="input"
                      placeholder="発注数量"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">希望納期</label>
                    <input
                      type="date"
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">備考</label>
                    <textarea
                      className="input"
                      rows={3}
                      placeholder="備考を入力"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="btn-secondary"
                  >
                    キャンセル
                  </button>
                  <button type="submit" className="btn-primary">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    発注実行
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default InventoryManagement

