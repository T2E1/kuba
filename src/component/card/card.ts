import { attributeChanged, define } from '@directive'
import { paint, retouch } from '@dom'
import Echo from '@echo'
import on, { customEvent, stop } from '@event'
import { Height, Hidden, Width } from '@mixin'
import component from './component'
import style from './style'

@define('kb-card')
@paint(component, style)
class Card extends Echo(Height(Hidden(Width(HTMLElement)))) {
  #direction
  #internals
  #value

  get direction() {
    return (this.#direction ??= 'column')
  }

  @attributeChanged('direction')
  @retouch
  set direction(value) {
    this.#direction = value
  }

  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  get value() {
    return (this.#value ??= '')
  }

  @attributeChanged('value')
  set value(value) {
    this.#value = value
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open', delegatesFocus: true })
  }

  // Intercepts both native "click" and re-dispatched "clicked" events from
  // descendants (stopping them), then re-emits a single "clicked" event
  // carrying `this.value`, so a card acts as one clickable unit.
  @on.click('*', stop)
  @on.clicked('*', stop)
  click() {
    this.dispatchEvent(customEvent('clicked', this.value))
    return this
  }
}

export default Card
