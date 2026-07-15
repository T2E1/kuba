import { attributeChanged, connected, define } from '@directive'
import { Headless } from '@mixin'
import { connectArc, setter } from './interfaces'

@define('m-on')
class On extends Headless(HTMLElement) {
  #value

  get value() {
    return (this.#value ??= '')
  }

  @attributeChanged('value')
  set value(value) {
    this.#value = value
  }

  @connected
  async [setter]() {
    await customElements.whenDefined(this.parentElement?.localName)
    this.parentElement?.[connectArc]?.(this.value)
    return this
  }
}

export default On
