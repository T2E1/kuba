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
