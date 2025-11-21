import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './src/manifest.json'

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      input: {
        playground: 'playground.html'
      }
    }
  },
  css: {
    postcss: './postcss.config.js',
  }
})
