const execute = (method) => ({
  on: (target) => ({
    after: (event) => {
      target[event] = new Proxy(target[event] || (() => {}), {
        apply(original, context, args) {
          original.apply(context, args)
          context[method](...args)
        },
      })
    },
  }),
})

export default execute
