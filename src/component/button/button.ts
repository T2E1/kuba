import { define } from '@directive'
import attributeChanged, {
  enumerating,
  escaping,
} from '@directive/attributeChanged'
import { paint, repaint, retouch } from '@dom'
import Echo from '@echo'
import on, { customEvent, stop } from '@event'
import { around, before } from '@middleware'
import { Disabled, Hidden, Value, Width } from '@mixin'
import { COLORS } from './color.js'
import component from './component.js'
import { dispatch, variantable } from './interfaces.js'
import style from './style.js'
import { TYPES } from './type.js'
import { VARIANTS } from './variant.js'

@define('kb-button')
@paint(component, style)
class Button extends Echo(Disabled(Hidden(Value(Width(HTMLElement))))) {
  #alt
  #color
  #internals
  #type
  #variant

  get alt() {
    return (this.#alt ??= '')
  }

  // Deliberately not the `Identity` mixin: that publishes a role and a name on
  // the host, and here the host is only a wrapper — the <button> in the shadow
  // root is what the accessibility tree treats as the button. `@repaint`
  // re-renders the markup so the template can write `aria-label` onto it.
  // `escaping` runs first so `component.js` can interpolate `alt` straight
  // into the attribute without escaping it itself.
  @attributeChanged('alt', escaping)
  @repaint
  set alt(value) {
    this.#alt = value
  }

  get color() {
    return (this.#color ??= COLORS.PRIMARY)
  }

  // `enumerating(COLORS)` only propagates a value in the known tokens — an
  // unknown one never reaches the setter, so an unvalidated attribute
  // never reaches the CSS interpolation in style.js, and the property
  // keeps whatever color was last valid.
  @attributeChanged('color', enumerating(COLORS))
  @retouch
  set color(value) {
    this.#color = value
  }

  // Exposed so the `Disabled`/`Hidden` mixins (`this.internals.states`) can
  // toggle their custom states — see mixin/disabled/disabled.ts and
  // mixin/hidden/hidden.ts. Internal only: not part of the published
  // contract (see types.d.ts).
  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  get type() {
    return (this.#type ??= TYPES.SUBMIT)
  }

  // `enumerating(TYPES)` only propagates a value in the known tokens — an
  // unknown one never reaches the setter, so `type` keeps whatever was
  // last valid.
  @attributeChanged('type', enumerating(TYPES))
  set type(value) {
    this.#type = value
  }

  get variant() {
    return (this.#variant ??= VARIANTS.SOLID)
  }

  // `enumerating(VARIANTS)` only propagates a value in the known tokens —
  // an unknown one never reaches the setter, so `internals.states` never
  // carries an invented custom state.
  @attributeChanged('variant', enumerating(VARIANTS))
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

  // Intercepts and stops any inner click, then interacts with the form
  // according to `type`.
  @on.click('*', stop)
  @around(dispatch)
  click() {
    switch (this.type) {
      case TYPES.SUBMIT:
        this.internals.form?.requestSubmit()
        break
      case TYPES.RESET:
        this.internals.form?.reset()
        break
    }
    return this
  }

  // Invoked by `around(dispatch)` on `click()`; dispatches "clicked"
  // carrying `this.value` as detail.
  [dispatch]() {
    this.dispatchEvent(customEvent('clicked', this.value))
    return this
  }

  // Invoked by `before(variantable)` on `set variant`, prior to
  // assignment; swaps the previous variant's custom state for the new
  // one so only one `:state(...)` variant is ever active at a time.
  [variantable](variant) {
    this.internals.states.delete(this.variant)
    this.internals.states.add(variant)
    return variant
  }
}

export default Button
