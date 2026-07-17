import fallback from './fallback'
import listeners from './listeners'

/**
 * Finds the first registered listener whose path pattern matches the current
 * pathname, or `fallback` if none matches.
 *
 * A `:name` segment matches one or more of `[a-z0-9-_]` (case-insensitive);
 * segments are otherwise matched literally, so the whole pathname must match
 * end-to-end (`^...$`), not just contain the pattern.
 */
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
