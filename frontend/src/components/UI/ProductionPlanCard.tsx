import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Target, Users, Clock, MoreVertical, Edit, Trash2, Eye } from 'lucide-react'

interface ProductionPlan {
  id: string
  name: string
  product: string
  quantity: number
  startDate: string
  endDate: string
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
  progress: number
  priority: 'low' | 'medium' | 'high'
}

interface ProductionPlanCardProps {
  plan: ProductionPlan
}

const ProductionPlanCard: React.FC<ProductionPlanCardProps> = ({ plan }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-secondary-100 text-secondary-800'
      case 'in_progress':
        return 'bg-primary-100 text-primary-800'
      case 'completed':
        return 'bg-success-100 text-success-800'
      case 'cancelled':
        return 'bg-danger-100 text-danger-800'
      default:
        return 'bg-secondary-100 text-secondary-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-danger-100 text-danger-800'
      case 'medium':
        return 'bg-warning-100 text-warning-800'
      case 'low':
        return 'bg-success-100 text-success-800'
      default:
        return 'bg-secondary-100 text-secondary-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planned':
        return '計画済み'
      case 'in_progress':
        return '進行中'
      case 'completed':
        return '完了'
      case 'cancelled':
        return 'キャンセル'
      default:
        return status
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return '高'
      case 'medium':
        return '中'
      case 'low':
        return '低'
      default:
        return priority
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="card hover:shadow-medium transition-all duration-300"
    >
      <div className="card-body">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-secondary-900 mb-1">{plan.name}</h3>
            <p className="text-sm text-secondary-600">{plan.product}</p>
            <p className="text-xs text-secondary-500 font-mono mt-1">{plan.id}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`badge ${getStatusColor(plan.status)}`}>
              {getStatusText(plan.status)}
            </span>
            <span className={`badge ${getPriorityColor(plan.priority)}`}>
              {getPriorityText(plan.priority)}
            </span>
            <button className="p-1 rounded-md hover:bg-secondary-100 text-secondary-400 hover:text-secondary-600">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-700">進捗</span>
            <span className="text-sm text-secondary-600">{plan.progress}%</span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${plan.progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-primary-600 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-secondary-400" />
            <div>
              <p className="text-xs text-secondary-500">数量</p>
              <p className="text-sm font-medium text-secondary-900">{plan.quantity.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-secondary-400" />
            <div>
              <p className="text-xs text-secondary-500">期間</p>
              <p className="text-sm font-medium text-secondary-900">
                {Math.ceil((new Date(plan.endDate).getTime() - new Date(plan.startDate).getTime()) / (1000 * 60 * 60 * 24))}日
              </p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-secondary-400" />
            <div className="flex-1">
              <p className="text-xs text-secondary-500">開始日</p>
              <p className="text-sm font-medium text-secondary-900">
                {new Date(plan.startDate).toLocaleDateString('ja-JP')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-secondary-400" />
            <div className="flex-1">
              <p className="text-xs text-secondary-500">終了日</p>
              <p className="text-sm font-medium text-secondary-900">
                {new Date(plan.endDate).toLocaleDateString('ja-JP')}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-4 border-t border-secondary-200">
          <button className="flex-1 btn-secondary text-xs py-2">
            <Eye className="h-3 w-3 mr-1" />
            詳細
          </button>
          <button className="flex-1 btn-primary text-xs py-2">
            <Edit className="h-3 w-3 mr-1" />
            編集
          </button>
          <button className="p-2 text-danger-400 hover:text-danger-600 hover:bg-danger-50 rounded-md transition-colors duration-200">
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductionPlanCard
