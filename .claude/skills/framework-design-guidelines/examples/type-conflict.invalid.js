// Viola o DO NOT das guidelines: "não introduza nomes de tipo genéricos como
// Element, Node, Log, Message". Correto em type-conflict.valid.js.

// ── packages/messaging/event/interfaces.js ──────────────────────────────────
// ERRO 1 — nomes que não sobrevivem fora da própria pasta.
// Dentro de event/ o contexto salva; no ponto de uso, `Detail` e `Target`
// não dizem de que evento se trata.
export const Detail = Symbol.for('kuba:detail')
export const Target = Symbol.for('kuba:target')

// ── packages/kernel/dom/interfaces.js ───────────────────────────────────────
// ERRO 2 — colisão com nome da plataforma.
// `Element` e `Node` são tipos globais do DOM. Sombreá-los é a colisão que a
// diretriz cita nominalmente: o leitor não sabe se está diante do tipo do
// navegador ou do da biblioteca.
export const Element = Symbol.for('kuba:element')
export const Node = Symbol.for('kuba:node')
export const Template = Symbol.for('kuba:template')

// ── packages/navigation/router/matching/params.js ───────────────────────────
// ERRO 3 — genérico e já tomado dentro do próprio repositório.
export function Params(pattern, path) {
  return { pattern, path }
}

// ── Ponto de uso: onde o custo aparece ──────────────────────────────────────
// Três imports precisam de alias para não se atropelar, e o alias é uma
// segunda chance de nomear — feita no consumidor, que é o lugar errado.
import { Detail } from '@event/interfaces'
import { Element as DomElement, Node as DomNode, Template } from '@dom/interfaces'
import { Params as RouterParams } from '@router'

// E este é o pior efeito: `Element` local sombreia o `Element` do DOM.
// Nada avisa; o código continua compilando e passa a significar outra coisa.
export function measure(element) {
  return element instanceof Element
}
