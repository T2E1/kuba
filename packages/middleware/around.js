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
