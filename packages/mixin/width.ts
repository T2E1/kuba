import attributeChanged, { resizing } from '@directive/attributeChanged'
import { retouch } from '@dom'

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
