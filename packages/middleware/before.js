const before = (method) => (_target, _propertyKey, descriptor) => {
  const type = descriptor.set ? 'set' : 'value'

  descriptor[type] = new Proxy(descriptor[type], {
    apply(original, context, args) {
      return original.call(context, context[method](...args))
    },
  })
}

export default before
