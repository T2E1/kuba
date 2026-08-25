import attributeChanged, {
  resizing,
  toSizeString,
} from '@directive/attributeChanged'
import { retouch } from '@dom'

/**
 * Adds a `width` property backed by the `width` attribute. Setting it
 * schedules a style-only re-render via `@retouch` (skipping markup
 * re-render) instead of the full repaint other reactive properties trigger.
 */
const Width = (Super) => {
  class C extends Super {
    #width

    get width() {
      return (this.#width ??= 'auto')
    }

    // `@attributeChanged('width', resizing)` only guards attribute writes —
    // `element.width = untrusted` skips it entirely and reaches this setter
    // directly, and the value lands in an interpolated stylesheet, where
    // anything appended after a length injects CSS rules. So the setter
    // re-applies the same normalization with `toSizeString` (resizing.js's
    // primitive) itself: the same closed set of outputs on both entry
    // points, not just the attribute one.
    @attributeChanged('width', resizing)
    @retouch
    set width(value) {
      this.#width = toSizeString(value)
    }
  }

  return C
}

export default Width
