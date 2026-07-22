import { resolve } from 'node:path'

const r = (p) => resolve(import.meta.dirname, p)

/**
 * Path aliases shared between the library build (`vite.config.js`) and the
 * Storybook build (`.storybook/main.js`), so both resolve `@behavior`,
 * `@component`, etc. the same way without duplicating the map.
 */
const aliases = {
  '@behavior': r('packages/behavior'),
  '@component': r('packages/component'),
  '@data': r('packages/data'),
  '@form': r('packages/form'),
  '@layout': r('packages/layout'),
  '@cookie': r('packages/cookie'),
  '@http': r('packages/http/index.js'),
  '@directive': r('packages/directive'),
  '@dom': r('packages/dom'),
  '@echo': r('packages/echo'),
  '@event': r('packages/event'),
  '@interpolate': r('packages/interpolate/index.js'),
  '@middleware': r('packages/middleware'),
  '@mixin': r('packages/mixin'),
  '@pixel': r('packages/pixel'),
  '@polyfill': r('packages/polyfill'),
  '@renderer': r('packages/renderer'),
  '@result': r('packages/result'),
  '@router': r('packages/router'),
  '@spark': r('packages/spark'),
  '@typography': r('packages/typography'),
}

export default aliases
