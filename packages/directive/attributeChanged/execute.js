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
