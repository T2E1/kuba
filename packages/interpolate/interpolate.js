const resolve = (data, path) =>
  path.split('.').reduce((value, key) => value?.[key], data)

/**
 * Replaces `{path.to.value}` placeholders in `text` with values read from
 * `data`. An empty placeholder (`{}`) is replaced with `data` itself.
 * A path that resolves to `null`/`undefined` (including a missing
 * intermediate segment) is replaced with an empty string rather than the
 * literal `"undefined"`.
 */
const interpolate = (text, data) =>
  text.replace(/\{(.*?)\}/g, (_, path) =>
    path === '' ? data : (resolve(data, path) ?? ''),
  )

export default interpolate
