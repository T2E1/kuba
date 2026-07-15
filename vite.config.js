import { resolve } from 'node:path'
import terser from '@rollup/plugin-terser'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: {
        kuba: resolve(__dirname, 'index.js'),
        cookie: resolve(__dirname, 'packages/cookie/index.js'),
        directive: resolve(__dirname, 'packages/directive/index.js'),
        dom: resolve(__dirname, 'packages/dom/index.js'),
        echo: resolve(__dirname, 'packages/echo/index.js'),
        event: resolve(__dirname, 'packages/event/index.js'),
        middleware: resolve(__dirname, 'packages/middleware/index.js'),
        mixin: resolve(__dirname, 'packages/mixin/index.js'),
        pixel: resolve(__dirname, 'packages/pixel/index.js'),
        polyfill: resolve(__dirname, 'packages/polyfill/index.js'),
        renderer: resolve(__dirname, 'packages/renderer/index.js'),
        result: resolve(__dirname, 'packages/result/index.js'),
        router: resolve(__dirname, 'packages/router/index.js'),
        spark: resolve(__dirname, 'packages/spark/index.js'),
        storage: resolve(__dirname, 'packages/storage/index.js'),
      },
      formats: ['es', 'cjs'],
    },
    minify: false,
    outDir: 'dist',
    rollupOptions: {
      plugins: [
        terser({
          format: {
            comments: false,
          },
        }),
      ],
    },
    sourcemap: true,
  },
})
