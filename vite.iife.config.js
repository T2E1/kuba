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
      entry: r('index.js'),
      fileName: 'kuba',
      formats: ['iife'],
      name: 'kuba',
    },
    minify: false,
    outDir: 'dist',
    emptyOutDir: false,
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
