import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    open: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/assets/base.css";`
      }
    }
  }
})