/**
 * Parses `value` with `Number.parseFloat` and returns the parsed number
 * re-serialized as a string — never the raw input. `parseFloat` only reads a
 * leading numeric prefix and ignores the rest, so returning the original
 * string would let anything appended after that prefix (CSS/markup
 * injection included) reach a caller unchanged. Returns `undefined` when
 * `value` has no numeric prefix `parseFloat` can turn into a finite number.
 * Does not clamp or round beyond what `parseFloat` itself does — a range
 * check is a concern of the caller, not of this function.
 *
 * This is the primitive `numeric` (the `attributeChanged` filter, below)
 * wraps for the attribute-to-property path. A setter that can also be
 * assigned directly — bypassing `attributeChanged` entirely — needs the same
 * guard inline; `attributeChanged` alone only protects one of the two ways a
 * value reaches a property.
 */
export function toNumericString(value) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? String(parsed) : undefined
}

/**
 * Filter for `attributeChanged`: only propagates `value` when
 * `toNumericString` accepts it, passing the sanitized string, never the raw
 * attribute text. An unparseable value never calls `next`, so the property
 * keeps whatever was last valid.
 */
function numeric(value, next) {
  const sanitized = toNumericString(value)
  sanitized !== undefined && next(sanitized)
}

export default numeric
