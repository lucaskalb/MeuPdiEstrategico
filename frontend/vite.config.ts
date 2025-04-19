import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Expõe para todos os IPs
    port: 5173, // Porta padrão do Vite
  }
})
