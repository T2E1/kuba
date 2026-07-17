/**
 * Extracts named `:segment` values from `path` against the current pathname
 * and refreshes them onto this same function object (see `args.js` for why
 * this module mutates itself instead of returning a value).
 *
 * Uses named capture groups (`(?<name>...)`) so extraction stays in sync with
 * the matching rule built in `matching.js`, which uses the equivalent
 * unnamed-group pattern to test for a match.
 */
const params = (path) => {
  if (!path) return

  const rule = path.replace(/:(\w+)/g, '(?<$1>[a-z0-9-_]+)')
  const pattern = new RegExp(`^${rule}$`, 'i')
  const match = globalThis.location.pathname.match(pattern)

  Object.keys(params).forEach((key) => delete params[key])

  if (match?.groups) {
    Object.entries(match.groups).forEach(([key, value]) => {
      Reflect.set(params, key, value)
    })
  }
}

export default params
