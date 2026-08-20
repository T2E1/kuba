/**
 * Filter factory for `attributeChanged`: returns a validator that only
 * propagates a value present among `values`'s own values (an
 * `Object.freeze`d enum, keyed in `UPPER_SNAKE_CASE` — see skill `enum`).
 * An unknown token never calls `next`, so the property keeps whatever was
 * last valid.
 */
function enumerating(values) {
  return (value, next) => {
    Object.values(values).includes(value) && next(value)
  }
}

export default enumerating
