import { formDisabled } from '@directive'
import attributeChanged, { booleanAttribute } from '@directive/attributeChanged'
import { around } from '@middleware'
import { disableable, inherit } from './interfaces'

/**
 * Adds a `disabled` property backed by the `disabled` attribute. Setting it
 * runs, in order: `@attributeChanged` (reflects the attribute, `booleanAttribute`
 * normalizes it), the setter itself (assigns only), then `@around` runs
 * `[disableable]`, which reflects the value onto `internals.states`. It does
 * not trigger a render — a consumer whose template writes the native
 * `disabled` attribute onto an inner control (as `kb-button` does) is
 * responsible for its own `@repaint`/`@retouch` on top of this property.
 * `[inherit]`, run by `@formDisabled` after `formDisabledCallback`, mirrors
 * a surrounding `<fieldset disabled>` onto this property — the consumer
 * must declare `static formAssociated = true` for that callback to fire.
 */
const Disabled = (Super) => {
  class C extends Super {
    #disabled

    get disabled() {
      return (this.#disabled ??= false)
    }

    @attributeChanged('disabled', booleanAttribute)
    @around(disableable)
    set disabled(value) {
      this.#disabled = value
    }

    [disableable]() {
      this.disabled
        ? this.internals.states.add('disabled')
        : this.internals.states.delete('disabled')
      return this
    }

    @formDisabled
    [inherit](disabled) {
      this.disabled = disabled
      return this
    }
  }

  return C
}

export default Disabled
