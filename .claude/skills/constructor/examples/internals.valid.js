// ✅ `internals` exposto por getter preguiçoso.

class Button extends Hidden(Echo(HTMLElement)) {
  #internals

  constructor() {
    super()
    this.attachShadow({ mode: 'open', delegatesFocus: true })
  }

  // Público, para que os mixins da cadeia usem a mesma instância.
  // `??=` garante uma única chamada de attachInternals() — a API não
  // permite duas, e o getter lazy resolve isso sem flag de controle.
  get internals() {
    return (this.#internals ??= this.attachInternals())
  }
}

// Por que getter e não campo inicializado no constructor:
//
// - `attachInternals()` só pode ser chamado uma vez por elemento. O `??=`
//   torna a chamada idempotente sem `if` nem flag.
// - Expor por getter mantém o campo privado e o acesso controlado — não é
//   um getter trivial proibido pela rule 008, porque carrega a lógica de
//   inicialização preguiçosa.
// - Os mixins da cadeia alcançam a mesma instância, que é o que faltava no
//   exemplo inválido.
//
// O que expõe publicamente entra no types.d.ts do componente (skill types),
// e ganha uma story com `play` que afirma o estado depois de setar o
// atributo (skill story, Regra 6).
