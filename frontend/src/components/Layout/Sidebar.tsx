import React from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Package, 
  Settings, 
  CheckCircle, 
  DollarSign, 
  TrendingUp,
  X
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface SidebarProps {
  onClose?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation()

  const navigation = [
    { name: 'ダッシュボード', href: '/', icon: BarChart3, color: 'text-primary-600' },
    { name: '生産計画', href: '/production-planning', icon: TrendingUp, color: 'text-success-600' },
    { name: '在庫管理', href: '/inventory', icon: Package, color: 'text-warning-600' },
    { name: '工程管理', href: '/process', icon: Settings, color: 'text-secondary-600' },
    { name: '品質管理', href: '/quality', icon: CheckCircle, color: 'text-success-600' },
    { name: '原価管理', href: '/cost', icon: DollarSign, color: 'text-danger-600' },
    { name: '需要予測', href: '/demand', icon: TrendingUp, color: 'text-primary-600' },
  ]

  return (
    <div className="flex h-full flex-col bg-white border-r border-secondary-200">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-secondary-200">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="flex items-center space-x-3"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-secondary-900">生産管理システム</h1>
            <p className="text-xs text-secondary-500">Production Control</p>
          </div>
        </motion.div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto rounded-md p-1 text-secondary-400 hover:text-secondary-600 lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item, index) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon

          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.href}
                onClick={onClose}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? item.color : 'text-secondary-400 group-hover:text-secondary-600'}`} />
                <span className="truncate">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto h-2 w-2 rounded-full bg-primary-600"
                  />
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-secondary-200 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-xs text-secondary-500">
            Version 1.0.0
          </p>
          <p className="text-xs text-secondary-400 mt-1">
            © 2024 Production Control System
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Sidebar
