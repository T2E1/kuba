// Despite the name, this does not wrap the original call synchronously:
// `method` is scheduled via setImmediate (runs after the current call
// returns, on a later tick) and its result is discarded — the original
// call's return value is what callers receive, unaffected by `method`.
const around = (method) => (_target, _propertyKey, descriptor) => {
  const type = descriptor.set ? 'set' : 'value'

  descriptor[type] = new Proxy(descriptor[type], {
    apply(original, context, args) {
      setImmediate(() => context[method](...args))
      return original.apply(context, args)
    },
  })
}

export default around
