import React from 'react'
import { motion } from 'framer-motion'
import { 
  Menu, 
  Bell, 
  User, 
  Search,
  Sun,
  Moon
} from 'lucide-react'

interface NavbarProps {
  onMenuClick: () => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, darkMode, onToggleDarkMode }) => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-secondary-200 bg-white/80 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8"
    >
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-secondary-700 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">メニューを開く</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-secondary-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Search */}
        <div className="relative flex flex-1 items-center">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-secondary-400" />
            <input
              className="block h-full w-full border-0 py-0 pl-8 pr-0 text-secondary-900 placeholder:text-secondary-400 focus:ring-0 sm:text-sm bg-transparent"
              placeholder="検索..."
              type="search"
              name="search"
            />
          </div>
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Dark mode toggle */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-secondary-400 hover:text-secondary-600"
            onClick={onToggleDarkMode}
          >
            <span className="sr-only">ダークモード切り替え</span>
            {darkMode ? (
              <Sun className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Moon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-secondary-400 hover:text-secondary-600 relative"
          >
            <span className="sr-only">通知を表示</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-danger-500 text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-secondary-200" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              className="-m-1.5 flex items-center p-1.5"
            >
              <span className="sr-only">プロフィールメニューを開く</span>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-secondary-900">管理者</p>
                  <p className="text-xs text-secondary-500">admin@company.com</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
