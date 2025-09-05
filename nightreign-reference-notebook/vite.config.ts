import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: (process.env.VERCEL === '1' || process.env.VERCEL === 'true') ? '/' : '/NightreignQuickRef/',
  plugins: [
    react()
  ],
  // GitHub Pages部署路径
  define: {
    // 在构建时注入部署时间
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  build: {
    // 启用 Tree Shaking
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 React 相关库分离
          'react-vendor': ['react', 'react-dom'],
          // 将 Ant Design 相关库分离
          'antd-vendor': ['antd', '@ant-design/colors', '@ant-design/plots'],
          // 将工具库分离
          'utils-vendor': ['lodash']
        },
        // 优化 chunk 文件名，便于缓存
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    // 增加警告阈值，避免误报
    chunkSizeWarningLimit: 2300,
    // 启用压缩
    minify: 'terser',
    // 启用源码映射（开发时）
    sourcemap: false,
    // 设置目标环境
    target: 'es2015'
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['react', 'react-dom', 'antd', 'lodash'],
    // 强制预构建
    force: false
  },
  // 开发服务器优化
  server: {
    // 启用热更新
    hmr: true
  }
})
