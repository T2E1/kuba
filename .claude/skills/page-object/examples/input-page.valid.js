import { clickInner, inner, mount } from '@test'

/** Page Object: interação com kb-input escondida atrás de métodos de intenção. */
export class InputPage {
  #host

  constructor(markup = '<kb-input name="who"></kb-input>') {
    this.#host = mount(markup).querySelector('kb-input')
  }

  async preencher(valor) {
    const control = await inner(this.#host, 'input')
    control.value = valor
    control.dispatchEvent(new Event('input', { bubbles: true }))
  }

  async submeter() {
    await clickInner(this.#host, 'button[type="submit"]')
  }

  estaInvalido() {
    return !this.#host.checkValidity()
  }
}
