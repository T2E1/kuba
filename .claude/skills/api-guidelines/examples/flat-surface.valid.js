// C-STRUCT-PRIVATE e o idioma central: interior aninhado, superfície plana.
// O pacote tem a profundidade que precisa; o consumidor escreve sempre raso.
//
//   packages/navigation/router/
//   ├── index.js              ← a única porta
//   ├── router.js
//   ├── matching/
//   │   ├── matching.js
//   │   ├── params.js
//   │   └── args.js
//   └── history/
//       ├── pushState.js
//       └── popState.js

// ── packages/navigation/router/index.js ─────────────────────────────────────
// Re-export nomeado, um por símbolo público. `matching/` e `history/` existem
// e são invisíveis: mover, renomear ou fundir qualquer um deles não alcança
// nenhum consumidor.
export { router } from './router.js'
export { RouteParams } from './matching/params.js'
export { urlFor } from './urlFor.js'

// ── packages/navigation/router/router.js ────────────────────────────────────
// C-STRUCT-PRIVATE — estado em campo `#`. Nunca vira contrato.
// C-NEWTYPE-HIDE — trocar Map por Array não alcança ninguém de fora.
export class Router {
  #listeners = new Map()

  // C-CTOR — construtor é método estático inerente do próprio tipo.
  static from(routes) {
    const instance = new Router()
    for (const route of routes) instance.register(route)
    return instance
  }

  // C-VALIDATE — valida na fronteira, e lança erro de domínio (rule 027).
  register(route) {
    if (!route?.path) throw new TypeError('router: route requires a path')
    this.#listeners.set(route.path, route)
    return this
  }

  // C-GETTER — sem prefixo `get`, e o retorno é derivado, não o campo cru.
  size() {
    return this.#listeners.size
  }

  // C-DEBUG-NONEMPTY — representação legível, nunca [object Object].
  toString() {
    return `Router(${this.#listeners.size} routes)`
  }
}

// ── Ponto de uso ────────────────────────────────────────────────────────────
// Um nível. O consumidor não sabe que `matching/` existe, e é por isso que
// reorganizar o interior deixa de ser mudança de contrato.
import { router, RouteParams } from '@router'

export const home = router('/', () => RouteParams('/', location.pathname))
