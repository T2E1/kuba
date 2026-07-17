/**
 * Replaces `{path}` placeholders in `text` with values read from `data` via
 * dot-path lookup (`{}` yields `data` itself). Uses `new Function` to
 * evaluate the path expression, so `data` must be trusted, non-user-supplied
 * content.
 */
const interpolate = (text, data) =>
  text.replace(/\{(.*?)\}/g, (_, namespace) => {
    if (namespace === '') return data
    return new Function('data', `return data?.${namespace} ?? ''`)(data)
  })

export default interpolate
