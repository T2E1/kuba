// Decorator factory: wraps a setter or method so that, after it runs, the
// host re-dispatches its new value/return as a bubbling CustomEvent, letting
// Echo's shared `target` bus pick it up and route it through arc wiring.
const dispatchEvent = (eventName) => (_target, _propertyKeyKey, descriptor) => {
  if (descriptor.set) {
    const originalSet = descriptor.set ?? (() => undefined)

    Object.assign(descriptor, {
      async set(value) {
        await Reflect.apply(originalSet, this, [value])

        if (this.isConnected) {
          this.dispatchEvent(
            new CustomEvent(eventName, {
              bubbles: true,
              composed: true,
              cancelable: true,
              detail: value,
            }),
          )
        }
      },
    })
  }

  if (descriptor.value) {
    const originalValue = descriptor.value ?? (() => undefined)

    Object.assign(descriptor, {
      async value(...args) {
        const output = await Reflect.apply(originalValue, this, args)

        this.dispatchEvent(
          new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: output,
          }),
        )

        return output
      },
    })
  }
}

export default dispatchEvent
