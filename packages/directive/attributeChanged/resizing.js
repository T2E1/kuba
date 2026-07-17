/**
 * Filter for `attributeChanged`: normalizes a `resizing` attribute value
 * into a CSS size — pass-through numeric px/% values, `"hug"` becomes
 * `"auto"`, `"fill"` becomes `"100%"`, anything else defaults to `"auto"`.
 */
function resizing(value) {
  if (/^[0-9]+(%|px)$/.test(value)) return value
  if (/^hug$/i.test(value)) return 'auto'
  if (/^fill$/i.test(value)) return '100%'
  return 'auto'
}

export default resizing
