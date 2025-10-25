import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  color: string
  bgColor: string
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  bgColor
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-success-600 bg-success-50'
      case 'negative':
        return 'text-danger-600 bg-danger-50'
      default:
        return 'text-secondary-600 bg-secondary-50'
    }
  }

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return '↗'
      case 'negative':
        return '↘'
      default:
        return '→'
    }
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="card hover:shadow-medium transition-all duration-300"
    >
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-secondary-600">{title}</p>
            <p className="text-2xl font-bold text-secondary-900 mt-1">{value}</p>
            <div className="flex items-center mt-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getChangeColor()}`}>
                <span className="mr-1">{getChangeIcon()}</span>
                {change}
              </span>
              <span className="text-xs text-secondary-500 ml-2">前月比</span>
            </div>
          </div>
          <div className={`p-3 rounded-xl ${bgColor}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default StatsCard
