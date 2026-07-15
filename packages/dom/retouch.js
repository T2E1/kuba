import '@polyfill/setImmediate'
import { cssCallback, isPainted } from './interfaces'

const retouch = (_target, _propertyKey, descriptor) => {
  const apply = (original, context, args) => {
    setImmediate(async () => {
      if (context[isPainted]) {
        await new Promise(context[cssCallback])
      }
    })

    return original.apply(context, args)
  }

  if (descriptor.set) {
    descriptor.set = new Proxy(descriptor.set, { apply })
  }

  if (descriptor.value) {
    descriptor.value = new Proxy(descriptor.value, { apply })
  }
}

export default retouch
