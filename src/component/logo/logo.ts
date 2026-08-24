import { connected, define } from '@directive'
import { paint } from '@dom'
import { around } from '@middleware'
import { Identity, role } from '@mixin'
import component from './component.js'
import { decorative } from './interfaces.js'
import style from './style.js'

@define('kb-logo')
@paint(component, style)
class Logo extends Identity(HTMLElement) {
  #internals

  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  // The shadow root is an inline <svg> with no <title>, so it contributes no
  // name of its own — the host is what assistive technology sees.
  get [role]() {
    return 'img'
  }

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

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  // A logo is usually redundant with the site name next to it, so hiding it is
  // the right default. Name it when the mark stands alone — a logo that is the
  // only content of a home link needs to say where that link goes.
  @connected
  [decorative]() {
    this.internals.ariaHidden = this.alt ? 'false' : 'true'
    return this
  }
}

export default Logo
