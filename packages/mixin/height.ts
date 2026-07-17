import attributeChanged, { resizing } from '@directive/attributeChanged'
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

    @attributeChanged('height', resizing)
    @retouch
    set height(value) {
      this.#height = value
    }
  }

  return C
}

export default Height
