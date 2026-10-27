import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      // Setiap request yang dimulai dengan /api akan diteruskan ke target
      '/api': {
        target: 'http://localhost:8000', // Alamat server backend Anda
        changeOrigin: true,             // Mengubah header 'origin' ke URL target
        // rewrite: (path) => path.replace(/^\/api/, ''), // Opsional: Hapus kata '/api' di awal
      },
    },
  },
})