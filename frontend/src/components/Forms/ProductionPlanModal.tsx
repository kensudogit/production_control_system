import React from 'react'
import { motion } from 'framer-motion'

interface ProductionPlanModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (plan: any) => void
  plan?: any
}

const ProductionPlanModal: React.FC<ProductionPlanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  plan
}) => {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">生産計画</h2>
        <p className="text-gray-600">モーダルコンテンツ</p>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            キャンセル
          </button>
          <button
            onClick={() => onSave(plan)}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            保存
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProductionPlanModal

