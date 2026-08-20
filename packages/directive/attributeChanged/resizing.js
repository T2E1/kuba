/**
 * Filter for `attributeChanged`: normalizes a `resizing` attribute value
 * into a CSS size — pass-through numeric px/% values, `"hug"` becomes
 * `"auto"`, `"fill"` becomes `"100%"`, anything else defaults to `"auto"`.
 * Every input has a valid output, so `next` always runs — never a
 * validator that rejects.
 */
function resizing(value, next) {
  if (/^[0-9]+(%|px)$/.test(value)) return next(value)
  if (/^hug$/i.test(value)) return next('auto')
  if (/^fill$/i.test(value)) return next('100%')
  next('auto')
}

export default resizing
