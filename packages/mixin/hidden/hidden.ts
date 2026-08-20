import attributeChanged, { booleanAttribute } from '@directive/attributeChanged'
import { around } from '@middleware'
import { cleanup, hideable } from './interfaces'

/**
 * Adds a `hidden` property backed by the `hidden` attribute. The setter only
 * assigns; both side effects run via `@around`, scheduled on a later tick,
 * neither touching the assigned value: `cleanup` removes the `hidden`
 * attribute when the value becomes `false`, and `hideable` reflects the
 * state onto `internals.states`.
 */
const Hidden = (Super) => {
  class C extends Super {
    #hidden

    get hidden() {
      return (this.#hidden ??= false)
    }

    @attributeChanged('hidden', booleanAttribute)
    @around(hideable)
    @around(cleanup)
    set hidden(value) {
      this.#hidden = value
    }

    [cleanup]() {
      !this.hidden && this.removeAttribute('hidden')
      return this
    }

    [hideable]() {
      this.hidden
        ? this.internals.states.add('hidden')
        : this.internals.states.delete('hidden')
      return this
    }
  }

  return C
}

export default Hidden
