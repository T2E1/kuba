/**
 * Registers `attribute` in `target.constructor.observedAttributes` and
 * wraps `attributeChangedCallback` in a `Proxy` so that, whenever `attribute`
 * changes, `newValue` is piped through `filters` (right-to-left) and
 * assigned to `context[property]`. Any pre-existing `attributeChangedCallback`
 * still runs first, unmodified.
 *
 * A filter of one argument, `(value) => nextValue`, transforms the value
 * and always continues — the same behavior as a plain `reduce`. A filter of
 * two arguments, `(value, next) => void`, is a validator: only calling
 * `next(value)` propagates further down the chain (to the next filter, or
 * to the assignment). A validator that never calls `next` stops the chain
 * there — the property keeps its previous value.
 */
const execute = (property) => ({
  with: (filters) => ({
    from: (target) => ({
      whenAttributeChanges: (attribute) => {
        target.constructor.observedAttributes = [
          ...new Set([
            ...(target.constructor.observedAttributes || []),
            attribute,
          ]),
        ]

        target.attributeChangedCallback = new Proxy(
          target.attributeChangedCallback || (() => {}),
          {
            apply(original, context, [name, oldValue, newValue]) {
              original.apply(context, [name, oldValue, newValue])
              if (name === attribute) {
                filters.reduceRight(
                  (next, filter) => (value) =>
                    filter.length >= 2
                      ? filter(value, next)
                      : next(filter(value)),
                  (value) => {
                    context[property] = value
                  },
                )(newValue)
              }
            },
          },
        )
      },
    }),
  }),
})

export default execute
