// ✅ Cada coisa no callback do ciclo de vida que lhe corresponde.

class Button extends Width(Hidden(Echo(HTMLElement))) {
  static observedAttributes = ['color']

  constructor() {
    super()
    // delegatesFocus: true porque Button é interativo — o foco recebido pelo
    // host é delegado ao elemento focável interno.
    this.attachShadow({ mode: 'open', delegatesFocus: true })
  }

  // Atributos chegam aqui, já processados pelo parser.
  attributeChangedCallback(name, previous, current) {
    if (previous === current) return
    this.color = current
  }

  // O elemento está no documento: é seguro registrar listener e tocar o DOM.
  connectedCallback() {
    this.addEventListener('click', this.handleClick)
  }

  // Todo listener registrado tem de ser removido, senão vaza (rule 048).
  disconnectedCallback() {
    this.removeEventListener('click', this.handleClick)
  }
}

// Componente comportamental não define constructor — usa Headless e não
// cria Shadow DOM, porque não renderiza nada.
class Redirect extends Headless(Echo(HTMLElement)) {}
