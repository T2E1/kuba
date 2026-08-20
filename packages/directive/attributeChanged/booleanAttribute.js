/**
 * Filter for `attributeChanged`: treats the HTML boolean-attribute
 * conventions (`null` = absent, `"false"`, `"0"`) as `false`; any other
 * string (including `""`, as in `<el disabled>`) as `true`. Every input has
 * a valid output, so `next` always runs — never a validator that rejects.
 */
function booleanAttribute(value, next) {
  if (value === 'false') return next(false)
  if (value === '0') return next(false)
  if (value === null) return next(false)
  next(true)
}

export default booleanAttribute
