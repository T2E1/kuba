// setImmediate is a Node.js API, not a browser/web standard, so it is absent
// in browser environments. This provides a fallback using setTimeout(fn, 0).
if (typeof globalThis.setImmediate !== 'function') {
  Reflect.defineProperty(globalThis, 'setImmediate', {
    value(fn) {
      return setTimeout(fn, 0)
    },
    writable: true,
    configurable: true,
  })
}
