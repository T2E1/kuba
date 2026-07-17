import attributeChanged, { resizing } from '@directive/attributeChanged'
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

    @attributeChanged('width', resizing)
    @retouch
    set width(value) {
      this.#width = value
    }
  }

  return C
}

export default Width
