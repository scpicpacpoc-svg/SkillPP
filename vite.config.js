import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/smsapi': {
        target: 'https://www.smsadvert.ro',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/smsapi/, '/api'),
      },
    },
  },
})
