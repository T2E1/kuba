/**
 * Replaces `{path.to.value}` placeholders in `text` with values read from
 * `data`. An empty placeholder (`{}`) is replaced with `data` itself.
 * Non-empty placeholders are resolved via a dynamically built property
 * accessor (`new Function`), so `namespace` must come from trusted
 * template text, never from unsanitized user input.
 */
const interpolate = (text, data) =>
  text.replace(/\{(.*?)\}/g, (_, namespace) => {
    if (namespace === '') return data
    return new Function('data', `return data.${namespace}`)(data)
  })

export default interpolate
