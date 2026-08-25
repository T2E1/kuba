/**
 * Normalizes `value` into a CSS size drawn from a closed set of shapes:
 * a numeric px/% length passes through, `"hug"` becomes `"auto"`, `"fill"`
 * becomes `"100%"`, and anything else — including a length with text
 * appended after it, which is how CSS injection reaches an interpolated
 * stylesheet — collapses to `"auto"`. Total: every input has a valid
 * output, so it never rejects; it substitutes. Idempotent, so applying it
 * twice on the same value costs nothing.
 *
 * This is the primitive `resizing` (the `attributeChanged` filter, below)
 * wraps for the attribute-to-property path. A setter that can also be
 * assigned directly — bypassing `attributeChanged` entirely — needs the same
 * guard inline; `attributeChanged` alone only protects one of the two ways a
 * value reaches a property.
 */
export function toSizeString(value) {
  if (/^[0-9]+(%|px)$/.test(value)) return value
  if (/^hug$/i.test(value)) return 'auto'
  if (/^fill$/i.test(value)) return '100%'
  return 'auto'
}

/**
 * Filter for `attributeChanged`: normalizes a `resizing` attribute value
 * with `toSizeString`. Every input has a valid output, so `next` always
 * runs — never a validator that rejects.
 */
function resizing(value, next) {
  next(toSizeString(value))
}

export default resizing
