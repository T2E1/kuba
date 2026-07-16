import { define } from '@directive'
import { paint, repaint } from '@dom'
import Echo from '@echo'
import { Hidden, Template } from '@mixin'
import component from './component'
import interpolate from './interpolate'
import style from './style'

@define('kb-render')
@paint(component, style)
class Render extends Echo(Hidden(Template(HTMLElement))) {
  #textContent
  #internals

  get textContent() {
    return (this.#textContent ??= '')
  }

  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open', delegatesFocus: true })
  }

  @repaint
  render(data) {
    this.#textContent = []
      .concat(data)
      .map((d) => interpolate(super.template, d))
      .join('')
    return this
  }
}

export default Render
