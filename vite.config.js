import { resolve } from 'node:path'
import terser from '@rollup/plugin-terser'
import { defineConfig } from 'vite'
import minifyTemplateLiterals from './plugins/minify-template-literals.js'
import aliases from './vite.aliases.js'

const r = (p) => resolve(__dirname, p)

export default defineConfig({
  plugins: [minifyTemplateLiterals()],
  resolve: {
    alias: aliases,
  },
  build: {
    lib: {
      entry: {
        kuba: r('index.js'),
        cookie: r('packages/cookie/index.js'),
        directive: r('packages/directive/index.js'),
        dom: r('packages/dom/index.js'),
        echo: r('packages/echo/index.js'),
        event: r('packages/event/index.js'),
        interpolate: r('packages/interpolate/index.js'),
        middleware: r('packages/middleware/index.js'),
        mixin: r('packages/mixin/index.js'),
        polyfill: r('packages/polyfill/index.js'),
        renderer: r('packages/renderer/index.js'),
        result: r('packages/result/index.js'),
        router: r('packages/router/index.js'),
        spark: r('packages/spark/index.js'),
        http: r('packages/http/index.js'),
      },
      formats: ['es'],
    },
    minify: false,
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        exports: 'named',
      },
      plugins: [
        terser({
          compress: true,
          mangle: true,
          format: {
            comments: false,
          },
        }),
      ],
    },
  },
})
