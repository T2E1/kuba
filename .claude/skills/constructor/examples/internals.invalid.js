// ❌ `attachInternals()` no constructor, sem exposição pública.
// Correto em: internals.valid.js

class Button extends Hidden(Echo(HTMLElement)) {
  #internals

  constructor() {
    super()
    this.attachShadow({ mode: 'open', delegatesFocus: true })
    // Chamado aqui e guardado em campo privado da classe do componente.
    this.#internals = this.attachInternals()
  }

  hide() {
    this.#internals.states.add('hidden')
  }
}

// O defeito real que isto causou em <kb-button>:
//
// O mixin Hidden precisa de `internals` para aplicar o estado, mas o campo
// é privado da classe do componente — o mixin não alcança. E chamar
// `attachInternals()` de novo, de dentro do mixin, lança: a API só permite
// uma chamada por elemento.
//
// Resultado: o controle `hidden` do painel do Storybook "funcionava"
// visualmente. Alguém clicava em True e nada acontecia. O bug passou pela
// revisão manual porque a story sem `play` não exercitava o estado —
// exatamente o caso que a Regra 6 da skill `story` existe para pegar.
