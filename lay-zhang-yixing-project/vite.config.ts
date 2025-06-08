import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: { 
    alias: { 
      '@': '/src' 
    } 
  },

  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },

  server: {
    port: 3004,
    strictPort: true,        // <<< 端口被占直接报错，不自动递增
    hmr: { 
      protocol: 'ws', 
      host: 'localhost', 
      port: 3004,
      overlay: false 
    },
    open: true
  }
}) 