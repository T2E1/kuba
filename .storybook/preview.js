import { action } from 'storybook/actions'
import { useEffect } from 'storybook/preview-api'
import '../packages/pixel/index.css'
import '../index.js'

/**
 * Wires `parameters.actions.handles` to the Actions panel by listening on
 * `#storybook-root` — same targeting as Storybook's own (deprecated, still
 * undocumented-replacement) `withActions` decorator from
 * `storybook/actions/decorator`. Reimplemented rather than reused because
 * that one logs the raw event object: every kuba event is a `CustomEvent`
 * whose payload lives in `.detail`, and `.detail` is an inherited
 * accessor, not an own enumerable property, so it's dropped when the
 * event crosses the iframe→manager channel — the panel showed only
 * `isTrusted`/`__className__` stubs, never the actual value. Logging
 * `event.detail` directly keeps the payload intact.
 */
function withDomActions(storyFn, context) {
  const handles = context.parameters?.actions?.handles
  useEffect(() => {
    const root = document.getElementById('storybook-root')
    if (!handles || !root) return undefined

    const listeners = handles.map((eventName) => {
      const handler = (event) => action(eventName)(event.detail)
      root.addEventListener(eventName, handler)
      return { eventName, handler }
    })

    return () =>
      listeners.forEach(({ eventName, handler }) =>
        root.removeEventListener(eventName, handler),
      )
  }, [handles])

  return storyFn()
}

/**
 * Pretty-prints the flat markup string returned by a story's `render`
 * (single line, no whitespace) into indented HTML for the "Show code"
 * panel. An empty element's opening/closing tags (e.g. `<kb-icon
 * use="home"></kb-icon>`) are kept on one line instead of split.
 */
function formatMarkup(html) {
  const tokens = html.match(/<[^>]+>|[^<]+/g) ?? []
  let depth = 0
  const lines = []
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].trim()
    if (!token) continue
    const isClosing = token.startsWith('</')
    const isSelfClosing = token.endsWith('/>')
    const isOpening = /^<[a-zA-Z]/.test(token) && !isClosing && !isSelfClosing
    const nextToken = tokens[i + 1]?.trim()
    const collapsesWithNext = isOpening && nextToken?.startsWith('</')
    if (isClosing) depth = Math.max(depth - 1, 0)
    let line = '  '.repeat(depth) + token
    if (collapsesWithNext) {
      line += nextToken
      i++
    }
    lines.push(line)
    if (isOpening && !collapsesWithNext) depth++
  }
  return lines.join('\n')
}

/** @type {import('@storybook/web-components-vite').Preview} */
const preview = {
  // The Actions panel is a built-in core panel (shows up with no addon
  // registered), but nothing listens for `parameters.actions.handles`
  // event names without a decorator wiring it up — see `withDomActions`.
  decorators: [withDomActions],
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
        transform: (_code, { originalStoryFn, args }) =>
          formatMarkup(originalStoryFn(args)),
      },
    },
  },
}

export default preview
