import { inner, mount } from '@test'

// Viola a rule 061 (Middle Man): cada método é um repasse de uma linha só, sem nome de
// intenção — e ainda devolve o elemento DOM cru, vazando o que a classe deveria esconder.
export class InputPage {
  host

  constructor(markup) {
    this.host = mount(markup).querySelector('kb-input')
  }

  async getInput() {
    return inner(this.host, 'input')
  }

  getHost() {
    return this.host
  }
}
