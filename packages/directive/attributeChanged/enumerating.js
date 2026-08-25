/**
 * Whether `value` is one of `values`'s own values (an `Object.freeze`d enum,
 * keyed in `UPPER_SNAKE_CASE` — see skill `enum`). The primitive `enumerating`
 * (below) wraps for the attribute-to-property path. A setter that can also be
 * assigned directly — bypassing `attributeChanged` entirely — needs the same
 * guard inline; `attributeChanged` alone only protects one of the two ways a
 * value reaches a property.
 */
export function isEnumerated(values, value) {
  return Object.values(values).includes(value)
}

/**
 * Filter factory for `attributeChanged`: returns a validator that only
 * propagates a value `isEnumerated` accepts. An unknown token never calls
 * `next`, so the property keeps whatever was last valid.
 */
function enumerating(values) {
  return (value, next) => {
    isEnumerated(values, value) && next(value)
  }
}

export default enumerating
