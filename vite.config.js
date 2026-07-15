import { resolve } from 'node:path'
import terser from '@rollup/plugin-terser'
import { defineConfig } from 'vite'

const r = (p) => resolve(__dirname, p)

const aliases = {
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
}

const minify = terser({ format: { comments: false } })

export default defineConfig({
  resolve: { alias: aliases },
  build: {
    lib: {
      entry: {
        kuba: r('index.js'),
        cookie: r('packages/cookie/index.js'),
        directive: r('packages/directive/index.js'),
        dom: r('packages/dom/index.js'),
        echo: r('packages/echo/index.js'),
        event: r('packages/event/index.js'),
        middleware: r('packages/middleware/index.js'),
        mixin: r('packages/mixin/index.js'),
        polyfill: r('packages/polyfill/index.js'),
        renderer: r('packages/renderer/index.js'),
        result: r('packages/result/index.js'),
        router: r('packages/router/index.js'),
        spark: r('packages/spark/index.js'),
        storage: r('packages/storage/index.js'),
      },
      formats: ['es', 'cjs'],
    },
    minify: false,
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        exports: 'named',
      },
      plugins: [minify],
    },
  },
})
