import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Vercel最適化プラグイン
    {
      name: 'vercel-optimize',
      configResolved(config) {
        if (config.command === 'build') {
          config.build.rollupOptions = {
            ...config.build.rollupOptions,
            output: {
              ...config.build.rollupOptions?.output,
              manualChunks: {
                vendor: ['react', 'react-dom'],
                router: ['react-router-dom'],
                ui: ['framer-motion', 'lucide-react'],
                charts: ['recharts'],
                utils: ['axios', 'clsx', 'tailwind-merge']
              }
            }
          }
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          charts: ['recharts'],
          utils: ['axios', 'clsx', 'tailwind-merge']
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(css)$/.test(assetInfo.name)) {
            return `assets/css/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  preview: {
    port: 4173,
    strictPort: true
  },
  define: {
    __VERCEL__: JSON.stringify(process.env.VERCEL === '1'),
    __VERCEL_URL__: JSON.stringify(process.env.VERCEL_URL || ''),
  }
})