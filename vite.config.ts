import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// ON PRODUCTION, CHANGE THE PROXY FOR THE WEBSITE
export default defineConfig({
  base: '/monty-hall/', // 
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
