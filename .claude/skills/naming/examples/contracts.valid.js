// ✅ O sufixo classifica o contrato — packages/**/interfaces.js.

// ─── Capacidade ligada a hook: sufixo -able ───────────────────────────────
// Lidos por um decorator (@before, @around, @connected), não chamados
// diretamente pelo consumidor. O sufixo anuncia isso.

/** Method key for the `@around` hook that reflects `variant` onto `internals.states`. */
export const variantable = Symbol('variantable')

/** Method key for the `@around` hook that mirrors `value` onto the ARIA value range. */
export const measurable = Symbol('measurable')

/** Method key for the `@connected` hook that publishes the role on `internals`. */
export const identifiable = Symbol('identifiable')

// Sem adjetivo natural em -able, um adjetivo simples resolve. O que não vale
// é substantivo, que sinalizaria recurso em vez de capacidade.
/** Method key for the hook that hides an unnamed icon from assistive technology. */
export const decorative = Symbol('decorative')

// ─── Ação: verbNoun ───────────────────────────────────────────────────────
// Operações invocadas de fato, com efeito nomeado.
export const dispatchFormAction = Symbol('dispatchFormAction')

// ─── Callback de ciclo de vida: verbCallback ──────────────────────────────
// O sufixo distingue o hook do decorator e da função de mesmo tema.
export const willPaintCallback = Symbol('willPaintCallback')
export const didPaintCallback = Symbol('didPaintCallback')
export const htmlCallback = Symbol('htmlCallback')
export const cssCallback = Symbol('cssCallback')

// ─── Recurso: substantivo ─────────────────────────────────────────────────
export const controller = Symbol('controller')

// ─── Predicado: isX ───────────────────────────────────────────────────────
// Symbol.for porque o estado precisa ser reconhecido mesmo com cópias do
// pacote duplicadas em bundles diferentes — o porquê fica comentado, sempre.
export const isPainted = Symbol.for('isPainted')

// ─── Symbol.for: só o que atravessa pacotes ───────────────────────────────
// Symbol.for (não Symbol()) para que todo pacote que importe este módulo
// resolva o MESMO símbolo, mesmo duplicado entre bundles — necessário para
// a busca de método entre pacotes (ex.: `this[connectArc]`).
export const connectArc = Symbol.for('connectArc')
export const disconnectArc = Symbol.for('disconnectArc')

// Nome de atributo observado também vira constante (rule 024).
export const on = 'on'

// As duas regras que valem para todos acima:
//
// 1. A descrição é IDÊNTICA ao nome da constante — é o que aparece no stack
//    trace e o que torna o símbolo pesquisável pelo nome do import.
// 2. Symbol.for só quando atravessa pacote ou bundle, com o porquê
//    comentado. No resto, Symbol() — o registro global anula encapsulamento.
