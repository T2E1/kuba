import { define } from '@directive'
import attributeChanged, {
  enumerating,
  isEnumerated,
} from '@directive/attributeChanged'
import { paint, retouch } from '@dom'
import Echo from '@echo'
import { Height, Hidden, Presentational, Width } from '@mixin'
import { ALIGNMENTS } from './align.js'
import component from './component.js'
import { DIRECTIONS } from './direction.js'
import { JUSTIFICATIONS } from './justify.js'
import { SPACINGS } from './spacing.js'
import style from './style.js'

@define('kb-stack')
@paint(component, style)
class Stack extends Presentational(Hidden(Width(Height(Echo(HTMLElement))))) {
  #align
  #direction
  #internals
  #justify
  #spacing

  get align() {
    return (this.#align ??= ALIGNMENTS.START)
  }

  // `@attributeChanged('align', enumerating(ALIGNMENTS))` only guards
  // attribute writes — `stack.align = untrusted` skips it and reaches this
  // setter directly, so the setter re-checks with `isEnumerated` itself. Both
  // entry points converge on the same closed set, not just the attribute one.
  @attributeChanged('align', enumerating(ALIGNMENTS))
  @retouch
  set align(value) {
    isEnumerated(ALIGNMENTS, value) && (this.#align = value)
  }

  get direction() {
    return (this.#direction ??= DIRECTIONS.ROW)
  }

  // Same asymmetry as `align`: the setter re-checks `isEnumerated` itself so
  // a direct `stack.direction = untrusted` gets the same guard as the
  // attribute path.
  @attributeChanged('direction', enumerating(DIRECTIONS))
  @retouch
  set direction(value) {
    isEnumerated(DIRECTIONS, value) && (this.#direction = value)
  }

  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  get justify() {
    return (this.#justify ??= JUSTIFICATIONS.START)
  }

  // Same asymmetry as `align`: the setter re-checks `isEnumerated` itself so
  // a direct `stack.justify = untrusted` gets the same guard as the
  // attribute path.
  @attributeChanged('justify', enumerating(JUSTIFICATIONS))
  @retouch
  set justify(value) {
    isEnumerated(JUSTIFICATIONS, value) && (this.#justify = value)
  }

  get spacing() {
    return (this.#spacing ??= SPACINGS.XS)
  }

  // Same asymmetry as `align`: the setter re-checks `isEnumerated` itself so
  // a direct `stack.spacing = untrusted` gets the same guard as the
  // attribute path — it never becomes part of the `--spacing_inset-{value}`
  // custom property name in style.js.
  @attributeChanged('spacing', enumerating(SPACINGS))
  @retouch
  set spacing(value) {
    isEnumerated(SPACINGS, value) && (this.#spacing = value)
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
}

export default Stack
