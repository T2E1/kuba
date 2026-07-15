import fallback from './fallback'
import listeners from './listeners'

const matching = () => {
  return (
    listeners.find(({ path }) => {
      if (!path) return false
      const rule = path.replace(/:\w+/g, '([a-z0-9-_]+)')
      const pattern = new RegExp(`^${rule}$`, 'i')
      return pattern.test(globalThis.location.pathname)
    }) ?? fallback
  )
}

export default matching
