import { uuid } from './uuid'

export class Storage {
  #map = new Map()
  #dataset

  get values() {
    return [...this.#map.values()]
  }

  constructor(dataset) {
    this.#dataset = dataset
  }

  delete(key) {
    this.#map.delete(key)
    return this
  }

  push(payload) {
    ;[].concat(payload).forEach((data) => {
      const key = data[this.#dataset.upsert] ?? uuid()
      const value = this.#map.get(key) ?? {}
      this.#map.set(key, {
        ...Object.assign(value, data),
        [this.#dataset.upsert]: key,
      })
    })
    return this
  }

  clear() {
    this.#map.clear()
    return this
  }

  static from(dataset) {
    return new Storage(dataset)
  }
}
