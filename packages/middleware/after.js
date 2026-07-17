// Runs the original call first, then pipes its return value through
// `method` and returns that instead — `method` transforms the result,
// it is not merely a side-effecting observer.
const after = (method) => (_target, _propertyKey, descriptor) => {
  const type = descriptor.set ? 'set' : 'value'

  descriptor[type] = new Proxy(descriptor[type], {
    apply(original, context, args) {
      return context[method](original.apply(context, args))
    },
  })
}

export default after
