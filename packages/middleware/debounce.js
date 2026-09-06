// Coalesces every call made within `wait` ms of the last one into a single
// invocation of the original method/setter, per instance — a later call
// resets the timer instead of scheduling a second one. The pending timeout
// is keyed on the instance itself, under a Symbol private to this decorator
// application: decorators run once, when the class is defined, so a plain
// closure variable would be shared by every instance of the class and
// cross-cancel unrelated instances' pending calls.
const debounce =
  (wait = 250) =>
  (_target, _propertyKey, descriptor) => {
    const type = descriptor.set ? 'set' : 'value'
    const timeoutID = Symbol('timeoutID')

    descriptor[type] = new Proxy(descriptor[type], {
      apply(original, context, args) {
        context[timeoutID] = clearTimeout(context[timeoutID])
        context[timeoutID] = setTimeout(
          () => original.call(context, ...args),
          wait,
        )
      },
    })
  }

export default debounce
