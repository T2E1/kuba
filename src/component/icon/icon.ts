import { connected, define } from '@directive'
import attributeChanged, {
  enumerated,
  escaping,
} from '@directive/attributeChanged'
import { paint, repaint, retouch } from '@dom'
import Echo from '@echo'
import { around } from '@middleware'
import { Identity, role } from '@mixin'
import { COLORS } from './color.js'
import component from './component.js'
import { decorative } from './interfaces.js'
import { SIZES } from './size.js'
import style from './style.js'

@define('kb-icon')
@paint(component, style)
class Icon extends Identity(Echo(HTMLElement)) {
  #color
  #internals
  #size
  #use

  get alt() {
    return super.alt
  }

  // No @attributeChanged('alt') here: Identity already registers it, and
  // observedAttributes/attributeChangedCallback are inherited, so the DOM
  // change already lands on this setter. Re-adding the decorator wraps a
  // second Proxy around the inherited one and fires this body twice.
  @around(decorative)
  set alt(value) {
    super.alt = value
  }

  get color() {
    return this.#color
  }

  // `enumerated(COLORS)` only propagates a value in the known tokens — an
  // unknown one never reaches the setter, so an unvalidated attribute
  // never reaches the CSS interpolation in style.js.
  @attributeChanged('color', enumerated(COLORS))
  @retouch
  set color(value) {
    this.#color = value
  }

  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  // The glyph is rendered as the element's own text content, with no wrapper,
  // so the host is what assistive technology sees.
  get [role]() {
    return 'img'
  }

  get size() {
    return (this.#size ??= SIZES.MD)
  }

  // `enumerated(SIZES)` only propagates a value in the known tokens — an
  // unknown one never reaches the setter, so an unvalidated attribute
  // never reaches the CSS interpolation in style.js.
  @attributeChanged('size', enumerated(SIZES))
  @retouch
  set size(value) {
    this.#size = value
  }

  get use() {
    return (this.#use ??= '')
  }

  // `component.js` returns `icon.use` verbatim and it lands in the shadow
  // root via `innerHTML` (see packages/dom/paint/render.js) — unlike `alt`,
  // this value becomes real markup, so it needs the same escaping button.ts
  // applies to `alt`.
  @attributeChanged('use', escaping)
  @repaint
  set use(value) {
    this.#use = value
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  // An icon is either named or decorative, never a nameless image: without a
  // name the ligature text is what gets announced, so `<kb-icon use="delete">`
  // reads as "delete". Hiding it is the right default — the surrounding
  // control carries the meaning.
  @connected
  [decorative]() {
    this.internals.ariaHidden = this.alt ? 'false' : 'true'
    return this
  }
}

export default Icon
