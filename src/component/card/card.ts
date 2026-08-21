import { define } from '@directive'
import attributeChanged, { enumerating } from '@directive/attributeChanged'
import { paint, retouch } from '@dom'
import Echo from '@echo'
import { Height, Hidden, Identity, role, Width } from '@mixin'
import component from './component.js'
import { DIRECTIONS } from './direction.js'
import style from './style.js'

@define('kb-card')
@paint(component, style)
class Card extends Identity(Echo(Height(Hidden(Width(HTMLElement))))) {
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

  // A layout box with no meaning of its own: declaring it presentational
  // keeps it from adding a generic node around whatever it groups.
  get [role]() {
    return 'none'
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
}

export default Card
