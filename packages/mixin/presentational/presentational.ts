import { connected } from '@directive'
import { presentational } from './interfaces'

/**
 * Takes the element out of the accessibility tree without hiding it: on
 * connect it publishes `role="none"` on `internals`, so a layout box adds no
 * generic node around whatever it groups. What has role and name is the
 * slotted content.
 *
 * Deliberately not part of `Identity`: `Identity` publishes a role *and* an
 * accessible name (`alt`), and a presentational host has no name to publish —
 * composing it for the role half alone would be refused bequest (rule 059)
 * and would put an `alt` the element never contracted onto its public
 * surface. This mixin is the role half on its own, and adds nothing to the
 * element's public surface.
 *
 * Reads `internals` from the host class, as `Hidden` and `Identity` do — the
 * element owns the `attachInternals()` call, which may happen only once per
 * element.
 */
const Presentational = (Super) => {
  class C extends Super {
    @connected
    [presentational]() {
      this.internals.role = 'none'
      return this
    }
  }

  return C
}

export default Presentational
