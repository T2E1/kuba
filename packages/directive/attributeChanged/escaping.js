/**
 * Filter for `attributeChanged`: escapes `&`, `"` and `<` so
 * consumer-supplied text is safe to interpolate into an HTML attribute in a
 * `component.js` template, which does not escape values on its own. Every
 * input has a valid output, so `next` always runs — never a validator that
 * rejects. Passes `null` through unchanged — the attribute was removed,
 * and the getter's own default takes over from there.
 */
function escaping(value, next) {
  if (value == null) return next(value)

  value = value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')

  next(value)
}

export default escaping
