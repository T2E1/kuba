import { define } from '@directive'
import attributeChanged, {
  enumerating,
  escaping,
} from '@directive/attributeChanged'
import { paint, repaint, retouch } from '@dom'
import Echo from '@echo'
import { Hidden } from '@mixin'
import component from './component.js'
import { ORIENTATIONS } from './orientation.js'
import style from './style.js'

@define('kb-cover')
@paint(component, style)
class Cover extends Echo(Hidden(HTMLElement)) {
  #alt
  #internals
  #orientation
  #src

  get alt() {
    return (this.#alt ??= '')
  }

  // `escaping` runs first so `component.js` can interpolate `alt` straight
  // into the attribute without escaping it itself.
  @attributeChanged('alt', escaping)
  @repaint
  set alt(value) {
    this.#alt = value
  }

  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  get orientation() {
    return (this.#orientation ??= ORIENTATIONS.LANDSCAPE)
  }

  @attributeChanged('orientation', enumerating(ORIENTATIONS))
  @retouch
  set orientation(value) {
    this.#orientation = value
  }

  get src() {
    return (this.#src ??= '')
  }

  // `escaping` runs first so `component.js` can interpolate `src` straight
  // into the attribute without escaping it itself.
  @attributeChanged('src', escaping)
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
