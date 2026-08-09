import { define } from '@directive'
import { paint } from '@dom'
import { Identity, role } from '@mixin'
import component from './component.js'
import style from './style.js'

@define('kb-header')
@paint(component, style)
class Header extends Identity(HTMLElement) {
  #internals

  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  // The landmark lives on the host, not on a <header> inside the shadow root:
  // that element would map to `banner` too, leaving two nested banners for a
  // screen reader to announce.
  get [role]() {
    return 'banner'
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
}

export default Header
