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
    // setImmediate lets the original setter/method return synchronously and
    // coalesces the repaint after the current call stack, rather than
    // awaiting it inline (which would make every decorated setter async).
    // Guarded by isPainted so a property write before the initial paint
    // doesn't trigger a redundant render.
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
