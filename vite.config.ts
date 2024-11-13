import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // TanStackRouterVite()
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
