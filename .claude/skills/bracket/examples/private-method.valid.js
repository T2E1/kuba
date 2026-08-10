// ✅ Duas privacidades diferentes, cada uma com a ferramenta certa.

// Symbol local, com descrição — a descrição aparece no stack trace ao depurar.
const render = Symbol('render')

class Component extends HTMLElement {
  // Campo `#`: privacidade absoluta, garantida pela linguagem. Nem um mixin
  // da cadeia alcança. Use quando ninguém de fora precisa mesmo.
  #state = 'idle'

  // Método por Symbol: invisível na enumeração comum, mas alcançável por
  // quem tem a referência — é o que permite um decorator ou mixin chamá-lo.
  [render]() {
    this.shadowRoot.innerHTML = `<span>${this.#state}</span>`
  }

  connectedCallback() {
    this[render]()
  }
}

// Como escolher entre os dois:
//
//   #campo    → ninguém de fora precisa. Privacidade absoluta.
//   [Symbol]  → um decorator, mixin ou módulo irmão precisa alcançar.
//
// `render` não é exportado: é privado a este módulo. Só vira export quando
// se torna contrato público, e aí sai por interfaces.js (rule 013).
