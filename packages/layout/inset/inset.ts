import { attributeChanged, define } from '@directive'
import { paint, retouch } from '@dom'
import Echo from '@echo'
import { Height, Hidden, Width } from '@mixin'
import component from './component'
import style from './style'

@define('m-inset')
@paint(component, style)
class Inset extends Echo(Height(Hidden(Width(HTMLElement)))) {
  #direction
  #internals
  #side

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

  get side() {
    return (this.#side ??= 'all')
  }

  @attributeChanged('side')
  @retouch
  set side(value) {
    this.#side = value
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
}

export default Inset
