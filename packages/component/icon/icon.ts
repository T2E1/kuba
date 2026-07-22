import { attributeChanged, define } from '@directive'
import { paint, repaint, retouch } from '@dom'
import Echo from '@echo'
import component from './component.js'
import style from './style.js'

@define('kb-icon')
@paint(component, style)
class Icon extends Echo(HTMLElement) {
  #color
  #size
  #use

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
}

export default Icon
