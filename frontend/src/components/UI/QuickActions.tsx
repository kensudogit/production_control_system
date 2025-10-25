import React from 'react'
import { motion } from 'framer-motion'
import { Plus, TrendingUp, Package, CheckCircle, DollarSign, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'

const QuickActions: React.FC = () => {
  const actions = [
    {
      title: '新規生産計画',
      description: '新しい生産計画を作成',
      icon: Plus,
      href: '/production-planning',
      color: 'bg-primary-500 hover:bg-primary-600'
    },
    {
      title: '在庫確認',
      description: '現在の在庫状況を確認',
      icon: Package,
      href: '/inventory',
      color: 'bg-warning-500 hover:bg-warning-600'
    },
    {
      title: '品質検査',
      description: '品質検査を開始',
      icon: CheckCircle,
      href: '/quality',
      color: 'bg-success-500 hover:bg-success-600'
    },
    {
      title: '原価分析',
      description: '原価分析レポートを生成',
      icon: DollarSign,
      href: '/cost',
      color: 'bg-danger-500 hover:bg-danger-600'
    },
    {
      title: '工程設定',
      description: '製造工程を設定',
      icon: Settings,
      href: '/process',
      color: 'bg-secondary-500 hover:bg-secondary-600'
    },
    {
      title: '需要予測',
      description: '需要予測を実行',
      icon: TrendingUp,
      href: '/demand',
      color: 'bg-primary-500 hover:bg-primary-600'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="card-header">
        <h3 className="text-lg font-semibold text-secondary-900">クイックアクション</h3>
        <p className="text-sm text-secondary-600">よく使用される機能</p>
      </div>
      <div className="card-body p-4">
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={action.href}
                  className="flex items-center p-3 rounded-lg border border-secondary-200 hover:border-secondary-300 hover:shadow-sm transition-all duration-200 group"
                >
                  <div className={`p-2 rounded-lg text-white ${action.color} transition-colors duration-200`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-secondary-900 group-hover:text-secondary-700">
                      {action.title}
                    </p>
                    <p className="text-xs text-secondary-500">{action.description}</p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

export default QuickActions

