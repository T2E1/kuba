import '@polyfill/setImmediate'
import {
  cssCallback,
  didPaintCallback,
  htmlCallback,
  isPainted,
  willPaintCallback,
} from '@dom/interfaces'

const repaint = (_target, _propertyKey, descriptor) => {
  const apply = (original, context, args) => {
    setImmediate(async () => {
      if (context[isPainted]) {
        await context[willPaintCallback]?.()
        await Promise.all([
          new Promise(context[htmlCallback]),
          new Promise(context[cssCallback]),
        ])
        await context[didPaintCallback]?.()
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

export default repaint
