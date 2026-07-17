// Shared mechanism behind willPaint/didPaint: wraps `target[event]` (a
// lifecycle callback such as connectedCallback) in a Proxy so the original
// behavior still runs, then awaits `context[method]()` afterwards. Falls
// back to a no-op if `event` was never defined, so decorating a class that
// has no existing hook doesn't throw.
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
