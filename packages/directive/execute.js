/**
 * Wraps a custom element lifecycle callback (e.g. `connectedCallback`) in a
 * `Proxy` so `target[method]` runs after the original callback, without
 * overwriting any implementation already present on `target`. Used as the
 * shared engine behind `connected`, `disconnected`, `adopted`,
 * `formAssociated`, `formDisabled`, `formReset` and `formStateRestore`.
 */
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
