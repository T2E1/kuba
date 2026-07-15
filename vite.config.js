import { resolve } from 'node:path'
import terser from '@rollup/plugin-terser'
import { defineConfig } from 'vite'

const r = (p) => resolve(__dirname, p)

function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>~+])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim()
}

function minifyCSSTemplateLiterals() {
  return {
    name: 'minify-css-template-literals',
    transform(code, id) {
      if (!/\.(js|ts)$/.test(id)) return null
      const result = code.replace(
        /\bcss`([\s\S]*?)`/g,
        (_, css) => `css\`${minifyCSS(css)}\``,
      )
      return result !== code ? { code: result, map: null } : null
    },
  }
}

export default defineConfig({
  plugins: [minifyCSSTemplateLiterals()],
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
      formats: ['es'],
    },
    minify: false,
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        exports: 'named',
      },
      plugins: [terser({ format: { comments: false } })],
    },
  },
})
