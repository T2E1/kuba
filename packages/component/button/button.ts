import { attributeChanged, define } from '@directive'
import { paint, retouch } from '@dom'
import Echo, { dispatchEvent } from '@echo'
import on, { stop } from '@event'
import { before } from '@middleware'
import { Hidden, Value, Width } from '@mixin'
import component from './component.js'
import { variantable } from './interfaces.js'
import style from './style.js'

/**
 * `variant` is validated by the `variantable` middleware (see `before`)
 * before being assigned, and the resulting element state is toggled via
 * `#internals.states` (rather than a class/attribute) so CSS can target it
 * with `:host(:state(...))`.
 */
@define('kb-button')
@paint(component, style)
class Button extends Echo(Hidden(Value(Width(HTMLElement)))) {
  #color
  #internals
  #type
  #variant

  get color() {
    return (this.#color ??= 'primary')
  }

  // Exposed so the `Hidden` mixin (`this.internals.states`) can toggle the
  // `hidden` custom state — see mixin/hidden/hidden.ts.
  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  @attributeChanged('color')
  @retouch
  set color(value) {
    this.#color = value
  }

  get type() {
    return (this.#type ??= 'submit')
  }

  @attributeChanged('type')
  set type(value) {
    this.#type = value
  }

  get variant() {
    return (this.#variant ??= 'solid')
  }

  @attributeChanged('variant')
  @before(variantable)
  set variant(value) {
    this.#variant = value
  }

  static get formAssociated() {
    return true
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open', delegatesFocus: true })
  }

  // Intercepts and stops any inner click, then re-dispatches it as a single
  // "clicked" event (via @dispatchEvent) carrying `this.value` as detail.
  @on.click('*', stop)
  @dispatchEvent('clicked')
  click() {
    switch (this.type) {
      case 'submit':
        this.internals.form?.requestSubmit()
        break
      case 'reset':
        this.internals.form?.reset()
        break
    }
    return this.value
  }

  // Invoked by the `before(variantable)` middleware on `set variant` prior
  // to assignment; swaps the previous variant's custom state for the new
  // one so only one `:state(...)` variant is ever active at a time.
  [variantable](variant) {
    this.internals.states.delete(this.variant)
    this.internals.states.add(variant)
    return this
  }
}

export default Button
