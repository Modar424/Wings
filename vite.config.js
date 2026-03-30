import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://hosting-wings.onrender.com',
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: 'localhost',
      },
      '/auth': {
        target: 'https://hosting-wings.onrender.com',
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: 'localhost',
      },
    },
  },
})
