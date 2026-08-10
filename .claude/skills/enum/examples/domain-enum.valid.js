// ✅ Enum congelado, no módulo dono do conceito.

// ─── order/status.js ──────────────────────────────────────────────────────
// O módulo de pedido define o conceito, então é o dono do enum (rule 016).
// Não vai para um constants.js genérico, que viola CCP e CRP ao mesmo tempo.
//
// Object.freeze não é decoração: sem ele o enum é mutável em runtime e vira
// estado global modificável (rules 029 e 070).
export const Status = Object.freeze({
  CANCELLED: 'cancelled',
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  SHIPPED: 'shipped',
})

// Número com significado ganha nome e unidade no próprio identificador.
export const SUBMIT_TIMEOUT_MS = 3000

// ─── order/orderService.js ────────────────────────────────────────────────
import { Status } from './status.js'

function canCancel(order) {
  return order.status === Status.PENDING || order.status === Status.CONFIRMED
}

// ─── checkout/checkout.js ─────────────────────────────────────────────────
import { Status, SUBMIT_TIMEOUT_MS } from '@order/status'

async function submit(order) {
  order.status = Status.PENDING
  await withTimeout(send(order), SUBMIT_TIMEOUT_MS)
}

// O que muda: `Status.CONFIMED` é `undefined` e falha na hora, em vez de
// virar comparação silenciosamente falsa. Renomear o valor é uma edição
// num arquivo só.
//
// Próximo passo, quando aparecer `if` para cada status: o enum resolveu o
// literal, não a ramificação. Aí entra Strategy ou function map (rule 011,
// skill gof) — mais constantes não resolvem isso.
