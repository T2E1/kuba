import { define } from '@directive'
import { paint } from '@dom'
import { Identity, role } from '@mixin'
import component from './component.js'
import style from './style.js'

@define('kb-main')
@paint(component, style)
class Main extends Identity(HTMLElement) {
  #internals

  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  // The shadow root renders a bare <slot>, so nothing inside carries the
  // landmark — the host has to be it.
  get [role]() {
    return 'main'
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
}

export default Main
