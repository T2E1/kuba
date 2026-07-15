import fallback from './fallback'
import handle from './handle'
import listeners from './listeners'

function router(path, page) {
  listeners.push({ path, page })
  return router
}

Object.assign(router, {
  router,
  fallback,
  handle,
})

export default router
