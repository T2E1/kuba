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

  @on.click('*', stop)
  @on.clicked('*', stop)
  click() {
    this.dispatchEvent(customEvent('clicked', this.value))
    return this
  }
}

export default Card
