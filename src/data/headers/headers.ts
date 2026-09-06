import { attributeChanged, define } from '@directive'
import Echo from '@echo'
import { around, debounce } from '@middleware'
import { Headless } from '@mixin'
import { publish, setHeader } from './interfaces'

/**
 * Declarative child that sets one HTTP header key/value pair on its parent
 * `<kb-fetch>`. Wiring happens on the parent, not on this element — see
 * `[publish]` below. `Echo` gives it the `on` attribute, so an arc can drive
 * `key`/`value` after connection (e.g. `type=setter`), not just at parse time.
 * `key` and `value` each schedule a call to `[publish]` on write via `@around`
 * (a pure side effect — it doesn't transform the setter's value); `@debounce`
 * on `[publish]` itself coalesces writes made close together (e.g. both
 * attributes present at parse time) into a single call to the parent.
 */
@define('kb-headers')
class Headers extends Echo(Headless(HTMLElement)) {
  #key
  #value

  get key() {
    return (this.#key ??= '')
  }

  @attributeChanged('key')
  @around(publish)
  set key(value) {
    this.#key = value
  }

  get value() {
    return (this.#value ??= '')
  }

  @attributeChanged('value')
  @around(publish)
  set value(value) {
    this.#value = value
  }

  // Waits for the parent element to upgrade before wiring — `[setHeader]` may not
  // exist yet. No guard here for a missing parent or an empty key: that's `[setHeader]`'s
  // call to make (see kb-fetch), the same way kb-filter leaves that judgment to `[dispatch]`.
  @debounce(100)
  async [publish]() {
    await customElements.whenDefined(this.parentElement.localName)
    this.parentElement[setHeader]?.(this.key, this.value)
    return this
  }
}

export default Headers
