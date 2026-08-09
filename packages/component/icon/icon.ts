import { attributeChanged, connected, define } from '@directive'
import { paint, repaint, retouch } from '@dom'
import Echo from '@echo'
import { around } from '@middleware'
import { Identity, role } from '@mixin'
import component from './component.js'
import { decorative } from './interfaces.js'
import style from './style.js'

@define('kb-icon')
@paint(component, style)
class Icon extends Identity(Echo(HTMLElement)) {
  #color
  #internals
  #size
  #use

  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  // The glyph is rendered as the element's own text content, with no wrapper,
  // so the host is what assistive technology sees.
  get [role]() {
    return 'img'
  }

  get alt() {
    return super.alt
  }

  @around(decorative)
  set alt(value) {
    super.alt = value
  }

  // Unlike the other getters here, the fallback isn't a stored default
  // (`??=`): an unset color must resolve to `currentColor` so the icon
  // inherits from its surrounding text, not from a fixed palette entry.
  get color() {
    return this.#color ? `var(--color-${this.#color})` : 'currentColor'
  }

  @attributeChanged('color')
  @retouch
  set color(value) {
    this.#color = value
  }

  get size() {
    return (this.#size ??= 'md')
  }

  @attributeChanged('size')
  @retouch
  set size(value) {
    this.#size = value
  }

  get use() {
    return (this.#use ??= '')
  }

  @attributeChanged('use')
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
