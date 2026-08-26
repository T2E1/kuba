// Viola C-STRUCT-PRIVATE e o idioma de superfície plana: o interior do pacote
// virou contrato sem ninguém decidir. Correto em flat-surface.valid.js.

// ── packages/navigation/router/index.js ─────────────────────────────────────
// ERRO 1 — re-export com curinga. Tudo que os arquivos exportam vira público,
// inclusive helpers que existiam só para o interior.
export * from './router.js'
export * from './matching/matching.js'
export * from './matching/params.js'
export * from './history/pushState.js'

// ── packages/navigation/router/router.js ────────────────────────────────────
export class Router {
  // ERRO 2 — C-STRUCT-PRIVATE: campo público é contrato para sempre.
  // Trocar Map por Array agora quebra qualquer consumidor que chamou
  // `.listeners.get(...)`, e nada declarou que isso era permitido.
  listeners = new Map()

  // ERRO 3 — C-GETTER: prefixo `get` num acessor que só devolve o campo.
  // Viola também a rule 008.
  getListeners() {
    return this.listeners
  }

  // ERRO 4 — C-VALIDATE ausente. Entrada inválida entra e falha longe daqui,
  // quando alguém tentar ler `.path` de undefined.
  register(route) {
    this.listeners.set(route.path, route)
  }

  // ERRO 5 — C-CUSTOM-TYPE: boolean decidindo comportamento.
  // `resolve(path, true)` não diz nada no ponto de chamada (rule 037).
  resolve(path, useFallback) {
    if (useFallback) return this.listeners.get(path) ?? this.listeners.get('*')
    return this.listeners.get(path)
  }
}

// ERRO 6 — C-CTOR: construtor como função solta, em outro módulo.
export function makeRouter(routes) {
  const instance = new Router()
  for (const route of routes) instance.register(route)
  return instance
}

// ── Ponto de uso: onde o custo aparece ──────────────────────────────────────
// ERRO 7 — import profundo, atravessando o index.
// O caminho `matching/params` virou contrato de fato: renomear a pasta
// quebra este arquivo, e nada avisou que isso era possível.
import { RouteParams } from '@router/matching/params'
import { pushState } from '@router/history/pushState'
import { Router } from '@router'

const instance = new Router()

// E o acesso direto ao campo público, que sela o Map como parte da API.
instance.listeners.set('/', () => RouteParams('/', location.pathname))
pushState('/')
