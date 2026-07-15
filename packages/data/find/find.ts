import { attributeChanged, define } from '@directive'
import Echo from '@echo'
import { around } from '@middleware'
import { Headless } from '@mixin'
import { dispatch } from './interfaces'

@define('k-find')
class Find extends Echo(Headless(HTMLElement)) {
  #key
  #value

  get key() {
    return this.#key
  }

  @attributeChanged('key')
  set key(value) {
    this.#key = value
  }

  get value() {
    return this.#value
  }

  @attributeChanged('value')
  @around(dispatch)
  set value(value) {
    this.#value = value
  }

  async [dispatch]() {
    await customElements.whenDefined(this.parentElement?.localName)
    const detail = this.parentElement.value.find(
      ({ [this.key]: value }) => value === this.value,
    )
    const init = { bubbles: true, cancelable: true, detail }
    const event = new CustomEvent('find', init)
    this.parentElement.dispatchEvent(event)
    return this
  }
}

export default Find
