/**
 * Filter for `attributeChanged`: treats the HTML boolean-attribute
 * conventions (`null` = absent, `"false"`, `"0"`) as `false`; any other
 * string (including `""`, as in `<el disabled>`) as `true`.
 */
function booleanAttribute(value) {
  if (value === 'false') return false
  if (value === '0') return false
  if (value === null) return false
  return true
}

export default booleanAttribute
