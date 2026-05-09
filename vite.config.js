import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/components/ui': path.resolve(__dirname, './src/apps/monitoring/shared/ui'),
      '@monitoring-shared': path.resolve(__dirname, './src/apps/monitoring/shared'),
      '@': path.resolve(__dirname, './src'),
    },
  },
})
 
