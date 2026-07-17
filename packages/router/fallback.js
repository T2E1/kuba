/**
 * Registers the page to run when no listener path matches the current URL.
 *
 * Stores `page`/`path` as properties on this same function so `matching.js` can
 * fall back to it with the same `{ page, path }` shape as a regular listener
 * entry (see `listeners.js`).
 */
const fallback = (page) => {
  fallback.page = page
  fallback.path = globalThis.location.pathname
}

export default fallback
