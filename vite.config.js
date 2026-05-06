import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/dash-api': {
        target: 'https://dash-api.learningbrands.cloud',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/dash-api/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main:      resolve(__dirname, 'index.html'),
        prevendas: resolve(__dirname, 'prevendas.html'),
        vendas:    resolve(__dirname, 'vendas.html'),
      },
    },
  },
})
