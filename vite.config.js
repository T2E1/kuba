import { resolve } from 'node:path'
import terser from '@rollup/plugin-terser'
import { defineConfig } from 'vite'

const r = (p) => resolve(__dirname, p)

export default defineConfig({
  resolve: {
    alias: {
      '@behavior': r('packages/behavior'),
      '@component': r('packages/component'),
      '@data': r('packages/data'),
      '@form': r('packages/form'),
      '@layout': r('packages/layout'),
      '@cookie': r('packages/cookie'),
      '@directive': r('packages/directive'),
      '@dom': r('packages/dom'),
      '@echo': r('packages/echo'),
      '@event': r('packages/event'),
      '@middleware': r('packages/middleware'),
      '@mixin': r('packages/mixin'),
      '@pixel': r('packages/pixel'),
      '@polyfill': r('packages/polyfill'),
      '@renderer': r('packages/renderer'),
      '@result': r('packages/result'),
      '@router': r('packages/router'),
      '@spark': r('packages/spark'),
      '@storage': r('packages/storage/index.js'),
    },
  },
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
      output: {
        exports: 'named',
      },
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
