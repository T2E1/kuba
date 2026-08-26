// C-WORD-ORDER correto: uma ordem de palavras só, aplicada a todo nome
// análogo do pacote. Qual ordem importa menos que usar sempre a mesma.
//
// Ordem adotada aqui: <verbo><Objeto><Qualificador>
// A biblioteca padrão do Rust usa verbo-objeto-erro pelo mesmo motivo:
// ParseIntError, RecvTimeoutError, StripPrefixError.

const routes = new Map()

// ── Erros: <Ação><Objeto>Error ──────────────────────────────────────────────
export class ParseRouteError extends Error {}
export class MatchPatternError extends Error {}
export class ResolveParamsError extends Error {}

// ── Consultas: find<Objeto>By<Critério> ─────────────────────────────────────
// A família inteira segue a mesma forma, então o quarto membro se adivinha
// sem consultar a documentação.
export function findRouteByPath(path) {
  return routes.get(path)
}

export function findRouteByName(name) {
  return [...routes.values()].find((route) => route.name === name)
}

export function findParamByKey(key) {
  return (params) => params[key]
}

// ── Comandos: <verbo><Objeto> ───────────────────────────────────────────────
export function registerRoute(route) {
  routes.set(route.path, route)
}

export function removeRoute(route) {
  routes.delete(route.path)
}

export function resolveRoute(route) {
  return findRouteByPath(route.path) ?? null
}

// ── Conversões: as/to/into + <Objeto> (C-CONV) ──────────────────────────────
export function asRouteView(route) {
  return route.segments
}

export function toRouteUrl(route) {
  return new URL(route.path, location.origin)
}

export function intoRouteParams(route) {
  const params = route.params
  route.params = null
  return params
}

// O ganho é previsibilidade: quem precisa remover um parâmetro sabe, antes
// de procurar, que a função se chama `removeParam` — porque `removeRoute`
// existe e a ordem é a mesma em todo o pacote.
