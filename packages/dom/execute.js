const execute = (method) => ({
  on: (target) => ({
    after: (event) => {
      target[event] = new Proxy(target[event] || (() => {}), {
        async apply(original, context, args) {
          await original.apply(context, args)
          await context[method]()
        },
      })
    },
  }),
})

export default execute
