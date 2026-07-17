// Browsers do not fire any event when history.pushState() is called, unlike
// popstate for back/forward navigation. This wraps pushState to dispatch a
// synthetic 'pushstate' event so listeners can react to programmatic
// navigation the same way they react to popstate.
const originalPushState = history.pushState

Reflect.defineProperty(history, 'pushState', {
  value(state, title, url) {
    const result = originalPushState.apply(this, arguments)
    window.dispatchEvent(
      new CustomEvent('pushstate', { detail: { state, title, url } }),
    )
    return result
  },
})
