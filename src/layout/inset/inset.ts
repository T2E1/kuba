import { define } from '@directive'
import attributeChanged, { enumerated } from '@directive/attributeChanged'
import { paint, retouch } from '@dom'
import Echo from '@echo'
import { Height, Hidden, Identity, role, Width } from '@mixin'
import component from './component'
import { DIRECTIONS } from './direction.js'
import { SIDES } from './side.js'
import style from './style'

@define('kb-inset')
@paint(component, style)
// The chain layers attribute reflection bottom-up: Width/Hidden/Height each own
// their attribute and rendering hooks, Echo adds the shared arc bus (so a
// consumer can drive the host declaratively), and Identity puts the `none` role
// from `[role]` below onto ElementInternals.
class Inset extends Identity(Echo(Height(Hidden(Width(HTMLElement))))) {
  #direction
  #internals
  #side

  // Both setters are validated against a closed keyword set (rule 003): the
  // value is interpolated straight into CSS in `style.js`, so an unknown token
  // never reaches the property, which keeps its last valid value.
  get direction() {
    return (this.#direction ??= DIRECTIONS.COLUMN)
  }

  @attributeChanged('direction', enumerated(DIRECTIONS))
  @retouch
  set direction(value) {
    this.#direction = value
  }

  // Negative spacing and nothing else — the content it lets bleed to the edge
  // keeps its own semantics.
  get [role]() {
    return 'none'
  }

  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  get side() {
    return (this.#side ??= SIDES.ALL)
  }

  @attributeChanged('side', enumerated(SIDES))
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
