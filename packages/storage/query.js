import Filter from './filter'
import Limit from './limit'
import Order from './order'

class Query {
  #filter = new Filter()
  #limit = new Limit()
  #order = new Order()
  #store

  constructor(store) {
    this.#store = store
  }

  async delete() {
    const { data: collected, error } = await this.#store.get()

    if (error) return { error }

    const filtered = this.#filter.reduce(collected)
    await Promise.all(filtered.map((record) => this.#store.delete(record.id)))

    return { data: true }
  }

  async get() {
    const { data: collected, error } = await this.#store.get()

    if (error) return { error }

    const filtered = this.#filter.reduce(collected)
    const ordered = this.#order.reduce(filtered)
    const limited = this.#limit.reduce(ordered)

    return { data: limited }
  }

  limit(count) {
    this.#limit.to(count)
    return this
  }

  orderBy(field, direction = 'asc') {
    this.#order.by(field, direction)
    return this
  }

  async put(data) {
    const { data: collected, error } = await this.#store.get()

    if (error) return { error }

    const filtered = this.#filter.reduce(collected)
    await Promise.all(
      filtered.map((record) => this.#store.put(record.id, data)),
    )

    return { data: true }
  }

  where(fields) {
    this.#filter.add(fields)
    return this
  }
}

export default Query
