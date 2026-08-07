import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'
import { aliases } from './vite.config.js'

export default defineConfig({
  resolve: { alias: aliases },
  test: {
    // A real browser, not jsdom: these components depend on ElementInternals,
    // custom states (:state()), adoptedStyleSheets, delegatesFocus and the
    // requestAnimationFrame that @paint defers the first render to. A DOM
    // emulation either lacks those or fakes them well enough to make a passing
    // test prove nothing.
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
    include: ['packages/**/*.test.js'],
    setupFiles: ['./vitest.setup.js'],
  },
})
