import { define } from '@directive'
import { paint, repaint } from '@dom'
import Echo from '@echo'
import interpolate from '@interpolate'
import { Hidden, Identity, role, Template } from '@mixin'
import component from './component'
import style from './style'

@define('kb-render')
@paint(component, style)
class Render extends Identity(Echo(Hidden(Template(HTMLElement)))) {
  #textContent
  #internals

  get textContent() {
    return (this.#textContent ??= '')
  }

  // A container for whatever the template produces; the rendered items carry
  // the semantics, not the box holding them.
  get [role]() {
    return 'none'
  }

  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open', delegatesFocus: true })
  }

  @repaint
  clear() {
    this.#textContent = ''
    return this
  }

  /**
   * Replaces `textContent` by interpolating the element's template against
   * `data`. A single item is coerced into a one-item list so the same
   * mapping logic renders one or many entries; results are concatenated in
   * order. `@repaint` triggers a re-render of the shadow DOM after this
   * runs.
   */
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
