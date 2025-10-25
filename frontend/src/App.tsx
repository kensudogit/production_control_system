import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import ProductionPlanning from './pages/ProductionPlanning'
import InventoryManagement from './pages/InventoryManagement'
import ProcessManagement from './pages/ProcessManagement'
import QualityManagement from './pages/QualityManagement'
import CostManagement from './pages/CostManagement'
import DemandForecasting from './pages/DemandForecasting'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
          <Layout>
            <AnimatePresence mode="wait">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <Dashboard />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/production-planning" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <ProductionPlanning />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/inventory" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <InventoryManagement />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/process" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <ProcessManagement />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/quality" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <QualityManagement />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/cost" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <CostManagement />
                    </motion.div>
                  } 
                />
                <Route 
                  path="/demand" 
                  element={
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <DemandForecasting />
                    </motion.div>
                  } 
                />
              </Routes>
            </AnimatePresence>
          </Layout>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
