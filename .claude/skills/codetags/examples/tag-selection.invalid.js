// ❌ TODO genérico usado para tudo, escondendo a severidade real.
// Correto em: tag-selection.valid.js

// TODO: rever isso aqui, acho que vaza o token
function logRequest(url, apiToken) {
  console.log(`GET ${url}`)
}

// TODO: função antiga, trocar um dia
function loadOrderLegacy(id) {
  return fetch(`/orders/${id}`)
}

// TODO: talvez otimizar
function findDuplicateOrders(orders) {
  return orders.filter((order, i) => orders.indexOf(order) !== i)
}

// Consequências:
//
// - `grep -rn "SECURITY(" packages/` não encontra a vulnerabilidade —
//   ela está indistinguível de qualquer outro TODO de baixa prioridade.
// - Nenhum prazo, nenhuma rule, nenhum critério de quando remover.
// - Um TODO de segurança real compete por atenção com "acho que" e
//   "um dia", e normalmente perde.
