import router from './router'

/**
 * Makes programmatic `history.pushState()` calls trigger route handling.
 *
 * The browser does not fire `popstate` for `pushState`, so this wraps
 * `history.pushState` in a `Proxy` that dispatches a synthetic `pushstate`
 * event after delegating to the original implementation, then listens for
 * that event to invoke `router.handle`.
 */
const pushState = () => {
  history.pushState = new Proxy(history.pushState, {
    apply(original, context, args) {
      original.apply(context, args)
      window.dispatchEvent(new CustomEvent('pushstate'))
    },
  })

  window.addEventListener('pushstate', router.handle)
}

export default pushState
