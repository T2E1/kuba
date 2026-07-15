import { attributeChanged, define } from '@directive'
import Echo from '@echo'
import { customEvent } from '@event'
import { after } from '@middleware'
import { Headless } from '@mixin'
import DB from '@storage'
import { dispatch } from './interfaces'

@define('m-find')
class Find extends Echo(Headless(HTMLElement)) {
  #key
  #value

  get key() {
    return (this.#key ??= '')
  }

  @attributeChanged('key')
  set key(value) {
    this.#key = value
  }

  get value() {
    return (this.#value ??= '')
  }

  @attributeChanged('value')
  @after(dispatch)
  set value(value) {
    this.#value = value
  }

  async [dispatch]() {
    await customElements.whenDefined(this.parentElement?.localName)

    const db = await DB.open()
    const {
      data: [data],
      error,
    } = await db[this.parentElement.store]
      .where({ [this.key]: this.value })
      .get()

    error
      ? this.parentElement.dispatchEvent(customEvent('failed', error))
      : this.parentElement.dispatchEvent(customEvent('finded', data))

    return this
  }
}

export default Find
