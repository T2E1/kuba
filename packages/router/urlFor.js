import listeners from './listeners'

/**
 * Builds a URL for the listener whose `page` function's `.name` matches
 * `name`, substituting `:key` segments from `params`.
 *
 * A `:key` segment with no matching entry in `params` is left as `:key`
 * rather than throwing, so callers can partially fill a template.
 *
 * @throws {TypeError} If no listener's page has a `.name` matching `name`
 * (destructuring `path` off the `undefined` search result).
 */
const urlFor = (name, params = {}) => {
  const { path } = listeners.find(({ page }) => page?.name === name)

  return path
    ? path.replace(/:(\w+)/g, (_, key) => params[key] ?? `:${key}`)
    : '#'
}

export default urlFor
