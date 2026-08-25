import attributeChanged, {
  resizing,
  toSizeString,
} from '@directive/attributeChanged'
import { retouch } from '@dom'

/**
 * Adds a `height` property backed by the `height` attribute. Setting it
 * schedules a style-only re-render via `@retouch` (skipping markup
 * re-render) instead of the full repaint other reactive properties trigger.
 */
const Height = (Super) => {
  class C extends Super {
    #height

    get height() {
      return (this.#height ??= 'auto')
    }

    // `@attributeChanged('height', resizing)` only guards attribute writes —
    // `element.height = untrusted` skips it entirely and reaches this setter
    // directly, and the value lands in an interpolated stylesheet, where
    // anything appended after a length injects CSS rules. So the setter
    // re-applies the same normalization with `toSizeString` (resizing.js's
    // primitive) itself: the same closed set of outputs on both entry
    // points, not just the attribute one.
    @attributeChanged('height', resizing)
    @retouch
    set height(value) {
      this.#height = toSizeString(value)
    }
  }

  return C
}

export default Height
