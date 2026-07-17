import { registry } from './registry'

const spark = {
  get(name) {
    // Unknown names fall back to the identity function rather than throwing.
    return registry[name] ?? ((x) => x)
  },

  set(name, fn) {
    registry[name] = fn
    return spark
  },
}

export default spark
