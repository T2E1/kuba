import { attributeChanged, connected, define } from '@directive'
import { Headless } from '@mixin'
import { connectArc, setter } from './interfaces'

/**
 * Declarative sibling of the `on="..."` attribute: lets an arc be expressed
 * as a child element instead of an inline attribute string. Wiring happens
 * on the parent, not on this element — see `[setter]` below.
 */
@define('kb-on')
class On extends Headless(HTMLElement) {
  #value

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
   * without `connectArc` yet. Mutates the parent, not `this`.
   */
  @connected
  async [setter]() {
    await customElements.whenDefined(this.parentElement?.localName)
    this.parentElement?.[connectArc]?.(this.value)
    return this
  }
}

export default On
