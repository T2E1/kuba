const after = (method) => (_target, _propertyKey, descriptor) => {
  const type = descriptor.set ? 'set' : 'value'

  descriptor[type] = new Proxy(descriptor[type], {
    apply(original, context, args) {
      return context[method](original.apply(context, args))
    },
  })
}

export default after
