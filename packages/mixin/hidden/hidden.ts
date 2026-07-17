import attributeChanged, { booleanAttribute } from '@directive/attributeChanged'
import { around, before } from '@middleware'
import { cleanup, hideable } from './interface'

/**
 * Adds a `hidden` property backed by the `hidden` attribute. Setting it runs,
 * in order: `cleanup` (via `@before`, synchronously, transforms the incoming
 * value and removes the `hidden` attribute when it becomes `false`), the
 * setter itself, then `hideable` (via `@around`, scheduled on a later tick)
 * to reflect the state onto `internals.states`.
 */
const Hidden = (Super) => {
  class C extends Super {
    #hidden

    get hidden() {
      return (this.#hidden ??= false)
    }

    @attributeChanged('hidden', booleanAttribute)
    @around(hideable)
    @before(cleanup)
    set hidden(value) {
      this.#hidden = value
    }

    [cleanup](value) {
      value === false && this.removeAttribute('hidden')
      return value
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
