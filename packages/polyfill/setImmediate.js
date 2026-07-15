if (typeof globalThis.setImmediate !== 'function') {
  Reflect.defineProperty(globalThis, 'setImmediate', {
    value(fn) {
      return setTimeout(fn, 0)
    },
    writable: true,
    configurable: true,
  })
}
