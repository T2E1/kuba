import { attributeChanged, define } from '@directive'
import { paint, retouch } from '@dom'
import Echo from '@echo'
import { Height, Hidden, Width } from '@mixin'
import component from './component.js'
import style from './style.js'

@define('m-stack')
@paint(component, style)
class Stack extends Hidden(Width(Height(Echo(HTMLElement)))) {
  #align
  #direction
  #internals
  #justify
  #spacing

  get align() {
    return (this.#align ??= 'start')
  }

  @attributeChanged('align')
  @retouch
  set align(value) {
    this.#align = value
  }

  get direction() {
    return (this.#direction ??= 'row')
  }

  @attributeChanged('direction')
  @retouch
  set direction(value) {
    this.#direction = value
  }

  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  get justify() {
    return (this.#justify ??= 'flex-start')
  }

  @attributeChanged('justify')
  @retouch
  set justify(value) {
    this.#justify = value
  }

  get spacing() {
    return (this.#spacing ??= 'xs')
  }

  @attributeChanged('spacing')
  @retouch
  set spacing(value) {
    this.#spacing = value
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
}

export default Stack
