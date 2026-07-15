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
