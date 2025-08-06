import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/NightreignQuickRef/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 React 相关库分离
          'react-vendor': ['react', 'react-dom'],
          // 将 Ant Design 相关库分离
          'antd-vendor': ['antd', '@ant-design/colors', '@ant-design/plots'],
          // 将工具库分离
          'utils-vendor': ['lodash']
        }
      }
    },
    // 增加警告阈值，避免误报
    chunkSizeWarningLimit: 2500
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['react', 'react-dom', 'antd', 'lodash']
  }
})
