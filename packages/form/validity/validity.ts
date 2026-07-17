import { attributeChanged, connected, define, disconnected } from '@directive'
import { paint } from '@dom'
import Echo from '@echo'
import component from './component'
import { reflectable, resettable, slottable, validatable } from './interfaces'
import style from './style'

/**
 * Displays validation feedback for a specific `ValidityState` key (e.g.
 * `valueMissing`, `patternMismatch`) of its parent form control. Expects to
 * be slotted into a `slot="validity"` of a form-associated custom element
 * (see `input`, `textarea`, `fileupload`) and reads `parentElement.validity`
 * directly, so it only works when nested as a direct child of such an
 * element.
 */
@define('kb-validity')
@paint(component, style)
class Validity extends Echo(HTMLElement) {
  #controller
  #internals
  #state

  get controller() {
    return (this.#controller ??= new AbortController())
  }

  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  get state() {
    return this.#state
  }

  @attributeChanged('state')
  set state(value) {
    this.#state = value
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  @disconnected
  remove() {
    super.remove()
    this.controller.abort()
    return this
  }

  /** Waits for the parent custom element to upgrade before wiring listeners, since `parentElement.validity` is unavailable until then. */
  @connected
  async [reflectable]() {
    await customElements.whenDefined(this.parentElement?.localName)

    for (const event of ['change', 'invalid']) {
      this.parentElement.addEventListener(event, this[validatable].bind(this), {
        signal: this.controller.signal,
      })
    }

    this.parentElement.addEventListener('reset', this[resettable].bind(this), {
      signal: this.controller.signal,
    })

    return this
  }

  [resettable]() {
    this.internals.states.delete('invalid')
    return this
  }

  @connected
  [slottable]() {
    this.setAttribute('slot', 'validity')
    return this
  }

  /** Reflects `:state(invalid)` based on the specific `ValidityState` flag named by `state` (e.g. `valueMissing`), not the parent's overall validity. */
  [validatable]() {
    this.parentElement.validity[this.state]
      ? this.internals.states.add('invalid')
      : this.internals.states.delete('invalid')
    return this
  }
}

export default Validity
