import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'terser',
    lib: {
      entry: 'package/index.ts',
      formats: ['es', 'cjs', 'iife'],
      name: 'vi.js',
      fileName: format => `vi.${format}.js`,
    },
  },
})
