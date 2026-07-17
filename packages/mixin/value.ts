import attributeChanged from '@directive/attributeChanged'

/** Adds a `value` property that stays in sync with the `value` attribute. */
const Value = (Super) => {
  class C extends Super {
    #value

    get value() {
      return this.#value
    }

    @attributeChanged('value')
    set value(value) {
      this.#value = value
    }
  }

  return C
}

export default Value
