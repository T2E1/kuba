import { attributeChanged, define } from '@directive'
import { paint, repaint, retouch } from '@dom'
import Echo from '@echo'
import component from './component.js'
import style from './style.js'

@define('m-cover')
@paint(component, style)
class Cover extends Echo(HTMLElement) {
  #alt
  #orientation
  #src

  get alt() {
    return (this.#alt ??= '')
  }

  @attributeChanged('alt')
  @repaint
  set alt(value) {
    this.#alt = value
  }

  get orientation() {
    return (this.#orientation ??= 'landscape')
  }

  @attributeChanged('orientation')
  @retouch
  set orientation(value) {
    this.#orientation = value
  }

  get src() {
    return (this.#src ??= '')
  }

  @attributeChanged('src')
  @repaint
  set src(value) {
    this.#src = value
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
}

export default Cover
