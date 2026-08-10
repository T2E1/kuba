// ✅ CC = 2 por método — dentro do limite da rule 022.
//
// Duas técnicas aplicadas:
// 1. Guard clause: a pré-condição sai do aninhamento e vira retorno antecipado
//    no topo (rules 001 e 002). O caminho feliz sobe para o nível zero.
// 2. Extração: cada decisão vira um método com nome próprio, testável isolado.

function processOrder(order) {
  //                                             base .......... 1
  if (isInvalid(order)) return 'invalid'      // +1 ............ 2

  return order.payment === 'pix'              // ternário conta no método
    ? processPix(order)
    : processCardPayment(order)
}

function processCardPayment(order) {
  //                                             base .......... 1
  return order.amount > 1000                  // +1 ............ 2
    ? applyDiscount(order)
    : processPayment(order)
}

function isInvalid(order) {
  //                                             base .......... 1
  return order.status !== 'pending' || order.items.length === 0 // +1 ... 2
}

// Ganho real, não realocação: a decisão de "é válido?" deixou de estar
// entrelaçada com a de "como cobrar?". Cada método tem no máximo dois
// caminhos, e um meio de pagamento novo toca só processOrder.
//
// Se o número de meios de pagamento crescer, o próximo passo é um function
// map ou polimorfismo (rule 011) — não mais um ternário.
