import { registry } from './registry'

const spark = {
  get(name) {
    return registry[name] ?? ((x) => x)
  },

  set(name, fn) {
    registry[name] = fn
    return spark
  },
}

export default spark
