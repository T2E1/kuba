// ✅ A tag corresponde à natureza do problema, não à urgência percebida.

// SECURITY(030): token de API está sendo interpolado direto na URL de log,
// vazando o segredo em qualquer agregador de logs que capture esta linha.
// Mover para header e mascarar antes de logar.
function logRequest(url, apiToken) {
  console.log(`GET ${url}`)
}

// DEPRECATED(2026-12-01): usar `fetchOrder` no lugar. Esta função ignora
// o cache de Identity Map e será removida na próxima major.
function loadOrderLegacy(id) {
  return fetch(`/orders/${id}`)
}

// OPTIMIZE: este filtro roda O(n²) sobre a lista de pedidos. Não é
// hotspot medido ainda — perfilar antes de trocar por Map (rule 069).
function findDuplicateOrders(orders) {
  return orders.filter((order, i) => orders.indexOf(order) !== i)
}

// Cada tag aqui carrega uma categoria distinta de risco — segurança,
// obsolescência com prazo, e performance não confirmada — e cada uma
// aponta para uma ação diferente (skill quality decide a categoria).
