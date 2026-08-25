import { define } from '@directive'
import attributeChanged, { enumerating } from '@directive/attributeChanged'
import { paint, retouch } from '@dom'
import Echo from '@echo'
import { Height, Hidden, Presentational, Width } from '@mixin'
import component from './component.js'
import { DIRECTIONS } from './direction.js'
import style from './style.js'

@define('kb-card')
@paint(component, style)
class Card extends Echo(Height(Hidden(Presentational(Width(HTMLElement))))) {
  #direction
  #internals

  get direction() {
    return (this.#direction ??= DIRECTIONS.COLUMN)
  }

  // `enumerating(DIRECTIONS)` only propagates a value in the known tokens —
  // an unknown one never reaches the setter, so `direction` keeps whatever
  // was last valid and the CSS interpolation in style.js never sees an
  // invalid keyword.
  @attributeChanged('direction', enumerating(DIRECTIONS))
  @retouch
  set direction(value) {
    this.#direction = value
  }

  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
}

export default Card
