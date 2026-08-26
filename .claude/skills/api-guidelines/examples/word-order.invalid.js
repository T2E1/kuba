// Viola C-WORD-ORDER: nomes análogos com ordem de palavras diferente.
// Correto em word-order.valid.js.

// ── Erros: três ordens diferentes para a mesma categoria ────────────────────
export class ParseRouteError extends Error {}   // acao-objeto-Error
export class ErrorMatchPattern extends Error {} // ERRO: Error-acao-objeto
export class ParamsResolveError extends Error {} // ERRO: objeto-acao-Error

// ── Consultas: cada uma inventa a própria forma ─────────────────────────────
export function findRouteByPath(path) {}  // find-Objeto-By-Criterio
export function byNameFindRoute(name) {}  // ERRO: By-Criterio-find-Objeto
export function keyParamFind(key) {}      // ERRO: Criterio-Objeto-find

// ── Comandos: verbo antes em um, depois no outro ────────────────────────────
export function registerRoute(route) {}   // verbo-Objeto
export function routeRemove(route) {}     // ERRO: Objeto-verbo
export function resolutionOfRoute(route) {} // ERRO: substantivo, nao verbo

// ── Conversões: prefixo de C-CONV misturado com a ordem ─────────────────────
export function asRouteView(route) {}     // as-Objeto-Qualificador
export function urlToRoute(route) {}      // ERRO: a ordem inverte o sentido —
                                          // parece converter url EM route, e
                                          // faz o contrário
export function paramsInto(route) {}      // ERRO: Objeto-into, sem alvo

// O custo: nada se adivinha. Quem precisa remover um parâmetro tem quatro
// candidatos plausíveis — `removeParam`, `paramRemove`, `byKeyRemoveParam`,
// `ParamRemoveError` — e precisa abrir o arquivo para descobrir qual existe.
// Multiplicado pelo número de funções do pacote, é o custo real da
// inconsistência: a documentação deixa de ser opcional.
