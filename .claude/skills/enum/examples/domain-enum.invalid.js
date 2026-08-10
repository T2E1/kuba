// ❌ Literais espalhados — viola a rule 024.
// Correto em: domain-enum.valid.js

// ─── order/orderService.js ────────────────────────────────────────────────
function canCancel(order) {
  return order.status === 'pending' || order.status === 'confirmed'
}

// ─── order/orderView.js ───────────────────────────────────────────────────
function badgeColor(order) {
  // 'confirmed' escrito de novo, noutro arquivo. Um typo aqui não quebra
  // nada em tempo de build — só produz comportamento errado em runtime.
  if (order.status === 'confimed') return 'success'
  if (order.status === 'pending') return 'warning'
  return 'master'
}

// ─── checkout/checkout.js ─────────────────────────────────────────────────
async function submit(order) {
  // Terceira ocorrência, terceiro arquivo. Renomear o status no domínio
  // exige encontrar as três — e a busca por 'pending' também acha
  // comentários e mensagens de UI.
  order.status = 'pending'

  // Número com significado de negócio, sem nome: o que são 3000?
  await withTimeout(send(order), 3000)
}

// O custo real: renomear 'pending' para 'awaiting_payment' é uma tarefa de
// busca e substituição manual, com risco de esquecer uma ocorrência que só
// aparece em produção.
