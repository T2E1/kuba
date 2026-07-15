import attributeChanged, { resizing } from '@directive/attributeChanged'
import { retouch } from '@dom'

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
