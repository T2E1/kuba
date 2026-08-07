import { vi } from 'vitest'
import { userEvent } from 'vitest/browser'

/** Renders `markup` into the document and returns it, for querying. */
export function mount(markup) {
  document.body.innerHTML = markup
  return document.body
}

/**
 * Resolves an element inside `host`'s shadow root. `@paint` (see
 * packages/dom/paint/render.js) defers the first shadow DOM write to a
 * requestAnimationFrame, so nothing is there when a test starts.
 */
export function inner(host, selector) {
  return vi.waitFor(() => {
    const found = host.shadowRoot?.querySelector(selector)
    if (!found) throw new Error(`no ${selector} in ${host.localName}`)
    return found
  })
}

/**
 * Clicks a component's own inner control. Listeners registered by `@on` live on
 * `shadowRoot` and only see events originating inside it (see
 * packages/event/listen.js), so clicking the host itself is a no-op.
 */
export async function clickInner(host, selector = 'button') {
  await userEvent.click(await inner(host, selector))
}
