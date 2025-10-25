import React from 'react'
import { motion } from 'framer-motion'
import { Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'success',
      title: '生産計画 #P-2024-001 完了',
      description: 'スマートフォン生産計画が予定通り完了しました',
      time: '2分前',
      icon: CheckCircle
    },
    {
      id: 2,
      type: 'warning',
      title: '在庫アラート',
      description: '液晶ディスプレイの在庫が最低レベルを下回りました',
      time: '15分前',
      icon: AlertTriangle
    },
    {
      id: 3,
      type: 'info',
      title: '品質検査開始',
      description: 'バッチ #Q-2024-003 の品質検査が開始されました',
      time: '1時間前',
      icon: Clock
    },
    {
      id: 4,
      type: 'error',
      title: '工程遅延',
      description: '組み立て工程で30分の遅延が発生しています',
      time: '2時間前',
      icon: XCircle
    },
    {
      id: 5,
      type: 'success',
      title: '原価分析完了',
      description: '今月の原価分析レポートが生成されました',
      time: '3時間前',
      icon: CheckCircle
    }
  ]

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-success-600 bg-success-50'
      case 'warning':
        return 'text-warning-600 bg-warning-50'
      case 'error':
        return 'text-danger-600 bg-danger-50'
      default:
        return 'text-primary-600 bg-primary-50'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="card-header">
        <h3 className="text-lg font-semibold text-secondary-900">最近のアクティビティ</h3>
        <p className="text-sm text-secondary-600">システム内の最新の活動</p>
      </div>
      <div className="card-body p-0">
        <div className="divide-y divide-secondary-200">
          {activities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start p-4 hover:bg-secondary-50 transition-colors duration-200"
              >
                <div className={`flex-shrink-0 p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-900">{activity.title}</p>
                  <p className="text-sm text-secondary-600 mt-1">{activity.description}</p>
                  <p className="text-xs text-secondary-500 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
      <div className="card-footer">
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          すべてのアクティビティを表示
        </button>
      </div>
    </motion.div>
  )
}

export default RecentActivity

