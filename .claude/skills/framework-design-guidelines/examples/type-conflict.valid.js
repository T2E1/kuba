// Correto: todo tipo exportado é qualificado, e nenhum colide com um nome
// muito usado da plataforma ou do próprio repositório.

// ── packages/messaging/event/interfaces.js ──────────────────────────────────
// `EventDetail`, não `Detail`. `EventTargetRef`, não `Target`.
// A qualificação carrega o contexto para o ponto de uso, onde o import já
// perdeu a informação da pasta de origem.
export const EventDetail = Symbol.for('kuba:event-detail')
export const EventTargetRef = Symbol.for('kuba:event-target-ref')

// ── packages/kernel/dom/interfaces.js ───────────────────────────────────────
// `PaintCallback`, não `Callback`. `RenderTemplate`, não `Template`.
export const PaintCallback = Symbol.for('kuba:paint-callback')
export const RenderTemplate = Symbol.for('kuba:render-template')

// ── packages/navigation/router/matching/params.js ───────────────────────────
// `RouteParams`, não `Params`. O prefixo diz de que rota se trata.
export function RouteParams(pattern, path) {
  return { pattern, path }
}

// ── Ponto de uso: a qualificação prova o valor aqui ─────────────────────────
// Cada nome continua legível fora da pasta que o definiu, e nada exige alias.
import { EventDetail } from '@event/interfaces'
import { PaintCallback, RenderTemplate } from '@dom/interfaces'
import { RouteParams } from '@router'

export function bind(host, pattern, path) {
  return {
    [EventDetail]: RouteParams(pattern, path),
    [PaintCallback]: host[RenderTemplate],
  }
}
