import { attributeChanged, define } from '@directive'
import Echo from '@echo'
import { customEvent } from '@event'
import { Headless } from '@mixin'
import DB from '@storage'

@define('m-dataset')
class Dataset extends Headless(Echo(HTMLElement)) {
  #store
  #upsert

  get store() {
    return (this.#store ??= '')
  }

  @attributeChanged('store')
  set store(value) {
    this.#store = value
  }

  get upsert() {
    return (this.#upsert ??= 'id')
  }

  @attributeChanged('upsert')
  set upsert(value) {
    this.#upsert = value
  }

  async add(data) {
    const db = await DB.open()
    const { data: created, error } = await db[this.store].add(data)
    error
      ? this.dispatchEvent(customEvent('failed', error))
      : this.dispatchEvent(customEvent('created', created))
    return this
  }

  async delete(id) {
    const db = await DB.open()
    const { data: removed, error } = await db[this.store].delete(id)
    error
      ? this.dispatchEvent(customEvent('failed', error))
      : this.dispatchEvent(customEvent('removed', removed))
    return this
  }

  async put(data) {
    const db = await DB.open()
    const id = data[this.upsert]

    delete data[this.upsert]

    const { data: saved, error } = await db[this.store].put(id, data)

    error
      ? this.dispatchEvent(customEvent('failed', error))
      : this.dispatchEvent(customEvent('saved', saved))
  }
}

export default Dataset
