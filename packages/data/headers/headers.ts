import { attributeChanged, connected, define } from '@directive'
import Echo from '@echo'
import { Headless } from '@mixin'
import { setHeader, setter } from './interfaces'

/**
 * Declarative child that sets one HTTP header key/value pair on its parent
 * `<k-fetch>`. Wiring happens on the parent, not on this element — see
 * `[setter]` below.
 */
@define('kb-headers')
class Headers extends Echo(Headless(HTMLElement)) {
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
  set value(value) {
    this.#value = value
  }

  /**
   * Waits for the parent custom element to be upgraded before wiring —
   * on connection, `parentElement` may still be an un-upgraded element
   * without `setHeader` yet. Mutates the parent, not `this`.
   */
  @connected
  async [setter]() {
    await customElements.whenDefined(this.parentElement?.localName)
    this.parentElement?.[setHeader]?.(this.key, this.value)
    return this
  }
}

export default Headers
