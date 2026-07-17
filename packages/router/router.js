import fallback from './fallback'
import handle from './handle'
import listeners from './listeners'

/**
 * Registers a route (`path`/`page` pair) and returns itself, so calls can be
 * chained: `router('/a', pageA)('/b', pageB)`.
 */
function router(path, page) {
  listeners.push({ path, page })
  return router
}

// Exposes fallback/handle as properties of the same callable so consumers can
// do `import router from './router'` and reach `router.fallback`/`router.handle`
// without a separate import.
Object.assign(router, {
  router,
  fallback,
  handle,
})

export default router
