import { attributeChanged, define } from '@directive'
import Echo from '@echo'
import { customEvent } from '@event'
import { around } from '@middleware'
import { Headless } from '@mixin'
import { dispatch } from './interfaces'

@define('k-filter')
class Filter extends Echo(Headless(HTMLElement)) {
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

  // Waits for the parent custom element to upgrade before reading its `value`, since
  // filtering relies on the parent already exposing a records collection (e.g. k-dataset).
  async [dispatch]() {
    await customElements.whenDefined(this.parentElement?.localName)
    const detail = this.parentElement.value.filter(
      ({ [this.key]: value }) => value === this.value,
    )
    this.parentElement.dispatchEvent(customEvent('filter', detail))
    return this
  }
}

export default Filter
