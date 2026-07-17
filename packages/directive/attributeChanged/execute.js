/**
 * Registers `attribute` in `target.constructor.observedAttributes` and
 * wraps `attributeChangedCallback` in a `Proxy` so that, whenever `attribute`
 * changes, `newValue` (piped through `filters`, left to right) is assigned to
 * `context[property]`. Any pre-existing `attributeChangedCallback` still
 * runs first, unmodified.
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
                context[property] = filters.reduce((v, fn) => fn(v), newValue)
              }
            },
          },
        )
      },
    }),
  }),
})

export default execute
