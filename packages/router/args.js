/**
 * Refreshes the current query-string arguments onto this same function object.
 *
 * `args` is used as a mutable singleton rather than returning a value: consumers
 * import the function once and read properties off it (e.g. `args.foo`), so the
 * property set here must be cleared and repopulated in place on every navigation
 * instead of replacing the reference.
 */
const args = () => {
  const search = new URLSearchParams(globalThis.location.search).entries()
  Object.keys(args).forEach((key) => delete args[key])
  Array.from(search).forEach(([key, value]) => Reflect.set(args, key, value))
}

export default args
