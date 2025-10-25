import React from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { 
  BarChart3, 
  Calendar, 
  Package, 
  Settings, 
  CheckCircle, 
  DollarSign, 
  TrendingUp,
  Menu,
  X
} from 'lucide-react'

interface SidebarProps {
  onClose?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation()
  const [isOpen, setIsOpen] = React.useState(false)

  const navigation = [
    { name: 'ダッシュボード', href: '/', icon: BarChart3 },
    { name: '生産計画', href: '/production-planning', icon: Calendar },
    { name: '在庫管理', href: '/inventory', icon: Package },
    { name: '工程管理', href: '/process', icon: Settings },
    { name: '品質管理', href: '/quality', icon: CheckCircle },
    { name: '原価管理', href: '/cost', icon: DollarSign },
    { name: '需要予測', href: '/demand', icon: TrendingUp },
  ]

  const handleLinkClick = () => {
    setIsOpen(false)
    onClose?.()
  }

  return (
    <>
      {/* モバイルメニューボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden glass-effect p-3 rounded-xl text-gray-700 hover:bg-white/30 transition-all duration-300"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* サイドバー */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`fixed left-0 top-0 h-full w-80 glass-effect z-40 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* ロゴエリア */}
          <div className="p-8 border-b border-white/20">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 gradient-bg-primary rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">生産管理システム</h1>
              <p className="text-sm text-gray-600 mt-1">Production Control</p>
            </motion.div>
          </div>

          {/* ナビゲーション */}
          <nav className="flex-1 px-6 py-8" role="navigation" aria-label="メインナビゲーション">
            <ul className="space-y-2">
              {navigation.map((item, index) => {
                const isActive = location.pathname === item.href
                return (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link
                      to={item.href}
                      onClick={handleLinkClick}
                      className={`group flex items-center px-4 py-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'gradient-bg-primary text-white shadow-lg shadow-blue-500/25'
                          : 'text-gray-700 hover:bg-white/20 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 mr-3 transition-transform duration-300 ${
                        isActive ? 'scale-110' : 'group-hover:scale-110'
                      }`} />
                      {item.name}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="ml-auto w-2 h-2 bg-white rounded-full"
                        />
                      )}
                    </Link>
                  </motion.li>
                )
              })}
            </ul>
          </nav>

          {/* フッター */}
          <div className="p-6 border-t border-white/20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center text-sm text-gray-600"
            >
              <p className="font-semibold">Version 1.0.0</p>
              <p className="mt-1">© 2024 Production Control System</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* オーバーレイ */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </>
  )
}

export default Sidebar