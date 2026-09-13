import { mount } from '@test'

/** Test Data Builder: cada teste customiza só o que precisa variar. */
export class InputBuilder {
  #name = 'who'
  #required = false
  #value = ''

  comNome(name) {
    this.#name = name
    return this
  }

  obrigatorio() {
    this.#required = true
    return this
  }

  comValor(value) {
    this.#value = value
    return this
  }

  montar() {
    const attrs = [
      `name="${this.#name}"`,
      this.#required ? 'required' : '',
      this.#value ? `value="${this.#value}"` : '',
    ]
      .filter(Boolean)
      .join(' ')
    return mount(`<kb-input ${attrs}></kb-input>`).querySelector('kb-input')
  }
}
