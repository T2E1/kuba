import { define } from '@directive'
import { paint } from '@dom'
import { Identity, role } from '@mixin'
import component from './component.js'
import style from './style.js'

@define('kb-footer')
@paint(component, style)
class Footer extends Identity(HTMLElement) {
  #internals

  // Exposed so the `Identity` mixin (`this.internals.role`/`ariaLabel`) can
  // publish the landmark's semantics — see mixin/identity/identity.ts.
  // Internal only: not part of the published contract (see types.d.ts).
  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  // The landmark lives on the host, not on a <footer> inside the shadow root:
  // that element would map to `contentinfo` too, leaving two nested landmarks
  // for a screen reader to announce.
  get [role]() {
    return 'contentinfo'
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
}

export default Footer
