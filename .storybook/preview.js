import '../packages/pixel/index.css'
import '../index.js'

/** @type {import('@storybook/web-components-vite').Preview} */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
      },
    },
    // Storybook's AUTO source mode falls back to DYNAMIC for any story that
    // uses `args` — DYNAMIC is documented as "currently React only" and, for
    // this web-components renderer, captures a live-DOM snapshot instead of
    // the actual source. Since our `render` functions return real markup
    // (some hand-escaped for prose display), that snapshot gets HTML-escaped
    // a second time before reaching the "Show code" panel. Forcing CODE
    // sidesteps that, but CODE's default `originalSource` is the literal
    // text of the *story export* (e.g. `export const Primary = {}` yields
    // the source `"{}"`), not the rendered markup, since every story here
    // relies on the meta-level `render` instead of declaring its own. The
    // `transform` re-derives the real markup by calling that same `render`
    // (exposed as `originalStoryFn`) with the story's current args.
    docs: {
      source: {
        type: 'code',
        transform: (_code, { originalStoryFn, args }) => originalStoryFn(args),
      },
    },
  },
}

export default preview
