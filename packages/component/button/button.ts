import { attributeChanged, define } from '@directive'
import { paint, retouch } from '@dom'
import Echo, { dispatchEvent } from '@echo'
import on, { stop } from '@event'
import { before } from '@middleware'
import { Hidden, Value, Width } from '@mixin'
import component from './component.js'
import { variantable } from './interfaces.js'
import style from './style.js'

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
    this.#internals = this.attachInternals()
  }

  @on.click('*', stop)
  @dispatchEvent('clicked')
  click() {
    switch (this.type) {
      case 'submit':
        this.#internals.form?.requestSubmit()
        break
      case 'reset':
        this.#internals.form?.reset()
        break
    }
    return this.value
  }

  [variantable](variant) {
    this.#internals.states.delete(this.variant)
    this.#internals.states.add(variant)
    return this
  }
}

export default Button
