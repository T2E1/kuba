import { connected } from '@directive'
import attributeChanged from '@directive/attributeChanged'
import { identifiable, role } from './interface'

/**
 * Gives the element an identity in the accessibility tree: the role it plays,
 * and — for elements with no readable text of their own — the name it answers
 * to. Without it a custom element is an anonymous box: `<kb-progress
 * value="40">` announces as nothing at all.
 *
 * The role is not configured here. The element declares it by implementing
 * `[role]`, which this mixin reads on connect.
 *
 * Both are published as *default* semantics through `ElementInternals`, so a
 * `role` or `aria-label` written in the markup by the author still wins.
 *
 * Reads `internals` from the host class, as `Hidden` does — the element owns
 * the `attachInternals()` call, which may happen only once per element.
 */
const Identity = (Super) => {
  class C extends Super {
    #alt

    get alt() {
      return (this.#alt ??= '')
    }

    // Only ever runs on an actual attribute change, so an element without
    // `alt` keeps whatever name its content gives it.
    @attributeChanged('alt')
    set alt(value) {
      this.#alt = value
      this.internals.ariaLabel = value
    }

    @connected
    [identifiable]() {
      this.internals.role = this[role]
      return this
    }
  }

  return C
}

export default Identity
