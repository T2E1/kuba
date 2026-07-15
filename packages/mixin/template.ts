import { attributeChanged } from '@directive'

const Template = (Super) => {
  class C extends Super {
    #template

    get template() {
      const { innerHTML, children } = (this.#template ??=
        this.querySelector('template'))
      return (
        innerHTML ||
        Array.from(children)
          .map((child) => child.outerHTML)
          .join('')
      )
    }

    @attributeChanged('template')
    set template(value) {
      this.#template = document.querySelector(`#${value}`)
    }
  }

  return C
}

export default Template
